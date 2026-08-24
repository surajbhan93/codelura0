import { Router } from "express";
import {
  getAllJobs,
  getJobBySlug,
  createJob,
  updateJob,
  expireJob,
  deleteJob,
  getRelatedJobs,
} from "../controllers/web/Job.controller.js";
// import {
//   getAllBlogs,
//   getBlogBySlug,
//   likeBlog
// } from "../controllers/web/blog.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
// import { verifyAdmin } from "../middlewares/auth.middleware"; // uncomment when ready

const router = Router();

/* ── Public Routes ── */
router.get("/",      getAllJobs);      // GET  /jobs
router.get("/related", getRelatedJobs);
router.get("/:slug", getJobBySlug);   // GET  /jobs/:slug

/* ── Admin Routes ── (add verifyAdmin middleware when ready) */
router.post("/",          authMiddleware  ,   createJob);   // POST   /jobs
router.put("/:slug",      authMiddleware  ,   updateJob);   // PUT    /jobs/:slug
router.patch("/:slug/expire",authMiddleware , expireJob);   // PATCH  /jobs/:slug/expire
router.delete("/:slug",     authMiddleware ,  deleteJob);   // DELETE /jobs/:slug

export default router;