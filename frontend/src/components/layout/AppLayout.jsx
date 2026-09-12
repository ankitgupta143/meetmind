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
    <div className="relative min-h-screen overflow-x-clip bg-[#070a13] text-slate-100 selection:bg-indigo-500/30 selection:text-white">
      {/* Top Ambient Glow Beam */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 via-purple-500/40 to-transparent" />
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 z-20 h-24 w-3/4 max-w-4xl bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-2xl" />

      {/* Dynamic Ambient Background Aura Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-indigo-600/15 via-indigo-900/10 to-transparent blur-[130px]" />
        <div className="absolute right-[5%] top-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-violet-600/12 via-purple-900/10 to-transparent blur-[140px]" />
        <div className="absolute bottom-[5%] left-[25%] h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-cyan-600/10 via-teal-900/5 to-transparent blur-[150px]" />
        
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)]" />
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
            className="mt-5 min-w-0 flex-1 rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-950/70 p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-7 md:p-8 relative overflow-hidden"
          >
            {/* Top specular highlight line */}
            <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
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

