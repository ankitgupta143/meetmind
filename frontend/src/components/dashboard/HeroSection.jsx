"use client";

import { Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardData } from "@/constants/mockData";

const HeroSection = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-indigo-100/70 bg-gradient-to-br from-white via-indigo-50/50 to-violet-50/70 p-7 shadow-[0_18px_45px_-30px_rgba(79,70,229,0.4)] sm:p-10 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-indigo-950/40">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative z-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              {today}
            </p>

            <h1 className="mt-3 text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-zinc-900 dark:text-white">
              {greeting}, {dashboardData.user.name} 👋
            </h1>

            <p className="mt-3 max-w-2xl text-xl leading-8 text-zinc-500 dark:text-zinc-400">
              {dashboardData.hero.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button className="h-12 rounded-2xl px-6 shadow-lg shadow-indigo-600/20">
              <Upload className="mr-2 h-4 w-4" />
              Upload Meeting
            </Button>

            <Button variant="outline" className="h-12 rounded-2xl px-6">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
