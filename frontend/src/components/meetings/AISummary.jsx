"use client";

import {
  Sparkles,
  Lightbulb,
  Target,
  CheckCircle2,
} from "lucide-react";

export default function AISummary() {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
            <Sparkles size={18} />
          </div>

          <h2 className="text-xl font-semibold">
            Meeting Overview
          </h2>
        </div>

        <p className="leading-7 text-zinc-600">
          The engineering team reviewed sprint progress,
          discussed backend integration, and finalized
          priorities for the upcoming release. The meeting
          concluded with clear ownership for pending tasks.
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
            <Lightbulb size={18} />
          </div>

          <h2 className="text-xl font-semibold">
            Key Takeaways
          </h2>
        </div>

        <ul className="space-y-3 text-zinc-600">
          <li>• Backend API integration is on schedule.</li>
          <li>• Authentication module is ready for QA.</li>
          <li>• Dashboard redesign will begin next sprint.</li>
        </ul>
      </div>

      {/* Decisions */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-2 text-violet-600">
            <Target size={18} />
          </div>

          <h2 className="text-xl font-semibold">
            Decisions Made
          </h2>
        </div>

        <ul className="space-y-3 text-zinc-600">
          <li>• Release scheduled for next Friday.</li>
          <li>• API version v2 becomes the default.</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
            <CheckCircle2 size={18} />
          </div>

          <h2 className="text-xl font-semibold">
            Next Actions
          </h2>
        </div>

        <ul className="space-y-3 text-zinc-600">
          <li>• Complete backend testing.</li>
          <li>• Prepare production deployment checklist.</li>
          <li>• Review UI redesign proposals.</li>
        </ul>
      </div>
    </div>
  );
}