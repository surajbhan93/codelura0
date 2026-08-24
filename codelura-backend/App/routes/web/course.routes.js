import express from "express";
import {
  listCourses,
  getCourse,
  previewPDF,
  downloadPDF,
  getRelatedCourses,
  saveCourseToDashboard,
  getMyCourses,
  buyCourse
} from "../../controllers/web/course.controller.js";

import {
  authMiddleware,
  authOptional,
  protectOptional
} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/courses", listCourses);
// router.get("/related", getRelatedCourses);
router.get("/courses/related", getRelatedCourses);
router.get("/courses/:id", protectOptional, getCourse);

router.get("/courses/:id/preview", protectOptional, previewPDF);

router.get("/courses/:id/pdf", protectOptional, downloadPDF);
router.post("/user/save-course", authMiddleware, saveCourseToDashboard);
router.get("/my-courses", authMiddleware, getMyCourses);
router.post("/buy-course", authMiddleware, buyCourse);
export default router;
