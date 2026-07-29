"use client";

import { meetingsData } from "@/constants/mockData";
import MeetingCard from "./MeetingCard";

export default function MeetingsList() {
  return (
    <div className="space-y-5">
      {meetingsData.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
        />
      ))}
    </div>
  );
}