import {
  createMeeting,
  getUserMeetingById,
  getUserMeetings,
} from "../services/meeting.service.js";
import { generateMeetingInsights } from "../services/meetingInsights.service.js";
import { processMeeting } from "../services/meetingProcessing.service.js";

export async function getMeetingsController(req, res, next) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      50,
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
    const meeting = await getUserMeetingById({
      userId: req.user.id,
      meetingId: req.params.id,
    });

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

export async function createMeetingController(req, res, next) {
  try {
    const meeting = await createMeeting({
      userId: req.user.id,
      file: req.file,
    });

    processMeeting({
      meetingId: meeting._id,
      userId: req.user.id,
    }).catch((error) => {
      console.error(
        `Background processing failed for meeting ${meeting._id}:`,
        error,
      );
    });
    return res.status(201).json({
      success: true,
      message: "Meeting uploaded successfully.",
      data: {
        meeting,
      },
    });
  } catch (error) {
    next(error);
  }
}

import { transcribeMeeting } from "../services/transcription.service.js";

export async function testTranscriptionController(req, res, next) {
  try {
    const transcription = await transcribeMeeting({
      meetingId: req.params.id,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Transcription completed.",
      data: {
        transcription,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function testMeetingInsightsController(req, res, next) {
  try {
    const insights = await generateMeetingInsights({
      meetingId: req.params.id,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Meeting insights generated successfully.",
      data: {
        insights,
      },
    });
  } catch (error) {
    next(error);
  }
}
