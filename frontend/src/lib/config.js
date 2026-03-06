const envBaseUrl = String(import.meta.env.VITE_API_BASE_URL || "").trim();

const isDev = Boolean(import.meta.env.DEV);

// Dev: default to local backend. Prod: default to same-origin so Vercel /api rewrite is used.
export const API_BASE_URL = isDev ? envBaseUrl || "http://localhost:5000" : envBaseUrl || "";
