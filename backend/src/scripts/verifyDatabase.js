import "dotenv/config";

import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";

import User from "../models/User.js";
import Meeting from "../models/Meeting.js";
import Transcript from "../models/Transcript.js";
import MeetingInsights from "../models/MeetingInsights.js";
import Session from "../models/Session.js";

async function verifyDatabase() {
  try {
    await connectDatabase();

    console.log("\nCreating test user...");

    const user = await User.create({
      firstName: "MeetMind",
      lastName: "Test User",
      email: `test-${Date.now()}@meetmind.dev`,
      passwordHash: "temporary-test-hash",
      emailVerifiedAt: new Date(),
    });

    console.log("User created:", user._id.toString());

    console.log("\nCreating test meeting...");

    const meeting = await Meeting.create({
      ownerId: user._id,
      title: "Database Verification Meeting",
      description: "Temporary meeting used to verify relationships.",
      meetingDate: new Date(),
      durationSeconds: 1800,
      participants: [
        {
          name: "MeetMind Test User",
          email: user.email,
        },
      ],
      source: "upload",
      status: "ready",
      processingStatus: "completed",
    });

    console.log("Meeting created:", meeting._id.toString());

    console.log("\nCreating transcript...");

    const transcript = await Transcript.create({
      meetingId: meeting._id,
      language: "en",
      status: "completed",
      provider: "manual",
      rawText: "This is a test transcript.",
      segments: [
        {
          speaker: "MeetMind Test User",
          startTime: 0,
          endTime: 5,
          text: "This is a test transcript.",
        },
      ],
      completedAt: new Date(),
    });

    console.log("Transcript created:", transcript._id.toString());

    console.log("\nCreating meeting insights...");

    const insights = await MeetingInsights.create({
      meetingId: meeting._id,
      status: "completed",
      provider: "gemini",
      model: "test-model",

      summary: {
        overview: "This is a test AI summary.",
        keyTakeaways: [
          "Database connection works.",
          "Model relationships work.",
        ],
      },

      actionItems: [
        {
          title: "Verify database models",
          priority: "high",
          status: "completed",
        },
      ],

      decisions: [
        {
          title: "Use MongoDB",
          description: "MongoDB will be the primary database.",
        },
      ],

      risks: [],

      timeline: [
        {
          timestamp: 0,
          title: "Meeting Started",
          description: "Verification meeting started.",
        },
      ],

      analytics: {
        totalDurationSeconds: 1800,
      },

      generatedAt: new Date(),
    });

    console.log("Meeting insights created:", insights._id.toString());

    const session = await Session.create({
      userId: user._id,
      tokenHash: `test-token-${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userAgent: "MeetMind Verification Script",
      ipAddress: "127.0.0.1",
      lastUsedAt: new Date(),
    });

    console.log("Session created:", session._id.toString());

    await Session.deleteOne({
      _id: session._id,
    });

    console.log("\nTesting relationship lookup...");

    const result = await Meeting.findById(meeting._id)
      .populate("ownerId")
      .lean();

    console.log("\nRelationship verification:");

    console.log({
      meeting: result.title,
      owner: result.ownerId.email,
    });

    console.log("\nDatabase verification successful! ✅");

    await Session.deleteOne({
      _id: session._id,
    });

    await User.deleteOne({ _id: user._id });
    await Meeting.deleteOne({ _id: meeting._id });
    await Transcript.deleteOne({ _id: transcript._id });
    await MeetingInsights.deleteOne({ _id: insights._id });

    console.log("Temporary test data removed.");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("\nDatabase verification failed ❌");
    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
}

verifyDatabase();
