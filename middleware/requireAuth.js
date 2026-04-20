// middleware/requireAuth.js — gate for admin routes; redirects unauthenticated users to login.

function requireAuth(req, res, next) {
  if (req.session && req.session.admin === true) return next();
  return res.redirect("/admin/login");
}

module.exports = requireAuth;
