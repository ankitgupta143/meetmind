import mongoose from "mongoose";
import Meeting from "../models/Meeting.js";
import MeetingInsights from "../models/MeetingInsights.js";
import GlobalConversation from "../models/GlobalConversation.js";

/**
 * Format relative time (e.g. "10 minutes ago", "2 hours ago", "Yesterday")
 */
function formatRelativeTime(date) {
  if (!date) return "Recently";
  const targetDate = new Date(date);
  if (Number.isNaN(targetDate.getTime())) return "Recently";

  const diffMs = Date.now() - targetDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;

  return targetDate.toLocaleDateString([], { month: "short", day: "numeric" });
}

/**
 * Format duration in seconds to a human-readable string
 */
function formatDuration(seconds = 0) {
  const totalSeconds = Math.max(Number(seconds) || 0, 0);
  if (totalSeconds < 60 && totalSeconds > 0) return "< 1 min";
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} hr`;
  return `${hours} hr ${remainingMinutes} min`;
}

/**
 * Get comprehensive workspace hub overview for a user
 */
export async function getWorkspaceOverview({ userId }) {
  if (!userId) {
    const error = new Error("User ID is required.");
    error.code = "USER_ID_REQUIRED";
    throw error;
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // 1. Fetch user's meetings (non-deleted)
  const meetings = await Meeting.find({
    ownerId: userObjectId,
    status: { $ne: "deleted" },
  })
    .sort({ createdAt: -1 })
    .lean();

  const meetingMap = new Map();
  meetings.forEach((m) => meetingMap.set(m._id.toString(), m));

  const totalMeetings = meetings.length;
  const totalSeconds = meetings.reduce(
    (sum, m) => sum + (Number(m.durationSeconds) || 0),
    0
  );

  // Filter favorite and pinned meetings
  const favoriteMeetingsRaw = meetings.filter((m) => m.isFavorite);
  const pinnedMeetingsRaw = meetings.filter((m) => m.isPinned);

  // 2. Fetch user's AI conversations from GlobalConversation
  const conversations = await GlobalConversation.find({
    ownerId: userObjectId,
  })
    .sort({ updatedAt: -1 })
    .lean();

  const totalConversations = conversations.length;

  // 3. Fetch MeetingInsights for user meetings to gather action items
  const meetingIds = meetings.map((m) => m._id);
  const insightsList = await MeetingInsights.find({
    meetingId: { $in: meetingIds },
  }).lean();

  const allActionItems = [];
  insightsList.forEach((insight) => {
    const meeting = meetingMap.get(insight.meetingId.toString());
    const meetingTitle = meeting?.title || "Meeting";

    (insight.actionItems || []).forEach((item, index) => {
      allActionItems.push({
        itemIndex: index,
        meetingId: insight.meetingId.toString(),
        meetingTitle,
        title: item.title,
        description: item.description || "",
        assignee: item.assignee || null,
        dueDate: item.dueDate || null,
        priority: item.priority || "medium",
        status: item.status || "pending",
      });
    });
  });

  const pendingActionItems = allActionItems.filter(
    (item) => item.status !== "completed"
  );

  // Sort action items: pending first, then by high priority, then dueDate
  const priorityOrder = { high: 1, medium: 2, low: 3 };
  allActionItems.sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    const pA = priorityOrder[a.priority] || 2;
    const pB = priorityOrder[b.priority] || 2;
    if (pA !== pB) return pA - pB;
    return 0;
  });

  // 4. Curate collections
  // A. Favorite Meetings (If user hasn't starred any yet, display most recent with isFavorite: false)
  const displayFavorites = (
    favoriteMeetingsRaw.length > 0 ? favoriteMeetingsRaw : meetings.slice(0, 4)
  ).map((m) => ({
    id: m._id.toString(),
    title: m.title,
    date: m.meetingDate
      ? new Date(m.meetingDate).toLocaleDateString([], {
          month: "short",
          day: "numeric",
        })
      : "Recent",
    duration: formatDuration(m.durationSeconds),
    participants: `${m.participants?.length || 0} participants`,
    badge: m.isFavorite ? "Favorited" : "Recent meeting",
    isFavorite: !!m.isFavorite,
    isPinned: !!m.isPinned,
    status: m.processingStatus || "ready",
  }));

  // B. Pinned Meetings
  const displayPinned = pinnedMeetingsRaw.map((m) => ({
    id: m._id.toString(),
    title: m.title,
    date: m.meetingDate
      ? new Date(m.meetingDate).toLocaleDateString([], {
          month: "short",
          day: "numeric",
        })
      : "Recent",
    duration: formatDuration(m.durationSeconds),
    participants: `${m.participants?.length || 0} participants`,
    badge: "Pinned",
    isFavorite: !!m.isFavorite,
    isPinned: true,
    status: m.processingStatus || "ready",
  }));

  // C. Saved AI Conversations
  const displayConversations = conversations.slice(0, 6).map((conv) => {
    const msgCount = conv.messages?.length || 0;
    const lastMsg =
      msgCount > 0 ? conv.messages[msgCount - 1].content?.slice(0, 80) : "";

    return {
      id: conv._id.toString(),
      title: conv.title || "Untitled AI Conversation",
      meta: `AI Assistant • ${formatRelativeTime(conv.updatedAt || conv.createdAt)}`,
      detail: `${msgCount} message${msgCount === 1 ? "" : "s"}`,
      badge: "Saved Chat",
      lastMessage: lastMsg,
    };
  });

  // D. Action Items collection
  const displayActionItems = allActionItems.slice(0, 8);

  // 5. Build Recent Activity Feed from actual database records
  const recentActivities = [];

  // Meetings activity
  meetings.slice(0, 5).forEach((m) => {
    recentActivities.push({
      id: `act-meet-${m._id}`,
      title: `Added meeting "${m.title}"`,
      time: formatRelativeTime(m.createdAt),
      timestamp: new Date(m.createdAt).getTime(),
      type: "meeting",
      link: `/meetings/${m._id}`,
      meta: `${formatDuration(m.durationSeconds)} • ${m.participants?.length || 0} participants`,
    });
  });

  // Conversations activity
  conversations.slice(0, 5).forEach((conv) => {
    recentActivities.push({
      id: `act-chat-${conv._id}`,
      title: `Researched in AI: "${conv.title}"`,
      time: formatRelativeTime(conv.updatedAt || conv.createdAt),
      timestamp: new Date(conv.updatedAt || conv.createdAt).getTime(),
      type: "chat",
      link: `/ai-assistant`,
      meta: `${conv.messages?.length || 0} messages`,
    });
  });

  // Action items activity
  pendingActionItems.slice(0, 3).forEach((item, idx) => {
    recentActivities.push({
      id: `act-task-${item.meetingId}-${idx}`,
      title: `Deliverable: "${item.title}"`,
      time: "Open task",
      timestamp: Date.now() - (idx + 1) * 3600000,
      type: "task",
      link: `/meetings/${item.meetingId}`,
      meta: `Source: ${item.meetingTitle} • Priority: ${item.priority}`,
    });
  });

  // Sort activities chronologically (newest first)
  recentActivities.sort((a, b) => b.timestamp - a.timestamp);

  return {
    stats: {
      totalMeetings,
      favoriteMeetings: favoriteMeetingsRaw.length,
      pinnedMeetings: pinnedMeetingsRaw.length,
      savedConversations: totalConversations,
      pendingActionItems: pendingActionItems.length,
      totalHoursRecorded: formatDuration(totalSeconds),
    },
    collections: {
      favoriteMeetings: displayFavorites,
      pinnedMeetings: displayPinned,
      savedConversations: displayConversations,
      actionItems: displayActionItems,
    },
    recentActivity: recentActivities.slice(0, 6),
  };
}

/**
 * Toggle meeting favorite status
 */
export async function toggleMeetingFavorite({ meetingId, userId }) {
  if (!meetingId || !userId) {
    const error = new Error("Meeting ID and User ID are required.");
    error.code = "PARAMS_REQUIRED";
    throw error;
  }

  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  });

  if (!meeting) {
    const error = new Error("Meeting not found or access denied.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  meeting.isFavorite = !meeting.isFavorite;
  await meeting.save();

  return {
    meetingId: meeting._id.toString(),
    isFavorite: meeting.isFavorite,
    isPinned: meeting.isPinned,
    title: meeting.title,
  };
}

/**
 * Toggle meeting pin status
 */
export async function toggleMeetingPin({ meetingId, userId }) {
  if (!meetingId || !userId) {
    const error = new Error("Meeting ID and User ID are required.");
    error.code = "PARAMS_REQUIRED";
    throw error;
  }

  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  });

  if (!meeting) {
    const error = new Error("Meeting not found or access denied.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  meeting.isPinned = !meeting.isPinned;
  await meeting.save();

  return {
    meetingId: meeting._id.toString(),
    isFavorite: meeting.isFavorite,
    isPinned: meeting.isPinned,
    title: meeting.title,
  };
}

/**
 * Toggle action item status across meetings from workspace hub
 */
export async function toggleWorkspaceActionItem({
  meetingId,
  itemIndex,
  userId,
  targetStatus,
}) {
  if (!meetingId || itemIndex === undefined || !userId) {
    const error = new Error("Missing required parameters.");
    error.code = "PARAMS_REQUIRED";
    throw error;
  }

  const meeting = await Meeting.findOne({
    _id: meetingId,
    ownerId: userId,
    status: { $ne: "deleted" },
  });

  if (!meeting) {
    const error = new Error("Meeting not found or access denied.");
    error.code = "MEETING_NOT_FOUND";
    throw error;
  }

  const insights = await MeetingInsights.findOne({ meetingId: meeting._id });
  if (!insights || !insights.actionItems || !insights.actionItems[itemIndex]) {
    const error = new Error("Action item not found.");
    error.code = "ACTION_ITEM_NOT_FOUND";
    throw error;
  }

  const currentItem = insights.actionItems[itemIndex];
  const newStatus =
    targetStatus || (currentItem.status === "completed" ? "pending" : "completed");

  currentItem.status = newStatus;
  await insights.save();

  return {
    meetingId,
    itemIndex: Number(itemIndex),
    status: newStatus,
    title: currentItem.title,
  };
}
