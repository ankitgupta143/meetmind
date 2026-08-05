"use client";

import { ArrowUp } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

export default function ChatInput({ isLoading, onChange, onSubmit, value }) {
  return <div className="border-t border-zinc-200 bg-white px-5 py-4 sm:px-7"><div className="mx-auto flex max-w-3xl items-end rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 focus-within:border-indigo-400"><TextareaAutosize value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSubmit(); } }} disabled={isLoading} maxRows={5} placeholder="Ask about all your meetings..." className="max-h-32 flex-1 resize-none bg-transparent px-1 py-1 text-sm outline-none" /><button onClick={onSubmit} disabled={!value.trim() || isLoading} className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white disabled:bg-zinc-200"><ArrowUp size={17} /></button></div><p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-zinc-400">MeetMind may make mistakes. Check important information in the source meeting.</p></div>;
}
