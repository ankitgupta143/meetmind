import { FileText, Mail, Save } from "lucide-react";

const icons = { save: Save, report: FileText, mail: Mail };

export default function ActivityCard({ activity }) {
  const Icon = icons[activity.type] || Save;
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-slate-900/40 p-3.5 transition hover:border-indigo-500/30 hover:bg-slate-900/70">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-white">
          {activity.title}
        </p>
        <p className="mt-0.5 font-mono text-[10px] text-slate-400">{activity.time}</p>
      </div>
    </div>
  );
}
