import { askMeetingAssistant } from "../services/assistant.service.js";
import {
  createMeeting,
  deleteMeeting,
  getUserMeetingById,
  getUserMeetings,
  updateMeeting,
} from "../services/meeting.service.js";
import { generateMeetingInsights, getUserMeetingInsights } from "../services/meetingInsights.service.js";
import { processMeeting } from "../services/meetingProcessing.service.js";
import { getDashboardOverview } from "../services/dashboard.service.js";
import { transcribeMeeting } from "../services/transcription.service.js";
import { isValidAudioVideoSignature } from "../utils/fileSignature.js";

export async function getDashboardStatsController(req, res, next) {
  try {
    const overview = await getDashboardOverview({
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMeetingsController(req, res, next) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      50,
    );

    const {
      search = "",
      status = "all",
      sortBy = "date",
      sortOrder = "desc",
    } = req.query;

    const result = await getUserMeetings({
      userId: req.user.id,
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder,
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
    if (!req.file) {
      const error = new Error("Meeting recording is required.");
      error.code = "MEETING_FILE_REQUIRED";
      throw error;
    }

    if (!isValidAudioVideoSignature(req.file.buffer)) {
      const error = new Error("Invalid recording file content. File does not match valid MP3, WAV, M4A, or MP4 headers.");
      error.code = "INVALID_FILE_SIGNATURE";
      throw error;
    }

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

export async function getMeetingInsightsController(req, res, next) {
  try {
    const insights = await getUserMeetingInsights({
      meetingId: req.params.id,
      userId: req.user.id,
    });

    if (!insights) {
      return res.status(404).json({
        success: false,
        message: "Meeting insights not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        insights,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function meetingAssistantController(req, res, next) {
  try {
    const { message } = req.body;

    const result = await askMeetingAssistant({
      meetingId: req.params.id,
      userId: req.user.id,
      message,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMeetingController(req, res, next) {
  try {
    const meeting = await updateMeeting({
      meetingId: req.params.id,
      userId: req.user.id,
      updates: req.body,
    });

    return res.status(200).json({
      success: true,
      message: "Meeting updated successfully.",
      data: {
        meeting,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMeetingController(req, res, next) {
  try {
    const result = await deleteMeeting({
      meetingId: req.params.id,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Meeting deleted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

