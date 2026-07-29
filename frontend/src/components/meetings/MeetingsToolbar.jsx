"use client";

import { Search, Filter, ArrowUpDown, Upload } from "lucide-react";

export default function MeetingsToolbar() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          />

          <input
            type="text"
            placeholder="Search meetings..."
            className="h-11 w-full rounded-xl border border-zinc-200 pl-11 pr-4 outline-none transition focus:border-indigo-500"
          />
        </div>

        {/* Status */}
        <select className="h-11 rounded-xl border border-zinc-200 px-4 outline-none focus:border-indigo-500">
          <option>All Status</option>
          <option>Completed</option>
          <option>Processing</option>
          <option>Summary Ready</option>
        </select>
      </div>

      {/* Right */}
      <div className="flex gap-3">
        <button className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 transition hover:bg-zinc-50">
          <ArrowUpDown size={18} />
          Sort
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700">
          <Upload size={18} />
          Upload
        </button>
      </div>
    </div>
  );
}