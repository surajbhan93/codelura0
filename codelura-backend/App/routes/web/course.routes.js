import express from "express";
import {
  listCourses,
  getCourse,
  previewPDF,
  downloadPDF
} from "../../controllers/web/course.controller.js";

import {
  authMiddleware,
  authOptional,
  protectOptional
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/courses", listCourses);

router.get("/courses/:id", protectOptional, getCourse);

router.get("/courses/:id/preview", protectOptional, previewPDF);

router.get("/courses/:id/pdf", protectOptional, downloadPDF);

export default router;
