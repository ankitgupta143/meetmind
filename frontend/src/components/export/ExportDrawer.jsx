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
  const { open, setOpen, meeting } = useExportDrawer();
  const [format, setFormat] = useState("markdown");
  const [sections, setSections] = useState(EXPORT_SECTIONS);
  const [customFilename, setCustomFilename] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_EXPORT_SETTINGS);
  const [isExporting, setIsExporting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [lastDownloadUrl, setLastDownloadUrl] = useState(null);

  const filename = customFilename !== null ? customFilename : (meeting?.title || DEFAULT_EXPORT_FILENAME);

  const selectedFormat = useMemo(
    () => EXPORT_FORMATS.find((option) => option.value === format) || EXPORT_FORMATS[2],
    [format],
  );

  const closeDrawer = useCallback(() => {
    setOpen(false);
    setIsExporting(false);
    setIsComplete(false);
    setCustomFilename(null);
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

    let meetingId = meeting?._id || meeting?.id;
    if (!meetingId && typeof window !== "undefined") {
      const match = window.location.pathname.match(/\/meetings\/([a-f0-9]{24})/i);
      if (match) {
        meetingId = match[1];
      }
    }

    if (!meetingId) {
      toast.error("Please open a meeting to export its summary report.");
      return;
    }

    setIsExporting(true);
    try {
      const exportFilename = buildExportFilename(filename, selectedFormat.extension);
      const exportResult = await requestMeetingExport({
        meetingId,
        format,
        sections,
        filename: exportFilename,
        settings,
      });

      setIsComplete(true);
      setLastDownloadUrl(exportResult.downloadUrl);
      toast.success("Meeting report downloaded! 🎉", {
        description: `Saved to your Downloads folder: ${exportFilename}`,
        action: exportResult.downloadUrl
          ? {
              label: "Download Again",
              onClick: () =>
                triggerExportDownload(exportResult.downloadUrl, exportResult.filename),
            }
          : undefined,
        duration: 8000,
      });
    } catch (err) {
      console.error("Export generation failed:", err);
      toast.error(
        err.message ||
          err.response?.data?.message ||
          "Failed to prepare your export report. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
  };

  const exportFilename = buildExportFilename(filename, selectedFormat.extension);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div aria-hidden="true" className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} />
          <motion.aside aria-labelledby="export-meeting-title" aria-modal="true" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col border-l border-white/10 bg-slate-950/95 text-slate-100 shadow-2xl backdrop-blur-2xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 360, damping: 34 }} role="dialog">
            <ExportHeader onClose={closeDrawer} />
            <div className="flex-1 overflow-y-auto">
              <ExportFormats format={format} onChange={setFormat} />
              <ExportOptions selectedSections={sections} onToggle={toggleSection} onToggleAll={toggleAllSections} />
              <ExportSettings settings={settings} onChange={(changes) => setSettings((current) => ({ ...current, ...changes }))} />
              <FileNameInput extension={selectedFormat.extension} filename={filename} onChange={setCustomFilename} />
            </div>
            <ExportFooter
              disabled={!sections.length}
              downloadFilename={exportFilename}
              isComplete={isComplete}
              isExporting={isExporting}
              lastDownloadUrl={lastDownloadUrl}
              onExport={handleExport}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
