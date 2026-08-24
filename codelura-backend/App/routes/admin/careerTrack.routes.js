import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/adminOnly.js";
import {
  createCareerTrack,
  getAllCareerTracksAdmin,
  getCareerTrackByIdAdmin,
  updateCareerTrack,
  deleteCareerTrack,
  updateCareerTrackStatus,
  toggleCareerTrackFlags,
} from "../../controllers/admin/careerTrack.controller.js";

const router = express.Router();

// All routes below are protected -> logged in + admin only
router.use(authMiddleware, adminOnly);

router.post("/", createCareerTrack);
router.get("/", getAllCareerTracksAdmin);
router.get("/:id", getCareerTrackByIdAdmin);
router.put("/:id", updateCareerTrack);
router.delete("/:id", deleteCareerTrack);
router.patch("/:id/status", updateCareerTrackStatus);
router.patch("/:id/flags", toggleCareerTrackFlags);

export default router;