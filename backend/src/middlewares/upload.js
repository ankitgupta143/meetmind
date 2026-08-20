import multer from "multer";
import path from "path";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const isValidExt = ALLOWED_EXTENSIONS.includes(ext);

  // Accept if MIME type is valid OR if MIME type is application/octet-stream and extension is valid
  if (isValidMime || (isValidExt && file.mimetype === "application/octet-stream")) {
    return callback(null, true);
  }

  const error = new Error("Only JPG, PNG, and GIF images are allowed.");
  error.code = "INVALID_FILE_TYPE";
  error.receivedMimeType = file.mimetype;
  return callback(error);
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

export default upload;