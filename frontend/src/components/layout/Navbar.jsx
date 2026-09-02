"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, UploadCloud, LogOut, Menu, Sparkles, Command } from "lucide-react";
import { useUploadModal } from "@/context/UploadModalContext";
import { NotificationDrawer } from "@/components/notifications";
import { useAuth } from "@/context/AuthContext";

const Navbar = ({ onMenuClick }) => {
  const router = useRouter();
  const { setOpen } = useUploadModal();
  const { user, logout } = useAuth();
  const [searchVal, setSearchVal] = useState("");

  const avatarUrl = user?.avatar?.url;

  const avatarInitials =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <header className="flex h-20 items-center justify-between rounded-[2rem] border border-white/[0.08] bg-slate-900/60 px-5 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:px-7">
      {/* Hamburger — mobile/tablet only */}
      <button
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* Search bar — desktop only */}
      <div className="relative hidden w-[440px] lg:block">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={17}
        />

        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={handleSearchSubmit}
          placeholder="Search meetings, transcripts, action items..."
          className="h-11 w-full rounded-xl border border-white/[0.08] bg-slate-950/60 pl-11 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500/50 focus:bg-slate-950/90 focus:ring-2 focus:ring-indigo-500/20"
        />

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          <span>↵</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setOpen(true)}
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          <UploadCloud size={17} className="transition-transform group-hover:scale-110" />
          <span className="hidden sm:inline">Upload Meeting</span>
          <span className="sm:hidden">Upload</span>
        </button>

        <NotificationDrawer />

        {user && (
          <div className="flex items-center gap-3 border-l border-white/[0.08] pl-3 sm:pl-4">
            <span className="hidden text-sm font-semibold text-slate-200 md:block">
              {user.firstName}
            </span>

            {/* Avatar with glowing ring */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 font-semibold text-white shadow-md ring-2 ring-indigo-500/30">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "User Avatar"}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs">{avatarInitials}</span>
              )}
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
            >
              <LogOut size={17} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;