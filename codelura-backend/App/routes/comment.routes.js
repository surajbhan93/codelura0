import express from "express";
import { addComment,getComments,toggleLike } from "../controllers/web/comment.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/comments", authMiddleware, addComment);
router.get("/comments/:blogId", getComments);
router.put("/comments/like/:commentId", authMiddleware, toggleLike);
export default router;
