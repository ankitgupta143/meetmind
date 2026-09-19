import { diarizeMeeting } from "../services/diarization.service.js";

export async function diarizeMeetingController(req, res, next) {
  try {
    const segments = await diarizeMeeting(
      req.params.meetingId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: "Meeting diarization completed successfully.",
      data: {
        segments,
      },
    });
  } catch (error) {
    next(error);
  }
}