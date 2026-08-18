export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "EMAIL_ALREADY_EXISTS") {
    return res.status(409).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists.",
    });
  }

  if (err.code === "INVALID_CREDENTIALS") {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  if (err.code === "WRONG_AUTH_PROVIDER") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === "ACCOUNT_SUSPENDED") {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === "ACCOUNT_DELETED") {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  if (
    err.code === "REFRESH_TOKEN_REQUIRED" ||
    err.code === "INVALID_REFRESH_TOKEN" ||
    err.code === "SESSION_REVOKED" ||
    err.code === "SESSION_EXPIRED"
  ) {
    return res.status(401).json({
      success: false,
      message: "Authentication session is invalid.",
    });
  }

  if (err.code === "USER_NOT_FOUND") {
  return res.status(404).json({
    success: false,
    message: "User not found.",
  });
}

if (err.code === "USER_DELETED") {
  return res.status(404).json({
    success: false,
    message: "User account no longer exists.",
  });
}

  return res.status(500).json({
    success: false,
    message: "Internal Server Error.",
  });
}
