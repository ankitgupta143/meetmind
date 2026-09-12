import { features } from "./data/features";

export default function FeaturesSection() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-full max-w-3xl bg-indigo-600/10 blur-[130px]" />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
          Everything you need
        </p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Make every meeting{" "}
          <span className="bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent">
            count
          </span>
          .
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-300">
          From multi-speaker conversations to instant executive clarity, MeetMind handles the heavy lifting automatically.
        </p>
      </div>

      <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-slate-900/65 via-slate-900/40 to-slate-950/70 p-7 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.25)]"
          >
            {/* Top specular highlight line */}
            <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity duration-300 group-hover:via-indigo-400/50" />

            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600/20 via-indigo-500/15 to-violet-500/20 border border-indigo-500/30 text-indigo-400 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-300 group-hover:border-cyan-500/40">
              <Icon className="size-6" />
            </div>

            <h3 className="mt-6 text-lg font-bold text-white transition-colors group-hover:text-indigo-200">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

