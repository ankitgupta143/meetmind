"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import MeetingSidebar from "./MeetingSidebar";
import AISummary from "./AISummary";
import Transcript from "./Transcript";
import ActionItems from "./ActionItems";
import Decisions from "./Decisions";
import Analytics from "./Analytics";
import { AIAssistant } from "../ai-assistant";
import { WORKSPACE_TABS } from "@/constants/meeting";
import { MeetingAudioProvider } from "@/context/MeetingAudioContext";
import MeetingAudioPlayer from "./player/MeetingAudioPlayer";

export default function MeetingWorkspace({
  meeting,
  insights,
  onRefresh,
}) {
  const [activeTab, setActiveTab] = useState(
    WORKSPACE_TABS.SUMMARY || "summary"
  );

  const workspaceViews = {
    summary: (
      <AISummary
        insights={insights}
      />
    ),

    transcript: (
      <Transcript
        meetingId={meeting?._id}
        participants={meeting?.participants}
        onSpeakerUpdated={onRefresh}
      />
    ),

    actions: (
      <ActionItems
        insights={insights}
        participants={meeting?.participants}
      />
    ),

    decisions: (
      <Decisions
        insights={insights}
        participants={meeting?.participants}
      />
    ),

    analytics: (
      <Analytics
        meetingId={meeting?._id}
        participants={meeting?.participants}
        insights={insights}
        onSpeakerUpdated={onRefresh}
      />
    ),

    assistant: (
      <AIAssistant
        meetingId={meeting?._id}
      />
    ),
  };

  return (
    <MeetingAudioProvider meeting={meeting}>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] pb-32">
        <MeetingSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          insights={insights}
        />

        <section className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {workspaceViews[activeTab] ?? (
                <AISummary
                  insights={insights}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      <MeetingAudioPlayer />
    </MeetingAudioProvider>
  );
}
