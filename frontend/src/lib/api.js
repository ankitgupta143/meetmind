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

// Share identical in-flight GETs. React Strict Mode can replay mount effects
// during development; coalescing these reads avoids duplicate server work while
// still allowing a later retry/refetch after the request settles.
const pendingGetRequests = new Map();
const axiosGet = api.get.bind(api);

api.get = (url, config = {}) => {
  // Requests with caller-managed cancellation must keep their own lifecycle.
  if (config.signal) {
    return axiosGet(url, config);
  }

  const requestConfig = { ...config, url, method: "get" };
  const requestUrl = api.getUri(requestConfig);
  const authorization =
    config.headers?.Authorization || config.headers?.authorization || accessToken;
  const key = `${requestUrl}|${authorization}`;
  const pending = pendingGetRequests.get(key);
  if (pending) return pending;

  const request = axiosGet(url, config).finally(() => {
    if (pendingGetRequests.get(key) === request) {
      pendingGetRequests.delete(key);
    }
  });
  pendingGetRequests.set(key, request);
  return request;
};

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

let refreshTokenPromise = null;

export const refreshSession = async (dispatchLogoutOnFail = true) => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        const newAccessToken = response.data?.data?.accessToken;
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          return newAccessToken;
        }
        throw new Error("No access token returned");
      })
      .catch((refreshError) => {
        setAccessToken("");
        if (dispatchLogoutOnFail && typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"));
        }
        return Promise.reject(refreshError);
      })
      .finally(() => {
        refreshTokenPromise = null;
      });
  }
  return refreshTokenPromise;
};

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
        const newAccessToken = await refreshSession();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
