import { Check } from "lucide-react";
import { EXPORT_SECTIONS } from "./export.constants";

export default function ExportOptions({ selectedSections, onToggle, onToggleAll }) {
  const hasSelections = selectedSections.length > 0;

  return (
    <section className="border-b border-white/[0.08] px-6 py-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Include Sections</h3>
        <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300" onClick={onToggleAll} type="button">
          {hasSelections ? "Clear all" : "Select all"}
        </button>
      </div>
      <div className="mt-3 space-y-1.5">
        {EXPORT_SECTIONS.map((section) => {
          const selected = selectedSections.includes(section);
          return (
            <label className="flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 transition hover:bg-white/[0.05]" key={section}>
              <span className="flex items-center gap-3 text-xs font-medium text-slate-200">
                <input checked={selected} className="sr-only" onChange={() => onToggle(section)} type="checkbox" />
                <span className={`flex h-4 w-4 items-center justify-center rounded-md border transition ${selected ? "border-indigo-500 bg-indigo-600 text-white shadow-sm" : "border-white/20 bg-white/[0.04]"}`}>
                  {selected && <Check size={11} strokeWidth={3} />}
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
