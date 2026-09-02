export default function FileNameInput({ extension, filename, onChange }) {
  return (
    <section className="px-6 py-5">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="export-filename">
        File name
      </label>
      <div className="mt-2 flex items-center rounded-xl border border-white/[0.08] bg-slate-900 px-3.5 py-2">
        <input
          className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
          id="export-filename"
          onChange={(event) => onChange(event.target.value)}
          placeholder="meetmind-export"
          type="text"
          value={filename}
        />
        <span className="font-mono text-xs text-slate-400">.{extension}</span>
      </div>
    </section>
  );
}
