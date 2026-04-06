import axios from "axios";
import { clearStoredStaffSession, getStoredStaffSession } from "../features/auth/utils/authStorage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const session = getStoredStaffSession();

  if (session?.token && !config.url?.includes("/auth/staff/login")) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/staff/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      clearStoredStaffSession();

      if (window.location.pathname !== "/staff/login") {
        window.location.href = "/staff/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
