"use client";

import { ArrowRight } from "lucide-react";

import { PROMPTS } from "./constants/prompts";

export default function PromptSuggestions({
  onSuggestionClick,
}) {
  return (
    <div className="mx-auto mt-14 w-full max-w-5xl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-900">
          Suggested Questions
        </h3>

        <p className="mt-1 text-sm text-zinc-500">
          Start with one of these prompts or ask your own question.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={20} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-zinc-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600"
                />
              </div>

              <h4 className="mt-5 text-base font-semibold text-zinc-900">
                {title}
              </h4>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {description}
              </p>
            </button>
          )
        )}
      </div>
    </div>
  );
}