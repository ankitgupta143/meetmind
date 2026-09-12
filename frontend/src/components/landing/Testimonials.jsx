import { Star } from "lucide-react";
import { testimonials } from "./data/testimonials";

export default function Testimonials() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute right-1/3 top-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
          Loved by thoughtful teams
        </p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Built for high-conviction{" "}
          <span className="bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent">
            leaders
          </span>
          .
        </h2>
      </div>

      <div className="relative mt-16 grid gap-6 md:grid-cols-3">
        {testimonials.map((item) => (
          <figure
            key={item.name}
            className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-950/80 p-7 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)]"
          >
            {/* Top highlight line */}
            <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity group-hover:via-indigo-400/50" />

            <div className="flex gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <blockquote className="mt-5 text-sm sm:text-base leading-relaxed text-slate-300">
              “{item.quote}”
            </blockquote>

            <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
              <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-md shadow-indigo-600/30">
                {item.initials}
              </span>
              <span>
                <span className="block text-sm font-bold text-white">{item.name}</span>
                <span className="block text-xs text-slate-400">{item.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

