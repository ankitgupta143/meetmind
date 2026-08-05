import { GLOBAL_ASSISTANT_PROMPTS } from "./data/assistantData";

export default function PromptGrid({ onSelect }) {
  return (
    <div className="mt-9 grid gap-3 sm:grid-cols-2">
      {GLOBAL_ASSISTANT_PROMPTS.map(({ icon: Icon, title, subtitle }) => (
        <button
          key={title}
          onClick={() => onSelect(title)}
          className="group rounded-xl border border-zinc-200 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/40"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Icon size={18} />
            </div>
            <div>
              <p className="font-medium text-zinc-800">{title}</p>
              <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
