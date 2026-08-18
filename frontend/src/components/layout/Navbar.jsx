"use client"

import { Search, UploadCloud, LogOut } from "lucide-react";
import { useUploadModal } from "@/context/UploadModalContext";
import { NotificationDrawer } from "@/components/notifications";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { setOpen } = useUploadModal();
  const { user, logout } = useAuth();
  
  const avatarLetter = user?.firstName?.charAt(0).toUpperCase() || "U";

  return (
    <header className="flex h-20 items-center justify-between rounded-[1.75rem] border border-white/70 bg-white/75 px-5 shadow-[0_12px_35px_-22px_rgba(40,43,80,0.35)] backdrop-blur-xl sm:px-8 dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="relative hidden w-[420px] sm:block">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          size={18}
        />

        <input
          placeholder="Search meetings..."
          className="h-12 w-full rounded-2xl border border-zinc-200/80 bg-zinc-50/70 pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800/60"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-600/30"
        >
          <UploadCloud size={18} />
          Upload Meeting
        </button>

        <NotificationDrawer />

        {user && (
          <div className="flex items-center gap-3 border-l border-zinc-200/80 pl-4 dark:border-zinc-700">
            <span className="hidden text-sm font-semibold text-zinc-700 dark:text-zinc-300 md:block">
              {user.firstName}
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white shadow-md">
              {avatarLetter}
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
