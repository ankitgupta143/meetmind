import { CalendarDays, Mail, Sparkles, Star } from "lucide-react";
import { workspaceStats } from "./data/workspaceData";

const icons = {
  calendar: CalendarDays,
  star: Star,
  sparkles: Sparkles,
  mail: Mail,
};
const colors = {
  indigo: "bg-indigo-500/15 border-indigo-500/30 text-indigo-400",
  amber: "bg-amber-500/15 border-amber-500/30 text-amber-400",
  violet: "bg-violet-500/15 border-violet-500/30 text-violet-400",
  emerald: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
};

export default function WorkspaceStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {workspaceStats.map((stat) => {
        const Icon = icons[stat.icon];
        return (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/[0.08] bg-slate-950/60 p-5 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-indigo-500/30 hover:-translate-y-0.5"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colors[stat.color]}`}
            >
              <Icon size={18} />
            </div>
            <p className="mt-4 text-2xl sm:text-3xl font-extrabold text-white">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">
              {stat.label}
            </p>
          </div>
        );
      })}
    </section>
  );
}
