"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Search,
  Users,
  Settings,
  Puzzle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Meetings",
    href: "/meetings",
    icon: CalendarDays,
  },
  {
    title: "AI Assistant",
    href: "/ai-assistant",
    icon: Sparkles,
  },
  {
    title: "Search",
    href: "/search",
    icon: Search,
  },
  {
    title: "Workspace",
    href: "/workspace",
    icon: Users,
  },
  {
    title: "Integrations",
    href: "/integrations",
    icon: Puzzle,
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`sticky top-6 hidden h-[calc(100vh-48px)] rounded-[2rem] border border-white/10 bg-slate-950 p-1.5 text-slate-100 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.55)] transition-all duration-300 lg:flex lg:flex-col ${
        collapsed ? "w-20" : "w-[280px]"
      }`}
    >
      {/* Header */}
      <div
        className={`px-5 pt-6 ${collapsed ? "flex flex-col items-center" : ""}`}
      >
        {collapsed ? (
          <>
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
              <Sparkles size={24} />
            </div>

            <button
              onClick={() => setCollapsed(false)}
              className="rounded-xl p-2 transition hover:bg-white/10"
            >
              <PanelLeftOpen size={20} />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
                <Sparkles size={24} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">MeetMind</h1>

                <p className="text-xs text-slate-400">AI Meeting Intelligence</p>
              </div>
            </div>

            <button
              onClick={() => setCollapsed(true)}
              className="rounded-xl p-2 transition hover:bg-white/10"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-10 flex-1 px-4">
        {menu.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`group mb-2 flex w-full items-center rounded-2xl py-3 transition-all duration-200 ${
              collapsed ? "justify-center" : "gap-4 px-4"
            } ${
              pathname === item.href
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-950/40"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon
              size={20}
              className={`transition-transform duration-200 ${
                pathname !== item.href && "group-hover:scale-110"
              }`}
            />

            {!collapsed && <span className="font-medium">{item.title}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-5">
        <Link
          href="/settings"
          className={`group flex w-full items-center rounded-2xl py-3 text-slate-400 transition-all duration-200 hover:bg-white/10 hover:text-white ${
            collapsed ? "justify-center" : "gap-4 px-4"
          }`}
        >
          <Settings
            size={20}
            className="transition-transform duration-200 group-hover:rotate-90"
          />

          {!collapsed && <span className="font-medium">Settings</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
