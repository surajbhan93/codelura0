import express from "express";
import {
  createEnrollmentOrder,
  verifyEnrollmentPayment,
  getMyEnrollments,
  getAllEnrollmentsAdmin,
  manualAdminEnroll,
} from "../controllers/web/enrollment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// ======================================================
// 🔒 USER ENROLLMENT ROUTES (Auth required)
// ======================================================
router.post("/create-order", authMiddleware, createEnrollmentOrder);
router.post("/verify-payment", authMiddleware, verifyEnrollmentPayment);
router.get("/my-enrollments", authMiddleware, getMyEnrollments);

// ======================================================
// 👑 ADMIN ENROLLMENT ROUTES (Admin only)
// ======================================================
router.get("/admin", authMiddleware, adminOnly, getAllEnrollmentsAdmin);
router.post("/admin/manual", authMiddleware, adminOnly, manualAdminEnroll);

export default router;
