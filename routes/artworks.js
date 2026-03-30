const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork");

// Gallery — all artworks
router.get("/", async (req, res) => {
  const artworks = await Artwork.find().sort({ createdAt: -1 });
  res.render("gallery", { artworks });
});

// Single artwork by slug
router.get("/:slug", async (req, res) => {
  const artwork = await Artwork.findOne({ slug: req.params.slug });
  if (!artwork) return res.status(404).render("404");
  res.render("artwork", { artwork });
});

module.exports = router;
