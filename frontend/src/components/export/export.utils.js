export function buildExportFilename(filename, extension) {
  const safeName = filename
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ");

  return `${safeName || "meeting-export"}.${extension}`;
}
