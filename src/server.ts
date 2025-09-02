import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

//Middleware
app.use(cors());

//NotFound
app.use("/", notFound);

//Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at PORT: ${PORT}`);
});
