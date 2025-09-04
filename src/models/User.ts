import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import type { User } from "../types.js";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

//Middleware for hashing password
userSchema.pre("save", async function (next) {
  if (!this.isNew) {
    if (!this.isModified("password")) return next();

    const currentUser: User | null = await mongoose
      .model("User")
      .findById(this._id);
    const isSame =
      currentUser &&
      (await bcrypt.compare(this.password, currentUser.password));
    if (isSame) return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
