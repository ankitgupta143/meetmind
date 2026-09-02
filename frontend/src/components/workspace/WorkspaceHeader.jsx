"use client";

import { FolderPlus, Search, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function WorkspaceHeader() {
  const { user } = useAuth();
  const userName = user?.firstName || "Ankit";

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-slate-950/60 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Sparkles size={14} className="text-cyan-400" /> Your Personal Knowledge Hub
          </p>
          <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back, {userName}
          </h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-400 leading-relaxed">
            Organize pinned recordings, executive dossiers, drafts and AI prompt templates in a single high-velocity canvas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white">
            <Search size={14} /> <span>Search Workspace</span>
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95">
            <FolderPlus size={14} /> <span>New Collection</span>
          </button>
        </div>
      </div>
    </section>
  );
}
