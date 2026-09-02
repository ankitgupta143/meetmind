"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { PROMPTS } from "./constants/prompts";

export default function PromptSuggestions({
  onSuggestionClick,
}) {
  return (
    <div className="mx-auto mt-6 w-full max-w-4xl">
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles size={13} className="text-indigo-400" />
          Suggested Prompts
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PROMPTS.map(
          ({
            id,
            title,
            description,
            icon: Icon,
          }) => (
            <button
              key={id}
              onClick={() => onSuggestionClick(title)}
              className="group rounded-2xl border border-white/[0.08] bg-slate-900/40 p-4 text-left transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:-translate-y-0.5 cursor-pointer shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={16} />
                </div>

                <ArrowRight
                  size={14}
                  className="text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-400"
                />
              </div>

              <h4 className="mt-3 text-xs font-bold text-slate-100 group-hover:text-white">
                {title}
              </h4>

              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                {description}
              </p>
            </button>
          )
        )}
      </div>
    </div>
  );
}