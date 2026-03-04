import axios from "axios";
import { API_BASE_URL } from "./config";
import { useAuthStore } from "../store/authStore";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = false;
let queue = [];

function flushQueue(error, token = null) {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  queue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);
    original._retry = true;
    if (refreshing) {
      const token = await new Promise((resolve, reject) => queue.push({ resolve, reject }));
      original.headers.Authorization = `Bearer ${token}`;
      return apiClient(original);
    }
    refreshing = true;
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
      useAuthStore.getState().setAccessToken(data.access_token);
      flushQueue(null, data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return apiClient(original);
    } catch (refreshError) {
      flushQueue(refreshError);
      useAuthStore.getState().logout();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      refreshing = false;
    }
  }
);

export default apiClient;

