import { Router } from "express";
import {
  initiateOAuth,
  handleOAuthCallback,
  getConnectionStatus,
  disconnectLinkedIn,
  getOrganizationPages,
  generateJobPost,
  savePromotion,
  publishPost,
  getPromotionStatus,
  generateCommentReply,
  getPostComments,
  replyToComment,
  getAllPromotions,
  getPromotionById,
  cancelPromotion,
  updateAutoReplySettings,
} from "../controllers/linkedin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/* ══════════════════════════════════════════════════════════════════
   OAUTH ROUTES
══════════════════════════════════════════════════════════════════ */

// Initiate OAuth flow
router.get("/oauth/connect", authMiddleware, initiateOAuth);

// OAuth callback (no auth - LinkedIn redirects here)
router.get("/oauth/callback", handleOAuthCallback);

// Get connection status
router.get("/status", authMiddleware, getConnectionStatus);

// Disconnect LinkedIn
router.delete("/disconnect", authMiddleware, disconnectLinkedIn);

/* ══════════════════════════════════════════════════════════════════
   PAGES & ACCOUNT ROUTES
══════════════════════════════════════════════════════════════════ */

// Get organization pages
router.get("/pages", authMiddleware, getOrganizationPages);

/* ══════════════════════════════════════════════════════════════════
   JOB POST GENERATION & PUBLISHING
══════════════════════════════════════════════════════════════════ */

// Generate LinkedIn job post with AI
router.post("/generate-job-post", authMiddleware, generateJobPost);

// Get all promotions (admin view)
router.get("/promotions", authMiddleware, getAllPromotions);

// Get single promotion by ID
router.get("/promotions/:promotionId", authMiddleware, getPromotionById);

// Save/update promotion (without publishing)
router.post("/promotions", authMiddleware, savePromotion);

// Get promotion status for a job
router.get("/promotions/job/:jobId", authMiddleware, getPromotionStatus);

// Publish LinkedIn post immediately
router.post("/promotions/:promotionId/publish", authMiddleware, publishPost);

// Cancel scheduled promotion
router.post("/promotions/:promotionId/cancel", authMiddleware, cancelPromotion);

// Update auto-reply settings
router.patch("/promotions/:promotionId/auto-reply", authMiddleware, updateAutoReplySettings);

/* ══════════════════════════════════════════════════════════════════
   COMMENTS & AUTO-REPLY
══════════════════════════════════════════════════════════════════ */

// Generate AI reply for a comment
router.post("/comments/generate-reply", authMiddleware, generateCommentReply);

// Get comments for a post
router.get("/promotions/:promotionId/comments", authMiddleware, getPostComments);

// Reply to a comment
router.post("/promotions/:promotionId/comments", authMiddleware, replyToComment);

export default router;
