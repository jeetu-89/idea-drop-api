import mongoose from "mongoose";

export type IdeaBody = {
  title: string;
  summary: string;
  description: string;
  tags: string | string[];
};

export type User = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
};
