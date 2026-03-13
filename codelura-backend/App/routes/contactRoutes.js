import express from "express";
import {
  createContactMessage,
  getAllContactMessages,
  updateContactStatus,
  deleteContactMessage,
} from "../controllers/web/contactController.js";

const router = express.Router();

router.post("/create", createContactMessage);
router.get("/admin/all", getAllContactMessages);
router.put("/admin/:id/status", updateContactStatus);
router.delete("/admin/:id", deleteContactMessage);
export default router;