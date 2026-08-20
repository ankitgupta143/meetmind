"use client";
import { Camera, Trash2 } from "lucide-react";
import { useRef } from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

const ProfileAvatar = ({ name, onUpload, onRemove }) => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    // Reset input so the same file can be selected again later
    event.target.value = "";

    if (!file) {
      return;
    }

    // 1. Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      onUpload?.({
        success: false,
        error: "Please select a JPG, PNG, or GIF image.",
      });

      return;
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      onUpload?.({
        success: false,
        error: "Image size cannot exceed 2MB.",
      });

      return;
    }

    // Valid file
    onUpload?.({
      success: true,
      file,
    });
  };

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900">
      {/* Avatar */}
      <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
        {initials}
      </div>

      {/* Information */}
      <div className="flex-1">
        <h2 className="font-bold text-zinc-900 dark:text-white">
          Avatar
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          JPG, PNG or GIF. Maximum file size 2MB.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleUploadClick}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Camera className="size-4" />
          Upload
        </button>

        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
        >
          <Trash2 className="size-4" />
          Remove
        </button>
      </div>
    </div>
  );
};

export default ProfileAvatar;