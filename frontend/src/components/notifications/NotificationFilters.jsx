import { NOTIFICATION_FILTERS } from "./notification.constant";

export default function NotificationFilters({ activeFilter, onChange }) {
  return (
    <div className="flex gap-2 border-b border-white/[0.08] px-5 py-2.5">
      {NOTIFICATION_FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              isActive
                ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300"
                : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
            }`}
            key={filter.value}
            onClick={() => onChange(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
