import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

import {
  createPremiumPlan,
  createCoupon,
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
} from "../controllers/web/premium.controller.js";

const router = express.Router();

/* ================= ADMIN ROUTES ================= */

router.post("/admin/plan", authMiddleware, adminOnly, createPremiumPlan);
router.post("/admin/coupon", authMiddleware, adminOnly, createCoupon);
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
router.get("/plan/:slug", getPlanBySlug);   // ✅ ADD THIS
router.post("/buy", authMiddleware, buySubscription);

export default router;