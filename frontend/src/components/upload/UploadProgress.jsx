"use client";

import { useEffect, useState } from "react";
import { UploadCloud, FileAudio, FileVideo } from "lucide-react";
import { UPLOAD_STEPS } from "@/constants/upload";

export default function UploadProgress({
  file,
  setStep,
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);

          setTimeout(() => {
            setStep(UPLOAD_STEPS.PROCESSING);
          }, 600);

          return 100;
        }

        return prev + 2;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [setStep]);

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
          <span>Uploading...</span>

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
      </div>
    </div>
  );
}