import { NOTIFICATION_TYPES } from "./notification.constant";

const INITIAL_NOTIFICATIONS = [
  {
    id: "ai-summary-ready",
    type: NOTIFICATION_TYPES.AI,
    title: "AI Summary Ready",
    description: "Weekly Engineering Sync",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "export-completed",
    type: NOTIFICATION_TYPES.EXPORT,
    title: "Export Completed",
    description: "Download ready",
    timestamp: "12 min ago",
    read: false,
  },
  {
    id: "mention-john",
    type: NOTIFICATION_TYPES.MENTION,
    title: "John mentioned you",
    description: "Sprint Review",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "meeting-reminder",
    type: NOTIFICATION_TYPES.REMINDER,
    title: "Meeting starts in 15 min",
    description: "Product Planning",
    timestamp: "Today, 2:45 PM",
    read: true,
  },
];

/**
 * Notification data boundary. Replace these local records with an API client
 * when the backend is available; presentation components consume this shape.
 */
export function getInitialNotifications() {
  return INITIAL_NOTIFICATIONS;
}
