"use client";

import { useState } from "react";
import { Upload, Video } from "lucide-react";
import { useUploadModal } from "@/context/UploadModalContext";
import ImportGoogleMeetModal from "./modals/ImportGoogleMeetModal";

export default function MeetingsHeader({ onImportSuccess }) {
  const { setOpen } = useUploadModal();
  const [googleMeetModalOpen, setGoogleMeetModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5 sm:text-3xl">
            Meetings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse, search and deep-dive into AI-processed conversation intelligence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setGoogleMeetModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-raised px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-hover active:scale-[0.98]"
          >
            <Video size={16} className="text-emerald-400 transition-transform group-hover:scale-110" />
            <span>Import Google Meet</span>
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-indigo-200 active:scale-[0.98]"
          >
            <Upload size={16} className="transition-transform group-hover:scale-110" />
            <span>Upload Meeting</span>
          </button>
        </div>
      </div>

      <ImportGoogleMeetModal
        isOpen={googleMeetModalOpen}
        onClose={() => setGoogleMeetModalOpen(false)}
        onImportSuccess={onImportSuccess}
      />
    </>
  );
}
