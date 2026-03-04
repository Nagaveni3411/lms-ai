const createError = require("http-errors");

function validateRegister(body) {
  const { email, password, name } = body;
  if (!email || !password || !name) {
    throw createError(400, "email, password, and name are required");
  }
  if (String(password).length < 6) {
    throw createError(400, "password must be at least 6 characters");
  }
}

function validateLogin(body) {
  const { email, password } = body;
  if (!email || !password) {
    throw createError(400, "email and password are required");
  }
}

module.exports = { validateRegister, validateLogin };

