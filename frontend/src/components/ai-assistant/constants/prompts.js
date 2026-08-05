import {
  FileText,
  CheckSquare,
  Target,
  Mail,
  TriangleAlert,
  Calendar,
} from "lucide-react";

export const PROMPTS = [
  {
    id: "summary",
    title: "Summarize this meeting",
    description: "Generate a concise overview.",
    icon: FileText,
  },
  {
    id: "actions",
    title: "List action items",
    description: "Extract all tasks.",
    icon: CheckSquare,
  },
  {
    id: "decisions",
    title: "Key decisions",
    description: "Show important outcomes.",
    icon: Target,
  },
  {
    id: "risks",
    title: "Potential risks",
    description: "Highlight blockers.",
    icon: TriangleAlert,
  },
  {
    id: "timeline",
    title: "Meeting timeline",
    description: "View chronological events.",
    icon: Calendar,
  },
  {
    id: "email",
    title: "Draft follow-up email",
    description: "Generate a ready-to-send email.",
    icon: Mail,
  },
];