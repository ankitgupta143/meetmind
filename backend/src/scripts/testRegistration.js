import "dotenv/config";

import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";
import User from "../models/User.js";
import { registerUser } from "../services/auth.service.js";

async function testRegistration() {
  try {
    await connectDatabase();

    const email = `registration-${Date.now()}@meetmind.dev`;

    console.log("\nRegistering test user...");

    const user = await registerUser({
      firstName: "MeetMind",
      lastName: "Tester",
      email,
      password: "MeetMind@123",
    });

    console.log("\nSafe user returned:");

    console.log(user);

    console.log("\nChecking database...");

    const storedUser = await User.findOne({ email }).select(
      "+passwordHash"
    );

    console.log({
      id: storedUser._id.toString(),
      email: storedUser.email,
      hasPasswordHash: Boolean(storedUser.passwordHash),
      passwordIsPlainText:
        storedUser.passwordHash === "MeetMind@123",
    });

    await User.deleteOne({
      _id: storedUser._id,
    });

    console.log("\nTest user removed.");

    await mongoose.connection.close();

    console.log("\nRegistration service test successful! ✅");

    process.exit(0);
  } catch (error) {
    console.error("\nRegistration service test failed ❌");
    console.error(error);

    await mongoose.connection.close();

    process.exit(1);
  }
}

testRegistration();