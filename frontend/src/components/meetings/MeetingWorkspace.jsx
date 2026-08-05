"use client";

import { useState } from "react";

import MeetingSidebar from "./MeetingSidebar";
import AISummary from "./AISummary";
import Transcript from "./Transcript";
import ActionItems from "./ActionItems";
import Decisions from "./Decisions";
import Analytics from "./Analytics";
import { AIAssistant } from "../ai-assistant";
import { WORKSPACE_TABS } from "@/constants/meeting";

export default function MeetingWorkspace() {
  const [activeTab, setActiveTab] = useState(WORKSPACE_TABS.ASSISTANT);

  const workspaceViews = {
    summary: <AISummary />,
    transcript: <Transcript />,
    actions: <ActionItems />,
    decisions: <Decisions />,
    analytics: <Analytics />,
    assistant: <AIAssistant />,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <MeetingSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <section>{workspaceViews[activeTab] ?? <AISummary />}</section>
    </div>
  );
}
