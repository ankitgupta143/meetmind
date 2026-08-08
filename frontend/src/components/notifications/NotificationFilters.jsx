import { NOTIFICATION_FILTERS } from "./notification.constant";

export default function NotificationFilters({ activeFilter, onChange }) {
  return (
    <div className="flex gap-2 border-b border-zinc-100 px-5 py-3">
      {NOTIFICATION_FILTERS.map((filter) => (
        <button
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${activeFilter === filter.value ? "bg-indigo-50 text-indigo-700" : "text-zinc-500 hover:bg-zinc-100"}`}
          key={filter.value}
          onClick={() => onChange(filter.value)}
          type="button"
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
