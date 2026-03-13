import express from "express";
import {
  createWork,
  getAllWorks,
  getWorkBySlug,
  updateWork,
  deleteWork
} from "../controllers/web/work.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getAllWorks);
router.get("/:slug", getWorkBySlug);

/* ADMIN (FIXED ORDER) */
router.post(
  "/",
  authMiddleware,
  adminOnly,
  createWork
);

router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  updateWork
);

router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  deleteWork
);

export default router;
