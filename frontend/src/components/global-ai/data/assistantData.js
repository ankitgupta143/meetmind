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
    items: [{ id: "welcome", title: "Workspace overview", messages: [] }],
  },
  {
    id: "previous",
    label: "Previous 7 days",
    items: [
      { id: "api", title: "API discussions", messages: [] },
      { id: "weekly", title: "Weekly meeting report", messages: [] },
    ],
  },
];
