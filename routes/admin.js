const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork");
const upload = require("../config/upload");

// Admin dashboard
router.get("/", async (req, res) => {
  try {
    const artworks = await Artwork.find().sort({ createdAt: -1 });
    res.render("admin/index", { artworks });
  } catch (err) {
    console.error(err);
    res.status(500).render("404");
  }
});

// New artwork form
router.get("/new", (req, res) => {
  res.render("admin/new");
});

// Create artwork
router.post("/", upload.single("image"), async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.status(500).render("404");
  }
});

// Edit form
router.get("/:id/edit", async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    res.render("admin/edit", { artwork });
  } catch (err) {
    console.error(err);
    res.status(500).render("404");
  }
});

// Update artwork
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, medium, year, slug } = req.body;
    const update = { title, description, medium, year, slug };
    if (req.file) update.imagePath = req.file.path.replace("public/", "");
    await Artwork.findByIdAndUpdate(req.params.id, update);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).render("404");
  }
});

// Delete artwork
router.delete("/:id", async (req, res) => {
  try {
    await Artwork.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).render("404");
  }
});

module.exports = router;
