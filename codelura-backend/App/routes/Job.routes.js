import { Router } from "express";
import {
  getAllJobs,
  getJobBySlug,
  createJob,
  updateJob,
  expireJob,
  deleteJob,
  getRelatedJobs,
  autoFillJob,
} from "../controllers/web/Job.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/* ── Admin AI Auto-fill ── */
router.post("/auto-fill", authMiddleware, autoFillJob);

/* ── Public Routes ── */
router.get("/",      getAllJobs);      // GET  /jobs
router.get("/related", getRelatedJobs);
router.get("/:slug", getJobBySlug);   // GET  /jobs/:slug

/* ── Admin Routes ── */
router.post("/",          authMiddleware  ,   createJob);   // POST   /jobs
router.put("/:slug",      authMiddleware  ,   updateJob);   // PUT    /jobs/:slug
router.patch("/:slug/expire",authMiddleware , expireJob);   // PATCH  /jobs/:slug/expire
router.delete("/:slug",     authMiddleware ,  deleteJob);   // DELETE /jobs/:slug

export default router;