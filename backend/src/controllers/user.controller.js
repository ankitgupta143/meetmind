import {
  deleteFromCloudinary,
  uploadBufferToCloudinary,
} from "../services/cloudinary.service.js";
import { getCurrentUser, updateCurrentUser } from "../services/user.service.js";
import { isValidImageSignature } from "../utils/fileSignature.js";

export async function getCurrentUserController(req, res, next) {
  try {
    const user = await getCurrentUser(req.user.id);

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

export async function updateCurrentUserController(req, res, next) {
  try {
    const user = await updateCurrentUser(req.user.id, req.body);

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

export async function uploadAvatarController(req, res, next) {
  let uploadedPublicId = null;

  try {
    if (!req.file) {
      const error = new Error("Avatar image is required.");
      error.code = "AVATAR_REQUIRED";
      throw error;
    }

    if (!isValidImageSignature(req.file.buffer)) {
      const error = new Error("Invalid image file content. File does not match valid JPEG, PNG, GIF, or WebP headers.");
      error.code = "INVALID_FILE_SIGNATURE";
      throw error;
    }

    // Get current avatar before replacing it
    const currentUser = await getCurrentUser(req.user.id);

    const oldPublicId = currentUser?.avatar?.publicId ?? null;

    // Upload new avatar
    const result = await uploadBufferToCloudinary(req.file.buffer);

    uploadedPublicId = result.public_id;

    try {
      // Save new avatar in MongoDB
      const updatedUser = await updateCurrentUser(req.user.id, {
        avatar: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      });

      // MongoDB succeeded, so now remove old image
      if (oldPublicId && oldPublicId !== result.public_id) {
        try {
          await deleteFromCloudinary(oldPublicId);
        } catch (cleanupError) {
          console.error(
            "Failed to delete old avatar from Cloudinary:",
            cleanupError,
          );
        }
      }

      return res.status(200).json({
        success: true,
        message: "Avatar uploaded successfully.",
        data: {
          user: updatedUser,
        },
      });
    } catch (databaseError) {
      // MongoDB failed after Cloudinary upload.
      // Remove the newly uploaded image so it doesn't become orphaned.
      if (uploadedPublicId) {
        try {
          await deleteFromCloudinary(uploadedPublicId);
        } catch (cleanupError) {
          console.error(
            "Failed to cleanup newly uploaded avatar:",
            cleanupError,
          );
        }
      }

      throw databaseError;
    }
  } catch (error) {
    next(error);
  }
}


export async function removeAvatarController(req, res, next) {
  try {
    const currentUser = await getCurrentUser(req.user.id);

    const publicId = currentUser?.avatar?.publicId;

    // No avatar already exists
    if (!publicId) {
      return res.status(200).json({
        success: true,
        message: "Avatar removed successfully.",
        data: {
          user: currentUser,
        },
      });
    }

    // Delete image from Cloudinary first
    const cloudinaryResult =
      await deleteFromCloudinary(publicId);

    // Cloudinary can return "ok" when deleted.
    // "not found" is also safe to treat as already removed.
    if (
      cloudinaryResult.result !== "ok" &&
      cloudinaryResult.result !== "not found"
    ) {
      const error = new Error(
        "Failed to remove avatar from storage."
      );

      error.code = "AVATAR_DELETE_FAILED";

      throw error;
    }

    // Clear avatar information from MongoDB
    const updatedUser = await updateCurrentUser(
      req.user.id,
      {
        avatar: {
          url: null,
          publicId: null,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Avatar removed successfully.",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
}