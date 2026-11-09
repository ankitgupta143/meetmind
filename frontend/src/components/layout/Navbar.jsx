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
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:rounded-xl lg:border lg:bg-card">
      {/* Hamburger — mobile/tablet only */}
      <button
        onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-hover hover:text-foreground lg:hidden"
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
          className="h-10 w-full rounded-lg border border-border bg-surface-raised pl-10 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-indigo-300/50 focus:ring-2 focus:ring-indigo-300/10"
        />

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <span>↵</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-indigo-200 active:scale-[0.98]"
        >
          <UploadCloud size={17} />
          <span className="hidden sm:inline">Upload Meeting</span>
          <span className="sm:hidden">Upload</span>
        </button>

        <NotificationDrawer />

        {user && (
          <div className="flex items-center gap-3 border-l border-border pl-3 sm:pl-4">
            <span className="hidden text-sm font-medium text-foreground md:block">
              {user.firstName}
            </span>

            {/* Avatar with glowing ring */}
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-300 font-semibold text-slate-950">
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
