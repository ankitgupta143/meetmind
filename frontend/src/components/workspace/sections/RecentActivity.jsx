import { recentActivity } from "../data/workspaceData";
import ActivityCard from "../cards/ActivityCard";

export default function RecentActivity() {
  return (
    <section className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl">
      <h2 className="text-sm font-bold text-white">Recent Activity</h2>
      <p className="mt-0.5 text-xs text-slate-400">Chronological history of workspace changes.</p>
      <div className="mt-4 space-y-2.5">
        {recentActivity.map((activity) => (
          <ActivityCard key={activity.title} activity={activity} />
        ))}
      </div>
    </section>
  );
}
