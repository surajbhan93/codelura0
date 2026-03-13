import express from "express";
import {
  createTestimonial,
  getApprovedTestimonials,
  approveTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllTestimonials,
} from "../controllers/web/testimonialController.js";

const router = express.Router();

router.post("/create", createTestimonial);

router.get("/:category", getApprovedTestimonials);

// admin 
router.get("/admin/all", getAllTestimonials); // 👈 add this
router.put("/admin/:id/approve", approveTestimonial);
router.put("/update/:id", updateTestimonial);
router.delete("/delete/:id", deleteTestimonial);
export default router;