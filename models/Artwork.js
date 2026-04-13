const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    medium: { type: String, trim: true },
    year: { type: Number },
    imagePath: { type: String, required: true }, // stores where the image lives
    slug: {
      // for SEO-friendly URLs
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Artwork", artworkSchema);
