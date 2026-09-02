import { Sparkles } from "lucide-react";

const ProfileHeader = () => (
  <div>
    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
      <Sparkles size={14} className="text-cyan-400" /> Account Settings
    </p>
    <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
      Personal Profile
    </h1>
    <p className="mt-1 text-xs text-slate-400">
      Manage your personal credentials, workspace preferences and communication defaults.
    </p>
  </div>
);

export default ProfileHeader;
