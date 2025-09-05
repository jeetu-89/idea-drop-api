import type { Request, Response, NextFunction } from "express";
import type { Payload } from "../types.js";

import express from "express";
import User from "../models/User.js";
import generateToken from "../lib/generateToken.js";
import dotenv from "dotenv";
import { jwtVerify } from "jose";
import JWT_SECRET from "../lib/getJWT.js";

dotenv.config();
const router = express.Router();

//--------------------------------------------------------------------------------------------------------------------------------------
//@route               POST /api/auth/register
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
      const refreshToken = await generateToken(payload, "30d");
      const accessToken = await generateToken(payload, "1m");

      //Setting up cookies
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, //30days
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
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
//--------------------------------------------------------------------------------------------------------------------------------------
//@route               POST /api/auth/logout
//@description         Logout user and delete  refreshToken
//@access              Private
router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      message: "Logged out successfully",
    });
  }
);

//--------------------------------------------------------------------------------------------------------------------------------------
//@route               POST /api/auth/login
//@description         Authenticate a user
//@access              Public
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      if (!email.trim() || !password.trim()) {
        res.status(400);
        throw new Error("Email and Password are required.");
      }
      const existingUser = await User.findOne({ email: email.trim() });
      if (!existingUser) {
        res.status(401);
        throw new Error("Invalid email or password.");
      }
      const isSame = await existingUser.matchPassword(password);
      if (!isSame) {
        res.status(401);
        throw new Error("Invalid email or password.");
      }

      //Token generation
      const payload = { userId: existingUser._id.toString() };
      const accessToken = await generateToken(payload, "1m");
      const refreshToken = await generateToken(payload, "30d");

      //set Cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, //30days,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      });

      res.status(200).json({
        accessToken,
        user: {
          userId: existingUser._id,
          name: existingUser.name,
          email,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);
//--------------------------------------------------------------------------------------------------------------------------------------
//@route               POST /api/auth/refresh
//@description         Generate new access token
//@access              Public (Needs valid refresh token in cookie )
router.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string | null = req.cookies?.refreshToken;
      if (!token) {
        res.status(401);
        throw new Error("No Refresh Token");
      }
      console.log("⏳ Refreshing Token...")

      const { payload } = await jwtVerify<Payload>(token, JWT_SECRET);
      const { userId } = payload;
      const user = await User.findById(userId);
      if (!user) {
        res.status(401);
        throw new Error("No User Found");
      }

      //generate access Token
      const newAccessToken = await generateToken(payload, "1m");
      res.json({
        accessToken: newAccessToken,
        user: {
          userId: user._id,
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
