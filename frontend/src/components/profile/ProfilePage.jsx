"use client";
import { useState } from "react";
import { toast } from "sonner";
import ProfileHeader from "./ProfileHeader";
import ProfileAvatar from "./ProfileAvatar";
import PersonalInformation from "./PersonalInformation";
import ProfileActions from "./ProfileActions";
import ProfileStats from "./ProfileStats";
import ProfileActivity from "./ProfileActivity";
import ProfileSecurity from "./ProfileSecurity";
import { profile, profileStats, recentActivity } from "./data/profile";
const ProfilePage = () => {
  const [values, setValues] = useState(profile);
  const change = (field, value) =>
    setValues((current) => ({ ...current, [field]: value }));
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
      <ProfileActions onSave={() => toast.success("Profile changes saved.")} />
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
