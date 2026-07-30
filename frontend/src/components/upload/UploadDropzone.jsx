"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileAudio, Sparkles, FileVideo } from "lucide-react";

import {
  MAX_UPLOAD_SIZE,
  SUPPORTED_FILE_TYPES,
  UPLOAD_STEPS,
} from "@/constants/upload";

export default function UploadDropzone({ setStep, setSelectedFile }) {
  const inputRef = useRef(null);
  const [error, setError] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
      setError(
        "Unsupported file type. Please upload MP3, WAV, M4A, MP4 or MOV.",
      );
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      setError("Maximum upload size is 500 MB.");
      return;
    }

    setError("");

    setSelectedFile(file);

    // Move to uploading state
    setStep(UPLOAD_STEPS.UPLOADING);
  };

  const handleBrowse = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">
          <Sparkles size={16} />
          AI Meeting Intelligence
        </div>

        <h2 className="text-3xl font-bold">Upload Meeting</h2>

        <p className="mt-3 text-zinc-500">
          Turn your meeting recording into transcripts, summaries, action items
          and AI insights.
        </p>
      </div>

      {/* Benefits */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {["Transcript", "Summary", "Action Items", "Analytics"].map((item) => (
          <div
            key={item}
            className="rounded-2xl border bg-zinc-50 p-4 text-center text-sm font-medium"
          >
            ✓ {item}
          </div>
        ))}
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="mt-8 rounded-3xl border-2 border-dashed border-indigo-300 bg-indigo-50/30 p-14 text-center transition hover:border-indigo-500 hover:bg-indigo-50"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
          <UploadCloud className="text-indigo-600" size={38} />
        </div>

        <h3 className="mt-6 text-xl font-semibold">
          Drag & Drop your recording
        </h3>

        <p className="mt-2 text-zinc-500">
          or click below to browse your computer
        </p>

        <button
          onClick={() => inputRef.current.click()}
          className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
        >
          Browse Files
        </button>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".mp3,.wav,.m4a,.mp4,.mov"
          onChange={handleBrowse}
        />

        <div className="mt-8 flex justify-center gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <FileAudio size={18} />
            MP3 / WAV / M4A
          </div>

          <div className="flex items-center gap-2">
            <FileVideo size={18} />
            MP4 / MOV
          </div>
        </div>

        <p className="mt-6 text-sm text-zinc-400">
          Maximum upload size: <strong>500 MB</strong>
        </p>
      </div>
    </div>
  );
}
