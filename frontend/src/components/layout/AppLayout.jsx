"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import UploadMeetingModal from "../upload/UploadMeetingModal";
import ExportDrawer from "../export/ExportDrawer";

const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-transparent dark:bg-zinc-950">
      <div className="flex gap-5 p-4 sm:p-6">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className="flex min-w-0 min-h-[calc(100vh-48px)] flex-1 flex-col">
          <Navbar onMenuClick={() => setMobileOpen(true)} />

          <main className="mt-5 min-w-0 flex-1 rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-[0_20px_60px_-28px_rgba(40,43,80,0.28)] backdrop-blur-xl sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/80">
            {children}
          </main>
        </div>

        <UploadMeetingModal />
        <ExportDrawer />
      </div>
    </div>
  );
};

export default AppLayout;
