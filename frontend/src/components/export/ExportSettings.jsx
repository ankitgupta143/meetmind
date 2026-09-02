const PAGE_SIZES = ["A4", "Letter", "Legal"];

function SettingToggle({ checked, description, label, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl px-3.5 py-2.5 transition hover:bg-white/[0.05]">
      <span>
        <span className="block text-xs font-semibold text-slate-200">{label}</span>
        <span className="mt-0.5 block text-[11px] text-slate-400">{description}</span>
      </span>
      <input checked={checked} className="mt-0.5 h-4 w-4 accent-indigo-500" onChange={(event) => onChange(event.target.checked)} type="checkbox" />
    </label>
  );
}

export default function ExportSettings({ settings, onChange }) {
  return (
    <section className="border-b border-white/[0.08] px-6 py-5">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Export settings</h3>
      <label className="mt-3 block px-3.5 text-xs font-semibold text-slate-300" htmlFor="export-page-size">
        Page format
        <select className="mt-1.5 block w-full rounded-xl border border-white/[0.08] bg-slate-900 px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500" id="export-page-size" onChange={(event) => onChange({ pageSize: event.target.value })} value={settings.pageSize}>
          {PAGE_SIZES.map((pageSize) => <option key={pageSize} className="bg-slate-900">{pageSize}</option>)}
        </select>
      </label>
      <div className="mt-3 space-y-1">
        <SettingToggle checked={settings.includeTimestamps} description="Show timestamps beside transcript dialogue entries." label="Include timestamps" onChange={(includeTimestamps) => onChange({ includeTimestamps })} />
        <SettingToggle checked={settings.includeBranding} description="Add the MeetMind AI mark to header and footer." label="Include MeetMind branding" onChange={(includeBranding) => onChange({ includeBranding })} />
      </div>
    </section>
  );
}
