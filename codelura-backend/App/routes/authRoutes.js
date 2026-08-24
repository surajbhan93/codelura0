import express from "express";
import {
  signup,
  login,
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
router.get("/me", me);       // 🔥 YE LINE MISS THI
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

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  (req, res) => {
    // 👉 yaha JWT banana best hai
    const user = req.user;

    // Example redirect (simple)
    res.redirect("http://localhost:3003/");

    // 👉 Better approach (JWT)
    // const token = generateToken(user._id);
    // res.redirect(`http://localhost:3003?token=${token}`);
  }
);
export default router;
