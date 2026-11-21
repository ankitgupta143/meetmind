import { refreshTokenCookieOptions } from "../config/cookies.js";
import { refreshAccessToken } from "../services/auth-refresh.service.js";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPasswordWithToken,
} from "../services/auth.service.js";
import { revokeSessionByRefreshToken } from "../services/session.service.js";
import {
  generateOAuthState,
  getGoogleAuthUrl,
  exchangeGoogleCode,
  getGitHubAuthUrl,
  exchangeGitHubCode,
  reconcileOAuthUser,
} from "../services/oauth.service.js";

const isProduction = process.env.NODE_ENV === "production";
const oauthStateCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/api/v1/auth",
  maxAge: 10 * 60 * 1000, // 10 minutes
};

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

export async function forgotPasswordController(req, res, next) {
  try {
    const result = await requestPasswordReset(req.body.email);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPasswordController(req, res, next) {
  try {
    const result = await resetPasswordWithToken({
      token: req.body.token,
      newPassword: req.body.password,
    });
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

// ──────────────────────────────────────────────
// OAuth Controllers (Google & GitHub)
// ──────────────────────────────────────────────

export async function googleInitController(req, res, next) {
  try {
    const state = generateOAuthState();
    res.cookie("oauth_state", state, oauthStateCookieOptions);
    const authUrl = getGoogleAuthUrl(state);
    return res.redirect(authUrl);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error.message)}`);
  }
}

export async function googleCallbackController(req, res, next) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error)}`);
    }

    const savedState = req.cookies.oauth_state;
    if (!savedState || !state || savedState !== state) {
      return res.redirect(`${frontendUrl}/login?error=Invalid+or+expired+OAuth+state`);
    }

    res.clearCookie("oauth_state", oauthStateCookieOptions);

    const profile = await exchangeGoogleCode(code);
    const result = await reconcileOAuthUser({
      provider: "google",
      ...profile,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);
    return res.redirect(`${frontendUrl}/auth/callback?status=success`);
  } catch (err) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err.message)}`);
  }
}

export async function githubInitController(req, res, next) {
  try {
    const state = generateOAuthState();
    res.cookie("oauth_state", state, oauthStateCookieOptions);
    const authUrl = getGitHubAuthUrl(state);
    return res.redirect(authUrl);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(error.message)}`);
  }
}

export async function githubCallbackController(req, res, next) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  try {
    const { code, state, error, error_description } = req.query;

    if (error) {
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(error_description || error)}`
      );
    }

    const savedState = req.cookies.oauth_state;
    if (!savedState || !state || savedState !== state) {
      return res.redirect(`${frontendUrl}/login?error=Invalid+or+expired+OAuth+state`);
    }

    res.clearCookie("oauth_state", oauthStateCookieOptions);

    const profile = await exchangeGitHubCode(code);
    const result = await reconcileOAuthUser({
      provider: "github",
      ...profile,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);
    return res.redirect(`${frontendUrl}/auth/callback?status=success`);
  } catch (err) {
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err.message)}`);
  }
}

