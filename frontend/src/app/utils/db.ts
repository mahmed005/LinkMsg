"use server";

import mongoose from "mongoose";
import { User } from "./models";

let isConnectedToDB = false;

export async function connectToDB() {
    if (isConnectedToDB) return;

    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        isConnectedToDB = true;
        console.log('Connected to database');
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
};

export async function getUser(email: string) {
    await connectToDB();

    const user = await User.findOne({ email });

    return user;
}

export async function createUserFromProvider(name: string | null | undefined, email: string | null | undefined, image: string | null | undefined) {
    await connectToDB();

    const user = new User({
        name,
        email,
        image
    })

    await user.save();

    return user;
}