import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "meetmind/avatars",
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      },
    );
  });
};

export const uploadMeetingToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "meetmind/meetings",
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
};

export const deleteMeetingFromCloudinary = async (
  publicId,
  resourceType = "video",
) => {
  if (!publicId) return { result: "no_public_id" };

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (res?.result === "ok") {
      return res;
    }

    // Fallback: If Cloudinary stored an audio file as "raw", destroy with raw
    if (res?.result === "not found" && resourceType !== "raw") {
      const fallback = await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
      });
      return fallback;
    }

    return res;
  } catch (error) {
    try {
      return await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
      });
    } catch (_) {
      throw error;
    }
  }
};
