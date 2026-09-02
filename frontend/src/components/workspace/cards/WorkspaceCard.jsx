import { ArrowUpRight } from "lucide-react";

export default function WorkspaceCard({ item, Icon }) {
  return (
    <button className="group w-full rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-5 text-left shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900/80 cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <Icon size={16} />
        </div>
        <ArrowUpRight
          size={16}
          className="text-slate-500 transition group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>

      <h3 className="mt-4 text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
        {item.title}
      </h3>
      <p className="mt-1 text-xs text-slate-400">{item.meta}</p>

      <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
        <span>{item.detail}</span>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 font-medium text-slate-300">
          {item.badge}
        </span>
      </div>
    </button>
  );
}
