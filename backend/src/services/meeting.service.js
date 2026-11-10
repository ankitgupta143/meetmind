import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import Transcript from "../models/Transcript.js";
import MeetingInsights from "../models/MeetingInsights.js";
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

export async function updateMeeting({ meetingId, userId, updates = {} }) {
  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const setOperations = {};

  if (updates.title !== undefined) {
    const cleanTitle = updates.title.trim();
    if (!cleanTitle) {
      const error = new Error("Meeting title cannot be empty.");
      error.code = "INVALID_MEETING_TITLE";
      throw error;
    }
    setOperations.title = cleanTitle;
  }

  if (updates.description !== undefined) {
    setOperations.description = updates.description.trim();
  }

  if (updates.meetingDate !== undefined) {
    const parsedDate = new Date(updates.meetingDate);
    if (isNaN(parsedDate.getTime())) {
      const error = new Error("Invalid meeting date.");
      error.code = "INVALID_MEETING_DATE";
      throw error;
    }
    setOperations.meetingDate = parsedDate;
  }

  if (updates.durationSeconds !== undefined) {
    setOperations.durationSeconds = Math.max(0, Number(updates.durationSeconds) || 0);
  }

  if (updates.participants !== undefined) {
    setOperations.participants = Array.isArray(updates.participants)
      ? updates.participants
          .map((p) => {
            if (typeof p === "string") {
              const name = p.trim();
              return name ? { name, email: "" } : null;
            }
            if (p && typeof p === "object") {
              const name = p.name ? p.name.trim() : "";
              const email = p.email ? p.email.trim().toLowerCase() : "";
              if (name || email) {
                return { name, email };
              }
            }
            return null;
          })
          .filter(Boolean)
      : [];
  }

  if (updates.isFavorite !== undefined) {
    setOperations.isFavorite = Boolean(updates.isFavorite);
  }

  if (updates.isPinned !== undefined) {
    setOperations.isPinned = Boolean(updates.isPinned);
  }

  if (updates.status !== undefined) {
    setOperations.status = updates.status;
  }

  if (Object.keys(setOperations).length === 0) {
    const error = new Error("No fields provided to update.");
    error.code = "NO_UPDATES_PROVIDED";
    throw error;
  }

  const meeting = await Meeting.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(meetingId),
      ownerId: new mongoose.Types.ObjectId(userId),
      status: { $ne: "deleted" },
    },
    {
      $set: setOperations,
    },
    {
      returnDocument: "after",
      runValidators: true,
    }
  ).lean();

  if (!meeting) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  return meeting;
}

export async function deleteMeeting({ meetingId, userId }) {
  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const meetingObjectId = new mongoose.Types.ObjectId(meetingId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // 1. Permanently remove meeting document from MongoDB
  const meeting = await Meeting.findOneAndDelete({
    _id: meetingObjectId,
    ownerId: userObjectId,
  }).lean();

  if (!meeting) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  // 2. Cascade delete associated Transcripts & MeetingInsights from MongoDB
  await Promise.allSettled([
    Transcript.deleteMany({ meetingId: meetingObjectId }),
    MeetingInsights.deleteMany({ meetingId: meetingObjectId }),
  ]);

  // 3. Safely clean up Cloudinary storage if recording was uploaded
  if (meeting.recording?.publicId) {
    try {
      const resourceType = meeting.recording.mimeType?.startsWith("video")
        ? "video"
        : "video";
      await deleteMeetingFromCloudinary(meeting.recording.publicId, resourceType);
    } catch (cleanupError) {
      console.warn(
        `[Meeting Delete] Cloudinary cleanup failed for ${meeting._id}:`,
        cleanupError.message
      );
    }
  }

  return {
    id: meeting._id,
    deleted: true,
  };
}
