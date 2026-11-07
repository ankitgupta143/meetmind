import { CheckCircle2, FileText, Search, Sparkles } from "lucide-react";

export const GLOBAL_ASSISTANT_PROMPTS = [
  {
    icon: FileText,
    title: "Summarize my last five meetings",
    subtitle: "Catch up on recent discussions",
  },
  {
    icon: Search,
    title: "Which meetings mentioned the API?",
    subtitle: "Search across all transcripts",
  },
  {
    icon: CheckCircle2,
    title: "Show overdue action items",
    subtitle: "See what needs attention",
  },
  {
    icon: Sparkles,
    title: "Generate weekly report",
    subtitle: "Create a clear meeting recap",
  },
];

export const INITIAL_CONVERSATIONS = [
  {
    id: "today",
    label: "Today",
    items: [],
  },
];

/**
 * Group server conversations into "Today", "Previous 7 days", and "Older"
 * based on actual timestamps.
 */
export function groupConversationsByDate(conversations = []) {
  if (!conversations || conversations.length === 0) {
    return [
      {
        id: "today",
        label: "Today",
        items: [],
      },
    ];
  }

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const sevenDaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;

  const todayItems = [];
  const previousItems = [];
  const olderItems = [];

  for (const conv of conversations) {
    const timeVal = new Date(
      conv.lastMessageAt || conv.createdAt || Date.now()
    ).getTime();

    const item = {
      id: conv._id || conv.id,
      title: conv.title || "New conversation",
      messages: conv.messages || [],
      messageCount: conv.messageCount ?? conv.messages?.length ?? 0,
      lastMessageAt: conv.lastMessageAt,
      createdAt: conv.createdAt,
    };

    if (timeVal >= startOfToday) {
      todayItems.push(item);
    } else if (timeVal >= sevenDaysAgo) {
      previousItems.push(item);
    } else {
      olderItems.push(item);
    }
  }

  const groups = [];
  if (
    todayItems.length > 0 ||
    (previousItems.length === 0 && olderItems.length === 0)
  ) {
    groups.push({ id: "today", label: "Today", items: todayItems });
  }
  if (previousItems.length > 0) {
    groups.push({
      id: "previous",
      label: "Previous 7 days",
      items: previousItems,
    });
  }
  if (olderItems.length > 0) {
    groups.push({ id: "older", label: "Older", items: olderItems });
  }

  return groups;
}
