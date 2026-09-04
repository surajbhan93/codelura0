import express from "express";
import { authMiddleware, authOptional } from "../middleware/auth.middleware.js";
import {
  getCampusProfile,
  joinCampusProgram,
  getCampusDashboard,
  getCampusTasks,
  submitTaskProof,
  getAvailableJobsForPromotion,
  submitJobPromotionProof,
  getMyCampusBlogs,
  submitCampusBlog,
  incrementCampusBlogViews,
  getMyCourseSales,
  getMyReferrals,
  getCampusLeaderboard,
  getMyEarnings,
  updatePayoutDetails,
  requestPayout,
} from "../controllers/web/campus.controller.js";

const router = express.Router();

// Public / Semi-public routes
router.get("/leaderboard", authOptional, getCampusLeaderboard);
router.post("/blogs/:id/view", incrementCampusBlogViews);

// Protected routes (Campus Participants)
router.use(authMiddleware);

router.get("/profile", getCampusProfile);
router.post("/join", joinCampusProgram);
router.get("/dashboard", getCampusDashboard);

// Tasks
router.get("/tasks", getCampusTasks);
router.post("/tasks/:id/submit", submitTaskProof);

// Jobs Promotion
router.get("/jobs", getAvailableJobsForPromotion);
router.post("/jobs/promote", submitJobPromotionProof);

// Blogs
router.get("/blogs", getMyCampusBlogs);
router.post("/blogs/submit", submitCampusBlog);

// Course Sales & Referrals
router.get("/course-sales", getMyCourseSales);
router.get("/referrals", getMyReferrals);

// Earnings & Payouts
router.get("/earnings", getMyEarnings);
router.put("/payout-details", updatePayoutDetails);
router.post("/payout/request", requestPayout);

export default router;
