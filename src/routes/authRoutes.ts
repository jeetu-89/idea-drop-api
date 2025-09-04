import type { Request, Response, NextFunction } from "express";

import express from "express";
import User from "../models/User.js";
import generateToken from "../lib/generateToken.js";
import dotenv from "dotenv"

dotenv.config();
const router = express.Router();

//--------------------------------------------------------------------------------------------------------------------------------------
//@route               POST /api/auth
//@description         Register user details
//@access              Public
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    try {
      if (!name.trim() || !email.trim() || !password.trim()) {
        res.status(400);
        throw new Error("All fields are required.");
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400);
        throw new Error("Email Id already Registered.");
      }
      const user = await User.create({
        name,
        email,
        password,
      });

      //Token generation
      const payload = { userId: user._id.toString() };
      const refreshToken =await generateToken(payload, "30d");
      const accessToken = await generateToken(payload, "1m");

      //Setting up cookies
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, //30days
        sameSite: "none",
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(201).json({
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);
export default router;
