// middleware/gatekeeper.js — redirects first-time public visitors to /enter before the gallery.

const BYPASS = [/^\/enter/, /^\/css\//, /^\/uploads\//, /^\/admin/];

function gatekeeper(req, res, next) {
  if (BYPASS.some((re) => re.test(req.path))) return next();
  if (req.session && req.session.entered === true) return next();
  return res.redirect("/enter");
}

module.exports = gatekeeper;
