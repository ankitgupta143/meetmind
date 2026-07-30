"use client";

import { useState } from "react";

import MeetingSidebar from "./MeetingSidebar";
import AISummary from "./AISummary";
import Transcript from "./Transcript";
import ActionItems from "./ActionItems";
import Decisions from "./Decisions";
import Analytics from "./Analytics";

export default function MeetingWorkspace() {
  const [activeTab, setActiveTab] = useState("summary");

  const renderContent = () => {
    switch (activeTab) {
      case "summary":
        return <AISummary />;

      case "transcript":
        return <Transcript />;

      case "actions":
        return <ActionItems />;

      case "decisions":
        return <Decisions />;

      case "analytics":
        return <Analytics />;

      default:
        return <AISummary />;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <MeetingSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <section>{renderContent()}</section>
    </div>
  );
}