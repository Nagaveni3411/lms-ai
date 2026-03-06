const envBaseUrl = String(import.meta.env.VITE_API_BASE_URL || "").trim();

function detectDefaultApiBaseUrl() {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  return isLocal ? "http://localhost:5000" : "";
}

// In production, prefer same-origin requests so Vercel rewrites handle backend routing and avoid browser CORS issues.
const isLocalRuntime =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const API_BASE_URL = isLocalRuntime ? envBaseUrl || detectDefaultApiBaseUrl() : "";
