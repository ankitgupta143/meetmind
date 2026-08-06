const filters = [
  { label: "All", value: "all" },
  { label: "Meetings", value: "meeting" },
  { label: "Transcripts", value: "transcript" },
  { label: "Actions", value: "action" },
  { label: "Decisions", value: "decision" },
  { label: "Speakers", value: "speaker" },
];

export default function SearchFilters({
  active,
  onChange,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`rounded-xl px-5 py-2 capitalize transition ${
            active === filter.value
              ? "bg-indigo-600 text-white"
              : "border border-zinc-200 bg-white hover:bg-zinc-100"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
