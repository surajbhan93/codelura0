import express from "express";

// Admin Controllers
import {
  createProgram,
  getAllProgramsAdmin,
  getProgramByIdAdmin,
  updateProgram,
  deleteProgram,
  toggleProgramFlag,
  updateProgramStatus,
  bulkDeletePrograms,
} from "../controllers/admin/programController.js";

// Web (Public) Controllers
import {
  getAllPrograms,
  getProgramBySlug,
  trackProgramClick,
  getFeaturedPrograms,
  incrementProgramStat,
} from "../controllers/web/programController.js";

// Middlewares
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

// ======================================================
// 🌐 PUBLIC / WEB ROUTES (No auth required)
// ======================================================

router.get("/featured", getFeaturedPrograms);          // GET  /api/programs/featured
router.get("/slug/:slug", getProgramBySlug);           // GET  /api/programs/slug/web-development
router.post("/click/:id", trackProgramClick);          // POST /api/programs/click/:id
router.post("/stat/:id", incrementProgramStat);        // POST /api/programs/stat/:id  (body: { statType })
router.get("/", getAllPrograms);                       // GET  /api/programs?category=Web Development

// ======================================================
// 🔒 ADMIN ROUTES (authMiddleware + adminOnly required)
// ======================================================

router.post(
  "/admin",
  authMiddleware,
  adminOnly,
  createProgram
); // POST /api/programs/admin

router.get(
  "/admin",
  authMiddleware,
  adminOnly,
  getAllProgramsAdmin
); // GET /api/programs/admin?page=1&limit=10

router.get(
  "/admin/:id",
  authMiddleware,
  adminOnly,
  getProgramByIdAdmin
); // GET /api/programs/admin/:id

router.put(
  "/admin/:id",
  authMiddleware,
  adminOnly,
  updateProgram
); // PUT /api/programs/admin/:id

router.delete(
  "/admin/:id",
  authMiddleware,
  adminOnly,
  deleteProgram
); // DELETE /api/programs/admin/:id

router.patch(
  "/admin/:id/toggle-flag",
  authMiddleware,
  adminOnly,
  toggleProgramFlag
); // PATCH /api/programs/admin/:id/toggle-flag (body: { flag: "featured" })

router.patch(
  "/admin/:id/status",
  authMiddleware,
  adminOnly,
  updateProgramStatus
); // PATCH /api/programs/admin/:id/status (body: { status: "published" })

router.post(
  "/admin/bulk-delete",
  authMiddleware,
  adminOnly,
  bulkDeletePrograms
); // POST /api/programs/admin/bulk-delete (body: { ids: [...] })

export default router;