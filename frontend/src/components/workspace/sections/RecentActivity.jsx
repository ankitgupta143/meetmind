"use client";

import { Activity } from "lucide-react";
import ActivityCard from "../cards/ActivityCard";

export default function RecentActivity({ activities = [] }) {
  return (
    <section className="rounded-[2.5rem] border border-white/[0.08] bg-slate-950/60 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
          <Activity size={14} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Recent Activity Stream</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Real-time audit of meeting recordings, AI queries, and assigned tasks.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {activities.length === 0 ? (
          <p className="py-4 text-center text-xs text-slate-500">
            No activity recorded yet. Upload a meeting or chat with AI to see events here.
          </p>
        ) : (
          activities.map((activity) => (
            <ActivityCard key={activity.id || activity.title} activity={activity} />
          ))
        )}
      </div>
    </section>
  );
}
