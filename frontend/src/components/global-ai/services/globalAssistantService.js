// Replace this adapter with an authenticated API request once the backend endpoint is available.
// Keeping it here prevents data access and prompt rules from leaking into UI components.
const DEMO_RESPONSES = {
  summary:
    "## Your recent meeting recap\n\nAcross your last five meetings, the team focused on the release plan, API integration, and the dashboard redesign.\n\n- **Release:** QA is the final dependency before next Friday's launch.\n- **Authentication:** Complete and ready for final testing.\n- **Dashboard:** Design work is planned for the next sprint.\n\nThere are **3 open action items** and **2 decisions** that may need follow-up.",
  api: "## API discussions\n\nI found API-related discussion in **3 meetings**:\n\n1. **Weekly Engineering Sync** — API testing and the v2 migration were discussed.\n2. **Product Planning** — The team agreed that API v2 will be the default for new integrations.\n3. **Client Demo** — The client requested clarification on API authentication.\n\nThe most important open item is **completing backend API testing** before the release.",
  actions:
    "## Overdue and upcoming action items\n\n- **Complete Backend API Testing** — John Doe · **Due today** · High priority\n- **Prepare Production Deployment** — Alex Brown · **Due Friday** · High priority\n- **Review Dashboard UI** — Sarah Miller · Completed\n\nWould you like me to turn the open items into a follow-up message?",
  report:
    "## Weekly meeting report\n\n**Highlights**\n- The release timeline was finalized for next Friday.\n- API v2 was selected as the default integration endpoint.\n- The dashboard redesign was scheduled for the next sprint.\n\n**Risks**\nQA findings could affect the release date. Make sure ownership and deadlines are confirmed for the remaining testing work.",
  default:
    "I searched your meeting workspace and can help surface decisions, action items, risks, people, and topics across every meeting. Try asking about a project, person, deadline, or a specific discussion.",
};

export async function askGlobalAssistant(prompt) {
  // Match the async contract a real network call will use.
  await new Promise((resolve) => window.setTimeout(resolve, 650));
  const text = prompt.toLowerCase();
  if (
    text.includes("summar") ||
    text.includes("last five") ||
    text.includes("recent")
  )
    return DEMO_RESPONSES.summary;
  if (text.includes("api") || text.includes("authentication"))
    return DEMO_RESPONSES.api;
  if (
    text.includes("overdue") ||
    text.includes("action") ||
    text.includes("task")
  )
    return DEMO_RESPONSES.actions;
  if (text.includes("report") || text.includes("weekly"))
    return DEMO_RESPONSES.report;
  return DEMO_RESPONSES.default;
}
