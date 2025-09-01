import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { signUpSchema } from "@/app/utils/types";
import { createUserFromProvider, getUser } from "@/app/utils/db";
import Google from "next-auth/providers/google";
import { EncryptJWT, jwtDecrypt } from 'jose';
import { hkdf } from "@panva/hkdf";
import type { IUser } from '@/app/utils/models';

const now = () => (Date.now() / 1000) | 0
const MAX_DAYS = 30 * 24 * 60 * 60 * 1000;
const alg = 'dir';
const enc = "A256CBC-HS512";

export const generateKey = async (secret: string) => {
    return await hkdf(
        'sha256',
        secret,
        'authjs.session-token',
        `Auth.js Generated Encryption Key (authjs.session-token)`,
        64
    )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    session: {
        strategy: 'jwt'
    },
    jwt: {
        async encode({ secret, token }) {
            secret = Array.isArray(secret) ? secret : [secret]
            const key = await generateKey(secret[0]);
            return new EncryptJWT(token).setProtectedHeader({ alg, enc }).setIssuedAt().setExpirationTime(now() + MAX_DAYS).encrypt(key);
        },
        async decode({ secret, token }) {
            secret = Array.isArray(secret) ? secret : [secret]
            if (!token) {
                return null;
            }
            const { payload } = await jwtDecrypt(
                token,
                await generateKey(secret[0]),
                {
                    clockTolerance: 15,
                    keyManagementAlgorithms: [alg],
                    contentEncryptionAlgorithms: [enc, "A256GCM"],
                }
            )
            return payload;
        }
    },
    callbacks: {
        async signIn({ account, profile, user }) {
            if (account?.provider === 'google') {
                const existingUser = await getUser(profile?.email as string);
                if (!existingUser) {
                    await createUserFromProvider(profile?.name, profile?.email, user.image);
                }
            }
            return true;
        },
        async jwt({ account, user, token }) {
            if (account?.provider === 'credentials' && user) {
                const castedUser = user as IUser;
                token.id = String(castedUser._id);
            } else if (account?.provider === 'google' && user) {
                const fetchedUser = await getUser(user.email as string);
                if (fetchedUser)
                    token.id = String(fetchedUser._id);
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id)
                session.user.id = token.id

            return session;
        }
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = signUpSchema.pick({ email: true, password: true }).safeParse(credentials)
                if (!parsedCredentials.success) {
                    return null;
                }
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                if (!user)
                    return null;
                const passwordMatch = await user.comparePassword(password);
                if (passwordMatch) {
                    return user;
                }
                return null;
            }
        }),
        Google
    ],
})