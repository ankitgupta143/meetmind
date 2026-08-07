import { Check } from "lucide-react";

import { EXPORT_SECTIONS } from "./export.constants";

export default function ExportOptions({ selectedSections, onToggle, onToggleAll }) {
  const hasSelections = selectedSections.length > 0;

  return (
    <section className="border-b border-zinc-200 px-6 py-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-zinc-900">Include</h3>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700" onClick={onToggleAll} type="button">
          {hasSelections ? "Clear all" : "Select all"}
        </button>
      </div>
      <div className="mt-4 space-y-1.5">
        {EXPORT_SECTIONS.map((section) => {
          const selected = selectedSections.includes(section);
          return (
            <label className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-zinc-50" key={section}>
              <span className="flex items-center gap-3 text-sm font-medium text-zinc-800">
                <input checked={selected} className="sr-only" onChange={() => onToggle(section)} type="checkbox" />
                <span className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${selected ? "border-indigo-600 bg-indigo-600 text-white" : "border-zinc-300 bg-white"}`}>
                  {selected && <Check size={14} strokeWidth={3} />}
                </span>
                {section}
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
