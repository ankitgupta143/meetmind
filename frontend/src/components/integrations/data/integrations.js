import {
  Bot,
  CalendarDays,
  CheckSquare,
  Cloud,
  FileText,
  MessageSquare,
  Video,
  VideoIcon,
} from "lucide-react";

export const integrationSections = [
  {
    name: "Communication",
    description: "Bring your meetings and conversations into MeetMind.",
    integrations: [
      {
        id: "google-meet",
        name: "Google Meet",
        description: "Automatically import and analyze your Google Meet calls.",
        icon: Video,
        color: "bg-emerald-50 text-emerald-600",
        connected: true,
        lastSync: "Synced just now",
      },
      {
        id: "zoom",
        name: "Zoom",
        description:
          "Turn every Zoom conversation into clear, searchable insights.",
        icon: VideoIcon,
        color: "bg-blue-50 text-blue-600",
      },
      {
        id: "teams",
        name: "Microsoft Teams",
        description:
          "Keep your Teams meetings, notes, and follow-ups in one place.",
        icon: MessageSquare,
        color: "bg-violet-50 text-violet-600",
      },
    ],
  },
  {
    name: "Productivity",
    integrations: [
      {
        id: "slack",
        name: "Slack",
        description:
          "Share meeting highlights with the channels that need them.",
        icon: MessageSquare,
        color: "bg-pink-50 text-pink-600",
      },
      {
        id: "notion",
        name: "Notion",
        description: "Send AI summaries straight to your team workspace.",
        icon: FileText,
        color: "bg-zinc-100 text-zinc-700",
      },
      {
        id: "jira",
        name: "Jira",
        description: "Create actionable issues from meeting decisions.",
        icon: CheckSquare,
        color: "bg-sky-50 text-sky-600",
      },
      {
        id: "clickup",
        name: "ClickUp",
        description: "Convert action items into tasks your team can track.",
        icon: CheckSquare,
        color: "bg-orange-50 text-orange-600",
      },
    ],
  },
  {
    name: "Calendar",
    integrations: [
      {
        id: "google-calendar",
        name: "Google Calendar",
        description: "See upcoming meetings and prepare with context.",
        icon: CalendarDays,
        color: "bg-blue-50 text-blue-600",
      },
      {
        id: "outlook",
        name: "Outlook Calendar",
        description: "Sync your schedule and keep every meeting organized.",
        icon: CalendarDays,
        color: "bg-indigo-50 text-indigo-600",
      },
    ],
  },
  {
    name: "Storage",
    integrations: [
      {
        id: "drive",
        name: "Google Drive",
        description: "Save recordings, summaries, and exports securely.",
        icon: Cloud,
        color: "bg-amber-50 text-amber-600",
      },
      {
        id: "dropbox",
        name: "Dropbox",
        description: "Keep meeting files available wherever your work happens.",
        icon: Cloud,
        color: "bg-blue-50 text-blue-600",
      },
      {
        id: "onedrive",
        name: "OneDrive",
        description: "Connect your Microsoft files to meeting context.",
        icon: Cloud,
        color: "bg-sky-50 text-sky-600",
      },
    ],
  },
  {
    name: "AI",
    integrations: [
      {
        id: "openai",
        name: "OpenAI",
        description: "Use advanced AI models for richer meeting intelligence.",
        icon: Bot,
        color: "bg-teal-50 text-teal-600",
      },
      {
        id: "gemini",
        name: "Google Gemini",
        description: "Bring Gemini-powered analysis into your workflow.",
        icon: Bot,
        color: "bg-rose-50 text-rose-600",
      },
      {
        id: "claude",
        name: "Claude",
        description:
          "Connect Claude for thoughtful, long-form meeting assistance.",
        icon: Bot,
        color: "bg-orange-50 text-orange-600",
      },
    ],
  },
];
