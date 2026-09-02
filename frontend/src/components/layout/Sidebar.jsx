"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Zap,
} from "lucide-react";

const menu = [
  { title: "Dashboard",    href: "/dashboard",    icon: LayoutDashboard },
  { title: "Meetings",     href: "/meetings",     icon: CalendarDays    },
  { title: "AI Assistant", href: "/ai-assistant", icon: Sparkles, badge: "AI" },
  { title: "Search",       href: "/search",       icon: Search          },
  { title: "Workspace",    href: "/workspace",    icon: Users           },
  { title: "Integrations", href: "/integrations", icon: Puzzle          },
];

function SidebarContent({ collapsed, setCollapsed, onClose }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between">
      {/* Header */}
      <div>
        <div className={`px-4 pt-5 ${collapsed ? "flex flex-col items-center" : ""}`}>
          {collapsed ? (
            <>
              <div className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-600/30">
                <Sparkles size={20} className="animate-pulse" />
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
                </span>
              </div>
              <button
                onClick={() => setCollapsed(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                title="Expand sidebar"
              >
                <PanelLeftOpen size={18} />
              </button>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <Link href="/" className="group flex items-center gap-3">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-transform duration-300 group-hover:scale-105">
                  <Sparkles size={20} />
                  <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold tracking-tight text-white">MeetMind</h2>
                    <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">PRO</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400">AI Meeting Intelligence</p>
                </div>
              </Link>

              {onClose ? (
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              ) : (
                <button
                  onClick={() => setCollapsed(true)}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose size={18} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 space-y-1.5 px-3">
          {menu.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose ?? undefined}
                className={`relative group flex items-center rounded-xl py-2.5 transition-all duration-200 ${
                  collapsed ? "justify-center px-0" : "gap-3.5 px-3.5"
                } ${
                  isActive
                    ? "text-white font-medium"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/90 via-indigo-600/70 to-violet-600/80 shadow-md shadow-indigo-600/25 border border-indigo-400/20"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-center">
                  <item.icon
                    size={19}
                    className={`transition-transform duration-200 ${
                      isActive ? "text-white scale-105" : "text-slate-400 group-hover:text-slate-200 group-hover:scale-110"
                    }`}
                  />
                </div>

                {!collapsed && (
                  <div className="relative z-10 flex flex-1 items-center justify-between">
                    <span className="text-sm">{item.title}</span>
                    {item.badge && (
                      <span className="rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-3 pb-4">
        {!collapsed && (
          <div className="mb-3 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-violet-950/30 p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-indigo-300">
              <Zap size={15} className="text-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold">AI Copilot Ready</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              Auto-diarization & sentiment analytics active.
            </p>
          </div>
        )}

        <div className="border-t border-white/[0.08] pt-3">
          <Link
            href="/settings"
            onClick={onClose ?? undefined}
            className={`group flex items-center rounded-xl py-2.5 text-slate-400 transition-all duration-200 hover:bg-white/[0.05] hover:text-white ${
              collapsed ? "justify-center px-0" : "gap-3.5 px-3.5"
            }`}
          >
            <Settings
              size={19}
              className="transition-transform duration-300 group-hover:rotate-90 text-slate-400 group-hover:text-white"
            />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar - instant snappy toggle */}
      <aside
        className={`sticky top-5 md:top-6 self-start hidden h-[calc(100vh-40px)] md:h-[calc(100vh-48px)] flex-shrink-0 rounded-[2rem] border border-white/[0.08] bg-slate-950/70 p-2 text-slate-100 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl lg:flex lg:flex-col ${
          collapsed ? "w-20" : "w-[260px]"
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onClose={null}
        />
      </aside>

      {/* Mobile drawer with smooth spring slide-in & fade */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col rounded-r-[2.5rem] border-r border-white/10 bg-slate-950/95 p-3 text-slate-100 shadow-[8px_0_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl lg:hidden"
            >
              <SidebarContent
                collapsed={false}
                setCollapsed={() => {}}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
