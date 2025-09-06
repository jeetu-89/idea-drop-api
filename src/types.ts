import mongoose, { mongo } from "mongoose";

export type IdeaBody = {
  title: string;
  summary: string;
  description: string;
  tags: string | string[];
};

export type UserType = {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
};

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  _id: mongoose.Schema.Types.ObjectId;
  matchPassword: (enteredPass: string) => Promise<boolean>;
}

export type Payload = {
  userId: string;
};
export type UserRequestType = {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
};
