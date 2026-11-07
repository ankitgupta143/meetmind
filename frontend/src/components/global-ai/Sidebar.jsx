"use client";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  RotateCw,
  Sparkles,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";

export default function Sidebar({
  activeChatId,
  chatGroups,
  onClose,
  onNewChat,
  onSelect,
  onDelete,
  onRename,
  isLoading = false,
  error = null,
  onRetry,
}) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const handleDeleteClick = (e, chatId) => {
    e.stopPropagation();
    setConfirmDeleteId(chatId);
    setEditingChatId(null);
  };

  const handleConfirmDelete = async (e, chatId) => {
    e.stopPropagation();
    if (!onDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      await onDelete(chatId);
    } catch (err) {
      console.error("Failed to delete chat:", err);
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  const handleStartRename = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
    setConfirmDeleteId(null);
  };

  const handleSaveRename = async (e, chatId) => {
    e?.stopPropagation();
    const clean = editTitle.trim();
    if (!clean || !onRename) {
      setEditingChatId(null);
      return;
    }

    try {
      await onRename(chatId, clean);
    } catch (err) {
      console.error("Failed to rename chat:", err);
    } finally {
      setEditingChatId(null);
    }
  };

  const handleCancelRename = (e) => {
    e?.stopPropagation();
    setEditingChatId(null);
  };

  const totalConversations = chatGroups.reduce(
    (acc, group) => acc + (group.items?.length || 0),
    0
  );

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
        {isLoading ? (
          <div className="space-y-4 px-1">
            <div className="space-y-2">
              <div className="h-2 w-14 rounded bg-white/10 animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 bg-white/[0.03] animate-pulse"
                >
                  <div className="h-3.5 w-3.5 rounded bg-white/10 shrink-0" />
                  <div
                    className="h-3 rounded bg-white/10"
                    style={{ width: `${55 + i * 15}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="mx-1 rounded-2xl border border-rose-500/20 bg-rose-950/20 p-3 text-center">
            <p className="text-[11px] text-rose-300 mb-2.5 leading-relaxed">
              {error}
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/20 px-3 py-1.5 text-[11px] font-semibold text-rose-200 hover:bg-rose-500/30 transition cursor-pointer"
              >
                <RotateCw size={12} />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : totalConversations === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-slate-500">
            No previous conversations
          </div>
        ) : (
          chatGroups.map((group) => {
            if (!group.items || group.items.length === 0) return null;

            return (
              <div key={group.id}>
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.label}
                </p>
                <div className="mt-1.5 space-y-1">
                  {group.items.map((chat) => {
                    const isSelected = activeChatId === chat.id;
                    const isConfirming = confirmDeleteId === chat.id;
                    const isEditing = editingChatId === chat.id;

                    return (
                      <div
                        key={chat.id}
                        onClick={() => !isEditing && onSelect(chat.id)}
                        className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition cursor-pointer ${
                          isSelected
                            ? "bg-white/10 text-white font-semibold border border-white/10"
                            : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                        }`}
                      >
                        {isEditing ? (
                          <div
                            className="flex items-center gap-1.5 w-full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              autoFocus
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveRename(e, chat.id);
                                if (e.key === "Escape") handleCancelRename(e);
                              }}
                              className="flex-1 bg-slate-900 border border-indigo-500/50 rounded px-2 py-0.5 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={(e) => handleSaveRename(e, chat.id)}
                              className="text-emerald-400 hover:text-emerald-300 p-0.5"
                              title="Save"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelRename}
                              className="text-slate-400 hover:text-slate-200 p-0.5"
                              title="Cancel"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex min-w-0 items-center gap-2.5 flex-1 pr-2">
                              <MessageSquare
                                size={14}
                                className="shrink-0 text-slate-400"
                              />
                              <span className="truncate">{chat.title}</span>
                            </div>

                            <div className="shrink-0 flex items-center gap-1">
                              {isConfirming ? (
                                <div
                                  className="flex items-center gap-1.5 bg-slate-900/90 rounded-lg px-1.5 py-0.5 border border-red-500/30"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span className="text-[10px] text-red-400 font-medium">
                                    Delete?
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      handleConfirmDelete(e, chat.id)
                                    }
                                    disabled={isDeleting}
                                    className="text-red-400 hover:text-red-300 p-0.5"
                                    title="Confirm delete"
                                  >
                                    <Check size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelDelete}
                                    className="text-slate-400 hover:text-slate-200 p-0.5"
                                    title="Cancel"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  {onRename && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleStartRename(e, chat)}
                                      className={`rounded p-1 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition opacity-0 group-hover:opacity-100 ${
                                        isSelected ? "opacity-70" : ""
                                      }`}
                                      title="Rename conversation"
                                    >
                                      <Pencil size={12} />
                                    </button>
                                  )}
                                  {onDelete && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteClick(e, chat.id)}
                                      className={`rounded p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100 ${
                                        isSelected ? "opacity-70" : ""
                                      }`}
                                      title="Delete conversation"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-indigo-500/20 bg-indigo-950/30 p-3 text-[11px] leading-relaxed text-indigo-300">
        <strong className="text-white">Workspace AI Active</strong>
        <br />
        Answers index content from all recorded meetings.
      </div>
    </aside>
  );
}
