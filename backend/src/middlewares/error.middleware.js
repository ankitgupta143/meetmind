export function errorHandler(err, req, res, next) {
  if (err.code !== "REFRESH_TOKEN_REQUIRED") {
    console.error(err);
  }

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Recording must be 25 MB or smaller. WAV files are large — please convert to MP3 or M4A first.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === "FILE_TOO_LARGE_FOR_TRANSCRIPTION") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Groq API returned 413 — file was too large for Whisper
  if (err.status === 413 || err.error?.error?.code === "request_too_large") {
    return res.status(400).json({
      success: false,
      message: "Recording is too large for transcription (Groq limit: 25 MB). Please re-upload as MP3 or M4A.",
    });
  }

  if (err.code === "AI_SERVICE_ERROR") {
    return res.status(503).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      message: `${err.message} Received type: ${err.receivedMimeType || "unknown"}.`,
    });
  }

  if (err.code === "AVATAR_REQUIRES") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

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

  if (err.code === "MEETING_NOT_FOUND") {
    return res.status(404).json({
      success: false,
      message: err.message || "Meeting not found.",
    });
  }

  if (
    err.code === "INSIGHTS_NOT_FOUND" ||
    err.code === "ACTION_ITEM_NOT_FOUND" ||
    err.code === "DECISION_NOT_FOUND"
  ) {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }

  if (
    err.code === "INVALID_ACTION_ITEM_INDEX" ||
    err.code === "INVALID_ACTION_ITEM_TITLE" ||
    err.code === "INVALID_ACTION_ITEM_DESCRIPTION" ||
    err.code === "INVALID_ACTION_ITEM_ASSIGNEE" ||
    err.code === "INVALID_ACTION_ITEM_DUE_DATE" ||
    err.code === "INVALID_ACTION_ITEM_PRIORITY" ||
    err.code === "INVALID_ACTION_ITEM_STATUS"
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === "TRANSCRIPT_NOT_FOUND") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error.",
  });
}
