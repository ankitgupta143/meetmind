import api from "@/lib/api";

export async function forgotPasswordApi(email) {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
}

export async function resetPasswordApi({ token, password }) {
  const response = await api.post("/auth/reset-password", { token, password });
  return response.data;
}

export async function verifyEmailApi(token) {
  const response = await api.post("/auth/verify-email", { token });
  return response.data;
}

export async function resendVerificationApi(email) {
  const response = await api.post("/auth/resend-verification", { email });
  return response.data;
}

export const authService = {
  forgotPassword: forgotPasswordApi,
  resetPassword: resetPasswordApi,
  verifyEmail: verifyEmailApi,
  resendVerification: resendVerificationApi,
};
