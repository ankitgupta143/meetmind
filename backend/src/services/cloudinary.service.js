import { resolve } from "dns";
import cloudinary from "../config/cloudinary.js";
import { buffer } from "stream/consumers";
import { error } from "console";

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
        if(error){
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  })
}


export const deleteMeetingFromCloudinary = (publicId, resourceType = "video") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, 
      {
        resource_type: resourceType,
      },
      (error, result) => {
        if(error){
          return reject(error);
        }
        resolve(result);
      }
    )
  })
}