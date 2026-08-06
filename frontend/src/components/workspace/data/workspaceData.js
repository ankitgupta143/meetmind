export const workspaceStats = [
  { label: "Saved Meetings", value: "24", icon: "calendar", color: "indigo" },
  { label: "Favorites", value: "8", icon: "star", color: "amber" },
  { label: "AI Reports", value: "12", icon: "sparkles", color: "violet" },
  { label: "Draft Emails", value: "5", icon: "mail", color: "emerald" },
];

export const workspaceSections = [
  {
    title: "Favorite Meetings",
    description: "Meetings you want to revisit.",
    icon: "star",
    items: [
      { title: "Product Roadmap Review", meta: "Today · 11:00 AM", detail: "12 participants", badge: "Summary ready" },
      { title: "Weekly Engineering Sync", meta: "Yesterday · 4:00 PM", detail: "8 participants", badge: "3 action items" },
    ],
  },
  {
    title: "Pinned Meetings",
    description: "Important conversations kept close.",
    icon: "pin",
    items: [
      { title: "Q3 Launch Planning", meta: "Jul 28 · 10:30 AM", detail: "6 participants", badge: "Pinned" },
      { title: "Client Discovery Call", meta: "Jul 25 · 2:00 PM", detail: "4 participants", badge: "Follow-up due" },
    ],
  },
  {
    title: "Saved AI Conversations",
    description: "Your most useful AI research.",
    icon: "bot",
    items: [
      { title: "Launch risks and mitigations", meta: "AI Assistant · 2 hours ago", detail: "8 messages", badge: "Saved" },
      { title: "Summarize customer feedback", meta: "AI Assistant · Yesterday", detail: "14 messages", badge: "Saved" },
    ],
  },
  {
    title: "Saved Reports",
    description: "AI-ready reports and summaries.",
    icon: "file",
    items: [
      { title: "July Meeting Intelligence Report", meta: "Generated Jul 31", detail: "PDF · 6 pages", badge: "Report" },
      { title: "Engineering Team Weekly Summary", meta: "Generated Jul 29", detail: "PDF · 4 pages", badge: "Report" },
    ],
  },
  {
    title: "Follow-up Emails",
    description: "Drafts waiting for your review.",
    icon: "mail",
    items: [
      { title: "Follow up: Product Roadmap Review", meta: "To: Product team", detail: "Draft updated 1 hour ago", badge: "Draft" },
      { title: "Next steps from Client Discovery", meta: "To: Priya Shah", detail: "Draft updated yesterday", badge: "Draft" },
    ],
  },
];

export const recentActivity = [
  { title: "Saved the Product Roadmap Review", time: "20 minutes ago", type: "save" },
  { title: "Generated a weekly engineering report", time: "2 hours ago", type: "report" },
  { title: "Created a follow-up email draft", time: "Yesterday", type: "mail" },
];

export const templates = [
  { title: "Meeting Follow-up", description: "Turn decisions and action items into a polished email.", icon: "mail" },
  { title: "Weekly Team Summary", description: "Create a concise update from this week's meetings.", icon: "file" },
  { title: "Project Status Report", description: "Collect progress, risks, and next steps in one report.", icon: "chart" },
];
