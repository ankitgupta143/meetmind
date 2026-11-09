"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UPLOAD_STEPS } from "@/constants/upload";
import { X } from "lucide-react";
import { useUploadModal } from "@/context/UploadModalContext";

import UploadDropzone from "./UploadDropzone";
import UploadProgress from "./UploadProgress";
import AIProcessing from "./AIProcessing";
import UploadSuccess from "./UploadSuccess";

export default function UploadMeetingModal() {
  const { open, setOpen } = useUploadModal();

  const [step, setStep] = useState(UPLOAD_STEPS.IDLE);
  const [selectedFile, setSelectedFile] = useState(null);
  const [meeting, setMeeting] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep(UPLOAD_STEPS.IDLE);
      setSelectedFile(null);
      setMeeting(null);
    }, 300);
  };

  if (!open) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-sm sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.96,
          }}
          transition={{
            duration: 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative my-auto mx-auto w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-20 rounded-lg p-2 text-muted-foreground transition hover:bg-surface-hover hover:text-foreground sm:right-5 sm:top-5"
          >
            <X size={18} />
          </button>

          <div className="max-h-[min(88svh,760px)] overflow-y-auto">
            {step === UPLOAD_STEPS.IDLE && (
              <UploadDropzone
                setStep={setStep}
                setSelectedFile={setSelectedFile}
              />
            )}

            {step === UPLOAD_STEPS.UPLOADING && (
              <UploadProgress
                file={selectedFile}
                setStep={setStep}
                setMeeting={setMeeting}
              />
            )}

            {step === UPLOAD_STEPS.PROCESSING && (
              <AIProcessing
                meeting={meeting}
                setStep={setStep}
                setMeeting={setMeeting}
              />
            )}

            {step === UPLOAD_STEPS.SUCCESS && (
              <UploadSuccess
                meeting={meeting}
                setOpen={setOpen}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
