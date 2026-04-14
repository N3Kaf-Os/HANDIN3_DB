const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const artworksRouter = require("./routes/artworks");
const adminRouter = require("./routes/admin");
const Artwork = require("./models/Artwork");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // only parses text fields, not files => multer handles file uploads
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("/", async (req, res) => {
  try {
    const artworks = await Artwork.find().sort({ createdAt: -1 }).limit(6);
    res.render("index", { artworks });
  } catch (err) {
    console.error(err);
    res.status(500).render("404");
  }
});

app.use("/artworks", artworksRouter);
app.use("/admin", adminRouter);

app.use((req, res) => {
  res.status(404).render("404");
});

module.exports = app;
