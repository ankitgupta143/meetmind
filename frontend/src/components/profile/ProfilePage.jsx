"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

import ProfileHeader from "./ProfileHeader";
import ProfileAvatar from "./ProfileAvatar";
import PersonalInformation from "./PersonalInformation";
import ProfileActions from "./ProfileActions";
import ProfileStats from "./ProfileStats";
import ProfileActivity from "./ProfileActivity";
import ProfileSecurity from "./ProfileSecurity";

import { profileStats, recentActivity } from "./data/profile";

const mapUserToProfile = (user) => ({
  firstName: user?.firstName ?? "",
  lastName: user?.lastName ?? "",
  email: user?.email ?? "",
  phone: user?.profile?.phone ?? "",
  company: user?.profile?.company ?? "",
  role: user?.profile?.jobTitle ?? "",
  timezone: user?.settings?.localization?.timezone ?? "",
  country: user?.profile?.country ?? "",
  language: user?.settings?.localization?.language ?? "",
});

const mapProfileToRequest = (values) => ({
  firstName: values.firstName.trim(),
  lastName: values.lastName.trim(),
  phone: values.phone.trim(),
  company: values.company.trim(),
  jobTitle: values.role.trim(),
  timezone: values.timezone.trim(),
  country: values.country.trim(),
  language: values.language.trim(),
});

const ProfilePage = () => {
  const { user, loading, updateUser } = useAuth();
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  // Sync form inputs when authenticated user data becomes available/changes
  useEffect(() => {
    if (user) {
      setValues(mapUserToProfile(user));
    }
  }, [user]);

  const change = (field, value) =>
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl py-20 text-center text-zinc-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    try {
      const payload = mapProfileToRequest(values);
      const response = await api.patch("/users/me", payload);
      
      const updatedUser = response.data?.data?.user;
      if (!updatedUser) {
        throw new Error("Invalid response from server.");
      }

      // Update global auth state
      updateUser(updatedUser);
      
      // Update local form state
      setValues(mapUserToProfile(updatedUser));
      
      toast.success("Profile changes saved successfully.");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      <ProfileHeader />

      <ProfileAvatar
        name={`${values.firstName} ${values.lastName}`}
        onUpload={() =>
          toast.info("Avatar upload will be available with the backend.")
        }
        onRemove={() => toast.info("Avatar removed.")}
      />

      <PersonalInformation values={values} onChange={change} />

      <ProfileActions onSave={handleSave} saving={saving} />

      <ProfileStats stats={profileStats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileActivity activity={recentActivity} />

        <ProfileSecurity
          onAction={(action) => toast.info(`${action} will be available soon.`)}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
