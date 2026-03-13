export const adminOnly = (req, res, next) => {
  console.log("ADMIN CHECK:", req.user);

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};
