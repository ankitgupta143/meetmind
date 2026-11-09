"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { PROMPTS } from "./constants/prompts";

export default function PromptSuggestions({
  onSuggestionClick,
}) {
  return (
    <div className="mx-auto mt-4 w-full max-w-4xl">
      <div className="mb-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles size={13} className="text-primary" />
          Suggested Prompts
        </h3>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
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
              className="group rounded-xl border border-border bg-surface-raised/70 p-3 text-left transition-all duration-200 hover:border-indigo-500/40 hover:bg-surface-hover hover:-translate-y-0.5 cursor-pointer shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={15} />
                </div>

                <ArrowRight
                  size={14}
                  className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                />
              </div>

              <h4 className="mt-2.5 text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                {title}
              </h4>

              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground line-clamp-1">
                {description}
              </p>
            </button>
          )
        )}
      </div>
    </div>
  );
}
