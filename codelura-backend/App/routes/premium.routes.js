import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

import {
  createPremiumPlan,
  updatePremiumPlan,
  getAllPlansAdmin,   // 👈 add karo
  getPlanById,        // 👈 add karo
  createCoupon,
  getAllCoupons,      // 👈 add karo
  applyCoupon,
  approveSubscription,
  getAllSubscriptions,
  getAllPlans,
  buySubscription,
  rejectSubscription,
  suspendSubscription,
  expireSubscription,
  changePlan,
  extendSubscription,
  deleteSubscription,
  getPlanBySlug,
  getMySubscriptions,
  getSubscriptionById, // ✅ ADD
} from "../controllers/web/premium.controller.js";

const router = express.Router();

/* ================= ADMIN ROUTES ================= */

router.post("/admin/plan", authMiddleware, adminOnly, createPremiumPlan);
router.get("/admin/plans", authMiddleware, adminOnly, getAllPlansAdmin);   // 👈 add karo — list page ke liye
router.get("/admin/plan/:id", authMiddleware, adminOnly, getPlanById);     // 👈 add karo — edit page ke liye
router.put("/admin/plan/:id", authMiddleware, adminOnly, updatePremiumPlan);

router.post("/admin/coupon", authMiddleware, adminOnly, createCoupon);
router.get("/admin/coupons", authMiddleware, adminOnly, getAllCoupons);    // 👈 add karo — list page ke liye

router.put("/admin/approve/:id", authMiddleware, adminOnly, approveSubscription);
router.get("/admin/subscriptions", authMiddleware, adminOnly, getAllSubscriptions);
router.put("/admin/reject/:id", authMiddleware, adminOnly, rejectSubscription);

router.put("/admin/suspend/:id", authMiddleware, adminOnly, suspendSubscription);

router.put("/admin/expire/:id", authMiddleware, adminOnly, expireSubscription);

router.put("/admin/extend/:id", authMiddleware, adminOnly, extendSubscription);

router.put("/admin/change-plan/:id", authMiddleware, adminOnly, changePlan);

router.delete("/admin/delete/:id", authMiddleware, adminOnly, deleteSubscription);

/* ================= USER ROUTES ================= */

router.get("/plans", getAllPlans);
router.get("/plan/:slug", getPlanBySlug);
router.post("/buy", authMiddleware, buySubscription);
router.post("/coupon/apply", authMiddleware, applyCoupon);

router.get("/my-subscriptions", authMiddleware, getMySubscriptions);
// ✅ View Details
router.get(
  "/admin/subscription/:id",
  authMiddleware,
  adminOnly,
  getSubscriptionById
);
export default router;