import Link from "next/link";
import { BarChart3, CheckCircle2, Sparkles, BrainCircuit } from "lucide-react";

export default function AuthSidePanel() {
  return (
    <aside className="order-first hidden bg-gradient-to-br from-indigo-950/80 via-slate-950 to-violet-950/80 p-10 lg:p-14 text-white lg:flex lg:flex-col border-r border-white/[0.08] relative overflow-hidden">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

      <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/30">
          <Sparkles className="size-4 text-white" />
        </span>
        <span className="text-white">MeetMind <span className="text-cyan-400">AI</span></span>
      </Link>

      <div className="my-auto">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
          <BrainCircuit size={14} className="text-cyan-400" /> Continuous Intelligence
        </p>

        <h1 className="mt-3 max-w-md text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Every conversation turns into execution.
        </h1>

        <p className="mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-slate-400">
          Capture audio diarization, executive summaries, decisions, and action items with automated AI agents.
        </p>

        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-200">Weekly Intelligence Pulse</p>
            <BarChart3 className="size-4 text-indigo-400" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              ["42", "Meetings"],
              ["138", "AI Chats"],
              ["62", "Dossiers"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-white/[0.04] bg-slate-900/60 p-2.5 text-center">
                <p className="text-lg font-extrabold text-white">{value}</p>
                <p className="text-[10px] font-semibold text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-2 text-xs text-slate-300">
          {[
            "Zero-loss transcript diarization",
            "OmniSearch across all past discussions",
            "Automatic task assignment & sync",
          ].map((item) => (
            <p key={item} className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>{item}</span>
            </p>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-slate-500 font-mono">
        © 2026 MeetMind AI Corp • High-speed meeting intelligence
      </p>
    </aside>
  );
}
