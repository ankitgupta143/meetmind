"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import IntegrationHeader from "./IntegrationHeader";
import IntegrationSearch from "./IntegrationSearch";
import IntegrationSection from "./IntegrationSection";
import IntegrationDrawer from "./IntegrationDrawer";
import { integrationSections } from "./data/integrations";

const IntegrationPage = () => {
  const [query, setQuery] = useState("");
  const [sections, setSections] = useState(integrationSections);
  const [selected, setSelected] = useState(null);
  const visibleSections = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          integrations: section.integrations.filter((item) =>
            `${item.name} ${item.description}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          ),
        }))
        .filter((section) => section.integrations.length),
    [query, sections],
  );
  const connect = (integration) => {
    if (integration.connected)
      return toast.info(`${integration.name} is already connected.`);
    setSections((current) =>
      current.map((section) => ({
        ...section,
        integrations: section.integrations.map((item) =>
          item.id === integration.id
            ? { ...item, connected: true, lastSync: "Synced just now" }
            : item,
        ),
      })),
    );
    setSelected({
      ...integration,
      connected: true,
      lastSync: "Synced just now",
    });
    toast.success(`${integration.name} connected successfully.`);
  };
  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-10">
      <IntegrationHeader />
      <IntegrationSearch value={query} onChange={setQuery} />
      <div className="space-y-10">
        {visibleSections.map((section) => (
          <IntegrationSection
            key={section.name}
            section={section}
            onOpen={setSelected}
          />
        ))}
        {!visibleSections.length && (
          <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-zinc-500">
            No integrations match “{query}”.
          </div>
        )}
      </div>
      <IntegrationDrawer
        integration={selected}
        onClose={() => setSelected(null)}
        onConnect={connect}
      />
    </div>
  );
};
export default IntegrationPage;
