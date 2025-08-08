export default function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }
  if (req.user.account_type !== 2) {
    return res.status(403).send("Admins only");
  }
  next();
}
