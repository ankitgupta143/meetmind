"use client";

import { createContext, useContext, useState, useCallback } from "react";

const ExportDrawerContext = createContext();

export function ExportDrawerProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [meeting, setMeeting] = useState(null);

  const openExport = useCallback((meetingData) => {
    setMeeting(meetingData || null);
    setOpen(true);
  }, []);

  const closeExport = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <ExportDrawerContext.Provider
      value={{
        open,
        setOpen,
        meeting,
        setMeeting,
        openExport,
        closeExport,
      }}
    >
      {children}
    </ExportDrawerContext.Provider>
  );
}

export function useExportDrawer() {
  const context = useContext(ExportDrawerContext);
  if (!context) {
    return {
      open: false,
      setOpen: () => {},
      meeting: null,
      setMeeting: () => {},
      openExport: () => {},
      closeExport: () => {},
    };
  }
  return context;
}
