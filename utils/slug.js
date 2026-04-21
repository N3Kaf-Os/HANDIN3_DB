// turns an artwork title into a URL-safe slug (pure, no deps).

function generateSlug(title) {
  if (typeof title !== "string" || title.trim() === "") {
    throw new Error("generateSlug: title must be a non-empty string");
  }

  const slug = title
    .toLowerCase()
    .normalize("NFKD") // split accents from letters (é → e + ́)
    .replace(/[\u0300-\u036f]/g, "") // drop combining marks
    .replace(/[^a-z0-9]+/g, "-") // anything else becomes a hyphen (collapses runs)
    .replace(/^-+|-+$/g, ""); // trim edge hyphens

  if (slug === "") {
    throw new Error("generateSlug: title produced an empty slug");
  }
  return slug;
}

module.exports = { generateSlug };
