"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import UploadMeetingModal from "../upload/UploadMeetingModal";
import ExportDrawer from "../export/ExportDrawer";

const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#070a12] text-slate-100 selection:bg-indigo-500/30 selection:text-white">
      {/* Dynamic Ambient Background Aura Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[550px] w-[550px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute right-[5%] top-[15%] h-[450px] w-[450px] rounded-full bg-violet-600/12 blur-[130px]" />
        <div className="absolute bottom-[5%] left-[30%] h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[140px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen items-start gap-5 p-3 sm:p-5 md:p-6">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className="flex min-w-0 min-h-[calc(100vh-48px)] flex-1 flex-col">
          <Navbar onMenuClick={() => setMobileOpen(true)} />

          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 min-w-0 flex-1 rounded-[2rem] border border-white/[0.08] bg-slate-900/50 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-7 md:p-8"
          >
            {children}
          </motion.main>
        </div>

        <UploadMeetingModal />
        <ExportDrawer />
      </div>
    </div>
  );
};

export default AppLayout;
