import { getUserMeetingById, getUserMeetings } from "../services/meeting.service.js";

export async function getMeetingsController(req, res, next) {
  try {
    const page = Math.max(
      Number.parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(req.query.limit, 10) || 10,
        1
      ),
      50
    );

    const result = await getUserMeetings({
      userId: req.user.id,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}


export async function getMeetingByIdController(req, res, next) {
  try {
    const meeting = await getUserMeetingById({userId: req.user.id, meetingId: req.params.id});

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        meeting,
      },
    });
  } catch (error) {
    next(error);
  }
}