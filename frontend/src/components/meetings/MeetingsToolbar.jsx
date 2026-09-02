import { Search, ArrowUpDown } from "lucide-react";

export default function MeetingsToolbar() {

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-slate-950/60 p-4 shadow-xl backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
      {/* Search & Filter */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search meetings by title, topic or participant..."
            className="h-10 w-full rounded-xl border border-white/[0.08] bg-slate-900/80 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select className="h-10 rounded-xl border border-white/[0.08] bg-slate-900/80 px-3.5 text-xs font-medium text-slate-300 outline-none transition focus:border-indigo-500 cursor-pointer">
          <option value="all" className="bg-slate-900">All Status</option>
          <option value="completed" className="bg-slate-900">Completed</option>
          <option value="processing" className="bg-slate-900">Processing</option>
          <option value="ready" className="bg-slate-900">Summary Ready</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button className="flex h-10 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">
          <ArrowUpDown size={14} />
          <span>Sort</span>
        </button>
      </div>
    </div>
  );
}