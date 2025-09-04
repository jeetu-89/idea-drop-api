import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.log("❌ Please add JWT_SECRET at .env file.");
  process.exit(1);
}
//Uint-8Array conversion
const encoder = new TextEncoder();
const encodedJWT = encoder.encode(JWT_SECRET);
export default encodedJWT;