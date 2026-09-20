"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { navLinks } from "./constants";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-slate-950/75 backdrop-blur-xl transition-all">
      {/* Top subtle highlight */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5 font-bold">
          <div className="relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="size-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
            </span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Meet<span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">Mind</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              className="text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white"
              href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white sm:block"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:scale-95"
          >
            <span>Start Free</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

