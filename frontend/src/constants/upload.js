export const UPLOAD_STEPS = {
  IDLE: "idle",
  UPLOADING: "uploading",
  PROCESSING: "processing",
  SUCCESS: "success",
};

export const MAX_UPLOAD_SIZE = 500 * 1024 * 1024; // 500 MB

export const SUPPORTED_FILE_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "video/mp4",
  "video/quicktime",
];

export const SUPPORTED_EXTENSIONS = [
  "MP3",
  "WAV",
  "M4A",
  "MP4",
  "MOV",
];