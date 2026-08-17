export function errorHandler(err, req, res, next) {
    console.error(err);

    if(err.code === "EMAIL_ALREADY_EXISTS"){
        return res.status(409).json({
            success: false,
            message: err.message
        });
    }

    if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists.",
    });
  }


    return res.status(500).json({
        success: false,
        message: "Internal Server Error.",
    });
}