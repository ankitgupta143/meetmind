"use client";

import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

export default function ChatInput({ value, onChange, onSubmit, isLoading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="border-t border-zinc-200 bg-white p-6">
      <div className="relative flex items-center rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
        <TextareaAutosize
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about this meeting..."
          className="flex-1 resize-none bg-transparent py-1 text-sm text-zinc-900 placeholder-zinc-400 outline-none max-h-40"
          maxRows={6}
          disabled={isLoading}
        />
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          className="ml-3 flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-700 disabled:bg-zinc-200 disabled:text-zinc-400 cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
