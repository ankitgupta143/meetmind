import mongoose from "mongoose";

import Meeting from "../models/Meeting.js";
import MeetingInsights from "../models/MeetingInsights.js";

export async function updateMeetingActionItem({
  meetingId,
  userId,
  itemIndex,
  updates,
}) {
  // 1. Validate meeting ID
  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  // 2. Validate action item index
  const index = Number.parseInt(itemIndex, 10);

  if (!Number.isInteger(index) || index < 0) {
    const error = new Error(
      "Invalid action item index."
    );

    error.code = "INVALID_ACTION_ITEM_INDEX";

    throw error;
  }

  // 3. Verify meeting ownership
  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  })
    .select("_id")
    .lean();

  if (!meeting) {
    const error = new Error("Meeting not found.");

    error.code = "MEETING_NOT_FOUND";

    throw error;
  }

  // 4. Get insights
  const insights = await MeetingInsights.findOne({
    meetingId: meeting._id,
  });

  if (!insights) {
    const error = new Error(
      "Meeting insights not found."
    );

    error.code = "INSIGHTS_NOT_FOUND";

    throw error;
  }

  // 5. Check action item exists
  if (
    !insights.actionItems ||
    index >= insights.actionItems.length
  ) {
    const error = new Error(
      "Action item not found."
    );

    error.code = "ACTION_ITEM_NOT_FOUND";

    throw error;
  }

  const actionItem = insights.actionItems[index];

  // 6. Validate individual fields

  if (updates.title !== undefined) {
    if (
      typeof updates.title !== "string" ||
      !updates.title.trim()
    ) {
      const error = new Error(
        "Action item title cannot be empty."
      );

      error.code = "INVALID_ACTION_ITEM_TITLE";

      throw error;
    }

    actionItem.title = updates.title.trim();
  }

  if (updates.description !== undefined) {
    if (typeof updates.description !== "string") {
      const error = new Error(
        "Action item description must be a string."
      );

      error.code = "INVALID_ACTION_ITEM_DESCRIPTION";

      throw error;
    }

    actionItem.description =
      updates.description.trim();
  }

  if (updates.assignee !== undefined) {
    if (
      updates.assignee !== null &&
      typeof updates.assignee !== "string"
    ) {
      const error = new Error(
        "Assignee must be a string or null."
      );

      error.code = "INVALID_ACTION_ITEM_ASSIGNEE";

      throw error;
    }

    actionItem.assignee =
      updates.assignee === null
        ? null
        : updates.assignee.trim();
  }

  if (updates.dueDate !== undefined) {
    if (updates.dueDate === null) {
      actionItem.dueDate = null;
    } else {
      const date = new Date(updates.dueDate);

      if (Number.isNaN(date.getTime())) {
        const error = new Error(
          "Invalid due date."
        );

        error.code = "INVALID_ACTION_ITEM_DUE_DATE";

        throw error;
      }

      actionItem.dueDate = date;
    }
  }

  if (updates.priority !== undefined) {
    const allowedPriorities = [
      "low",
      "medium",
      "high",
    ];

    if (
      !allowedPriorities.includes(
        updates.priority
      )
    ) {
      const error = new Error(
        "Invalid action item priority."
      );

      error.code = "INVALID_ACTION_ITEM_PRIORITY";

      throw error;
    }

    actionItem.priority = updates.priority;
  }

  if (updates.status !== undefined) {
    const allowedStatuses = [
      "pending",
      "in-progress",
      "completed",
    ];

    if (
      !allowedStatuses.includes(
        updates.status
      )
    ) {
      const error = new Error(
        "Invalid action item status."
      );

      error.code = "INVALID_ACTION_ITEM_STATUS";

      throw error;
    }

    actionItem.status = updates.status;
  }

  // 7. Save
  await insights.save();

  return actionItem;
}


/**
 * Create a new action item in meeting insights
 */
export async function createMeetingActionItem({
  meetingId,
  userId,
  actionItemData = {},
}) {
  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  })
    .select("_id")
    .lean();

  if (!meeting) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  let insights = await MeetingInsights.findOne({ meetingId: meeting._id });
  if (!insights) {
    insights = await MeetingInsights.create({
      meetingId: meeting._id,
      actionItems: [],
    });
  }

  const title = (actionItemData.title || "").trim();
  if (!title) {
    const error = new Error("Action item title cannot be empty.");
    error.code = "INVALID_ACTION_ITEM_TITLE";
    throw error;
  }

  const newItem = {
    title,
    description: (actionItemData.description || "").trim(),
    assignee: actionItemData.assignee ? actionItemData.assignee.trim() : null,
    dueDate: actionItemData.dueDate ? new Date(actionItemData.dueDate) : null,
    priority: ["low", "medium", "high"].includes(actionItemData.priority)
      ? actionItemData.priority
      : "medium",
    status: ["pending", "in-progress", "completed"].includes(actionItemData.status)
      ? actionItemData.status
      : "pending",
  };

  insights.actionItems.push(newItem);
  await insights.save();

  return {
    actionItem: newItem,
    actionItems: insights.actionItems,
  };
}

/**
 * Delete an action item from meeting insights
 */
export async function deleteMeetingActionItem({
  meetingId,
  userId,
  itemIndex,
}) {
  if (!mongoose.Types.ObjectId.isValid(meetingId)) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const index = Number.parseInt(itemIndex, 10);
  if (!Number.isInteger(index) || index < 0) {
    const error = new Error("Invalid action item index.");
    error.code = "INVALID_ACTION_ITEM_INDEX";
    throw error;
  }

  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  })
    .select("_id")
    .lean();

  if (!meeting) {
    const error = new Error("Meeting not found.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const insights = await MeetingInsights.findOne({ meetingId: meeting._id });
  if (!insights || !insights.actionItems || index >= insights.actionItems.length) {
    const error = new Error("Action item not found.");
    error.code = "ACTION_ITEM_NOT_FOUND";
    throw error;
  }

  const removed = insights.actionItems.splice(index, 1)[0];
  await insights.save();

  return {
    success: true,
    removed,
    actionItems: insights.actionItems,
  };
}
