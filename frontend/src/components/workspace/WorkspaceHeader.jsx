"use client";

import { MessageSquareText, Search, Sparkles, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useUploadModal } from "@/context/UploadModalContext";

export default function WorkspaceHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const { setOpen } = useUploadModal();
  const userName = user?.firstName || "there";

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
            Manage your favorited recordings, cross-meeting action deliverables, AI research sessions, and synthesis templates in one unified command center.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white cursor-pointer active:scale-95"
          >
            <Search size={14} /> <span>Search Workspace</span>
          </button>
          <button
            onClick={() => {
              try {
                sessionStorage.setItem("meetmind_force_new_chat", "true");
                localStorage.removeItem("meetmind_active_chat_id");
              } catch (_) {}
              router.push("/ai-assistant?new=true");
            }}
            className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20 hover:text-white cursor-pointer active:scale-95"
          >
            <MessageSquareText size={14} /> <span>AI Assistant</span>
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 cursor-pointer"
          >
            <UploadCloud size={14} /> <span>Upload Recording</span>
          </button>
        </div>
      </div>
    </section>
  );
}
