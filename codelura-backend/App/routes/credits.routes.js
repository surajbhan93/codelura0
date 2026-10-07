import { Router } from "express";
import {
  getWallet,
  getCreditHistory,
  getCreditPackages,
  createCreditOrder,
  verifyCreditPayment,
  unlockReferral,
  getMyUnlockedReferrals,
  claimFreeTrial,
  getFreeTrialStatus,
  adminGetPackages,
  adminCreatePackage,
  adminUpdatePackage,
  adminDeletePackage,
  adminAdjustCredits,
} from "../controllers/credits.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = Router();

/* ── Public / Client Credit Routes ── */
router.get("/packages", getCreditPackages);

/* ── Protected User Credit Routes ── */
router.get("/wallet", authMiddleware, getWallet);
router.get("/history", authMiddleware, getCreditHistory);
router.get("/my-unlocked-referrals", authMiddleware, getMyUnlockedReferrals);

router.post("/claim-free-trial", authMiddleware, claimFreeTrial);
router.get("/free-trial-status", authMiddleware, getFreeTrialStatus);

router.post("/create-order", authMiddleware, createCreditOrder);
router.post("/verify-payment", authMiddleware, verifyCreditPayment);

/* ── Unlock Premium Referral ── */
router.post("/referral/:id/unlock", authMiddleware, unlockReferral);

/* ── Admin Credit Routes ── */
router.get("/admin/packages", authMiddleware, adminOnly, adminGetPackages);
router.post("/admin/packages", authMiddleware, adminOnly, adminCreatePackage);
router.put("/admin/packages/:id", authMiddleware, adminOnly, adminUpdatePackage);
router.delete("/admin/packages/:id", authMiddleware, adminOnly, adminDeletePackage);
router.post("/admin/adjust", authMiddleware, adminOnly, adminAdjustCredits);

export default router;
