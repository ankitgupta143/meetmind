import { CalendarDays, Mail, Sparkles, Star } from "lucide-react";
import { workspaceStats } from "./data/workspaceData";

const icons = {
  calendar: CalendarDays,
  star: Star,
  sparkles: Sparkles,
  mail: Mail,
};
const colors = {
  indigo: "bg-indigo-50 text-indigo-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

export default function WorkspaceStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {workspaceStats.map((stat) => {
        const Icon = icons[stat.icon];
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[stat.color]}`}
            >
              <Icon size={19} />
            </div>
            <p className="mt-5 text-3xl font-bold text-zinc-900 dark:text-white">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-medium text-zinc-500">
              {stat.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}
