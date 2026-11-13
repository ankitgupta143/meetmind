import Notification from "../models/Notification.js";
import User from "../models/User.js";

/**
 * Format relative time (e.g. "Just now", "5m ago", "2h ago", "Yesterday")
 */
export function formatRelativeTime(date) {
  if (!date) return "";
  const now = Date.now();
  const time = new Date(date).getTime();
  const diffMs = now - time;

  if (diffMs < 0) return "Just now";

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 45) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour === 1) return "1 hour ago";
  if (diffHour < 24) return `${diffHour} hours ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Create a new notification for a user, respecting their notification settings
 */
export async function createNotification({
  recipient,
  type = "ai",
  title,
  description = "",
  meetingId = null,
  link = null,
  metadata = {},
}) {
  if (!recipient || !title) {
    return null;
  }

  // Check user settings if recipient is present
  try {
    const user = await User.findById(recipient)
      .select("settings.notifications")
      .lean();

    if (user?.settings?.notifications) {
      const prefs = user.settings.notifications;
      // If user turned off inApp notifications globally
      if (prefs.inApp === false) {
        return null;
      }
      // If notification is meeting/ai ready and user specifically disabled it
      if (
        (type === "ai" || type === "meeting") &&
        prefs.meetingReady === false
      ) {
        return null;
      }
    }
  } catch (err) {
    console.warn(`[Notification] Could not check user settings for ${recipient}:`, err.message);
  }

  const notification = await Notification.create({
    recipient,
    type,
    title,
    description,
    meetingId,
    link,
    metadata,
  });

  return notification;
}

/**
 * Get paginated notifications for a user
 */
export async function getUserNotifications(
  userId,
  { filter = "all", limit = 20, page = 1 } = {}
) {
  const query = { recipient: userId };

  if (filter === "unread") {
    query.read = false;
  }

  const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const parsedPage = Math.max(Number(page) || 1, 1);
  const skip = (parsedPage - 1) * parsedLimit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),
    Notification.countDocuments(query),
    Notification.countDocuments({ recipient: userId, read: false }),
  ]);

  const formatted = notifications.map((n) => ({
    id: n._id.toString(),
    type: n.type,
    title: n.title,
    description: n.description,
    read: n.read,
    meetingId: n.meetingId,
    link: n.link,
    createdAt: n.createdAt,
    timestamp: formatRelativeTime(n.createdAt),
  }));

  return {
    notifications: formatted,
    unreadCount,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit) || 1,
    },
  };
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId, userId) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true },
    { new: true }
  ).lean();

  if (!notification) return null;

  return {
    id: notification._id.toString(),
    type: notification.type,
    title: notification.title,
    description: notification.description,
    read: true,
    meetingId: notification.meetingId,
    link: notification.link,
    createdAt: notification.createdAt,
    timestamp: formatRelativeTime(notification.createdAt),
  };
}

/**
 * Mark all notifications as read for a given user
 */
export async function markAllNotificationsAsRead(userId) {
  await Notification.updateMany(
    { recipient: userId, read: false },
    { read: true }
  );
  return true;
}

/**
 * Delete a specific notification belonging to a user
 */
export async function deleteNotification(notificationId, userId) {
  const result = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });
  return Boolean(result);
}
