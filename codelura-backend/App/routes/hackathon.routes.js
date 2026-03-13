import express from "express";
import { 
  getHackathons, 
  getHackathonById, 
  joinHackathon,
  submitProject,
  getMySubmission,
 
} from "../controllers/web/hackathon.controller.js";
import { authMiddleware, authOptional } from "../middleware/auth.middleware.js";
import { 
  classifySubmission, 
  checkPlagiarism,
  judgeSubmission ,
  makeUsageDecision, getUsageStats,
getProjectFeedback,
 } from "../controllers/hackthone.Aicontroller.js";
const router = express.Router();

// 🔥 Specific routes first
router.post("/join", authMiddleware, joinHackathon);

// Public routes
router.get("/", authOptional, getHackathons);
router.get("/:id", authOptional, getHackathonById);

// submission

router.post("/submit", authOptional, submitProject);

router.get("/my/:hackathonId", authOptional, getMySubmission);



//AI route

router.post("/ai/submission-classifier", classifySubmission);
router.post("/ai/plagiarism-check", checkPlagiarism);
router.post("/ai/judge",judgeSubmission  );

// Kartik route 
// Decide whether AI should be used
router.post("/ai/usage-decision", makeUsageDecision);

// Get AI usage statistics
router.get("/ai/usage-stats", getUsageStats);

// sai 
router.post("/ai/feedback", getProjectFeedback);

export default router;