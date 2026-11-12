/**
 * Inspects buffer headers to detect actual file type magic bytes.
 * Prevents MIME confusion, disguised executable uploads, and polyglot payloads.
 */

export function isValidImageSignature(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 12) {
    return false;
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // 3. GIF: GIF87a or GIF89a
  const gifHeader = buffer.subarray(0, 6).toString("ascii");
  if (gifHeader === "GIF87a" || gifHeader === "GIF89a") {
    return true;
  }

  // 4. WebP: RIFF....WEBP
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return true;
  }

  return false;
}

export function isValidAudioVideoSignature(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 12) {
    return false;
  }

  // 1. MP3 with ID3v2 tag (ID3...)
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) {
    return true;
  }

  // 2. MP3 frame sync without ID3 (FF FB, FF F3, FF F2)
  if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) {
    return true;
  }

  // 3. WAV: RIFF....WAVE
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WAVE"
  ) {
    return true;
  }

  // 4. MP4 / M4A / MOV (ISO Base Media File Format box)
  // Box type at offset 4: "ftyp", "moov", "mdat", "wide"
  const boxType = buffer.subarray(4, 8).toString("ascii");
  if (["ftyp", "moov", "mdat", "wide"].includes(boxType)) {
    return true;
  }

  return false;
}
