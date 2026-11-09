import api from "@/lib/api";

/**
 * Fetch connected integrations for current user
 */
export async function fetchUserIntegrations() {
  const response = await api.get("/integrations");
  return response.data?.data || [];
}

/**
 * Connect or update an integration
 */
export async function connectIntegration(provider, payload = {}) {
  const response = await api.post(`/integrations/${provider}/connect`, payload);
  return response.data?.data;
}

/**
 * Disconnect an integration
 */
export async function disconnectIntegration(provider) {
  const response = await api.post(`/integrations/${provider}/disconnect`);
  return response.data?.data;
}

/**
 * Trigger sync for an integration
 */
export async function syncIntegration(provider) {
  const response = await api.post(`/integrations/${provider}/sync`);
  return response.data?.data;
}

/**
 * Update integration configuration (e.g. Webhook URL, channels)
 */
export async function updateIntegrationConfig(provider, config = {}) {
  const response = await api.patch(`/integrations/${provider}/config`, { config });
  return response.data?.data;
}

/**
 * Post meeting intelligence summary & action items directly to Slack
 */
export async function postMeetingToSlack({ meetingId, channel, customNote }) {
  const response = await api.post("/integrations/slack/post-meeting", {
    meetingId,
    channel,
    customNote,
  });
  return response.data;
}

/**
 * Import Google Meet call with full attendee list and intelligence
 */
export async function importGoogleMeetMeeting({ meetingTitle, date, participants } = {}) {
  const response = await api.post("/integrations/google-meet/import", {
    meetingTitle,
    date,
    participants,
  });
  return response.data?.data;
}
