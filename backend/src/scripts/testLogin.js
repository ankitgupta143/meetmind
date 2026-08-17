import "dotenv/config";

import mongoose from "mongoose";

import { connectDatabase } from "../config/database.js";
import User from "../models/User.js";
import { registerUser, loginUser } from "../services/auth.service.js";

async function testLogin() {
  let user;

  try {
    await connectDatabase();

    const email = `login-${Date.now()}@meetmind.dev`;
    const password = "MeetMind@123";

    console.log("\nCreating test user...");

    user = await registerUser({
      firstName: "Login",
      lastName: "Tester",
      email,
      password,
    });

    console.log("Test user created.");

    console.log("\nTesting correct credentials...");

    const loggedInUser = await loginUser({
      email,
      password,
    });

    console.log("Login successful:");

    console.log({
      id: loggedInUser.id.toString(),
      email: loggedInUser.email,
      lastLoginAt: loggedInUser.lastLoginAt,
    });

    console.log("\nTesting wrong password...");

    try {
      await loginUser({
        email,
        password: "WrongPassword123",
      });

      console.error(
        "❌ Wrong password was incorrectly accepted."
      );
    } catch (error) {
      console.log({
        code: error.code,
        message: error.message,
      });
    }

    console.log("\nTesting unknown email...");

    try {
      await loginUser({
        email: "does-not-exist@meetmind.dev",
        password,
      });

      console.error(
        "❌ Unknown email was incorrectly accepted."
      );
    } catch (error) {
      console.log({
        code: error.code,
        message: error.message,
      });
    }

    console.log("\nLogin service test successful! ✅");
  } catch (error) {
    console.error("\nLogin service test failed ❌");
    console.error(error);

    process.exitCode = 1;
  } finally {
    if (user?.id) {
      await User.deleteOne({
        _id: user.id,
      });
    }

    await mongoose.connection.close();
  }
}

testLogin();