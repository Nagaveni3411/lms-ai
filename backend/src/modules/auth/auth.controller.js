const authService = require("./auth.service");
const { validateRegister, validateLogin } = require("./auth.validator");
const { refreshCookieName, refreshCookieOptions } = require("../../config/security");

async function register(req, res, next) {
  try {
    validateRegister(req.body);
    const data = await authService.register(req.body);
    res.cookie(refreshCookieName, data.refreshToken, refreshCookieOptions);
    res.status(201).json({ user: data.user, access_token: data.accessToken });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    validateLogin(req.body);
    const data = await authService.login(req.body);
    res.cookie(refreshCookieName, data.refreshToken, refreshCookieOptions);
    res.json({ user: data.user, access_token: data.accessToken });
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies[refreshCookieName];
    const data = await authService.refresh(token);
    res.json({ access_token: data.accessToken, user: data.user });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies[refreshCookieName];
    await authService.logout(token);
    res.clearCookie(refreshCookieName, refreshCookieOptions);
    res.json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, refresh, logout };

