import type { Request, Response, NextFunction } from "express";


const notFound = async (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export default notFound;
