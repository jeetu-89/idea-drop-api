import { SignJWT } from "jose";
import JWT_SECRET from "./getJWT.js";
import type { Payload } from "../types.js";
const generateToken = async (payload: Payload, expiresIn = "15m") => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
};

export default generateToken;
