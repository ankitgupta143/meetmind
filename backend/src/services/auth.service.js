import User from "../models/User.js";
import { hashPassword } from "./password.service.js";

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
