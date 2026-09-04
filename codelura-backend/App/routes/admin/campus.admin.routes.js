import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  getAdminCampusOverview,
  getAllParticipantsAdmin,
  addParticipantAdmin,
  updateParticipantAdmin,
  getAllTasksAdmin,
  createTaskAdmin,
  getAllTaskSubmissionsAdmin,
  reviewTaskSubmissionAdmin,
  getAllJobPromotionsAdmin,
  reviewJobPromotionAdmin,
  getAllCampusBlogsAdmin,
  reviewCampusBlogAdmin,
  getAllCourseSalesAdmin,
  getAllPayoutsAdmin,
  processPayoutAdmin,
  getCampusSettingsAdmin,
  updateCampusSettingsAdmin,
} from "../../controllers/admin/campus.admin.controller.js";

const router = express.Router();

// Admin auth protection
router.use(authMiddleware);

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};

router.use(requireAdmin);

// Overview
router.get("/overview", getAdminCampusOverview);

// Participants
router.get("/participants", getAllParticipantsAdmin);
router.post("/participants", addParticipantAdmin);
router.put("/participants/:id", updateParticipantAdmin);

// Tasks & Submissions
router.get("/tasks", getAllTasksAdmin);
router.post("/tasks", createTaskAdmin);
router.get("/task-submissions", getAllTaskSubmissionsAdmin);
router.put("/task-submissions/:id/review", reviewTaskSubmissionAdmin);

// Job Promotions
router.get("/job-promotions", getAllJobPromotionsAdmin);
router.put("/job-promotions/:id/review", reviewJobPromotionAdmin);

// Blogs
router.get("/blogs", getAllCampusBlogsAdmin);
router.put("/blogs/:id/review", reviewCampusBlogAdmin);

// Course Sales
router.get("/course-sales", getAllCourseSalesAdmin);

// Payouts
router.get("/payouts", getAllPayoutsAdmin);
router.put("/payouts/:id", processPayoutAdmin);

// Settings
router.get("/settings", getCampusSettingsAdmin);
router.put("/settings", updateCampusSettingsAdmin);

export default router;
