import express from "express";
import {
  createService,
  getAllServices,
  updateService,
  deleteService,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../../controllers/admin/service.admin.controller.js";

import { authMiddleware as protect } from "../../middleware/auth.middleware.js";
import { adminOnly } from "../../middleware/adminOnly.js";


const router = express.Router();

router.use(protect, adminOnly);

router.post("/", createService);
router.get("/", getAllServices);
router.put("/:id", updateService);
router.delete("/:id", deleteService);
router.get("/getEnquiries", getAllEnquiries);
router.put("/:id/status", updateEnquiryStatus);
router.delete("/delete/:id", deleteEnquiry);
export default router;
