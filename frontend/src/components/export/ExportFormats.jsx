import { EXPORT_FORMATS } from "./export.constants";

export default function ExportFormats({ format, onChange }) {
  return (
    <section className="border-b border-white/[0.08] px-6 py-5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Export format</h3>
      <fieldset className="mt-3 space-y-1.5">
        <legend className="sr-only">Export format</legend>
        {EXPORT_FORMATS.map((option) => (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 transition hover:bg-white/[0.05] has-[:checked]:bg-indigo-500/15 has-[:checked]:border has-[:checked]:border-indigo-500/30" key={option.value}>
            <input checked={format === option.value} className="h-4 w-4 accent-indigo-500" name="export-format" onChange={() => onChange(option.value)} type="radio" value={option.value} />
            <span className="text-xs font-semibold text-slate-200">{option.label}</span>
          </label>
        ))}
      </fieldset>
    </section>
  );
}
