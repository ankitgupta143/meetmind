import { Clock3 } from "lucide-react";

const ProfileActivity = ({ activity }) => (
  <section className="rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl">
    <h2 className="text-base font-bold text-white">
      Recent Activity
    </h2>
    <div className="mt-4 divide-y divide-white/[0.06]">
      {activity.map((item) => (
        <div
          key={item.title}
          className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <Clock3 className="size-3.5" />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-200">{item.title}</p>
            <p className="mt-0.5 font-mono text-[10px] text-slate-400">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ProfileActivity;
