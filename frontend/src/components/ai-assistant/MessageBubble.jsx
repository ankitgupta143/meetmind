"use client";

import { Bot, Copy, RotateCcw, User } from "lucide-react";
import { toast } from "sonner";

import MarkdownRenderer from "./MarkdownRenderer";

export default function MessageBubble({
  message,
  onRegenerate,
}) {
  const isUser = message.role === "user";

  const formattedTime = new Date(
    message.createdAt || Date.now()
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);

      toast.success("Copied to clipboard");
    } catch {
      toast.error("Unable to copy");
    }
  };

  return (
    <div
      className={`mb-8 flex gap-4 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${
          isUser
            ? "bg-indigo-50 text-indigo-600"
            : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
        }`}
      >
        {isUser ? (
          <User size={18} />
        ) : (
          <Bot size={18} />
        )}
      </div>

      {/* Message */}

      <div
        className={`max-w-[82%] ${
          isUser ? "items-end" : ""
        } flex flex-col`}
      >
        {/* Header */}

        <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
          <span className="font-medium">
            {isUser ? "You" : "MeetMind AI"}
          </span>

          <span>•</span>

          <span>{formattedTime}</span>
        </div>

        {/* Bubble */}

        <div
          className={`rounded-2xl px-5 py-4 shadow-sm ${
            isUser
              ? "rounded-tr-none bg-indigo-600 text-white"
              : "rounded-tl-none border border-zinc-200 bg-white"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-7">
              {message.content}
            </p>
          ) : (
            <MarkdownRenderer
              content={message.content}
            />
          )}
        </div>

        {/* Actions */}

        {!isUser && (
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={copyMessage}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              <Copy size={14} />

              Copy
            </button>

            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              <RotateCcw size={14} />

              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}