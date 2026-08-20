"use client";
import { Camera, Trash2, AlertTriangle, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const ProfileAvatar = ({ name, avatarUrl, onUpload, onRemove }) => {
  const fileInputRef = useRef(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close confirmation modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showConfirm) {
        setShowConfirm(false);
      }
    };

    if (showConfirm) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showConfirm]);

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

  const handleRemoveClick = () => {
    if (!avatarUrl) return;
    setShowConfirm(true);
  };

  const handleConfirmRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove?.();
      setShowConfirm(false);
    } catch {
      // Error handled by parent toast
    } finally {
      setIsRemoving(false);
    }
  };

  const initials = (name || "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900">
        {/* Avatar */}
        <div className="relative flex size-20 shrink-0 overflow-hidden items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name || "User Avatar"}
              className="size-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
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
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleUploadClick}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
          >
            <Camera className="size-4" />
            Upload
          </button>

          <button
            type="button"
            onClick={handleRemoveClick}
            disabled={!avatarUrl}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Trash2 className="size-4" />
            Remove
          </button>
        </div>
      </div>

      {/* Confirmation Modal via React Portal */}
      {showConfirm &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
              onClick={() => !isRemoving && setShowConfirm(false)}
            />

            {/* Modal Box */}
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => !isRemoving && setShowConfirm(false)}
                className="absolute right-4 top-4 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                  <AlertTriangle className="size-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    Remove profile picture?
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Your current profile picture will be permanently removed.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={isRemoving}
                  className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-95 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmRemove}
                  disabled={isRemoving}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95 disabled:opacity-50"
                >
                  {isRemoving ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ProfileAvatar;