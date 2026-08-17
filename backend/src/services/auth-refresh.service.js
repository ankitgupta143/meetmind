import User from "../models/User.js";

import {
  generateAccessToken,
} from "./token.service.js";

import {
  findValidSession,
  rotateSession,
} from "./session.service.js";

export async function refreshAccessToken({
  refreshToken,
  userAgent,
  ipAddress,
}) {
  if (!refreshToken) {
    const error = new Error(
      "Refresh token is required."
    );

    error.code = "REFRESH_TOKEN_REQUIRED";

    throw error;
  }

  const currentSession =
    await findValidSession(refreshToken);

  const user = await User.findById(
    currentSession.userId
  );

  if (!user) {
    const error = new Error(
      "User associated with this session no longer exists."
    );

    error.code = "USER_NOT_FOUND";

    throw error;
  }

  if (user.status !== "active") {
    const error = new Error(
      "This account cannot be authenticated."
    );

    error.code = "ACCOUNT_NOT_ACTIVE";

    throw error;
  }

  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  const {
    refreshToken: newRefreshToken,
    session: newSession,
  } = await rotateSession({
    currentSession,
    userAgent,
    ipAddress,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    session: newSession,
  };
}