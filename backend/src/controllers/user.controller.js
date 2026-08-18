import {
  getCurrentUser,
  updateCurrentUser,
} from "../services/user.service.js";

export async function getCurrentUserController(
  req,
  res,
  next
) {
  try {
    const user = await getCurrentUser(
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully.",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCurrentUserController(
  req,
  res,
  next
) {
  try {
    const user = await updateCurrentUser(
      req.user.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}