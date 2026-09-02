const colorMap = {
  "bg-indigo-50 text-indigo-600": "bg-indigo-500/15 border-indigo-500/30 text-indigo-400",
  "bg-emerald-50 text-emerald-600": "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
  "bg-violet-50 text-violet-600": "bg-violet-500/15 border-violet-500/30 text-violet-400",
  "bg-amber-50 text-amber-600": "bg-amber-500/15 border-amber-500/30 text-amber-400",
};

const ProfileStats = ({ stats }) => (
  <section>
    <div className="mb-3.5">
      <h2 className="text-base font-bold text-white">
        Your Activity Footprint
      </h2>
      <p className="mt-0.5 text-xs text-slate-400">
        Snapshot of recordings processed and meeting insights generated.
      </p>
    </div>
    <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colorClass = colorMap[stat.color] || "bg-indigo-500/15 border-indigo-500/30 text-indigo-400";
        return (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/[0.08] bg-slate-950/60 p-4 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-indigo-500/30 hover:-translate-y-0.5"
          >
            <span
              className={`flex size-9 items-center justify-center rounded-xl border ${colorClass}`}
            >
              <Icon className="size-4" />
            </span>
            <p className="mt-3.5 text-2xl font-extrabold text-white">{stat.value}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{stat.label}</p>
          </div>
        );
      })}
    </div>
  </section>
);

export default ProfileStats;
