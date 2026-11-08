"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MessageSquare,
  Pin,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

export default function WorkspaceGrid({
  collections,
  onToggleFavorite,
  onTogglePin,
  onToggleActionItem,
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all"); // "all" | "favorites" | "pinned" | "actions" | "chats"

  const favoriteMeetings = collections?.favoriteMeetings || [];
  const pinnedMeetings = collections?.pinnedMeetings || [];
  const savedConversations = collections?.savedConversations || [];
  const actionItems = collections?.actionItems || [];

  return (
    <section className="space-y-6">
      {/* Section Header & Tab Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Curated Knowledge Collections
            <Sparkles size={16} className="text-cyan-400" />
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Live meetings, pinned discussions, saved AI conversations, and actionable tasks.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/[0.08] bg-slate-900/60 p-1 backdrop-blur-xl">
          {[
            { id: "all", label: "All Collections" },
            { id: "favorites", label: `Favorites (${favoriteMeetings.length})` },
            { id: "pinned", label: `Pinned (${pinnedMeetings.length})` },
            { id: "actions", label: `Tasks (${actionItems.length})` },
            { id: "chats", label: `AI Chats (${savedConversations.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* SECTION 1: Pinned Meetings */}
        {(activeTab === "all" || activeTab === "pinned") && (
          <div>
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <Pin size={14} className="rotate-45" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Pinned Discussions
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Mission-critical meetings pinned to the top of your workspace.
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/meetings")}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition"
              >
                <span>Browse all meetings</span>
                <ArrowUpRight size={13} />
              </button>
            </div>

            {pinnedMeetings.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-slate-950/40 p-6 text-center text-xs text-slate-400">
                <p>No meetings pinned yet.</p>
                <button
                  onClick={() => router.push("/meetings")}
                  className="mt-2 text-indigo-400 hover:underline cursor-pointer"
                >
                  Click the pin icon on any meeting in your archive to pin it here
                </button>
              </div>
            ) : (
              <div className="grid gap-3.5 md:grid-cols-2">
                {pinnedMeetings.map((item) => (
                  <div
                    key={`pinned-${item.id}`}
                    onClick={() => router.push(`/meetings/${item.id}`)}
                    className="group relative rounded-[2rem] border border-indigo-500/30 bg-slate-950/70 p-5 text-left shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/60 hover:bg-slate-900/90 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                        <Pin size={16} className="rotate-45 fill-indigo-400" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {onTogglePin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePin(item.id, item.title);
                            }}
                            className="rounded-lg p-1.5 text-indigo-400 hover:text-indigo-200 hover:bg-white/[0.06] transition"
                            title="Unpin meeting"
                          >
                            <Pin size={14} className="rotate-45 fill-indigo-400" />
                          </button>
                        )}
                        <ArrowUpRight
                          size={16}
                          className="text-slate-500 transition group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                    </div>

                    <h4 className="mt-3 text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {item.title}
                    </h4>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={12} className="text-indigo-400" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock3 size={12} className="text-amber-400" />
                        {item.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-cyan-400" />
                        {item.participants}
                      </span>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                      <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-indigo-300 font-mono text-[10px] font-semibold">
                        📌 Pinned
                      </span>
                      <span className="text-indigo-400 group-hover:underline text-[11px] font-medium">
                        Open Workspace →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: Favorite Meetings */}
        {(activeTab === "all" || activeTab === "favorites") && (
          <div>
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Star size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Favorite & Key Meetings
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Bookmarked conversations kept close for easy reference.
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/meetings")}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition"
              >
                <span>Browse all meetings</span>
                <ArrowUpRight size={13} />
              </button>
            </div>

            {favoriteMeetings.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-slate-950/40 p-6 text-center text-xs text-slate-400">
                <p>No favorited meetings yet.</p>
                <button
                  onClick={() => router.push("/meetings")}
                  className="mt-2 text-indigo-400 hover:underline cursor-pointer"
                >
                  Explore your meetings archive to star key conversations
                </button>
              </div>
            ) : (
              <div className="grid gap-3.5 md:grid-cols-2">
                {favoriteMeetings.map((item) => (
                  <div
                    key={`fav-${item.id}`}
                    onClick={() => router.push(`/meetings/${item.id}`)}
                    className="group relative rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-5 text-left shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900/80 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                        <Star size={16} className="fill-amber-400/20" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {onTogglePin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePin(item.id, item.title);
                            }}
                            className={`rounded-lg p-1.5 transition ${
                              item.isPinned
                                ? "text-indigo-400 bg-indigo-500/15"
                                : "text-slate-400 hover:text-indigo-400 hover:bg-white/[0.06]"
                            }`}
                            title={item.isPinned ? "Unpin meeting" : "Pin meeting"}
                          >
                            <Pin
                              size={14}
                              className={item.isPinned ? "rotate-45 fill-indigo-400" : ""}
                            />
                          </button>
                        )}
                        {onToggleFavorite && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(item.id, item.title);
                            }}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-amber-400 hover:bg-white/[0.06] transition"
                            title={item.isFavorite ? "Remove favorite" : "Add to favorites"}
                          >
                            <Star
                              size={15}
                              className={item.isFavorite ? "fill-amber-400 text-amber-400" : ""}
                            />
                          </button>
                        )}
                        <ArrowUpRight
                          size={16}
                          className="text-slate-500 transition group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                    </div>

                    <h4 className="mt-3 text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {item.title}
                    </h4>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={12} className="text-indigo-400" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock3 size={12} className="text-amber-400" />
                        {item.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} className="text-cyan-400" />
                        {item.participants}
                      </span>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-slate-400 font-mono text-[10px]">
                        {item.status === "completed" ? "AI Processed" : item.status}
                      </span>
                      <span className="text-indigo-400 group-hover:underline text-[11px] font-medium">
                        Open Workspace →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: Action Items & Deliverables Across Meetings */}
        {(activeTab === "all" || activeTab === "actions") && (
          <div>
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Cross-Meeting Action Deliverables
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Live tasks extracted by MeetMind AI across all discussions.
                  </p>
                </div>
              </div>

              <span className="text-xs font-medium text-slate-400">
                {actionItems.filter((i) => i.status !== "completed").length} pending
              </span>
            </div>

            {actionItems.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-slate-950/40 p-6 text-center text-xs text-slate-400">
                <p>No action items found across your meetings yet.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {actionItems.map((item, idx) => {
                  const isCompleted = item.status === "completed";
                  const priorityColors = {
                    high: "bg-rose-500/15 border-rose-500/30 text-rose-300",
                    medium: "bg-amber-500/15 border-amber-500/30 text-amber-300",
                    low: "bg-slate-500/15 border-slate-500/30 text-slate-300",
                  };

                  return (
                    <div
                      key={`${item.meetingId}-${item.itemIndex || idx}`}
                      className={`group relative rounded-2xl border p-4 transition-all duration-200 ${
                        isCompleted
                          ? "border-white/[0.05] bg-slate-950/40 opacity-70"
                          : "border-white/[0.08] bg-slate-950/60 hover:border-emerald-500/30 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            onToggleActionItem?.(
                              item.meetingId,
                              item.itemIndex,
                              item.status
                            )
                          }
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition cursor-pointer ${
                            isCompleted
                              ? "bg-emerald-600 border-emerald-500 text-white"
                              : "border-white/20 bg-white/[0.04] hover:border-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {isCompleted && <CheckCircle2 size={13} />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs sm:text-sm font-semibold leading-snug ${
                              isCompleted
                                ? "text-slate-400 line-through"
                                : "text-white"
                            }`}
                          >
                            {item.title}
                          </p>

                          {item.description && (
                            <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
                            <span
                              className={`rounded-full border px-2 py-0.5 font-semibold uppercase tracking-wider ${
                                priorityColors[item.priority] || priorityColors.medium
                              }`}
                            >
                              {item.priority}
                            </span>

                            {item.assignee && (
                              <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-slate-300">
                                @{item.assignee}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => router.push(`/meetings/${item.meetingId}`)}
                              className="ml-auto inline-flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition"
                            >
                              <span className="truncate max-w-[130px] font-medium">
                                {item.meetingTitle}
                              </span>
                              <ExternalLink size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: Saved AI Conversations */}
        {(activeTab === "all" || activeTab === "chats") && (
          <div>
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                  <Bot size={14} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Saved AI Conversations
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Cross-meeting intelligence and research sessions with Groq AI.
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/ai-assistant")}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition"
              >
                <span>Open Assistant</span>
                <ArrowUpRight size={13} />
              </button>
            </div>

            {savedConversations.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-slate-950/40 p-6 text-center text-xs text-slate-400">
                <p>No AI assistant conversations saved yet.</p>
                <button
                  onClick={() => router.push("/ai-assistant")}
                  className="mt-2 text-indigo-400 hover:underline cursor-pointer"
                >
                  Ask MeetMind AI a question across your workspace
                </button>
              </div>
            ) : (
              <div className="grid gap-3.5 md:grid-cols-2">
                {savedConversations.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      try {
                        localStorage.setItem("meetmind_active_chat_id", chat.id);
                      } catch (_) {}
                      router.push("/ai-assistant");
                    }}
                    className="group w-full rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-5 text-left shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900/80 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <MessageSquare size={16} />
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="text-slate-500 transition group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>

                    <h4 className="mt-4 text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {chat.title}
                    </h4>

                    {chat.lastMessage && (
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        &quot;{chat.lastMessage}&quot;
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
                      <span>{chat.meta}</span>
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 font-medium text-slate-300">
                        {chat.detail}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
