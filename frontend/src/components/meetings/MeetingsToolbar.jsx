"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowUpDown, X, Check, ChevronDown } from "lucide-react";

export default function MeetingsToolbar({
  search = "",
  onSearchChange,
  status = "all",
  onStatusChange,
  sortBy = "date",
  sortOrder = "desc",
  onSortChange,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Close sort menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions = [
    { label: "Newest First", by: "date", order: "desc" },
    { label: "Oldest First", by: "date", order: "asc" },
    { label: "Title (A - Z)", by: "title", order: "asc" },
    { label: "Title (Z - A)", by: "title", order: "desc" },
    { label: "Duration (Longest)", by: "duration", order: "desc" },
    { label: "Duration (Shortest)", by: "duration", order: "asc" },
  ];

  const currentSortLabel =
    sortOptions.find((o) => o.by === sortBy && o.order === sortOrder)?.label ||
    "Newest First";

  return (
    <div className="relative z-30 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search & Filter */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search meetings by title, topic or participant..."
            className="h-10 w-full rounded-lg border border-border bg-surface-raised pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-indigo-300/50 focus:ring-2 focus:ring-indigo-300/10"
          />

          {search && (
            <button
              onClick={() => onSearchChange?.("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition p-0.5 rounded-full hover:bg-white/10"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className="h-10 rounded-lg border border-border bg-surface-raised px-3.5 text-sm font-medium text-foreground outline-none transition focus:border-indigo-300/50 cursor-pointer"
        >
          <option value="all" className="bg-slate-900 text-white">All Status</option>
          <option value="completed" className="bg-slate-900 text-white">Completed</option>
          <option value="processing" className="bg-slate-900 text-white">Processing</option>
          <option value="ready" className="bg-slate-900 text-white">Summary Ready</option>
          <option value="failed" className="bg-slate-900 text-white">Failed</option>
        </select>
      </div>

      {/* Sort Dropdown Menu */}
      <div className="relative z-40 flex items-center gap-2.5" ref={sortRef}>
        <button
          onClick={() => setSortOpen((prev) => !prev)}
          className="flex h-10 items-center gap-2 rounded-lg border border-border bg-surface-raised px-3.5 text-sm font-medium text-foreground transition hover:bg-surface-hover cursor-pointer"
        >
          <ArrowUpDown size={14} className="text-indigo-400" />
          <span>{currentSortLabel}</span>
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 text-slate-400 ${
              sortOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {sortOpen && (
          <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-white/[0.12] bg-slate-900/98 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150">
            {sortOptions.map((opt) => {
              const isSelected = opt.by === sortBy && opt.order === sortOrder;
              return (
                <button
                  key={opt.label}
                  onClick={() => {
                    onSortChange?.(opt.by, opt.order);
                    setSortOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600/25 text-indigo-300 font-semibold"
                      : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={14} className="text-indigo-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
