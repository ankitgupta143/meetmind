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
    <section className="relative overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-200">
            <Sparkles size={14} /> Your Personal Knowledge Hub
          </p>
          <h1 className="mt-2.5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Welcome back, {userName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Manage your favorited recordings, cross-meeting action deliverables, AI research sessions, and synthesis templates in one unified command center.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-hover cursor-pointer active:scale-[0.98]"
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
            className="flex items-center gap-2 rounded-lg border border-indigo-300/20 bg-indigo-300/10 px-4 py-2.5 text-sm font-medium text-indigo-100 transition hover:bg-indigo-300/15 cursor-pointer active:scale-[0.98]"
          >
            <MessageSquareText size={14} /> <span>AI Assistant</span>
          </button>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-indigo-200 active:scale-[0.98] cursor-pointer"
          >
            <UploadCloud size={14} /> <span>Upload Recording</span>
          </button>
        </div>
      </div>
    </section>
  );
}
