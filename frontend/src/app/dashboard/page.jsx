import AppLayout from "@/components/layout/AppLayout";
import HeroSection from "@/components/dashboard/HeroSection";
import ContinueWorking from "@/components/dashboard/ContinueWorking";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentMeetings from "@/components/dashboard/RecentMeetings";
import AIInsights from "@/components/dashboard/AIInsights";
import UpcomingMeetings from "@/components/dashboard/UpcomingMeetings";

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <HeroSection />
        <ContinueWorking />
        <QuickStats />
        <RecentMeetings />
        <AIInsights />
        <UpcomingMeetings />
      </div>
    </AppLayout>
  );
}