"use server";

import mongoose, { Document, Schema, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
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

UserSchema.pre("save", function (next) {
  if (!this.password)
    return next();
  if (!this.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  if (!this.password)
    return false;
  return bcrypt.compareSync(candidate, this.password);
};

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export interface IFriend extends Document {
  user1: Types.ObjectId,
  user2: Types.ObjectId
};

const friendSchema = new mongoose.Schema<IFriend>({
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

export const Friend: Model<IFriend> = (mongoose.models.Friend as Model<IFriend>) || mongoose.model('Friend', friendSchema)

export interface IGroup extends Document {
  name: string,
  members: (string | Types.ObjectId)[],
  image?: string
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

export const Group: Model<IGroup> = (mongoose.models.Group as Model<IGroup>) || mongoose.model('Group', groupSchema)

