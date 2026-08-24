import express from "express";
import {
  createTeam,
  getTeam,
  getAllTeam,
  updateTeam,
  deleteTeam,
  toggleTeamStatus,
} from "../controllers/web/team.controller.js";

const router = express.Router();

// Public
router.get("/", getTeam);

// Admin
router.get("/admin", getAllTeam);
router.post("/", createTeam);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);
router.patch("/:id/toggle", toggleTeamStatus);

export default router;