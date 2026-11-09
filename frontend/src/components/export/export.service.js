import api from "@/lib/api";

/**
 * Execute real meeting export against MeetMind Backend API
 */
export async function requestMeetingExport({
  meetingId,
  format,
  sections,
  filename,
  settings,
}) {
  if (!meetingId) {
    throw new Error("No meeting specified for export.");
  }

  try {
    const response = await api.post(
      `/meetings/${meetingId}/export`,
      {
        format,
        sections,
        filename,
        settings,
      },
      {
        responseType: "blob",
      }
    );

    const contentType =
      response.headers?.["content-type"] || "application/octet-stream";
    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: contentType });

    const downloadUrl = window.URL.createObjectURL(blob);

    // Trigger download immediately in the browser
    triggerExportDownload(downloadUrl, filename);

    return {
      downloadUrl,
      filename,
      status: "ready",
    };
  } catch (error) {
    // If backend returns a JSON error, axios blob response wraps it into a Blob
    if (error.response?.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        const json = JSON.parse(errorText);
        if (json?.message) {
          error.message = json.message;
        }
      } catch {
        // Blob wasn't JSON, leave original error message
      }
    }
    throw error;
  }
}

export function triggerExportDownload(downloadUrl, filename) {
  if (!downloadUrl || typeof window === "undefined") return;

  const link = document.createElement("a");
  link.style.display = "none";
  link.href = downloadUrl;
  link.setAttribute("download", filename);
  link.setAttribute("target", "_blank");
  link.rel = "noopener noreferrer";

  document.body.appendChild(link);

  // Trigger download click
  link.click();

  // Defer removal so Chrome / Edge download manager on Windows can safely dispatch the file save
  window.setTimeout(() => {
    try {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    } catch {
      // Ignore removal error
    }
  }, 1500);
}
