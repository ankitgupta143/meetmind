"use client";

import { createContext, useContext, useState } from "react";

const ExportDrawerContext = createContext();

export function ExportDrawerProvider({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <ExportDrawerContext.Provider
      value={{
        open,
        setOpen,
      }}
    >
      {children}
    </ExportDrawerContext.Provider>
  );
}

export function useExportDrawer() {
  return useContext(ExportDrawerContext);
}