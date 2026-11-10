import { CalendarDays, MessageSquare, Video, VideoIcon } from "lucide-react";

export const roles = [
  {
    id: "developer",
    label: "Developer",
    description: "Code reviews, technical specs, and standup notes.",
  },
  {
    id: "manager",
    label: "Manager",
    description: "Team alignment, 1-on-1s, and project trackers.",
  },
  {
    id: "founder",
    label: "Founder",
    description: "Investor pitches, strategic vision, and hiring.",
  },
  {
    id: "student",
    label: "Student",
    description: "Lecture notes, study groups, and research summaries.",
  },
];

export const platforms = [
  {
    id: "google-meet",
    name: "Google Meet",
    description: "Seamless integration with Google Calendar and Workspace.",
    icon: Video,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Direct cloud recording sync and transcript imports.",
    icon: VideoIcon,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Channel sync, action items, and Office 365 export.",
    icon: MessageSquare,
    color: "bg-violet-50 text-violet-600",
  },
];

export const apps = [
  {
    id: "slack",
    name: "Slack",
    description: "Post meeting recaps and action item alerts to channels.",
    icon: MessageSquare,
    color: "bg-pink-50 text-pink-600",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Auto-export meeting notes and summaries to your Notion docs.",
    icon: CalendarDays,
    color: "bg-zinc-100 text-zinc-700",
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description: "Sync events and automatically prepare meeting briefs.",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600",
  },
];
