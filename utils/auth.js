// utils/auth.js — password verification helper; safe against missing inputs.
const bcrypt = require("bcrypt");

async function verifyPassword(plain, hash) {
  if (!plain || !hash) return false; // guards missing env var / empty submit
  return bcrypt.compare(plain, hash);
}

module.exports = { verifyPassword };
