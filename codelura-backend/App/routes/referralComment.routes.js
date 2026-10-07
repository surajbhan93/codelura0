import { Router } from "express";
import {
  getPublicComments,
  createStudentComment,
  getAdminComments,
  adminAddComment,
  adminToggleApproved,
  adminDeleteComment,
} from "../controllers/referralComment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = Router();

/* ── Public / Student Routes ── */
router.get("/", getPublicComments);
router.post("/", authMiddleware, createStudentComment);

/* ── Admin Management Routes ── */
router.get("/admin", authMiddleware, adminOnly, getAdminComments);
router.post("/admin", authMiddleware, adminOnly, adminAddComment);
router.patch("/admin/:id/approve", authMiddleware, adminOnly, adminToggleApproved);
router.delete("/admin/:id", authMiddleware, adminOnly, adminDeleteComment);

export default router;
