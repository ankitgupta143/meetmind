"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import IntegrationHeader from "./IntegrationHeader";
import IntegrationSearch from "./IntegrationSearch";
import IntegrationSection from "./IntegrationSection";
import IntegrationDrawer from "./IntegrationDrawer";
import { integrationSections } from "./data/integrations";
import {
  fetchUserIntegrations,
  connectIntegration,
  disconnectIntegration,
  syncIntegration,
  updateIntegrationConfig,
} from "./services/integration.service";

function formatSyncTime(date) {
  if (!date) return "Synced just now";
  try {
    const diffSeconds = Math.round((new Date() - new Date(date)) / 1000);
    if (diffSeconds < 60) return "Synced just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `Synced ${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Synced ${diffHours}h ago`;
    return `Synced on ${new Date(date).toLocaleDateString()}`;
  } catch {
    return "Synced just now";
  }
}

const IntegrationPage = () => {
  const [query, setQuery] = useState("");
  const [sections, setSections] = useState(integrationSections);
  const [selected, setSelected] = useState(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Load user's real connected integrations from MongoDB on mount
  useEffect(() => {
    let isMounted = true;

    async function loadIntegrations() {
      try {
        const userIntegrations = await fetchUserIntegrations();
        if (!isMounted) return;

        const connectedMap = new Map();
        userIntegrations.forEach((item) => {
          connectedMap.set(item.provider, item);
        });

        setSections((current) =>
          current.map((section) => ({
            ...section,
            integrations: section.integrations.map((item) => {
              const connectedItem = connectedMap.get(item.id);
              if (connectedItem) {
                return {
                  ...item,
                  connected: true,
                  lastSync: formatSyncTime(connectedItem.lastSyncAt),
                  config: connectedItem.config,
                };
              }
              return {
                ...item,
                connected: false,
                lastSync: null,
              };
            }),
          }))
        );
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load integrations from server:", err);
      }
    }

    loadIntegrations();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleConnect = async (integration) => {
    if (integration.connected) {
      toast.info(`${integration.name} is already connected.`);
      return;
    }

    setIsConnecting(true);
    try {
      const saved = await connectIntegration(integration.id, {
        name: integration.name,
      });

      const updatedSync = formatSyncTime(saved?.lastSyncAt);

      setSections((current) =>
        current.map((section) => ({
          ...section,
          integrations: section.integrations.map((item) =>
            item.id === integration.id
              ? { ...item, connected: true, lastSync: updatedSync }
              : item
          ),
        }))
      );

      setSelected((prev) =>
        prev
          ? {
              ...prev,
              connected: true,
              lastSync: updatedSync,
            }
          : null
      );

      toast.success(`${integration.name} connected successfully! 🎉`);
    } catch (err) {
      console.error("Failed to connect integration:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          `Failed to connect ${integration.name}.`
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (integration) => {
    setIsDisconnecting(true);
    try {
      await disconnectIntegration(integration.id);

      setSections((current) =>
        current.map((section) => ({
          ...section,
          integrations: section.integrations.map((item) =>
            item.id === integration.id
              ? { ...item, connected: false, lastSync: null }
              : item
          ),
        }))
      );

      setSelected((prev) =>
        prev
          ? {
              ...prev,
              connected: false,
              lastSync: null,
            }
          : null
      );

      toast.info(`${integration.name} disconnected.`);
    } catch (err) {
      console.error("Failed to disconnect integration:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          `Failed to disconnect ${integration.name}.`
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSync = async (integration) => {
    setIsSyncing(true);
    try {
      const result = await syncIntegration(integration.id);
      const updatedSync = formatSyncTime(result?.lastSyncAt);

      setSections((current) =>
        current.map((section) => ({
          ...section,
          integrations: section.integrations.map((item) =>
            item.id === integration.id
              ? { ...item, lastSync: updatedSync }
              : item
          ),
        }))
      );

      setSelected((prev) =>
        prev
          ? {
              ...prev,
              lastSync: updatedSync,
            }
          : null
      );

      toast.success(`${integration.name} synchronized successfully! 🔄`);
    } catch (err) {
      console.error("Failed to sync integration:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          `Failed to sync ${integration.name}.`
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveConfig = async (provider, config) => {
    try {
      const updated = await updateIntegrationConfig(provider, config);
      setSections((current) =>
        current.map((section) => ({
          ...section,
          integrations: section.integrations.map((item) =>
            item.id === provider ? { ...item, config: updated.config } : item
          ),
        }))
      );
      setSelected((prev) =>
        prev && prev.id === provider ? { ...prev, config: updated.config } : prev
      );
      toast.success(`${provider} configuration updated! ✨`);
    } catch (err) {
      console.error("Failed to update config:", err);
      toast.error(err.response?.data?.message || "Failed to save configuration.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      <IntegrationHeader />
      <IntegrationSearch value={query} onChange={setQuery} />
      <div className="space-y-8">
        {visibleSections.map((section) => (
          <IntegrationSection
            key={section.name}
            section={section}
            onOpen={setSelected}
          />
        ))}
        {!visibleSections.length && (
          <div className="rounded-[2rem] border border-dashed border-white/10 bg-slate-950/60 py-16 text-center text-xs text-slate-400">
            No integrations match &ldquo;{query}&rdquo;.
          </div>
        )}
      </div>
      <IntegrationDrawer
        integration={selected}
        onClose={() => setSelected(null)}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onSync={handleSync}
        onSaveConfig={handleSaveConfig}
        isConnecting={isConnecting}
        isSyncing={isSyncing}
        isDisconnecting={isDisconnecting}
      />
    </div>
  );
};

export default IntegrationPage;
