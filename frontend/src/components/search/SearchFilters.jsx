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
              ? "border border-indigo-300/20 bg-indigo-300/10 text-indigo-100"
              : "border border-border bg-surface-raised text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
