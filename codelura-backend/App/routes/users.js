import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("name email phone createdAt")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

export default router;
