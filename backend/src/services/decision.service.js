import mongoose from "mongoose";

import Meeting from "../models/Meeting.js";
import MeetingInsights from "../models/MeetingInsights.js";

async function verifyMeetingOwnership({ meetingId, userId }) {
  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    return null;
  }

  return Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  })
    .select("_id")
    .lean();
}

export async function getMeetingDecisions({ meetingId, userId }) {
  const meeting = await verifyMeetingOwnership({
    meetingId,
    userId,
  });

  if (!meeting) {
    return null;
  }

  const insights = await MeetingInsights.findOne({
    meetingId: meeting._id,
  }).lean();

  if (!insights) {
    return null;
  }

  return {
    decisions: insights.decisions || [],
  };
}

export async function updateMeetingDecision({
  meetingId,
  userId,
  index,
  updates,
}) {
  const meeting = await verifyMeetingOwnership({
    meetingId,
    userId,
  });

  if (!meeting) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const insights = await MeetingInsights.findOne({
    meetingId: meeting._id,
  });

  if (!insights) {
    const error = new Error("Meeting insights not found.");
    error.code = "INSIGHTS_NOT_FOUND";
    throw error;
  }

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= insights.decisions.length
  ) {
    const error = new Error("Decision not found.");
    error.code = "DECISION_NOT_FOUND";
    throw error;
  }

  const decision = insights.decisions[index];

  if (updates.title !== undefined) {
    decision.title = updates.title.trim();
  }

  if (updates.description !== undefined) {
    decision.description = updates.description.trim();
  }

  if (updates.owner !== undefined) {
    decision.owner = updates.owner?.trim() || null;
  }

  await insights.save();

  return decision;
}

export async function deleteMeetingDecision({ meetingId, userId, index }) {
  const meeting = await verifyMeetingOwnership({
    meetingId,
    userId,
  });

  if (!meeting) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const insights = await MeetingInsights.findOne({
    meetingId: meeting._id,
  });

  if (!insights) {
    const error = new Error("Meeting insights not found.");
    error.code = "INSIGHTS_NOT_FOUND";
    throw error;
  }

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= insights.decisions.length
  ) {
    const error = new Error("Decision not found.");
    error.code = "DECISION_NOT_FOUND";
    throw error;
  }

  const deletedDecision = insights.decisions[index];

  insights.decisions.splice(index, 1);

  await insights.save();

  return deletedDecision;
}
