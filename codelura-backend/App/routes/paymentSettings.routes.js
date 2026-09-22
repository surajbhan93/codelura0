import express from "express";
import {
  getPaymentSettings,
  updateUpiNumber,
  uploadQrCode,
  deleteQrCode,
  getAdminPaymentSettings,
} from "../controllers/paymentSettings.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/payment-settings
 * @desc    Get payment settings (UPI & QR code)
 * @access  Public
 */
router.get("/", getPaymentSettings);

// ==================== ADMIN ROUTES ====================

/**
 * @route   GET /api/payment-settings/admin
 * @desc    Get admin view of payment settings
 * @access  Private (Admin)
 */
router.get("/admin", authMiddleware, adminOnly, getAdminPaymentSettings);

/**
 * @route   PUT /api/payment-settings/admin/upi
 * @desc    Update UPI number
 * @access  Private (Admin)
 */
router.put("/admin/upi", authMiddleware, adminOnly, updateUpiNumber);

/**
 * @route   POST /api/payment-settings/admin/qr-code
 * @desc    Upload/Update QR code
 * @access  Private (Admin)
 */
router.post("/admin/qr-code", authMiddleware, adminOnly, upload.single("qrCode"), uploadQrCode);

/**
 * @route   DELETE /api/payment-settings/admin/qr-code
 * @desc    Delete QR code
 * @access  Private (Admin)
 */
router.delete("/admin/qr-code", authMiddleware, adminOnly, deleteQrCode);

export default router;
