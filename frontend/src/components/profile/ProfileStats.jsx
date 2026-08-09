const ProfileStats = ({ stats }) => (
  <section>
    <div className="mb-4">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
        Your activity
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        A snapshot of how you use MeetMind.
      </p>
    </div>
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span
              className={`flex size-10 items-center justify-center rounded-xl ${stat.color}`}
            >
              <Icon className="size-5" />
            </span>
            <p className="mt-4 text-2xl font-bold">{stat.value}</p>
            <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
          </div>
        );
      })}
    </div>
  </section>
);
export default ProfileStats;
