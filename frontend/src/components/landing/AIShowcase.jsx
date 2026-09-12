import { ArrowUp, Bot, Sparkles, CheckCircle2 } from "lucide-react";

export default function AIShowcase() {
  return (
    <section className="relative border-y border-white/[0.06] bg-slate-950/60 py-24 sm:py-32 backdrop-blur-md">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-indigo-600/12 blur-[140px]" />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
            Meet your executive copilot
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ask anything.{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent">
              Remember everything
            </span>
            .
          </h2>
          <p className="mt-4 max-w-md text-base text-slate-300 leading-relaxed">
            MeetMind analyzes cross-meeting nuance, audio inflections, and speaker context so your team can make high-stakes decisions with confidence.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "Instant answers backed by timestamped citations",
              "Automated blocker & risk identification",
              "Personalized action item dossiers per attendee",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={13} />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Chat Mockup */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.1] bg-gradient-to-b from-slate-900/85 via-slate-950/90 to-[#070a13] p-5 sm:p-7 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          {/* Top highlight */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">MeetMind Copilot</p>
                <p className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Gemini Ultra Diarization Model
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 py-5">
            {/* User Prompt */}
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-4 py-3 text-xs sm:text-sm font-medium text-white shadow-lg shadow-indigo-600/25">
              Summarize key takeaways and unassigned action items from today&apos;s product sync.
            </div>

            {/* Copilot Response */}
            <div className="max-w-[95%] rounded-2xl rounded-bl-sm border border-white/[0.08] bg-slate-900/80 p-4 text-xs sm:text-sm leading-relaxed text-slate-200 backdrop-blur-md shadow-md">
              <div className="mb-2.5 flex items-center gap-2 font-bold text-cyan-300">
                <Bot className="size-4 text-cyan-400" />
                <span>Executive Synthesis (42 min audio)</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm">
                The team aligned on the new onboarding flow redesign. Database migration is rescheduled to Friday 10 PM.
              </p>

              <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/30 p-3">
                <p className="font-semibold text-white text-xs">Extracted Action Items:</p>
                <ul className="mt-1.5 space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-indigo-400" />
                    <span><strong>@Sarah:</strong> Finalize Figma prototype by Thursday 5 PM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-cyan-400" />
                    <span><strong>@Alex:</strong> Send staging migration checklist to DevOps</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="flex items-center rounded-xl border border-white/[0.1] bg-slate-900/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-400 backdrop-blur-md">
            <span>Ask anything about any past meeting...</span>
            <button className="ml-auto flex size-7 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 transition hover:scale-105">
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

