import axios from "axios";

let accessToken = "";

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach access token and handle multipart FormData
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Auth endpoints (login, register, refresh) should NEVER trigger a silent
    // token refresh — their 401s carry real error messages (e.g. wrong password).
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

    // If 401 Unauthorized, not an auth endpoint, and we haven't retried yet
    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Request a new access token from the refresh endpoint
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data?.data?.accessToken;

        if (newAccessToken) {
          setAccessToken(newAccessToken);

          // Update the original request's authorization header and retry
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token is expired or invalid — force logout
        setAccessToken("");

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"));
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
