import crypto from "node:crypto";
import User from "../models/User.js";
import { hashPassword, verifyPassword } from "./password.service.js";
import { generateAccessToken } from "./token.service.js";
import { createSession, revokeAllUserSessions } from "./session.service.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email.service.js";

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

  // Generate 32-byte secure email verification token and hash
  const rawVerificationToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawVerificationToken).digest("hex");

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    passwordHash,
    authProvider: "local",
    emailVerificationToken: tokenHash,
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Dispatch transactional activation email
  try {
    await sendVerificationEmail({
      email: user.email,
      name: user.firstName,
      verificationToken: rawVerificationToken,
    });
  } catch (err) {
    console.error("[AuthService] Failed to dispatch verification email on signup:", err.message);
  }

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

export async function requestPasswordReset(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  const genericResponse = {
    message: "If an account exists with that email, a password reset link has been sent.",
  };

  // If user does not exist or uses social OAuth (google/github) or is not active
  if (!user || user.authProvider !== "local" || user.status !== "active") {
    // Small artificial delay to mitigate timing analysis user enumeration
    await new Promise((resolve) => setTimeout(resolve, 80));
    return genericResponse;
  }

  // Generate 32-byte cryptographically secure random token (64 hex chars)
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Hash the token with SHA-256 before persisting to MongoDB
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  // Reset link expires in 1 hour
  user.passwordResetToken = tokenHash;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  try {
    await sendPasswordResetEmail({
      email: user.email,
      name: user.firstName,
      resetToken: rawToken,
    });
  } catch (emailErr) {
    console.error("[AuthService] Failed to dispatch password reset email:", emailErr.message);
    // Even if email delivery fails, we don't throw raw internal errors to the client
  }

  return genericResponse;
}

export async function resetPasswordWithToken({ token, newPassword }) {
  if (!token || typeof token !== "string" || !token.trim()) {
    const error = new Error("Invalid or missing password reset token.");
    error.code = "INVALID_RESET_TOKEN";
    error.status = 400;
    throw error;
  }

  const tokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");

  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetExpires +passwordHash");

  if (!user) {
    const error = new Error("Password reset link is invalid or has expired.");
    error.code = "EXPIRED_OR_INVALID_TOKEN";
    error.status = 400;
    throw error;
  }

  // Hash new password using Argon2
  const newPasswordHash = await hashPassword(newPassword);

  user.passwordHash = newPasswordHash;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  // Invalidate all active sessions for this user across all devices
  await revokeAllUserSessions(user._id, "password-change");

  return {
    message: "Password has been successfully reset. Please log in with your new password.",
  };
}

export async function verifyEmailWithToken(token) {
  if (!token || typeof token !== "string" || !token.trim()) {
    const error = new Error("Invalid or missing verification token.");
    error.code = "INVALID_VERIFICATION_TOKEN";
    error.status = 400;
    throw error;
  }

  const tokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: tokenHash,
    emailVerificationExpires: { $gt: new Date() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    const error = new Error("Email verification link is invalid or has expired.");
    error.code = "EXPIRED_OR_INVALID_TOKEN";
    error.status = 400;
    throw error;
  }

  user.emailVerifiedAt = new Date();
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();

  return {
    message: "Email verified successfully! You can now access your workspace.",
  };
}

export async function resendVerificationEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+emailVerificationToken +emailVerificationExpires"
  );

  const genericResponse = {
    message: "If an unverified account exists with that email, a verification link has been sent.",
  };

  // User not found or non-local account
  if (!user || user.authProvider !== "local" || user.status !== "active") {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return genericResponse;
  }

  // If already verified
  if (user.emailVerifiedAt) {
    return {
      message: "Your email address is already verified. You can sign in directly.",
      alreadyVerified: true,
    };
  }

  // Generate fresh token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.emailVerificationToken = tokenHash;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  await user.save();

  try {
    await sendVerificationEmail({
      email: user.email,
      name: user.firstName,
      verificationToken: rawToken,
    });
  } catch (emailErr) {
    console.error("[AuthService] Failed to dispatch verification email on resend:", emailErr.message);
  }

  return genericResponse;
}


