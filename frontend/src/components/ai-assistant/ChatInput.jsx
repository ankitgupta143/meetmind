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
    <div className="border-t border-border bg-card p-4 sm:p-5">
      <div className="relative flex items-center rounded-xl border border-border bg-surface-raised px-4 py-2.5 transition focus-within:border-indigo-300/50 focus-within:ring-2 focus-within:ring-indigo-300/10">
        <TextareaAutosize
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about this meeting (e.g., 'What deadlines were set?')..."
          className="flex-1 resize-none bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground outline-none max-h-36"
          maxRows={5}
          disabled={isLoading}
        />
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          className="ml-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition hover:bg-indigo-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
