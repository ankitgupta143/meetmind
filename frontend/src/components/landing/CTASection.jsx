import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative px-6 pb-24 sm:pb-32">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] border border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-violet-950/80 px-7 py-16 text-center text-white shadow-[0_25px_70px_-15px_rgba(99,102,241,0.3)] backdrop-blur-2xl sm:px-14 sm:py-24">
        {/* Top specular highlight */}
        <div className="pointer-events-none absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
        
        {/* Background aurora spots */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-[90px]" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-indigo-300">
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            Your meetings deserve better
          </div>

          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ready to give your team{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent">
              superpowers
            </span>
            ?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-slate-300">
            Start free today. Upload your first meeting in 30 seconds with zero credit card required.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-7 py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-indigo-600/35 transition-all duration-300 hover:shadow-indigo-600/55 hover:-translate-y-0.5 active:scale-95"
            >
              <span>Get Started Now</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

