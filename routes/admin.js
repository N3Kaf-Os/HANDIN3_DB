const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork");
const upload = require("../config/upload");

// Admin dashboard
router.get("/", async (req, res) => {
  const artworks = await Artwork.find().sort({ createdAt: -1 });
  res.render("admin/index", { artworks });
});

// New artwork form
router.get("/new", (req, res) => {
  res.render("admin/new");
});

// Create artwork
router.post("/", upload.single("image"), async (req, res) => {
  const { title, description, medium, year, slug } = req.body;
  await Artwork.create({
    title,
    description,
    medium,
    year,
    slug,
    imagePath: req.file.path.replace("public/", ""),
  });
  res.redirect("/admin");
});

// Edit form
router.get("/:id/edit", async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);
  res.render("admin/edit", { artwork });
});

// Update artwork
router.put("/:id", upload.single("image"), async (req, res) => {
  const { title, description, medium, year, slug } = req.body;
  const update = { title, description, medium, year, slug };
  if (req.file) update.imagePath = req.file.path.replace("public/", "");
  await Artwork.findByIdAndUpdate(req.params.id, update);
  res.redirect("/admin");
});

// Delete artwork
router.delete("/:id", async (req, res) => {
  await Artwork.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
});

module.exports = router;
