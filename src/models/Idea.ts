import mongoose, { model } from "mongoose";
import { title } from "process";

const ideaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    summary: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Idea = model("Idea", ideaSchema);
export default Idea;
