import "dotenv/config";

import cloudinary from "../config/cloudinary.js";

async function verifyCloudinary() {
  try {
    const result = await cloudinary.api.ping();

    console.log("Cloudinary connection successful ✅");
    console.log(result);
  } catch (error) {
    console.error("Cloudinary connection failed ❌");
    console.error(error.message);

    process.exit(1);
  }
}

verifyCloudinary();