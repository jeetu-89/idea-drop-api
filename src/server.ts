import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import connectDB from "./config/db.js";
import ideaRouter from "./routes/idea.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Endpoints
app.use("/api/ideas", ideaRouter);

//NotFound
app.use("/", notFound);

//Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at PORT: ${PORT}`);
});
