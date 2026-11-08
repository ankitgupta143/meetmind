import api from "@/lib/api";

/**
 * Fetch complete live workspace overview (stats, collections, recent activity)
 */
export async function getWorkspaceOverviewApi() {
  const response = await api.get("/workspace/overview");
  return response.data?.data;
}

/**
 * Toggle favorite status of a meeting
 */
export async function toggleMeetingFavoriteApi(meetingId) {
  const response = await api.patch(`/workspace/meetings/${meetingId}/favorite`);
  return response.data?.data;
}

/**
 * Toggle pin status of a meeting
 */
export async function toggleMeetingPinApi(meetingId) {
  const response = await api.patch(`/workspace/meetings/${meetingId}/pin`);
  return response.data?.data;
}

/**
 * Toggle action item status across any meeting
 */
export async function toggleWorkspaceActionItemApi(meetingId, itemIndex, targetStatus) {
  const response = await api.patch(`/workspace/action-items/${meetingId}/${itemIndex}`, {
    status: targetStatus,
  });
  return response.data?.data;
}
