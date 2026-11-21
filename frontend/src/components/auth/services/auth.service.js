import api from "@/lib/api";

export async function forgotPasswordApi(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPasswordApi({ token, password }) {
  const response = await api.post("/auth/reset-password", { token, password });
  return response.data;
}

export const authService = {
  forgotPassword: forgotPasswordApi,
  resetPassword: resetPasswordApi,
};
