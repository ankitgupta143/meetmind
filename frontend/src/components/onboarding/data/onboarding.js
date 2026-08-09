import { CalendarDays, MessageSquare, Video, VideoIcon } from "lucide-react";
export const roles = ["Developer", "Manager", "Founder", "Student"];
export const platforms = [
  {
    id: "google-meet",
    name: "Google Meet",
    icon: Video,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "zoom",
    name: "Zoom",
    icon: VideoIcon,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    icon: MessageSquare,
    color: "bg-violet-50 text-violet-600",
  },
];
export const apps = [
  {
    id: "slack",
    name: "Slack",
    icon: MessageSquare,
    color: "bg-pink-50 text-pink-600",
  },
  {
    id: "notion",
    name: "Notion",
    icon: CalendarDays,
    color: "bg-zinc-100 text-zinc-700",
  },
  {
    id: "calendar",
    name: "Google Calendar",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600",
  },
];
