import axios, { AxiosError } from "axios";
import { clearToken, getToken } from "./session";

// Backend base URL. Configure via VITE_API_BASE_URL, default localhost:8080.
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8080";

export const OAUTH_START_URL = `${API_BASE_URL}/oauth2/authorization/github`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearToken();
      if (!window.location.pathname.startsWith("/oauth/success") && window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }
    return Promise.reject(error);
  },
);
