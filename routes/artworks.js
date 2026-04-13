const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork");

// Gallery — all artworks
router.get("/", async (req, res) => {
  try {
    const artworks = await Artwork.find().sort({ createdAt: -1 });
    res.render("gallery", { artworks });
  } catch (err) {
    console.error(err);
    res.status(500).render("404");
  }
});

// Single artwork by slug
router.get("/:slug", async (req, res) => {
  try {
    const artwork = await Artwork.findOne({ slug: req.params.slug });
    if (!artwork) return res.status(404).render("404");
    res.render("artwork", { artwork });
  } catch (err) {
    console.error(err);
    res.status(500).render("404");
  }
});

module.exports = router;
