import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import connectDB from "./config/db.js";
import ideaRouter from "./routes/ideaRoutes.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

const allowedOrigins = ["http://localhost:3000"];
//Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//Endpoints
app.use("/api/ideas", ideaRouter);
app.use("/api/auth", authRouter);

//NotFound
app.use("/", notFound);

//Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at PORT: ${PORT}`);
});
