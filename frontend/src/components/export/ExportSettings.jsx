const PAGE_SIZES = ["A4", "Letter", "Legal"];

function SettingToggle({ checked, description, label, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl px-3 py-3 transition hover:bg-zinc-50">
      <span>
        <span className="block text-sm font-medium text-zinc-800">{label}</span>
        <span className="mt-0.5 block text-xs text-zinc-500">{description}</span>
      </span>
      <input checked={checked} className="mt-0.5 h-4 w-4 accent-indigo-600" onChange={(event) => onChange(event.target.checked)} type="checkbox" />
    </label>
  );
}

export default function ExportSettings({ settings, onChange }) {
  return (
    <section className="border-b border-zinc-200 px-6 py-6">
      <h3 className="text-sm font-semibold text-zinc-900">Export settings</h3>
      <label className="mt-4 block px-3 text-xs font-medium text-zinc-600" htmlFor="export-page-size">
        Page size
        <select className="mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" id="export-page-size" onChange={(event) => onChange({ pageSize: event.target.value })} value={settings.pageSize}>
          {PAGE_SIZES.map((pageSize) => <option key={pageSize}>{pageSize}</option>)}
        </select>
      </label>
      <div className="mt-3 space-y-1">
        <SettingToggle checked={settings.includeTimestamps} description="Show timestamps beside transcript entries." label="Include timestamps" onChange={(includeTimestamps) => onChange({ includeTimestamps })} />
        <SettingToggle checked={settings.includeBranding} description="Add the MeetMind mark to the report." label="Include MeetMind branding" onChange={(includeBranding) => onChange({ includeBranding })} />
      </div>
    </section>
  );
}
