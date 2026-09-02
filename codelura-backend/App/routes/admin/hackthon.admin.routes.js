import express from "express";

import {
  createHackathon,
  getAllHackathonsAdmin,
  deleteHackathon,
  getHackathonAnalytics,
  togglePublishHackathon,
  getAllSubmissions,
  getHackathonSubmissions,
  getHackathonParticipantsAdmin,
  saveSubmissionScores
} from "../../controllers/admin/hackathon.admin.controller.js";

import { authMiddleware as protect } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/adminOnly.js";

const router = express.Router();

// Create Hackathon
router.post("/hackathons", protect, adminOnly, createHackathon);

// Get All Hackathons (Admin Panel)
router.get("/hackathons", protect, adminOnly, getAllHackathonsAdmin);

// Delete Hackathon
router.delete("/hackathons/:id", protect, adminOnly, deleteHackathon);

// Hackathon Analytics (participants, submissions etc.)
router.get("/hackathons/:id/analytics", protect, adminOnly, getHackathonAnalytics);

// Publish / Unpublish Hackathon
router.patch("/hackathons/:id/publish", protect, adminOnly, togglePublishHackathon);

router.get("/submissions", protect, adminOnly, getAllSubmissions);
router.get("/hackathons/:id/submissions", protect, adminOnly, getHackathonSubmissions);
router.get("/hackathons/:id/participants", protect, adminOnly, getHackathonParticipantsAdmin);
router.patch("/submissions/:id/scores", protect, adminOnly, saveSubmissionScores);


export default router;