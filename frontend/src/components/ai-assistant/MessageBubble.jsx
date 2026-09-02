"use client";

import { Bot, Copy, RotateCcw, User, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import MarkdownRenderer from "./MarkdownRenderer";

export default function MessageBubble({
  message,
  onRegenerate,
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const formattedTime = new Date(
    message.createdAt || Date.now()
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Copied message to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy");
    }
  };

  return (
    <div
      className={`mb-6 flex gap-3.5 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ${
          isUser
            ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-400"
            : "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-600/20"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message */}
      <div
        className={`max-w-[85%] sm:max-w-[78%] ${
          isUser ? "items-end" : ""
        } flex flex-col`}
      >
        {/* Header */}
        <div className="mb-1.5 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300">
            {isUser ? "You" : "MeetMind Copilot"}
          </span>
          <span>•</span>
          <span className="font-mono">{formattedTime}</span>
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3.5 shadow-md ${
            isUser
              ? "rounded-tr-none bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
              : "rounded-tl-none border border-white/[0.08] bg-slate-900/80 text-slate-100"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
              {message.content}
            </p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Actions */}
        {!isUser && (
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={copyMessage}
              className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <RotateCcw size={12} />
                <span>Retry</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}