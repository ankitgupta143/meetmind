import api from "@/lib/api";

/**
 * Update user settings in MongoDB
 * @param {Object} settings - Granular settings object
 */
export async function updateSettingsApi(settings) {
  const response = await api.patch("/users/me/settings", settings);
  return response.data?.data?.user;
}
