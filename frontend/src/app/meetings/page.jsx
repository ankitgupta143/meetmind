import AppLayout from "@/components/layout/AppLayout";
import MeetingsHeader from "@/components/meetings/MeetingsHeader";
import MeetingsList from "@/components/meetings/MeetingsList";
import MeetingsToolbar from "@/components/meetings/MeetingsToolbar";

export default function MeetingsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <MeetingsHeader />
        <MeetingsToolbar />
        <MeetingsList />
      </div>
    </AppLayout>
  );
}