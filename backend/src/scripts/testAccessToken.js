import "dotenv/config";

import jwt from "jsonwebtoken";

import { generateAccessToken } from "../services/token.service.js";

const userId = "68a123456789abcdef123456";

const token = generateAccessToken({
  userId,
  role: "user",
});

console.log("\nGenerated access token:");
console.log(token);

console.log("\nToken parts:");

const parts = token.split(".");

console.log({
  header: parts[0],
  payload: parts[1],
  signature: parts[2],
});

const decoded = jwt.decode(token);

console.log("\nDecoded token:");
console.log(decoded);

const secret = process.env.JWT_ACCESS_SECRET;

const verified = jwt.verify(token, secret, {
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
});

console.log("\nVerified token:");
console.log(verified);