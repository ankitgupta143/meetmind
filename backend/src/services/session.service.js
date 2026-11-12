import mongoose from "mongoose";
import Session from "../models/Session.js";
import { generateRefreshToken, hashRefreshToken } from "./token.service.js";

const REFRESH_TOKEN_EXPIRES_IN_DAYS =
  Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS) || 7;

export async function createSession({ userId, userAgent, ipAddress, mongoSession = null }) {
  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  );

  const [session] = await Session.create(
    [
      {
        userId,
        tokenHash,
        expiresAt,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
        lastUsedAt: new Date(),
      },
    ],
    {
      session: mongoSession,
    }
  );

  return {
    session,
    refreshToken,
  };
}

export async function findValidSession(refreshToken) {
  if (typeof refreshToken !== "string" || !refreshToken.trim()) {
    const error = new Error("Invalid refresh token.");
    error.code = "INVALID_REFRESH_TOKEN";
    throw error;
  }
  const tokenHash = hashRefreshToken(refreshToken);
  const session = await Session.findOne({ tokenHash });

  if (!session) {
    const error = new Error("Invalid refresh token.");
    error.code = "INVALID_REFRESH_TOKEN";
    throw error;
  }

  if (session.revokedAt) {
    const error = new Error("Session has been revoked.");
    error.code = "SESSION_REVOKED";
    throw error;
  }

  if (session.expiresAt <= new Date()) {
    const error = new Error("Session has expired.");
    error.code = "SESSION_EXPIRED";
    throw error;
  }

  return session;
}


export async function revokeSession(sessionId){
    const session = await Session.findById(sessionId);

    if(!session){
        const error = new Error("Session not found.");
        error.code = "SESSION_NOT_FOUND";
        throw error;
    }

    if(!session.revokedAt){
        session.revokedAt = new Date();
        await session.save();
    }

    return session;
}


export async function rotateSession({
  currentSession,
  userAgent,
  ipAddress,
}) {
  const mongoSession = await mongoose.startSession();

  try {
    let result;

    await mongoSession.withTransaction(async () => {
      currentSession.revokedAt = new Date();

      await currentSession.save({
        session: mongoSession,
      });

      result = await createSession({
        userId: currentSession.userId,
        userAgent,
        ipAddress,
        mongoSession,
      });
    });

    return result;
  } finally {
    await mongoSession.endSession();
  }
}


export async function revokeSessionByRefreshToken(
  refreshToken
) {
  if (!refreshToken || typeof refreshToken !== "string") {
    return null;
  }

  const tokenHash = hashRefreshToken(refreshToken);

  const session = await Session.findOne({
    tokenHash,
  });

  if (!session) {
    return null;
  }

  if (!session.revokedAt) {
    session.revokedAt = new Date();

    await session.save();
  }

  return session;
}