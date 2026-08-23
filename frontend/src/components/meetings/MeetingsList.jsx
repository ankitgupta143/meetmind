"use client";

import MeetingCard from "./MeetingCard";

export default function MeetingsList({ meetings = [], loading, error }) {
  if(loading){
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">
        Loading meetings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!meetings.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-zinc-900">
          No meetings yet
        </h3>

        <p className="mt-2 text-sm text-zinc-500">
          Upload your first meeting to get started.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
        />
      ))}
    </div>
  );
}