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
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-white/[0.08] bg-slate-950/80 p-4">
      <div className="mb-5 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Sparkles size={16} className="text-indigo-400" />
          <span>Chat History</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={16} />
        </button>
      </div>

      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:shadow-indigo-600/40 active:scale-95 cursor-pointer"
      >
        <Plus size={15} /> <span>New Chat</span>
      </button>

      <div className="mt-5 flex-1 space-y-5 overflow-y-auto">
        {chatGroups.map((group) => (
          <div key={group.id}>
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {group.label}
            </p>
            <div className="mt-1.5 space-y-1">
              {group.items.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelect(chat.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition ${
                    activeChatId === chat.id
                      ? "bg-white/10 text-white font-semibold border border-white/10"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  <MessageSquare size={14} className="shrink-0 text-slate-400" />
                  <span className="truncate">{chat.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-950/30 p-3 text-[11px] leading-relaxed text-indigo-300">
        <strong className="text-white">Workspace AI Active</strong>
        <br />
        Answers index content from all recorded meetings.
      </div>
    </aside>
  );
}
