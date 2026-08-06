import { ArrowUpRight } from "lucide-react";

export default function WorkspaceCard({ item, Icon }) {
  return (
    <button className="group w-full rounded-2xl border border-zinc-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10">
          <Icon size={18} />
        </div>
        <ArrowUpRight
          size={17}
          className="text-zinc-400 transition group-hover:text-indigo-600"
        />
      </div>
      <h3 className="mt-5 font-semibold text-zinc-900 dark:text-white">
        {item.title}
      </h3>
      <p className="mt-1 text-sm text-zinc-500">{item.meta}</p>
      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-zinc-500">
        <span>{item.detail}</span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {item.badge}
        </span>
      </div>
    </button>
  );
}
