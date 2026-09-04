import express from "express";
import {
  signup,
  login,
  googleLogin,
  verifyEmail,
  me,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats,
} from "../controllers/web/authController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
// import { authMiddleware as protect } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";
import passport from "passport";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", me);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.patch("/change-password", authMiddleware, changePassword);
router.post("/logout", logout);

/* ── Admin User Routes ── */
router.get("/admin/users",           authMiddleware, adminOnly, getAllUsers);
router.get("/admin/users/stats",     authMiddleware, adminOnly, getUserStats);
router.get("/admin/users/:id",       authMiddleware, adminOnly, getUserById);
router.put("/admin/users/:id/role",  authMiddleware, adminOnly, updateUserRole);
router.delete("/admin/users/:id",    authMiddleware, adminOnly, deleteUser);

const checkGitHubConfigured = (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    return res.status(400).json({ success: false, message: "GitHub OAuth is not configured on this server." });
  }
  next();
};

router.get(
  "/github",
  checkGitHubConfigured,
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  checkGitHubConfigured,
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    const clientUrl = process.env.FRONTEND_URL || "http://localhost:3003";
    res.redirect(clientUrl);
  }
);
export default router;
