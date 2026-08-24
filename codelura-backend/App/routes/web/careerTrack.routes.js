import express from "express";
import {
  getAllCareerTracks,
  getCareerTrackBySlug,
  getFeaturedCareerTracks,
  getTrendingCareerTracks,
  likeCareerTrack,
} from "../../controllers/web/careerTrack.controller.js";

const router = express.Router();

// Public routes - no auth required
router.get("/featured", getFeaturedCareerTracks);
router.get("/trending", getTrendingCareerTracks);
router.get("/", getAllCareerTracks);
router.get("/:slug", getCareerTrackBySlug);
router.post("/:id/like", likeCareerTrack);

export default router;