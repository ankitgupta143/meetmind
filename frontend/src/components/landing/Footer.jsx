import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const groups = {
    Product: ["Features", "Pricing", "Integrations", "Roadmap"],
    Company: ["About Us", "Careers", "Security", "Contact"],
    Resources: ["Documentation", "API Reference", "Guides", "Community"],
    Legal: ["Privacy Policy", "Terms of Service", "SOC 2 Type II", "Cookie Settings"],
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#05080e] text-slate-400">
      {/* Top subtle highlight divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[2fr_repeat(4,1fr)]">
        <div>
          <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-white">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="size-4" />
            </div>
            <span>
              Meet<span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">Mind</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-xs sm:text-sm leading-relaxed text-slate-400">
            Next-generation AI meeting intelligence engineered for modern high-velocity teams.
          </p>
          <div className="mt-6 flex gap-3 text-xs font-semibold text-slate-400">
            <a href="#twitter" className="rounded-lg border border-white/10 px-3 py-1.5 transition hover:text-white hover:border-white/20">
              Twitter
            </a>
            <a href="#linkedin" className="rounded-lg border border-white/10 px-3 py-1.5 transition hover:text-white hover:border-white/20">
              LinkedIn
            </a>
            <a href="#github" className="rounded-lg border border-white/10 px-3 py-1.5 transition hover:text-white hover:border-white/20">
              GitHub
            </a>
          </div>
        </div>

        {Object.entries(groups).map(([group, links]) => (
          <div key={group}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {group}
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
                    className="transition-colors hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.04] py-6 text-center text-xs text-slate-400">
        © 2026 MeetMind Intelligence Inc. All rights reserved.
      </div>
    </footer>
  );
}

