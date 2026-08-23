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

  if (!open) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key={step}
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -20,
            scale: 0.98,
          }}
          transition={{
            duration: 0.3,
          }}
          className="relative mx-4 w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 rounded-xl p-2 hover:bg-zinc-100"
          >
            <X />
          </button>

          <div className="max-h-[90vh] overflow-y-auto">
            {step === UPLOAD_STEPS.IDLE && (
              <UploadDropzone
                setStep={setStep}
                setSelectedFile={setSelectedFile}
              />
            )}

            {step === UPLOAD_STEPS.UPLOADING && (
              <UploadProgress file={selectedFile} setStep={setStep} />
            )}

            {step === UPLOAD_STEPS.PROCESSING && <AIProcessing setStep={setStep} />}

            {step === UPLOAD_STEPS.SUCCESS && <UploadSuccess setOpen={setOpen} />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
