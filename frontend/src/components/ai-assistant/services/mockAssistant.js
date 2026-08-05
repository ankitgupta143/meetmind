const MOCK_ANSWERS = {
  "summarize this meeting": "Here is a summary of the meeting:\n\n**Overview**\nThe engineering team reviewed sprint progress, discussed backend integration, and finalized priorities for the upcoming release. The meeting concluded with clear ownership for pending tasks.\n\n**Key Takeaways**\n* Backend API integration is on schedule.\n* Authentication module is ready for QA.\n* Dashboard redesign will begin next sprint.",
  
  "list action items": "Here are the action items from this meeting:\n\n* **Complete Backend API Testing**\n  * Assignee: John Doe\n  * Due Date: Today\n  * Priority: High\n* **Review Dashboard UI** (Completed)\n  * Assignee: Sarah Miller\n  * Due Date: Tomorrow\n  * Priority: Medium\n* **Prepare Production Deployment**\n  * Assignee: Alex Brown\n  * Due Date: Friday\n  * Priority: High",
  
  "key decisions": "Here are the key decisions made during the meeting:\n\n1. **Release Timeline Finalized**: The team agreed to release the application next Friday after completing QA testing. (Owner: Product Team)\n2. **API Version Decision**: API Version 2 will become the default endpoint for all future integrations. (Owner: Backend Team)\n3. **Dashboard Redesign**: The dashboard redesign will begin immediately after the production release. (Owner: Design Team)",
  
  "potential risks": "Based on the meeting transcript, here are the potential risks identified:\n\n* **QA Timeline**: The release is scheduled for next Friday. If QA testing of the authentication module or backend API reveals critical bugs, it could delay the release.\n* **Dashboard Redesign Scope**: Starting the dashboard redesign immediately after the release requires clear requirements and design specs. Any delays in final specs could push the timeline.",
  
  "meeting timeline": "Here is the meeting timeline:\n\n* **09:00 AM**: Meeting Started\n* **09:12 AM**: Sprint Planning\n* **09:27 AM**: Authentication Discussion\n* **09:38 AM**: API Design Finalized\n* **09:50 AM**: Release Planning\n* **09:58 AM**: Meeting Ended",
  
  "draft follow-up email": "Here is a draft follow-up email you can send to the team:\n\n***\n\n**Subject: Follow-up: Sprint Planning & Release Timeline**\n\nHi Team,\n\nThanks for a productive sync today. Here is a summary of what we discussed, our decisions, and the next steps:\n\n**Key Decisions:**\n* **Production Release:** Scheduled for next Friday after QA testing.\n* **API v2:** Default endpoint for all future integrations.\n* **Dashboard Redesign:** Will commence next sprint post-release.\n\n**Action Items:**\n* **John Doe:** Complete backend API testing (Due: Today)\n* **Sarah Miller:** Review Dashboard UI (Completed)\n* **Alex Brown:** Prepare production deployment checklist (Due: Friday)\n\nLet me know if you have any questions or updates.\n\nBest regards,\nAnkit\n\n***"
};

const normalizeText = (text) => text.toLowerCase().trim().replace(/[?.!]/g, "");

export function getResponse (prompt) {
  const normalized = normalizeText(prompt);
  
  // Find key matches
  if (normalized.includes("summar") || normalized.includes("overview")) {
    return MOCK_ANSWERS["summarize this meeting"];
  }
  if (normalized.includes("action") || normalized.includes("todo") || normalized.includes("task")) {
    return MOCK_ANSWERS["list action items"];
  }
  if (normalized.includes("decision") || normalized.includes("agree")) {
    return MOCK_ANSWERS["key decisions"];
  }
  if (normalized.includes("risk") || normalized.includes("blocker") || normalized.includes("concern")) {
    return MOCK_ANSWERS["potential risks"];
  }
  if (normalized.includes("timeline") || normalized.includes("agenda") || normalized.includes("schedule")) {
    return MOCK_ANSWERS["meeting timeline"];
  }
  if (normalized.includes("email") || normalized.includes("draft") || normalized.includes("follow up")) {
    return MOCK_ANSWERS["draft follow-up email"];
  }
  
  return `I can help you with summarizing this meeting, checking action items, reviewing decisions, identifying risks, or drafting follow-up emails. 

Could you please clarify your request, or try one of the suggestions?`;
};

