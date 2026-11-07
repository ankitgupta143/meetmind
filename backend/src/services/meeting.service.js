import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import { deleteMeetingFromCloudinary, uploadMeetingToCloudinary } from "./cloudinary.service.js";

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getUserMeetings({
  userId,
  page = 1,
  limit = 10,
  search = "",
  status = "all",
  sortBy = "date",
  sortOrder = "desc",
}) {
  const skip = (page - 1) * limit;

  const filter = {
    ownerId: new mongoose.Types.ObjectId(userId),
    status: { $ne: "deleted" },
  };

  // Status Filter
  if (status && status !== "all") {
    const normalizedStatus = String(status).toLowerCase();
    if (normalizedStatus === "completed" || normalizedStatus === "ready") {
      filter.processingStatus = "completed";
    } else if (normalizedStatus === "processing") {
      filter.processingStatus = { $in: ["processing", "pending"] };
    } else if (normalizedStatus === "failed") {
      filter.processingStatus = "failed";
    }
  }

  // Keyword / Search Filter
  const trimmedSearch = (search || "").trim();
  if (trimmedSearch) {
    const searchRegex = new RegExp(escapeRegex(trimmedSearch), "i");
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { "participants.name": searchRegex },
    ];
  }

  // Sorting
  const order = sortOrder === "asc" ? 1 : -1;
  let sortCriteria = { meetingDate: order, createdAt: order };

  if (sortBy === "title") {
    sortCriteria = { title: order };
  } else if (sortBy === "duration") {
    sortCriteria = { durationSeconds: order };
  }

  const [meetings, total] = await Promise.all([
    Meeting.find(filter)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean(),

    Meeting.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

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

export async function createMeeting({ userId, file }) {
  if (!file) {
    const error = new Error("Meeting recording is required.");
    error.code = "MEETING_FILE_REQUIRED";
    throw error;
  }

  const result = await uploadMeetingToCloudinary(file.buffer, {
    folder: "meetmind/meetings",
    resource_type: "auto",
  });

  const title = file.originalname.replace(/\.[^/.]+$/, "").trim();

  try {
    const meeting = await Meeting.create({
      ownerId: new mongoose.Types.ObjectId(userId),
      title: title || "Untitled Meeting",
      meetingDate: new Date(),
      source: "upload",
      status: "draft",
      processingStatus: "pending",
      durationSeconds: result.duration || 0,
      recording: {
        url: result.secure_url || result.url,
        publicId: result.public_id,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        durationSeconds: result.duration || null,
      }
    });
    return meeting;
  } catch (error) {
    // If MongoDB creation fails after Cloudinary succeeds,
    // remove the uploaded recording so we don't leave
    // an orphaned file in Cloudinary.
    if (result.public_id) {
      try {
        await deleteMeetingFromCloudinary(
          result.public_id,
          result.resource_type
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up Cloudinary recording:",
          cleanupError
        );
      }
    }

    throw error;
  }
}
