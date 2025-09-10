import express from 'express';
import { createServer } from 'node:http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import cors from 'cors';
import { hkdf } from '@panva/hkdf';
import { jwtDecrypt } from 'jose-node-cjs-runtime';
import { CustomSocket } from './types/socket';
import connectToDB from './db/connection';
import { deleteMessages, getAllMessages, getGroupMembers, getGroups } from './db/helpers';
import { IMessage, Message } from './db/models';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Types } from 'mongoose';

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URI,
        credentials: true,
        allowedHeaders: '*',
        methods: ['GET', 'POST']
    }
});

const s3 = new S3Client({
    region: 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string
    }
});

async function getS3Url(key: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME as string,
        Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return url;
}

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

const decode = async ({ secret, token }: { secret: string | string[], token: string }) => {
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

if (!(process.env.PORT && process.env.CLIENT_URI && process.env.NEXTAUTH_SECRET)) {
    console.error("Couldn't load either the Port number or the Client URI or the access token secret");
    process.exit(1);
}

app.use(cors({
    origin: [
        process.env.CLIENT_URI
    ],
    allowedHeaders: '*',
    credentials: true
}));

const onlineUsers = new Set<String>();

io.use(async (socket: CustomSocket, next) => {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) {
        return next(new Error('Unauthorized no credentials provided'));
    }
    const token = cookie.split('authjs.session-token=')[1];
    if (!token)
        return next(new Error('Unauthorized'));
    const payload = await decode({ secret: process.env.NEXTAUTH_SECRET as string, token });
    if (!payload || !payload.id)
        return next(new Error('Unauthorized'));
    socket.user = payload;
    next();
});

io.on('connection', async (socket: CustomSocket) => {
    socket.join(socket.user.id);
    onlineUsers.add(socket.user.id);
    const groups = await getGroups(socket.user.id);
    for (const group of groups) {
        socket.join(String(group._id));
    }
    let messages = await getAllMessages(socket.user.id);
    messages = await Promise.all(messages.map(async message => {
        for (let i = 0; i < message.media.length; i++) {
            const url = await getS3Url(message.media[i]);
            message.media[i] = url;
        }
        return message;
    }));
    io.to(socket.user.id).emit('initial-notifications', messages);
    deleteMessages(messages, socket.user.id);
    socket.on('send-message', async (message: IMessage) => {
        if (message.groupId) {
            for (let i = 0; i < message.media.length; i++) {
                const url = await getS3Url(message.media[i]);
                message.media[i] = url;
            }
            io.to(String(message.groupId)).emit('receive-message', message);
            const members = await getGroupMembers(String(message.groupId));
            const offlineMembers = [];
            for (const member of members as Types.ObjectId[]) {
                if (!onlineUsers.has(String(member)))
                    offlineMembers.push(member);
            }
            if (offlineMembers.length !== 0) {
                const newMessage = new Message(message);
                newMessage.remainingReceivers = offlineMembers;
                await newMessage.save();
            }
        }
        else if (onlineUsers.has(String(message.receiverId))) {
            for (let i = 0; i < message.media.length; i++) {
                const url = await getS3Url(message.media[i]);
                message.media[i] = url;
            }
            io.to(String(message.receiverId)).emit('receive-message', message);
        } else {
            const messageModel = new Message(message);
            await messageModel.save();
        }
    });
    socket.on('disconnect', async () => {
        socket.leave(socket.user.id);
        const groups = await getGroups(socket.user.id);
        for (const group of groups)
            socket.leave(String(group._id));
        onlineUsers.delete(socket.user.id);
    });
});

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error("Couldn't get the database address");
    process.exit(1);
}

server.listen(process.env.PORT, async () => {
    console.log(`Server running on port ${process.env.PORT}`);
    await connectToDB(mongoUri as string);
});