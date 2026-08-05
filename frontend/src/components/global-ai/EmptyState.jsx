import { Bot } from "lucide-react";
import PromptGrid from "./PromptGrid";

export default function EmptyState({ onPromptSelect }) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 py-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center">
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
          <Bot size={27} />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Your meeting workspace, at a glance.
        </h2>
        <p className="mt-3 max-w-xl text-base leading-7 text-zinc-500">
          Ask MeetMind to connect the dots across every conversation, decision,
          and action item.
        </p>
        <PromptGrid onSelect={onPromptSelect} />
      </div>
    </div>
  );
}
