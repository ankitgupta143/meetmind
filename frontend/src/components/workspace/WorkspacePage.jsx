"use client";

import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceStats from "./WorkspaceStats";
import WorkspaceGrid from "./WorkspaceGrid";
import RecentActivity from "./sections/RecentActivity";
import Templates from "./sections/Templates";
import useWorkspace from "./hooks/useWorkspace";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function WorkspacePage() {
  const {
    data,
    loading,
    error,
    refetch,
    toggleFavorite,
    togglePin,
    toggleActionItem,
  } = useWorkspace();

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-44 rounded-[2.5rem] bg-slate-900/50 border border-white/[0.05]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-900/40 border border-white/[0.05]"
            />
          ))}
        </div>
        <div className="h-96 rounded-[2.5rem] bg-slate-900/40 border border-white/[0.05]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={refetch}
            className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1 font-semibold text-rose-200 hover:bg-rose-500/30 transition cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Retry</span>
          </button>
        </div>
      )}

      <WorkspaceHeader />
      <WorkspaceStats stats={data.stats} />
      <WorkspaceGrid
        collections={data.collections}
        onToggleFavorite={toggleFavorite}
        onTogglePin={togglePin}
        onToggleActionItem={toggleActionItem}
      />
      <RecentActivity activities={data.recentActivity} />
      <Templates />
    </div>
  );
}
