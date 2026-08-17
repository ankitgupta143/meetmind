import { success } from "zod";
import { refreshTokenCookieOptions } from "../config/cookies.js";
import { refreshAccessToken } from "../services/auth-refresh.service.js";
import { registerUser, loginUser } from "../services/auth.service.js";
import { revokeSessionByRefreshToken } from "../services/session.service.js";

export async function registerController(req, res, next) {
  try {
    const user = await registerUser(req.body);
    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const result = await loginUser({
      ...req.body,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });
    res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
}


export async function refreshController(
  req,
  res,
  next
) {
  try {
    const result = await refreshAccessToken({
      refreshToken: req.cookies.refreshToken,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshTokenCookieOptions
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed.",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}


export async function logoutController(req, res, next) {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    await revokeSessionByRefreshToken(
      refreshToken
    );

    res.clearCookie(
      "refreshToken",
      refreshTokenCookieOptions
    );

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
}