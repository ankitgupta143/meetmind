import "dotenv/config";

import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";
import User from "../models/User.js";

async function testUserProfile() {
  let user;

  try {
    await connectDatabase();

    console.log("\nCreating test user with profile...");

    user = await User.create({
      firstName: "MeetMind",
      lastName: "Profile Test",
      email: `profile-${Date.now()}@meetmind.dev`,
      passwordHash: "temporary-test-hash",

      profile: {
        phone: "+91 98765 43210",
        company: "MeetMind",
        jobTitle: "Frontend Engineer",
        country: "India",
      },
    });

    console.log("User created:", user._id.toString());

    console.log("\nReading profile from MongoDB...");

    const savedUser = await User.findById(user._id)
      .select("firstName lastName profile")
      .lean();

    console.log("\nProfile:");

    console.log(savedUser.profile);

    console.log("\nVerifying fields...");

    console.log({
      phone: savedUser.profile.phone,
      company: savedUser.profile.company,
      jobTitle: savedUser.profile.jobTitle,
      country: savedUser.profile.country,
    });

    if (
      savedUser.profile.phone !== "+91 98765 43210" ||
      savedUser.profile.company !== "MeetMind" ||
      savedUser.profile.jobTitle !== "Frontend Engineer" ||
      savedUser.profile.country !== "India"
    ) {
      throw new Error(
        "Profile fields were not persisted correctly."
      );
    }

    console.log(
      "\nUser profile model verification successful! ✅"
    );
  } catch (error) {
    console.error(
      "\nUser profile model verification failed ❌"
    );

    console.error(error);

    process.exitCode = 1;
  } finally {
    if (user?._id) {
      await User.deleteOne({
        _id: user._id,
      });

      console.log("\nTemporary user removed.");
    }

    await mongoose.connection.close();
  }
}

testUserProfile();