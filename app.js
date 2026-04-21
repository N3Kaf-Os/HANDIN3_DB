const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const artworksRouter = require("./routes/artworks");
const adminRouter = require("./routes/admin");
const gatekeeper = require("./middleware/gatekeeper");
const Artwork = require("./models/Artwork");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // only parses text fields, not files => multer handles file uploads
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Sessions — required by admin auth. Server.js enforces SESSION_SECRET in prod; fallback keeps tests green.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "test-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get("/enter", (req, res) => {
  res.render("enter");
});

app.post("/enter", (req, res) => {
  if (req.body.website) {
    return res.status(403).send("Forbidden");
  }
  req.session.entered = true;
  res.redirect("/");
});

app.use(gatekeeper);

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
