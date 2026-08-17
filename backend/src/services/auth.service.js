import User from "../models/User.js";
import { hashPassword, verifyPassword } from "./password.service.js";
import { generateAccessToken } from "./token.service.js";
import { createSession } from "./session.service.js";

export async function registerUser({ firstName, lastName, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    const error = new Error("An Account with this email already exists.");
    error.code = "EMAIL_ALREADY_EXISTS";
    throw error;
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    passwordHash,
    authProvider: "local",
  });

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    authProvider: user.authProvider,
    emailVerifiedAt: user.emailVerifiedAt,
    onboardingCompleted: user.onboardingCompleted,
    role: user.role,
    status: user.status,
    avatar: user.avatar,
    settings: user.settings,
    createdAt: user.createdAt,
  };
}

export async function loginUser({ email, password, userAgent, ipAddress }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+passwordHash",
  );

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  if (user.authProvider !== "local") {
    const error = new Error(`Please login using ${user.authProvider}.`);
    error.code = "INVALID_AUTH_PROVIDER";
    throw error;
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);

  if (!passwordValid) {
    const error = new Error("Invalid email or password.");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  if (user.status === "suspended") {
    const error = new Error(
      "Your account has been suspended. Please contact support.",
    );
    error.code = "ACCOUNT_SUSPENDED";
    throw error;
  }

  if (user.status === "deleted") {
    const error = new Error(
      "This account has been deleted. Please contact support.",
    );
    error.code = "ACCOUNT_DELETED";
    throw error;
  }

  user.lastLoginAt = new Date();

  await user.save();

  const accessToken = generateAccessToken({userId: user._id, role: user.role});
  const {refreshToken} = await createSession({
    userId: user._id,
    userAgent,
    ipAddress,
  })

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      authProvider: user.authProvider,
      emailVerifiedAt: user.emailVerifiedAt,
      onboardingCompleted: user.onboardingCompleted,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      settings: user.settings,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    },
  };
}
