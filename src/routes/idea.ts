import express from "express";
import type { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import Idea from "../models/Idea.js";

const router = express();

//---------------------------------------------------------------------------------------------------------
//route               GET /api/ideas
//description         Get all ideas
//access              Public
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (error) {
    next(error);
  }
});

//--------------------------------------------------------------------------------------------------------------
//route               GET /api/ideas/:id
//description         Get single idea
//access              Public
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400);
      throw new Error("You forget to provide ideaId");
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea not Found");
    }
    const idea = await Idea.findById(id);
    res.json(idea);
  } catch (err) {
    next(err);
  }
});
export default router;
