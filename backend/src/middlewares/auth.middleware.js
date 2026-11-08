import { verifyAccessToken } from "../services/token.service.js";

export function authenticate(req, res, next) {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const [scheme, token] =
      authorization.split(" ");

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header.",
      });
    }

    const decoded =
      verifyAccessToken(token);

    if (decoded.type !== "access") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token.",
      });
    }

    req.user = {
      id: decoded.sub,
      _id: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
}
