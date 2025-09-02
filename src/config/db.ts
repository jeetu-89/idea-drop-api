import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.log("❌ MongDB URI is missing. Please set MONGO_URI in .env file.");
  process.exit(1);
}
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`✅ DataBase connected successfully: ${conn.connection.host}`);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "With Unknown Error";
    console.error(`❌ Error connecting MongoDB: ${message}`);
    process.exit(1);
  }
};
export default connectDB;
