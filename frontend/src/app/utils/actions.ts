"use server";
import { signUpSchema } from "./types";
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Friend, Group, IGroup, User } from '@/app/utils/models';
import { redirect } from "next/navigation";
import { signIn, signOut, auth } from "@/auth";
import { AuthError } from "next-auth";
import { connectToDB } from "./db";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

const s3 = new S3Client({
    region: 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string
    }
});



export async function signUp(formData: unknown) {
    await connectToDB();
    const { success, data } = signUpSchema.safeParse(formData);
    if (!success) {
        throw new Error("Invalid data was submitted to the form");
    }

    const prevUser = await User.findOne({ email: data.email })
    if (prevUser)
        throw new Error("A User already exists with the credentials");
    const user = new User(data)
    try {
        await user.save();
    } catch (err) {
        throw new Error("Could not save user");
    }
    redirect('/login');
}

export async function postMediaURL(mediaType: string) {
    const key = crypto.randomBytes(32).toString('hex');
    const params = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: key,
        ContentType: mediaType
    }

    const command = new PutObjectCommand(params);

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    return { url, key };
}

export async function authenticate(formData: unknown) {
    try {
        await signIn('credentials', formData as FormData);
    } catch (err) {
        if (err instanceof AuthError) {
            switch (err.type) {
                case 'CredentialsSignin':
                    return "Invalid Credentials";
                default:
                    return "Something went wrong";
            }
        }
        throw err;
    }
}

export async function signInFromGoogle() {
    await signIn('google', { redirectTo: '/' });
}

export async function signOutFromApp() {
    await signOut();
}

export async function getFriends(userId: string) {
    await connectToDB();

    const friends = await Friend.find({
        $or: [
            {
                user1: userId
            },
            {
                user2: userId
            }
        ]
    });

    return friends.length;
}

export async function getTotalUsers() {
    const users = await User.find({});

    return users.length;
}

export async function getFriendSuggestions() {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId)
        return {
            success: false,
            error: [
                {
                    message: 'You are not logged in'
                }
            ]
        };

    await connectToDB();
    const suggestions = await Friend.find({
        $or: [
            {
                user1: userId
            },
            {
                user2: userId
            }
        ]
    });

    const ids = suggestions.map(suggestion => {
        if (String(suggestion.user1) === userId)
            return suggestion.user2;
        return suggestion.user1;
    });

    let users: any = await User.find({
        _id: {
            $nin: ids
        }
    }).lean();

    users = users.map((user: any) => ({
        ...user,
        _id: String(user._id)
    }));

    users = users.filter((user: any) => user._id !== userId);

    users = await Promise.all(users.map(async (user: any) => {
        if (user.image.startsWith('https'))
            return user;
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME as string,
            Key: user.image
        });

        const uri = await getSignedUrl(s3, command, { expiresIn: 60 });

        return {
            ...user,
            image: uri
        };
    }));

    return users;
}

export async function getFriendsFull() {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId)
        return {
            success: false,
            error: [
                {
                    message: 'You are not logged in'
                }
            ]
        };

    await connectToDB();

    const friends = await Friend.find({
        $or: [
            {
                user1: userId
            },
            {
                user2: userId
            }
        ]
    });

    const userIds = friends.map(friend => {
        if (userId === String(friend.user1))
            return friend.user2;
        return friend.user1;
    })

    let returnedFriends: any = await User.find({
        _id: {
            $in: userIds
        }
    }).lean();

    returnedFriends = returnedFriends.map((friend: any) => ({
        ...friend,
        _id: String(friend._id)
    }));

    returnedFriends = await Promise.all(
        returnedFriends.map(async (user: any) => {
            if (!user.image) {
                return { ...user, image: null };
            }

            if (user.image.startsWith('https'))
                return user;

            const command = new GetObjectCommand({
                Bucket: process.env.BUCKET_NAME as string,
                Key: user.image,
            });

            const uri = await getSignedUrl(s3, command, { expiresIn: 60 });

            return {
                ...user,
                image: uri,
            };
        })
    );

    return returnedFriends;
}

export async function addFriend(userId: string) {
    const session = await auth();

    const newFriend = new Friend;
    newFriend.user1 = new mongoose.Types.ObjectId(session?.user?.id);
    newFriend.user2 = new mongoose.Types.ObjectId(userId);

    try {
        await connectToDB();
        await newFriend.save();
        revalidatePath('/');
        revalidatePath('/chat');
        return {
            success: true,
        }
    } catch (err: any) {
        console.error(err.message);
        return {
            success: false,
            error: [
                {
                    message: 'Error adding to friend'
                }
            ]
        }
    }
}

export async function getMediaUrl(name: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME as string,
        Key: name,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 })
    return url;
}

export async function getUserDetails(id: string) {
    const user = await User.findOne({
        _id: id
    }).lean();

    if (!user)
        return null;

    user._id = String(user._id);

    if (user.image && !user.image.startsWith('https')) {
        const url = await getMediaUrl(user.image);
        user.image = url;
    }

    return user;
}

export async function getGroups() {
    const session = await auth();

    if (!session?.user)
        return {
            success: false,
            error: [{
                message: 'Unauthenticated request'
            }]
        }

    let groups: any = await Group.find({
        members: session?.user?.id
    }).lean();

    groups = groups.map((group: any) => ({
        ...group,
        _id: String(group._id)
    }));

    for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < groups[i].members.length; j++) {
            groups[i].members[j] = String(groups[i].members[j]);
        }
    }

    groups = await Promise.all(groups.map(async (group: any) => {
        if (!group.image)
            return group;
        group.image = await getMediaUrl(group.image);
        return group;
    }))

    return groups;
}

export async function addGroup(group: Partial<IGroup>) {
    const newGroup = new Group({
        name: group.name,
        members: group.members,
        image: group.image
    });


    await newGroup.save();
    revalidatePath('/groups')
}

export async function leaveGroup(groupId: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            success: false,
            error: [{ message: "Unauthenticated request" }],
        };
    }

    await connectToDB();

    const group = await Group.findById(groupId);
    if (!group) {
        return {
            success: false,
            error: [{ message: "Group not found" }],
        };
    }

    group.members = group.members.filter(
        (member) => String(member) !== String(session.user?.id)
    );

    if (group.members.length <= 1) {
        await Group.findByIdAndDelete(groupId);
    } else {
        await group.save();
    }

    revalidatePath("/groups");

    return { success: true };
}
