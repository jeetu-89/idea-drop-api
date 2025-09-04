import express from "express";
import User from "../models/User.js";
import type { Request, Response, NextFunction } from "express";

const router = express.Router();

//--------------------------------------------------------------------------------------------------------------------------------------
//@route               POST /api/auth
//@description         Register user details
//@access              Public
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
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

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
