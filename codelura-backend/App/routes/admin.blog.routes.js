import express from "express";
import {
  createBlog,
  publishBlog,
  getPopularBlogs
} from "../controllers/admin/blog.admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import {
  getAllAdminBlogs,
  getAdminBlogById,
  updateBlog,
  deleteBlog
} from "../controllers/admin/blog.admin.controller.js";
const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createBlog);
// LIST
router.get("/", authMiddleware, getAllAdminBlogs);
// GET SINGLE
router.get("/:id", authMiddleware, getAdminBlogById);
// UPDATE
router.patch("/:id", authMiddleware, updateBlog);
// DELETE
router.delete("/:id", authMiddleware, deleteBlog);

router.patch("/:id/publish", authMiddleware, adminMiddleware, publishBlog);
router.get("/popular", authMiddleware, adminMiddleware, getPopularBlogs);

export default router;
