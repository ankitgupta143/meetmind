import { updateMeetingSpeakers } from "../services/meetingSpeaker.service.js";

/**
 * Controller: Update/Rename speakers across transcript, insights, and meeting
 */
export async function updateMeetingSpeakersController(req, res, next) {
  try {
    const userId = req.user.id || req.user._id;
    const meetingId = req.params.meetingId || req.params.id;
    const { speakerMapping, oldName, newName } = req.body || {};

    const mapping =
      speakerMapping || (oldName && newName ? { [oldName]: newName } : {});

    const result = await updateMeetingSpeakers({
      meetingId,
      userId,
      speakerMapping: mapping,
    });

    return res.status(200).json({
      success: true,
      message: `Speakers updated successfully across ${result.updatedSegmentsCount} dialogue segments.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
