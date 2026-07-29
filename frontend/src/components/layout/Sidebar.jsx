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
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`sticky top-6 hidden h-[calc(100vh-48px)] rounded-3xl bg-white shadow-sm transition-all duration-300 lg:flex lg:flex-col dark:bg-zinc-900 ${
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
              className="rounded-xl p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
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

                <p className="text-xs text-zinc-500">AI Meeting Intelligence</p>
              </div>
            </div>

            <button
              onClick={() => setCollapsed(true)}
              className="rounded-xl p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
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
      <div className="border-t p-5">
        <button
          className={`group flex w-full items-center rounded-2xl py-3 text-zinc-600 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white ${
            collapsed ? "justify-center" : "gap-4 px-4"
          }`}
        >
          <Settings
            size={20}
            className="transition-transform duration-200 group-hover:rotate-90"
          />

          {!collapsed && <span className="font-medium">Settings</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
