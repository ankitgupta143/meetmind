import { FileText, Mail, Save } from "lucide-react";

const icons = { save: Save, report: FileText, mail: Mail };

export default function ActivityCard({ activity }) {
  const Icon = icons[activity.type] || Save;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-500/10">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <p className="font-medium text-zinc-900 dark:text-white">
          {activity.title}
        </p>
        <p className="mt-1 text-sm text-zinc-500">{activity.time}</p>
      </div>
    </div>
  );
}
