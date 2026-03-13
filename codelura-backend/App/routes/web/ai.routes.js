import express from "express";
import { semanticSearch,contentRecommendations
  ,getBlogSummary
 } from "../../controllers/web/ai.controller.js";
import {
  
  generateBlogTags
} from "../../controllers/web/aiTag.controller.js";

const router = express.Router();
// kartik
router.post("/ai/search", semanticSearch);
router.post("/ai/recommendations", contentRecommendations);
// ✅ NEW: Auto Blog Tag Generator
router.post("/ai/blog-tags", generateBlogTags);
// AI Blog Summary  : 
router.post("/ai/blog-summary", getBlogSummary);
export default router;