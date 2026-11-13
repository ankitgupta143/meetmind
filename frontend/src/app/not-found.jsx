"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Compass,
  Home,
  LayoutDashboard,
  Puzzle,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickLinks = [
    {
      title: "Dashboard",
      description: "Overview of your hours saved & metrics",
      href: "/dashboard",
      icon: LayoutDashboard,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Meetings",
      description: "Browse all uploaded audio & video calls",
      href: "/meetings",
      icon: CalendarDays,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    },
    {
      title: "AI Assistant",
      description: "Ask questions across your transcripts",
      href: "/ai-assistant",
      icon: Sparkles,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
    {
      title: "Workspace",
      description: "Track action items, decisions & tags",
      href: "/workspace",
      icon: Users,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      {/* Ambient background glow effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/4 h-[450px] w-[450px] rounded-full bg-indigo-600/15 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-1/4 h-[450px] w-[450px] rounded-full bg-violet-600/15 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-[160px]"
      />

      {/* Top Brand Bar */}
      <header className="relative z-10 flex w-full max-w-5xl items-center justify-between">
        <Link
          className="group flex items-center gap-3 transition"
          href="/"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-md shadow-indigo-500/25 transition group-hover:scale-105">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              MeetMind
            </span>
            <span className="block text-[11px] font-medium text-slate-400">
              AI meeting intelligence
            </span>
          </div>
        </Link>

        <Link
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition hover:bg-white/[0.08] hover:text-white"
          href="/"
        >
          <Home size={14} />
          <span>Home</span>
        </Link>
      </header>

      {/* Main 404 Hero Container */}
      <main className="relative z-10 my-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Floating status pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 shadow-sm backdrop-blur-md">
          <Compass className="animate-spin text-indigo-400" size={14} style={{ animationDuration: "12s" }} />
          <span>Error 404 &bull; Page Not Found</span>
        </div>

        {/* Large Gradient 404 Number */}
        <h1 className="mt-4 font-mono text-7xl font-extrabold tracking-tight sm:text-8xl md:text-9xl">
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(99,102,241,0.25)]">
            404
          </span>
        </h1>

        {/* Heading & Subtext */}
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Lost in the transcripts?
        </h2>
        <p className="mt-3 max-w-lg text-sm text-slate-400 sm:text-base leading-relaxed">
          The page or meeting you&apos;re looking for doesn&apos;t exist, was deleted, or the URL might be mistyped. Let&apos;s get you back on track.
        </p>

        {/* Search Input Shortcut */}
        <form
          className="mt-6 flex w-full max-w-md items-center rounded-2xl border border-white/10 bg-slate-900/80 p-1.5 shadow-2xl backdrop-blur-xl transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20"
          onSubmit={handleSearch}
        >
          <div className="flex items-center pl-3 text-slate-400">
            <Search size={18} />
          </div>
          <input
            aria-label="Search meetings or notes"
            className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meetings, topics, or notes..."
            type="text"
            value={searchQuery}
          />
          <button
            className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            type="submit"
          >
            Search
          </button>
        </form>

        {/* Primary Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-xs font-semibold text-slate-300 backdrop-blur-md transition hover:bg-white/[0.1] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            onClick={() => router.back()}
            type="button"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <Link
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 hover:shadow-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            href="/dashboard"
          >
            <LayoutDashboard size={16} />
            <span>Go to Dashboard</span>
          </Link>
        </div>

        {/* Quick Navigation Cards */}
        <div className="mt-10 w-full max-w-xl text-left">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-slate-500">
            Or jump directly to a section
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  className="group flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-slate-900/50 p-3.5 backdrop-blur-md transition hover:border-white/15 hover:bg-white/[0.04]"
                  href={item.href}
                  key={item.title}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${item.color} transition group-hover:scale-105`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white group-hover:text-indigo-300 transition">
                      {item.title}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} MeetMind &bull; AI Meeting Intelligence</p>
      </footer>
    </div>
  );
}
