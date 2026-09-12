import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { pricing } from "./data/pricing";

export default function PricingSection() {
  return (
    <section id="pricing" className="relative border-y border-white/[0.06] bg-slate-950/60 py-24 sm:py-32 backdrop-blur-md">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-full max-w-4xl bg-indigo-600/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
            Transparent pricing
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Plans that scale with{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent">
              your ambition
            </span>
            .
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Start free, upgrade when your team needs unlimited transcription and executive AI intelligence.
          </p>
        </div>

        <div className="relative mt-16 grid gap-6 lg:grid-cols-3 items-stretch">
          {pricing.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] p-7 sm:p-8 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "border-2 border-indigo-500/60 bg-gradient-to-b from-indigo-950/50 via-slate-900/80 to-slate-950 shadow-[0_20px_50px_-10px_rgba(99,102,241,0.3)]"
                  : "border border-white/[0.08] bg-gradient-to-b from-slate-900/65 via-slate-900/40 to-slate-950/70 shadow-xl"
              }`}
            >
              {/* Top highlight line */}
              <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 px-3.5 py-1 text-[11px] font-bold text-white shadow-md shadow-indigo-500/30">
                  <Sparkles size={12} />
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                    {plan.price}
                  </span>
                  {plan.price.startsWith("$") && (
                    <span className="text-sm font-medium text-slate-400">/month</span>
                  )}
                </div>

                <Link
                  href="/dashboard"
                  className={`mt-8 block w-full rounded-2xl py-3.5 text-center text-sm font-bold transition-all duration-300 active:scale-95 ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:brightness-110"
                      : "border border-white/[0.1] bg-white/[0.05] text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="mt-8 border-t border-white/[0.06] pt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    What&apos;s included:
                  </p>
                  <ul className="mt-4 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <div className="flex size-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                          <Check className="size-3" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

