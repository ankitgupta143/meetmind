import { recentActivity } from "../data/workspaceData";
import ActivityCard from "../cards/ActivityCard";

export default function RecentActivity() {
  return <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Activity</h2><p className="mt-1 text-sm text-zinc-500">A quick look at what changed.</p><div className="mt-5 space-y-3">{recentActivity.map((activity) => <ActivityCard key={activity.title} activity={activity} />)}</div></section>;
}
