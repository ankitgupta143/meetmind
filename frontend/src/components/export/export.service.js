/**
 * Boundary for the meeting-export API.
 *
 * Replace the implementation with the API client once the backend endpoint is
 * available. Keeping this contract here prevents presentation components from
 * depending on transport details.
 */
export async function requestMeetingExport(exportRequest) {
  // TODO: POST /api/meetings/:meetingId/export with exportRequest.
  // The temporary response keeps the UI usable until that endpoint exists.
  await new Promise((resolve) => window.setTimeout(resolve, 700));

  return {
    // The backend should return a short-lived signed URL here.
    downloadUrl: null,
    filename: exportRequest.filename,
    status: "ready",
  };
}

export function triggerExportDownload(downloadUrl, filename) {
  if (!downloadUrl) return;

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
