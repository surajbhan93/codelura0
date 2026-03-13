import express from "express";
import { getServices,getServiceBySlug,createEnquiry } from "../../controllers/web/service.controller.js";

const router = express.Router();

/**
 * GET /api/services
 * Public
 */
router.get("/", getServices);
router.get("/:slug", getServiceBySlug);
router.post("/create", createEnquiry);

export default router;
