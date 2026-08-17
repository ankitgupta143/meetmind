import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

const JWT_ISSUER = process.env.JWT_ISSUER || "meetmind-api";

const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "meetmind-client";

function getAccessTokenSecret() {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT_ACCESS_SECRET is not configured.");
  }
  return process.env.JWT_ACCESS_SECRET;
}

export function generateAccessToken({ userId, role }) {
  const secret = getAccessTokenSecret();

  return jwt.sign(
    {
      sub: userId.toString(),
      role,
      type: "access",
    },
    secret,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    },
  );
}

export function verifyAccessToken(token) {
  const secret = getAccessTokenSecret();

  return jwt.verify(token, secret, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

export function generateRefreshToken(){
    return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token){
    return crypto.createHash("sha256").update(token).digest("hex");
}