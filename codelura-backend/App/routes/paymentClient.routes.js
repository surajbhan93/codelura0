import express from "express";
import {
  createPaymentClient,
  loginPaymentClient,
  getAllPaymentClients,
  getPaymentClientInfo,
} from "../controllers/paymentClient.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

/**
 * @route   POST /api/payment-clients/login
 * @desc    Payment client login (separate from main auth)
 * @access  Public
 */
router.post("/login", loginPaymentClient);

/**
 * @route   GET /api/payment-clients/me
 * @desc    Get authenticated payment client info
 * @access  Private (Payment Client)
 */
router.get("/me", authMiddleware, getPaymentClientInfo);

/**
 * @route   POST /api/payment-clients/admin/create
 * @desc    Admin creates payment client
 * @access  Private (Admin)
 */
router.post("/admin/create", authMiddleware, adminOnly, createPaymentClient);

/**
 * @route   GET /api/payment-clients/admin/all
 * @desc    Get all payment clients
 * @access  Private (Admin)
 */
router.get("/admin/all", authMiddleware, adminOnly, getAllPaymentClients);

export default router;
