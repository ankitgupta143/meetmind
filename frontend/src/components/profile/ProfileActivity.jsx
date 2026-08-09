import { Clock3 } from "lucide-react";
const ProfileActivity = ({ activity }) => (
  <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
      Recent Activity
    </h2>
    <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
      {activity.map((item) => (
        <div
          key={item.title}
          className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Clock3 className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
export default ProfileActivity;
