import { EXPORT_FORMATS } from "./export.constants";

export default function ExportFormats({ format, onChange }) {
  return (
    <section className="border-b border-zinc-200 px-6 py-6">
      <h3 className="text-sm font-semibold text-zinc-900">Export format</h3>
      <fieldset className="mt-4 space-y-1.5">
        <legend className="sr-only">Export format</legend>
        {EXPORT_FORMATS.map((option) => (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-zinc-50 has-[:checked]:bg-indigo-50" key={option.value}>
            <input checked={format === option.value} className="h-4 w-4 accent-indigo-600" name="export-format" onChange={() => onChange(option.value)} type="radio" value={option.value} />
            <span className="text-sm font-medium text-zinc-800">{option.label}</span>
          </label>
        ))}
      </fieldset>
    </section>
  );
}
