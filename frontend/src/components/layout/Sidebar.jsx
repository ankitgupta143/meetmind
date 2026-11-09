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
                <div className="relative mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-300 text-slate-950">
                <Sparkles size={19} />
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
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-300 text-slate-950 transition-colors group-hover:bg-indigo-200">
                  <Sparkles size={19} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold tracking-tight text-white">MeetMind</h2>
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground">AI meeting intelligence</p>
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
                onClick={() => {
                  if (item.href === "/ai-assistant") {
                    try {
                      sessionStorage.setItem("meetmind_force_new_chat", "true");
                      localStorage.removeItem("meetmind_active_chat_id");
                    } catch (_) {}
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("meetmind:new_chat"));
                    }
                  }
                  onClose?.();
                }}
                className={`relative group flex items-center rounded-xl py-2.5 transition-all duration-200 ${
                  collapsed ? "justify-center px-0" : "gap-3.5 px-3.5"
                } ${
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    className="absolute inset-0 rounded-lg border border-indigo-300/15 bg-indigo-300/10"
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
            <div className="mb-3 rounded-xl border border-border bg-surface-raised p-3.5">
            <div className="flex items-center gap-2 text-foreground">
              <Zap size={15} className="text-indigo-300" />
              <span className="text-xs font-semibold">AI Copilot Ready</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              Auto-diarization & sentiment analytics active.
            </p>
          </div>
        )}

        <div className="border-t border-border pt-3">
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
        className={`sticky top-5 self-start hidden h-[calc(100vh-40px)] flex-shrink-0 rounded-xl border border-border bg-sidebar p-2 text-sidebar-foreground lg:flex lg:flex-col ${
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-border bg-sidebar p-3 text-sidebar-foreground shadow-2xl lg:hidden"
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
