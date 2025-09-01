import mongoose, { Document, Types } from "mongoose";

export interface IMessage extends Document {
    message?: string;
    media: string[];
    from: Types.ObjectId;
    to: "Individual" | "Group";
    groupId?: Types.ObjectId;
    receiverId?: Types.ObjectId;
    remainingReceivers?: Types.ObjectId[]
};

const messageSchema = new mongoose.Schema<IMessage>({
    message: {
        type: String,
        required: false,
    },
    media: {
        type: [String],
        required: false
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        required: true,
        type: String,
    },
    groupId: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    },
    receiverId: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    remainingReceivers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: false
    }
});

export const Message = mongoose.model('Message', messageSchema);

export interface IGroup extends Document {
    name: string,
    members: Types.ObjectId[],
    image: string
};

const groupSchema = new mongoose.Schema<IGroup>({
    name: {
        type: String,
        required: true,
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    image: {
        type: String,
        requried: false
    }
});

export const Group = mongoose.model('Group', groupSchema);

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: false,
            minlength: 8,
        },
        image: {
            type: String,
            default: undefined,
        },
    },
);

export const User = mongoose.model('User', userSchema)

export interface Friend extends Document {
    user1: Types.ObjectId,
    user2: Types.ObjectId
};

const friendSchema = new mongoose.Schema<Friend>({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

export const Friend = mongoose.model('Friend', friendSchema)