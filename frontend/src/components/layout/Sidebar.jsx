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
  X,
} from "lucide-react";

const menu = [
  { title: "Dashboard",    href: "/",             icon: LayoutDashboard },
  { title: "Meetings",     href: "/meetings",     icon: CalendarDays    },
  { title: "AI Assistant", href: "/ai-assistant", icon: Sparkles        },
  { title: "Search",       href: "/search",       icon: Search          },
  { title: "Workspace",    href: "/workspace",    icon: Users           },
  { title: "Integrations", href: "/integrations", icon: Puzzle          },
];

// Shared sidebar content — used in both desktop & mobile drawer
function SidebarContent({ collapsed, setCollapsed, onClose }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={`px-5 pt-6 ${collapsed ? "flex flex-col items-center" : ""}`}>
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
                <h2 className="text-xl font-bold tracking-tight">MeetMind</h2>
                <p className="text-xs text-slate-400">AI Meeting Intelligence</p>
              </div>
            </div>

            {/* Mobile: X close button — Desktop: collapse button */}
            {onClose ? (
              <button
                onClick={onClose}
                className="rounded-xl p-2 transition hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            ) : (
              <button
                onClick={() => setCollapsed(true)}
                className="rounded-xl p-2 transition hover:bg-white/10"
              >
                <PanelLeftClose size={20} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-10 flex-1 px-4">
        {menu.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            onClick={onClose ?? undefined}
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

      {/* Footer — Settings */}
      <div className="border-t border-white/10 p-5">
        <Link
          href="/settings"
          onClick={onClose ?? undefined}
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
    </div>
  );
}

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* ─── Desktop sidebar (lg+) ─── */}
      <aside
        className={`sticky top-6 hidden h-[calc(100vh-48px)] flex-shrink-0 rounded-[2rem] border border-white/10 bg-slate-950 p-1.5 text-slate-100 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.55)] transition-all duration-300 lg:flex lg:flex-col ${
          collapsed ? "w-20" : "w-[280px]"
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onClose={null}
        />
      </aside>

      {/* ─── Mobile/tablet drawer (< lg) ─── */}
      {mobileOpen && (
        <>
          {/* Dark backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in panel */}
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col rounded-r-[2rem] bg-slate-950 p-1.5 text-slate-100 shadow-[4px_0_40px_rgba(15,23,42,0.5)] lg:hidden">
            <SidebarContent
              collapsed={false}
              setCollapsed={() => {}}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
