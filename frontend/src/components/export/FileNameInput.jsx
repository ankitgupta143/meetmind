import { buildExportFilename } from "./export.utils";

export default function FileNameInput({ extension, filename, onChange }) {
  const exportFilename = buildExportFilename(filename, extension);

  return (
    <section className="px-6 py-6">
      <label className="block text-sm font-semibold text-zinc-900" htmlFor="export-filename">Filename</label>
      <div className="mt-3 flex items-center rounded-xl border border-zinc-200 bg-white px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
        <input className="min-w-0 flex-1 py-3 text-sm text-zinc-900 outline-none" id="export-filename" onChange={(event) => onChange(event.target.value)} value={filename} />
        <span className="pl-2 text-sm text-zinc-400">.{extension}</span>
      </div>
      <p className="mt-2 text-xs text-zinc-500">Your export will be saved as {exportFilename}</p>
    </section>
  );
}
