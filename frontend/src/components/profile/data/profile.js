import { Bot, FileDown, FolderKanban, Video } from "lucide-react";

export const profile = {
  firstName: "Ankit",
  lastName: "Gupta",
  email: "ankit@gmail.com",
  phone: "+91 98765 43210",
  company: "MeetMind",
  role: "Frontend Engineer",
  timezone: "Asia/Kolkata (GMT+5:30)",
  country: "India",
  language: "English",
};
export const profileStats = [
  {
    label: "Meetings",
    value: "42",
    icon: Video,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "AI Chats",
    value: "138",
    icon: Bot,
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Exports",
    value: "62",
    icon: FileDown,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Workspace Items",
    value: "14",
    icon: FolderKanban,
    color: "bg-emerald-50 text-emerald-600",
  },
];
export const recentActivity = [
  { title: "Updated profile", time: "Yesterday" },
  { title: "Downloaded meeting report", time: "2 days ago" },
  { title: "Connected Slack", time: "3 days ago" },
];
