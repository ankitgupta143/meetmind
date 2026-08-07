"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { useExportDrawer } from "@/context/ExportDrawerContext";

import ExportFooter from "./ExportFooter";
import ExportFormats from "./ExportFormats";
import ExportHeader from "./ExportHeader";
import ExportOptions from "./ExportOptions";
import ExportSettings from "./ExportSettings";
import FileNameInput from "./FileNameInput";
import { DEFAULT_EXPORT_FILENAME, DEFAULT_EXPORT_SETTINGS, EXPORT_FORMATS, EXPORT_SECTIONS } from "./export.constants";
import { requestMeetingExport, triggerExportDownload } from "./export.service";
import { buildExportFilename } from "./export.utils";

export default function ExportDrawer() {
  const { open, setOpen } = useExportDrawer();
  const [format, setFormat] = useState("pdf");
  const [sections, setSections] = useState(EXPORT_SECTIONS);
  const [filename, setFilename] = useState(DEFAULT_EXPORT_FILENAME);
  const [settings, setSettings] = useState(DEFAULT_EXPORT_SETTINGS);
  const [isExporting, setIsExporting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const selectedFormat = useMemo(
    () => EXPORT_FORMATS.find((option) => option.value === format),
    [format],
  );

  const closeDrawer = useCallback(() => {
    setOpen(false);
    setIsExporting(false);
    setIsComplete(false);
  }, [setOpen]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") closeDrawer();
    };

    if (open) window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, closeDrawer]);

  const toggleSection = (section) => {
    setSections((current) => current.includes(section)
      ? current.filter((item) => item !== section)
      : [...current, section]);
  };

  const toggleAllSections = () => {
    setSections((current) => (current.length ? [] : EXPORT_SECTIONS));
  };

  const handleExport = async () => {
    if (!sections.length || isExporting) return;

    setIsExporting(true);
    try {
      const exportResult = await requestMeetingExport({
        format,
        sections,
        filename: buildExportFilename(filename, selectedFormat.extension),
        settings,
      });
      setIsComplete(true);
      toast.success("Your export is ready", {
        action: exportResult.downloadUrl ? {
          label: "Download",
          onClick: () => triggerExportDownload(exportResult.downloadUrl, exportResult.filename),
        } : undefined,
      });
    } catch {
      toast.error("We couldn't prepare your export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div aria-hidden="true" className="fixed inset-0 z-40 bg-zinc-950/35 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} />
          <motion.aside aria-labelledby="export-meeting-title" aria-modal="true" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col border-l border-zinc-200 bg-white shadow-2xl shadow-zinc-950/15" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 360, damping: 34 }} role="dialog">
            <ExportHeader onClose={closeDrawer} />
            <div className="flex-1 overflow-y-auto">
              <ExportFormats format={format} onChange={setFormat} />
              <ExportOptions selectedSections={sections} onToggle={toggleSection} onToggleAll={toggleAllSections} />
              <ExportSettings settings={settings} onChange={(changes) => setSettings((current) => ({ ...current, ...changes }))} />
              <FileNameInput extension={selectedFormat.extension} filename={filename} onChange={setFilename} />
            </div>
            <ExportFooter disabled={!sections.length} isComplete={isComplete} isExporting={isExporting} onExport={handleExport} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
