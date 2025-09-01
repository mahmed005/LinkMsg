import hkdf from '@panva/hkdf';
import { jwtDecrypt } from 'jose';
import type { NextAuthConfig } from 'next-auth';

export const generateKey = async (secret: string) => {
    return await hkdf(
        'sha256',
        secret,
        'authjs.session-token',
        `Auth.js Generated Encryption Key (authjs.session-token)`,
        64
    )
}

const alg = 'dir';
const enc = "A256CBC-HS512";

export const authConfig = {
    pages: {
        signIn: '/login'
    },
    jwt: {
        async decode({ secret, token }) {
            secret = Array.isArray(secret) ? secret : [secret]
            if (!token)
                return null;
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
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedin = !!auth?.user;
            const isAwayFromAuth = nextUrl.pathname !== '/login' && nextUrl.pathname != '/signup';
            if (isAwayFromAuth && isLoggedin)
                return true;
            else if (!isAwayFromAuth && isLoggedin)
                return Response.redirect(new URL('/', nextUrl));
            else {
                if (!isAwayFromAuth)
                    return true;
                return false;
            }
        },
    },
    providers: [],
} satisfies NextAuthConfig;