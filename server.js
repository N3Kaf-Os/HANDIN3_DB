const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

// Fail fast if critical env vars are missing — running half-configured is worse than crashing.
for (const key of ["SESSION_SECRET", "ADMIN_PASSWORD_HASH", "MONGO_URI"]) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
