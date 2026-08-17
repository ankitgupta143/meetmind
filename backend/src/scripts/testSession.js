import "dotenv/config";

import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";
import User from "../models/User.js";
import Session from "../models/Session.js";
import { createSession } from "../services/session.service.js";
import { hashRefreshToken } from "../services/token.service.js";

async function testSession() {
  let user;
  let session;

  try {
    await connectDatabase();

    console.log("\nCreating test user...");

    user = await User.create({
      firstName: "Session",
      lastName: "Tester",
      email: `session-${Date.now()}@meetmind.dev`,
      passwordHash: "temporary-test-hash",
      authProvider: "local",
    });

    console.log("User created:", user._id.toString());

    console.log("\nCreating session...");

    const result = await createSession({
      userId: user._id,
      userAgent: "MeetMind Session Test",
      ipAddress: "127.0.0.1",
    });

    session = result.session;
    const refreshToken = result.refreshToken;

    console.log("Session created:", session._id.toString());

    console.log("\nRefresh token generated:");
    console.log(refreshToken);

    console.log("\nChecking stored session...");

    const storedSession = await Session.findById(
      session._id
    ).select("+tokenHash");

    console.log({
      userId: storedSession.userId.toString(),
      hasTokenHash: Boolean(storedSession.tokenHash),
      expiresAt: storedSession.expiresAt,
      revokedAt: storedSession.revokedAt,
      userAgent: storedSession.userAgent,
      ipAddress: storedSession.ipAddress,
    });

    const calculatedHash =
      hashRefreshToken(refreshToken);

    console.log(
      "\nRefresh token hash matches:",
      calculatedHash === storedSession.tokenHash
    );

    console.log("\nSession test successful! ✅");
  } catch (error) {
    console.error("\nSession test failed ❌");
    console.error(error);

    process.exitCode = 1;
  } finally {
    if (session?._id) {
      await Session.deleteOne({
        _id: session._id,
      });
    }

    if (user?._id) {
      await User.deleteOne({
        _id: user._id,
      });
    }

    await mongoose.connection.close();
  }
}

testSession();