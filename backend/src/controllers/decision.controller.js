import {
  deleteMeetingDecision,
  getMeetingDecisions,
  updateMeetingDecision,
} from "../services/decision.service.js";

export async function getMeetingDecisionsController(req, res, next) {
  try {
    const result = await getMeetingDecisions({
      meetingId: req.params.id,
      userId: req.user.id,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Meeting decisions not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMeetingDecisionController(req, res, next) {
  try {
    const index = Number.parseInt(req.params.index, 10);

    const { title, description, owner } = req.body;

    if (
      title === undefined &&
      description === undefined &&
      owner === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required.",
      });
    }

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      return res.status(400).json({
        success: false,
        message: "Decision title cannot be empty.",
      });
    }

    const decision = await updateMeetingDecision({
      meetingId: req.params.meetingId,
      userId: req.user.id,
      index,
      updates: {
        title,
        description,
        owner,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Decision updated successfully.",
      data: {
        decision,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMeetingDecisionController(req, res, next) {
  try {
    const index = Number.parseInt(req.params.index, 10);

    const decision = await deleteMeetingDecision({
      meetingId: req.params.meetingId,
      userId: req.user.id,
      index,
    });

    return res.status(200).json({
      success: true,
      message: "Decision deleted successfully.",
      data: {
        decision,
      },
    });
  } catch (error) {
    next(error);
  }
}


export async function createMeetingDecisionController(req, res, next) {
  try {
    const { title, description, owner } = req.body || {};

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Decision title cannot be empty.",
      });
    }

    const { createMeetingDecision } = await import("../services/decision.service.js");
    const result = await createMeetingDecision({
      meetingId: req.params.meetingId || req.params.id,
      userId: req.user.id || req.user._id,
      decisionData: { title, description, owner },
    });

    return res.status(201).json({
      success: true,
      message: "Decision created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
