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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
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
          className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/95 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        >
          <button
            onClick={handleClose}
            className="absolute right-6 top-6 z-20 rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>

          <div className="max-h-[85vh] overflow-y-auto">
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