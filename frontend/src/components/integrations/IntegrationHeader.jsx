import { Sparkles } from "lucide-react";

const IntegrationHeader = () => (
  <div>
    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
      <Sparkles size={14} className="text-cyan-400" /> Ecosystem & Sync
    </p>
    <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
      Workspace Integrations
    </h1>
    <p className="mt-1 text-xs text-slate-400">
      Connect Google Meet, Zoom, Slack, Notion and calendars to ingest and broadcast intelligence automatically.
    </p>
  </div>
);

export default IntegrationHeader;
