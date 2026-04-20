// scripts/hashPassword.js — one-off tool: prints a bcrypt hash of ADMIN_PASSWORD.
// Usage: ADMIN_PASSWORD=yourpassword node scripts/hashPassword.js
const bcrypt = require("bcrypt");

const plain = process.env.ADMIN_PASSWORD;
if (!plain) {
  console.error("Set ADMIN_PASSWORD env var before running.");
  process.exit(1);
}

bcrypt.hash(plain, 12).then((hash) => {
  console.log(hash);
});
