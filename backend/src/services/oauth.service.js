import crypto from "node:crypto";
import User from "../models/User.js";
import { generateAccessToken } from "./token.service.js";
import { createSession } from "./session.service.js";

/**
 * Generate cryptographically secure state parameter for CSRF prevention in OAuth
 */
export function generateOAuthState() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Build Google OAuth 2.0 Authorization URL
 */
export function getGoogleAuthUrl(state) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri =
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:5000/api/v1/auth/google/callback";

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured in backend environment.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    prompt: "select_account",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange Google Authorization Code for user profile
 */
export async function exchangeGoogleCode(code) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:5000/api/v1/auth/google/callback";

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json().catch(() => ({}));
    throw new Error(
      errorData.error_description || "Failed to exchange authorization code with Google."
    );
  }

  const tokenData = await tokenResponse.json();

  const userinfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!userinfoResponse.ok) {
    throw new Error("Failed to retrieve user profile from Google.");
  }

  const profile = await userinfoResponse.json();

  const nameParts = (profile.name || "").trim().split(/\s+/);
  const firstName = profile.given_name || nameParts[0] || "User";
  const lastName = profile.family_name || nameParts.slice(1).join(" ") || "User";

  return {
    providerId: profile.sub,
    email: profile.email.toLowerCase().trim(),
    firstName,
    lastName,
    avatar: profile.picture || null,
  };
}

/**
 * Build GitHub OAuth Authorization URL
 */
export function getGitHubAuthUrl(state) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri =
    process.env.GITHUB_CALLBACK_URL ||
    "http://localhost:5000/api/v1/auth/github/callback";

  if (!clientId) {
    throw new Error("GITHUB_CLIENT_ID is not configured in backend environment.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange GitHub Authorization Code for user profile
 */
export async function exchangeGitHubCode(code) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri =
    process.env.GITHUB_CALLBACK_URL ||
    "http://localhost:5000/api/v1/auth/github/callback";

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to exchange authorization code with GitHub.");
  }

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    throw new Error(tokenData.error_description || "GitHub OAuth token exchange failed.");
  }

  // Fetch GitHub User profile
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "User-Agent": "MeetMind-App",
    },
  });

  if (!userResponse.ok) {
    throw new Error("Failed to retrieve user profile from GitHub.");
  }

  const githubUser = await userResponse.json();

  // Fetch GitHub verified primary email
  const emailResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "User-Agent": "MeetMind-App",
    },
  });

  let userEmail = githubUser.email;

  if (emailResponse.ok) {
    const emails = await emailResponse.json();
    const primaryVerified = emails.find((e) => e.primary && e.verified);
    const anyVerified = emails.find((e) => e.verified);
    userEmail = primaryVerified?.email || anyVerified?.email || userEmail;
  }

  if (!userEmail) {
    throw new Error("No verified email address found on your GitHub account.");
  }

  const nameParts = (githubUser.name || githubUser.login || "").trim().split(/\s+/);
  const firstName = nameParts[0] || githubUser.login || "User";
  const lastName = nameParts.slice(1).join(" ") || "User";

  return {
    providerId: String(githubUser.id),
    email: userEmail.toLowerCase().trim(),
    firstName,
    lastName,
    avatar: githubUser.avatar_url || null,
  };
}

/**
 * Reconcile OAuth user in database:
 * 1. Find by provider ID (googleId / githubId)
 * 2. If not found, match by verified email (account linking)
 * 3. If still not found, create a new User account
 * 4. Issue access token and persist new session
 */
export async function reconcileOAuthUser({
  provider,
  providerId,
  email,
  firstName,
  lastName,
  avatar,
  userAgent,
  ipAddress,
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const providerKey = provider === "google" ? "googleId" : "githubId";

  // 1. Check if user already exists with this OAuth Provider ID
  let user = await User.findOne({ [providerKey]: providerId });

  if (user) {
    if (user.status === "suspended") {
      const error = new Error("Your account has been suspended. Please contact support.");
      error.code = "ACCOUNT_SUSPENDED";
      throw error;
    }
    if (user.status === "deleted") {
      const error = new Error("This account has been deleted. Please contact support.");
      error.code = "ACCOUNT_DELETED";
      throw error;
    }

    user.lastLoginAt = new Date();
    if (!user.avatar?.url && avatar) {
      user.avatar = { url: avatar, publicId: null };
    }
    await user.save();
  } else {
    // 2. Check if user already exists with this email (Safe Account Linking)
    user = await User.findOne({ email: normalizedEmail });

    if (user) {
      if (user.status === "suspended") {
        const error = new Error("Your account has been suspended. Please contact support.");
        error.code = "ACCOUNT_SUSPENDED";
        throw error;
      }
      if (user.status === "deleted") {
        const error = new Error("This account has been deleted. Please contact support.");
        error.code = "ACCOUNT_DELETED";
        throw error;
      }

      // Link OAuth Provider ID to existing account
      user[providerKey] = providerId;
      if (!user.emailVerifiedAt) {
        user.emailVerifiedAt = new Date();
      }
      if (!user.avatar?.url && avatar) {
        user.avatar = { url: avatar, publicId: null };
      }
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      // 3. Create fresh User document
      user = await User.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        authProvider: provider,
        [providerKey]: providerId,
        emailVerifiedAt: new Date(),
        onboardingCompleted: false,
        lastLoginAt: new Date(),
        avatar: avatar ? { url: avatar, publicId: null } : { url: null, publicId: null },
      });
    }
  }

  // Generate tokens and create Session
  const accessToken = generateAccessToken({ userId: user._id, role: user.role });
  const { refreshToken } = await createSession({
    userId: user._id,
    userAgent,
    ipAddress,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
}
