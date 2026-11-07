"use client";

import AppLayout from "@/components/layout/AppLayout";
import HeroSection from "@/components/dashboard/HeroSection";
import ContinueWorking from "@/components/dashboard/ContinueWorking";
import QuickStats from "@/components/dashboard/QuickStats";
import RecentMeetings from "@/components/dashboard/RecentMeetings";
import AIInsights from "@/components/dashboard/AIInsights";
import UpcomingMeetings from "@/components/dashboard/UpcomingMeetings";
import { useDashboardData } from "@/components/dashboard/hooks/useDashboardData";
import { AlertCircle, RefreshCw } from "lucide-react";

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-64 rounded-[2.5rem] bg-slate-900/40 border border-white/[0.06]" />

      {/* Continue Working Skeleton */}
      <div className="h-44 rounded-[2rem] bg-slate-900/30 border border-white/[0.06]" />

      {/* Quick Stats Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 rounded-[2rem] bg-slate-900/30 border border-white/[0.06]" />
        ))}
      </div>

      {/* Recent Meetings Skeleton */}
      <div className="h-60 rounded-[2rem] bg-slate-900/30 border border-white/[0.06]" />

      {/* AI Insights Skeleton */}
      <div className="h-56 rounded-[2.5rem] bg-slate-900/30 border border-white/[0.06]" />
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboardData();

  return (
    <AppLayout>
      <div className="space-y-8">
        {error && (
          <div className="flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-300">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={18} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-3 py-1 font-semibold text-rose-200 hover:bg-rose-500/30 transition"
            >
              <RefreshCw size={13} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <HeroSection
              description={data?.hero?.description}
              stats={data?.stats}
            />

            <ContinueWorking meeting={data?.continueWorking} />

            <QuickStats
              stats={data?.stats}
              quickStats={data?.quickStats}
            />

            <RecentMeetings meetings={data?.recentMeetings || []} />

            <AIInsights insights={data?.aiInsights || []} />

            <UpcomingMeetings meetings={data?.upcomingMeetings || []} />
          </>
        )}
      </div>
    </AppLayout>
  );
}
