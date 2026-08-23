import { getMeetingTranscript } from "../services/transcript.service.js";

/**
 * GET /api/v1/meetings/:id/transcript
 *
 * Query params:
 *   search  {string}  - substring match on segment text and speaker name
 *   speaker {string}  - exact speaker name filter
 *   page    {number}  - 1-based page number (default: 1)
 *   limit   {number}  - segments per page, 1–200 (default: 50)
 */
export async function getMeetingTranscriptController(req, res, next) {
  try {
    const { search = "", speaker = "" } = req.query;

    // Clamp page and limit to sane bounds
    const page  = Math.max(1, parseInt(req.query.page,  10) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 50));

    const result = await getMeetingTranscript({
      userId:    req.user.id,
      meetingId: req.params.id,
      search:    search.trim(),
      speaker:   speaker.trim(),
      page,
      limit,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Transcript not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        transcript: result.transcript,
        pagination: result.pagination,
        speakers:   result.speakers,
      },
    });
  } catch (error) {
    next(error);
  }
}