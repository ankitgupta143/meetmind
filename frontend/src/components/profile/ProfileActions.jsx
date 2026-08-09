import { Save } from "lucide-react";
const ProfileActions = ({ onSave }) => (
  <div className="flex justify-end">
    <button
      onClick={onSave}
      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition hover:bg-indigo-700"
    >
      <Save className="size-4" />
      Save Changes
    </button>
  </div>
);
export default ProfileActions;
