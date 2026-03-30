const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const artworksRouter = require("./routes/artworks");
const adminRouter = require("./routes/admin");
const Artwork = require("./models/Artwork");
require("dotenv").config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected")) //.then() bc it's async, we wait for the connection to be established before logging success
  .catch((err) => console.log(err));

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Routes
app.get("/", async (req, res) => {
  const artworks = await Artwork.find().sort({ createdAt: -1 }).limit(6);
  res.render("index", { artworks });
});

app.use("/artworks", artworksRouter);
app.use("/admin", adminRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
