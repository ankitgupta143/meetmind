import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceStats from "./WorkspaceStats";
import WorkspaceGrid from "./WorkspaceGrid";
import RecentActivity from "./sections/RecentActivity";
import Templates from "./sections/Templates";

export default function WorkspacePage() {
  return (
    <div className="space-y-8">
      <WorkspaceHeader />
      <WorkspaceStats />
      <WorkspaceGrid />
      <RecentActivity />
      <Templates />
    </div>
  );
}
