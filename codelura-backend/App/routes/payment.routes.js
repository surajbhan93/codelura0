import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/web/payment.controller.js";
import {
  createCourseOrder,
  verifyCoursePayment,
  getAllPurchases,
} from "../controllers/web/coursePaymentController.js";
import { authOptional,authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";
const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify",authOptional, verifyPayment);




//Course,Study Material payment route
router.post("/course/create-order", authMiddleware, createCourseOrder);

router.post("/course/verify-payment", authMiddleware, verifyCoursePayment);
// admin route 
router.get("/purchases", authMiddleware, getAllPurchases);
export default router;