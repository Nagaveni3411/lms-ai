const envBaseUrl = import.meta.env.VITE_API_BASE_URL;

function detectDefaultApiBaseUrl() {
  if (typeof window === "undefined") return "http://localhost:5000";
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  if (isLocal) return "http://localhost:5000";
  return "https://lms-b6ib.onrender.com";
}

export const API_BASE_URL = envBaseUrl || detectDefaultApiBaseUrl();
