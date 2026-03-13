import express from "express";
import {
  getActivePrograms,
  redirectToPlatform,
} from "../../controllers/web/program.controller.js";

const router = express.Router();

router.get("/", getActivePrograms);
router.get("/:slug", redirectToPlatform);

export default router;