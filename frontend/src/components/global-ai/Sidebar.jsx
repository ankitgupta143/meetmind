"use client";

import { MessageSquare, Plus, Sparkles, X } from "lucide-react";

export default function Sidebar({
  activeChatId,
  chatGroups,
  onClose,
  onNewChat,
  onSelect,
}) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50/80 p-4">
      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 font-semibold text-zinc-900">
          <Sparkles size={18} className="text-indigo-600" /> MeetMind AI
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200 lg:hidden"
        >
          <X size={18} />
        </button>
      </div>
      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        <Plus size={17} /> New chat
      </button>
      <div className="mt-7 flex-1 space-y-6 overflow-y-auto">
        {chatGroups.map((group) => (
          <div key={group.id}>
            <p className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
              {group.label}
            </p>
            <div className="mt-2 space-y-1">
              {group.items.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelect(chat.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${activeChatId === chat.id ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-600 hover:bg-white/70"}`}
                >
                  <MessageSquare size={16} className="shrink-0 text-zinc-400" />
                  <span className="truncate">{chat.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-xs leading-5 text-indigo-800">
        <b>Workspace AI</b>
        <br />
        Answers use insights from all your meetings.
      </div>
    </aside>
  );
}
