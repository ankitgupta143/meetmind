"use client";

import { FolderPlus, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkspaceHeader() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
            <Sparkles size={16} /> Your personal hub
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome back, Ankit
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-500">
            Keep your important meetings, AI work, reports, and follow-ups in
            one calm place.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="h-11 rounded-xl">
            <Search size={16} className="mr-2" /> Search workspace
          </Button>
          <Button className="h-11 rounded-xl">
            <FolderPlus size={16} className="mr-2" /> New collection
          </Button>
        </div>
      </div>
    </section>
  );
}
