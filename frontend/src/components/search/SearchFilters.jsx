const filters = [
  { label: "All", value: "all" },
  { label: "Meetings", value: "meeting" },
  { label: "Transcripts", value: "transcript" },
  { label: "Action Items", value: "action" },
  { label: "Decisions", value: "decision" },
  { label: "Speakers", value: "speaker" },
];

export default function SearchFilters({
  active,
  onChange,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition cursor-pointer ${
            active === filter.value
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "border border-white/[0.08] bg-white/[0.04] text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
