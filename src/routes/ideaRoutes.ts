import express from "express";
import type { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
import Idea from "../models/Idea.js";
import type { IdeaBody } from "../types.js";

const router = express();

//---------------------------------------------------------------------------------------------------------
//@route               GET /api/ideas
//@description         Get all ideas
//@access              Public
//@query              _limit(optional limit for ideas returned)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const limit = parseInt(
    typeof req.query._limit === "string" ? req.query._limit : "0"
  );
  try {
    const query = Idea.find().sort({ createdAt: -1 });
    if (!isNaN(limit)) {
      query.limit(limit);
    }
    const ideas = await query.exec();
    res.json(ideas);
  } catch (error) {
    next(error);
  }
});

//--------------------------------------------------------------------------------------------------------------
//@route               GET /api/ideas/:id
//@description         Get single idea
//@access              Public
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

//-----------------------------------------------------------------------------------------------
//@route               POST /api/ideas
//@description         Post single idea
//@access              Private
router.post(
  "/",
  async (req: Request<{}, {}, IdeaBody>, res: Response, next: NextFunction) => {
    const { title, summary, description, tags } = req.body;

    try {
      if (!title.trim() || !summary.trim() || !description.trim()) {
        res.status(400);
        throw new Error("Insufficent body content passed");
      }
      const newIdea = {
        title,
        summary,
        description,
        tags:
          typeof tags === "string"
            ? tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : Array.isArray(tags)
            ? tags
            : [],
      };

      const savedIdea = await Idea.create(newIdea);
      res.status(201).json(savedIdea);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

//-----------------------------------------------------------------------------------------------------------------
//@routes               DELETE /api/ideas/:id
//@description          Delete single idea by its id
//@access               Private
router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400);
        throw new Error("You forgot to provide ideaId");
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("Invalid idea id has provided.");
      }
      const idea = await Idea.findByIdAndDelete(id);

      if (!idea) {
        res.status(404);
        throw new Error("Idea not Found");
      }
      res.json({
        message: "Idea deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
);
//-----------------------------------------------------------------------------------------------------------------
//@routes               Update /api/ideas/:id
//@description          Update single idea by its id
//@access               Private
router.put(
  "/:id",
  async (
    req: Request<{ id: string }, {}, IdeaBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const { title, description, summary, tags } = req.body;
    try {
      if (!id) {
        res.status(400);
        throw new Error("You forgot to provide ideaId");
      }
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("Invalid idea id has provided.");
      }
      if (!title.trim() || !description.trim() || !summary.trim()) {
        res.status(400);
        throw new Error("Title, Description, and Summary are needed");
      }

      const newIdea = {
        title,
        description,
        summary,
        tags:
          typeof tags === "string"
            ? tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : Array.isArray(tags)
            ? tags
            : [],
      };
      const savedIdea = await Idea.findByIdAndUpdate(id, newIdea);
      if (!savedIdea) {
        res.status(404);
        throw new Error("Idea not Found");
      }
      res.status(201).json(savedIdea);
    } catch (error) {
      next(error);
    }
  }
);
export default router;
