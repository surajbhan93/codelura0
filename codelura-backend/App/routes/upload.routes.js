import express from "express";
import upload from "../middleware/uploadIM.js";
import { uploadImage } from "../controllers/web/upload.controller.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadImage);

export default router;