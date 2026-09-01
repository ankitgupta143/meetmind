"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, FileAudio, FileVideo } from "lucide-react";
import { UPLOAD_STEPS } from "@/constants/upload";
import api from "@/lib/api";

export default function UploadProgress({
  file,
  setStep,
  setMeeting,
}) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!file) {
      setError("No recording selected.");
      return;
    }

    // Prevent duplicate upload invocation (e.g. React 18+ StrictMode double-mount in dev)
    if (hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;

    const uploadMeeting = async () => {
      try {
        setError("");
        setProgress(0);

        const formData = new FormData();
        formData.append("recording", file); // must match multer field name on backend

        const response = await api.post("/meetings", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            if (!event.total) return;

            const percentage = Math.round(
              (event.loaded * 100) / event.total
            );

            setProgress(percentage);
          },
        });

        const meeting = response.data?.data?.meeting;

        if (!meeting?._id) {
          throw new Error(
            "Meeting was uploaded but no meeting ID was returned."
          );
        }

        setMeeting(meeting);
        setProgress(100);

        setTimeout(() => {
          setStep(UPLOAD_STEPS.PROCESSING);
        }, 500);
      } catch (error) {
        hasStartedRef.current = false;
        console.error("Meeting upload failed:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to upload meeting."
        );
      }
    };

    uploadMeeting();
  }, [file, setMeeting, setStep]);

  const isVideo = file?.type?.startsWith("video");

  const formatSize = (bytes) => {
    if (!bytes) return "0 MB";

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="p-10">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
          <UploadCloud
            className="text-indigo-600"
            size={40}
          />
        </div>

        <h2 className="mt-6 text-3xl font-bold">
          Uploading Meeting
        </h2>

        <p className="mt-2 text-zinc-500">
          Please wait while we securely upload your recording.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-indigo-100 p-3">
            {isVideo ? (
              <FileVideo
                className="text-indigo-600"
                size={24}
              />
            ) : (
              <FileAudio
                className="text-indigo-600"
                size={24}
              />
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold">
              {file?.name}
            </h3>

            <p className="text-sm text-zinc-500">
              {formatSize(file?.size)}
            </p>
          </div>

          <span className="font-semibold text-indigo-600">
            {progress}%
          </span>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-200">
          <div
            style={{
              width: `${progress}%`,
            }}
            className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
          <span>
            {error ? "Upload failed" : "Uploading..."}
          </span>

          <span>
            {(
              (file?.size * progress) /
              100 /
              1024 /
              1024
            ).toFixed(1)}
            {" MB / "}
            {formatSize(file?.size)}
          </span>
        </div>

        {error && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(UPLOAD_STEPS.IDLE)}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}