import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";

export async function getUserMeetings({ userId, page = 1, limit = 10 }) {
  const skip = (page - 1) * limit;

  const filter = {
    ownerId: userId,
    status: { $ne: "deleted" },
  };

  const [meetings, total] = await Promise.all([
    Meeting.find(filter)
      .sort({ meetingDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Meeting.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meetings,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getUserMeetingById({ meetingId, userId }) {
  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  }).lean();

  if (!meeting) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  return meeting;
}
