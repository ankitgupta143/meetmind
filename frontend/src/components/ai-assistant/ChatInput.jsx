"use client";

import { ArrowUp, Sparkles } from "lucide-react";
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
    <div className="border-t border-white/[0.08] bg-slate-950/80 p-4 sm:p-5 backdrop-blur-xl">
      <div className="relative flex items-center rounded-2xl border border-white/[0.08] bg-slate-900/90 px-4 py-2.5 transition-all duration-200 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20">
        <TextareaAutosize
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about this meeting (e.g., 'What deadlines were set?')..."
          className="flex-1 resize-none bg-transparent py-1 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none max-h-36"
          maxRows={5}
          disabled={isLoading}
        />
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          className="ml-3 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md transition-all hover:shadow-indigo-600/30 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
