import { BrainCircuit, Search, Share2, Upload } from "lucide-react";

const steps = [
  [
    "01",
    "Upload Meeting",
    "Drop in any MP4, MP3, WAV or sync automatically with your Google Calendar.",
    Upload,
  ],
  [
    "02",
    "AI Diarization",
    "Whisper & Gemini distinguish speakers, tone, and extract crucial decisions.",
    BrainCircuit,
  ],
  [
    "03",
    "Instant Intelligence",
    "Search across all past conversations and ask questions in plain English.",
    Search,
  ],
  [
    "04",
    "Share & Automate",
    "Export to Slack, Notion, or Linear with one-click automated task creation.",
    Share2,
  ],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative border-y border-white/[0.06] bg-slate-950/60 py-24 sm:py-32 backdrop-blur-md">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
            Simple by design
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            From conversation to{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent">
              momentum
            </span>
            .
          </h2>
          <p className="mt-3 text-base text-slate-300">
            A frictionless pipeline engineered to turn audio into high-conviction team execution.
          </p>
        </div>

        {/* Step Cards with Pipeline */}
        <div className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Subtle connecting gradient line for desktop */}
          <div className="pointer-events-none absolute top-1/2 left-0 right-0 hidden h-[1px] -translate-y-10 bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-cyan-500/30 lg:block" />

          {steps.map(([num, title, description, Icon]) => (
            <div
              key={num}
              className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-950/80 p-7 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)]"
            >
              {/* Top highlight */}
              <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity group-hover:via-indigo-400/50" />

              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold bg-gradient-to-br from-white/30 to-white/5 bg-clip-text text-transparent">
                  {num}
                </span>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600/20 to-violet-500/20 border border-indigo-500/30 text-indigo-400 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:text-cyan-300">
                  <Icon className="size-5" />
                </span>
              </div>

              <h3 className="mt-6 text-lg font-bold text-white transition-colors group-hover:text-indigo-200">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

