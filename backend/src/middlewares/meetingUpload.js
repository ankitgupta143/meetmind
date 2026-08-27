import multer from "multer";
import path from "path";

// Groq Whisper API hard limit is 25 MB.
// WAV files are uncompressed — a 38 MB WAV is typically ~3-4 MB as MP3.
// Users should convert to MP3 or M4A before uploading.
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB


const ALLOWED_MIME_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "video/mp4",
  "video/quicktime",
];

const ALLOWED_EXTENSIONS = [
  ".mp3",
  ".wav",
  ".m4a",
  ".mp4",
  ".mov",
];


const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    const ext = path.extname(file.originalname || "").toLowerCase();

    const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype);

    const isValidExt = ALLOWED_EXTENSIONS.includes(ext);

    if(isValidMime || (isValidExt && file.mimetype === "application/octet-stream")){
        return callback(null, true);
    }

    const error = new Error("Only MP3, WAV, M4A, MP4, and MOV files are allowed.");
    error.code = "INVALID_MEETING_FILE_TYPE";
    error.receivedMimeType = file.mimetype;

    return callback(error);
}

const meetingUpload = multer({storage, limits: {
    fileSize: MAX_FILE_SIZE,
}, fileFilter,});

export default meetingUpload;
