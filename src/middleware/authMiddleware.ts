import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";
import JWT_SECRET from "../lib/getJWT.js";
import type { Payload } from "../types.js";
import User from "../models/User.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error(
        "Unauthorized access, Forgot to pass authorization ."
      );
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("Unauthorized access, No token.");
    }
    const { payload } = await jwtVerify<Payload>(token, JWT_SECRET);
    const user = await User.findById(payload.userId).select("_id name email");
    if (!user) {
      res.status(401);
      throw new Error("User Not found.");
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    next(new Error("Not authorized, token failed"));
  }
};
