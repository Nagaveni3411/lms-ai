const createError = require("http-errors");
const { verifyAccessToken } = require("../utils/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) {
    return next(createError(401, "Missing or invalid Authorization header"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: Number(payload.sub), email: payload.email, name: payload.name };
    return next();
  } catch (error) {
    return next(createError(401, "Invalid or expired access token"));
  }
}

module.exports = authMiddleware;

