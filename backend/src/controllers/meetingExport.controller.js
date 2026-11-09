import { exportMeetingDossier } from "../services/meetingExport.service.js";

/**
 * Controller: Export meeting dossier in requested format (Markdown, HTML, PDF, Text, JSON)
 */
export async function exportMeetingController(req, res, next) {
  try {
    const userId = req.user?.id || req.user?._id;
    const meetingId = req.params.meetingId || req.params.id;
    const { format = "markdown", sections = [], settings = {}, filename } = req.body || {};

    const result = await exportMeetingDossier({
      meetingId,
      userId,
      format,
      sections,
      settings,
    });

    // Generate safe filename for HTTP header
    const rawName = (filename || "meeting-export")
      .replace(/\.[^/.]+$/, "") // strip extension if already provided
      .trim();
    const safeName = rawName.replace(/[^a-zA-Z0-9_\-\s]/g, "").replace(/\s+/g, "_") || "meeting-export";
    const downloadFilename = `${safeName}.${result.extension}`;

    res.setHeader("Content-Type", result.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${downloadFilename}"`
    );

    // Send buffer or string
    return res.status(200).send(result.content);
  } catch (error) {
    next(error);
  }
}
