export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized. Please log in as admin." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied. Admin role required." });
  }

  next();
};
