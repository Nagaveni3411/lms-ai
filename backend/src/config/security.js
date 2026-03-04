const cors = require("cors");
const env = require("./env");

const isProduction = env.nodeEnv === "production";
const vercelRegex = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;

function buildAllowedOrigins() {
  const configured = String(env.corsOrigin || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (!isProduction) {
    configured.push("http://localhost:5173", "http://127.0.0.1:5173");
  }

  return Array.from(new Set(configured));
}

const allowedOrigins = buildAllowedOrigins();

function isAllowedOrigin(origin) {
  if (!origin) return true; // non-browser clients
  if (allowedOrigins.includes(origin)) return true;
  if (env.allowVercelOrigins && vercelRegex.test(origin)) return true;
  if (!isProduction && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return true;
  return false;
}

const corsMiddleware = cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 204
});

const refreshCookieName = "refresh_token";
const refreshCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/api/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000
};

if (env.cookieDomain) {
  refreshCookieOptions.domain = env.cookieDomain;
}

module.exports = {
  corsMiddleware,
  refreshCookieName,
  refreshCookieOptions
};
