"use client";

import { Upload } from "lucide-react";

export default function MeetingsHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold">Meetings</h1>
        <p className="mt-1 text-zinc-500">
          View and manage all your recorded meetings.
        </p>
      </div>

      <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700">
        <Upload size={18} />
        Upload Meeting
      </button>
    </div>
  );
}