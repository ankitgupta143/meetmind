import AppLayout from "@/components/layout/AppLayout";
import MeetingDetailsHeader from "@/components/meetings/MeetingDetailsHeader";
import MeetingWorkspace from "@/components/meetings/MeetingWorkspace";

export default function MeetingDetailsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <MeetingDetailsHeader />
        <MeetingWorkspace />
      </div>
    </AppLayout>
  );
}