import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import UploadMeetingModal from "../upload/UploadMeetingModal";
import ExportDrawer from "../export/ExportDrawer";

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="flex gap-6 p-6">
        <Sidebar />

        <div className="flex min-h-[calc(100vh-48px)] flex-1 flex-col">
          <Navbar />

          <main className="mt-6 flex-1 rounded-3xl bg-white p-8 shadow-sm dark:bg-zinc-900">
            {children}
          </main>
        </div>

        <UploadMeetingModal />
        <ExportDrawer />
      </div>
    </div>
  );
};

export default AppLayout;