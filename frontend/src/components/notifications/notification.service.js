import api from "@/lib/api";
import { NOTIFICATION_TYPES } from "./notification.constant";

/**
 * Fetch user notifications from backend API with optional filter ('all' | 'unread')
 */
export async function fetchNotificationsApi(filter = "all", limit = 20) {
  const response = await api.get("/notifications", {
    params: { filter, limit },
  });
  return response.data?.data || { notifications: [], unreadCount: 0 };
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsReadApi(notificationId) {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data?.data;
}

/**
 * Mark all notifications as read for current user
 */
export async function markAllNotificationsAsReadApi() {
  const response = await api.patch("/notifications/read-all");
  return response.data;
}

/**
 * Delete a notification
 */
export async function deleteNotificationApi(notificationId) {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
}

/**
 * Fallback initial notification state
 */
export function getInitialNotifications() {
  return [];
}
