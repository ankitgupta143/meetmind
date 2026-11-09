"use client";

import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import UploadMeetingModal from "../upload/UploadMeetingModal";
import ExportDrawer from "../export/ExportDrawer";

const AppLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-x-clip bg-background text-foreground selection:bg-indigo-500/30 selection:text-white">
        <div className="mx-auto flex min-h-screen max-w-[1800px] items-start gap-0 lg:gap-5 lg:p-5">
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:min-h-[calc(100vh-40px)]">
            <Navbar onMenuClick={() => setMobileOpen(true)} />

            <motion.main
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-0 flex-1 overflow-visible border-t border-border bg-background px-4 py-6 sm:px-6 lg:mt-3 lg:rounded-xl lg:border lg:bg-card lg:p-7"
            >
              {children}
            </motion.main>
          </div>

          <UploadMeetingModal />
          <ExportDrawer />
        </div>
      </div>
    </MotionConfig>
  );
};

export default AppLayout;

