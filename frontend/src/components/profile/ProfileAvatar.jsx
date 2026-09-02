"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Camera, Trash2, LoaderCircle, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const ProfileAvatar = ({ avatarUrl, onAvatarChange, name }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return toast.error("Invalid file format. Please upload JPG, PNG, GIF, or WebP.");
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return toast.error("File size exceeds 2MB limit.");
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await api.post("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = response.data?.data?.user;
      const newAvatarUrl = updatedUser?.profile?.avatar;

      if (newAvatarUrl && onAvatarChange) {
        onAvatarChange(newAvatarUrl);
      }

      toast.success("Profile avatar updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload avatar.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleConfirmRemove = async () => {
    setIsRemoving(true);
    try {
      const response = await api.delete("/users/me/avatar");

      const updatedUser = response.data?.data?.user;
      const newAvatarUrl = updatedUser?.profile?.avatar || "";

      if (onAvatarChange) {
        onAvatarChange(newAvatarUrl);
      }

      toast.success("Profile avatar removed.");
      setShowConfirm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove avatar.");
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
      <div className="flex flex-col gap-5 rounded-[2rem] border border-white/[0.08] bg-slate-950/60 p-6 shadow-xl backdrop-blur-2xl sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="relative flex size-20 shrink-0 overflow-hidden items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/20 border border-white/10">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name || "User Avatar"}
              className="size-full object-cover"
            />
          ) : (
            <span>{initials || "U"}</span>
          )}
        </div>

        {/* Information */}
        <div className="flex-1">
          <h2 className="text-base font-bold text-white">
            Profile Avatar
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            JPG, PNG, GIF or WebP • Max 2MB file size.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isRemoving}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isUploading ? (
              <>
                <LoaderCircle className="size-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Camera className="size-3.5" />
                <span>Change Avatar</span>
              </>
            )}
          </button>

          {avatarUrl && (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={isUploading || isRemoving}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal via React Portal */}
      {showConfirm &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              onClick={() => !isRemoving && setShowConfirm(false)}
            />

            <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/[0.08] bg-slate-950 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => !isRemoving && setShowConfirm(false)}
                className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
                  <AlertTriangle className="size-5" />
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-bold text-white">
                    Remove profile picture?
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Your avatar will be deleted and reset to your initials.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={isRemoving}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmRemove}
                  disabled={isRemoving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
                >
                  {isRemoving ? "Removing..." : "Confirm Delete"}
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