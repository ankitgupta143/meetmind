"use client"

import { Search, UploadCloud } from "lucide-react";
import { useUploadModal } from "@/context/UploadModalContext";
import { NotificationDrawer } from "@/components/notifications";

const Navbar = () => {
  const { setOpen } = useUploadModal();
  return (
    <header className="flex h-20 items-center justify-between rounded-3xl bg-white px-8 shadow-sm dark:bg-zinc-900">
      <div className="relative w-[420px]">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          size={18}
        />

        <input
          placeholder="Search meetings..."
          className="h-12 w-full rounded-2xl border bg-transparent pl-11 pr-4 outline-none transition focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg"
        >
          <UploadCloud size={18} />
          Upload Meeting
        </button>

        <NotificationDrawer />

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
};

export default Navbar;
