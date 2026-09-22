import express from "express";
import {
  submitPayment,
  verifyPayment,
  rejectPayment,
  getPendingPayments,
  getPaymentHistory,
  getPaymentReceipt,
  getPaymentAuditLogs,
} from "../controllers/payment.controller.js";
import {
  createProjectPayment,
  getUserProjectPayment,
  getUserProjects,
  getAllProjects,
  getEmiCalendar,
  deleteProjectPayment,
} from "../controllers/projectPayment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// ==================== CLIENT ROUTES ====================

/**
 * @route   POST /api/payments/submit
 * @desc    Submit payment with screenshot
 * @access  Private (Client)
 */
router.post("/submit", authMiddleware, upload.single("screenshot"), submitPayment);

/**
 * @route   GET /api/payments/history
 * @desc    Get payment history for logged-in user
 * @access  Private (Client)
 */
router.get("/history", authMiddleware, getPaymentHistory);

/**
 * @route   GET /api/payments/receipt/:paymentId
 * @desc    Get payment receipt
 * @access  Private (Client)
 */
router.get("/receipt/:paymentId", authMiddleware, getPaymentReceipt);

/**
 * @route   GET /api/payments/projects
 * @desc    Get all projects for logged-in user
 * @access  Private (Client)
 */
router.get("/projects", authMiddleware, getUserProjects);

/**
 * @route   GET /api/payments/project/:projectPaymentId
 * @desc    Get project payment details with EMIs
 * @access  Private (Client)
 */
router.get("/project/:projectPaymentId", authMiddleware, getUserProjectPayment);

/**
 * @route   GET /api/payments/emi-calendar/:projectPaymentId
 * @desc    Get EMI calendar for a project
 * @access  Private (Client)
 */
router.get("/emi-calendar/:projectPaymentId", authMiddleware, getEmiCalendar);

// ==================== ADMIN ROUTES ====================

/**
 * @route   GET /api/payments/admin/pending
 * @desc    Get all pending payments for verification
 * @access  Private (Admin)
 */
router.get("/admin/pending", authMiddleware, adminOnly, getPendingPayments);

/**
 * @route   POST /api/payments/admin/verify/:paymentId
 * @desc    Verify a payment
 * @access  Private (Admin)
 */
router.post("/admin/verify/:paymentId", authMiddleware, adminOnly, verifyPayment);

/**
 * @route   POST /api/payments/admin/reject/:paymentId
 * @desc    Reject a payment
 * @access  Private (Admin)
 */
router.post("/admin/reject/:paymentId", authMiddleware, adminOnly, rejectPayment);

/**
 * @route   GET /api/payments/admin/audit-logs/:paymentId
 * @desc    Get audit logs for a payment
 * @access  Private (Admin)
 */
router.get("/admin/audit-logs/:paymentId", authMiddleware, adminOnly, getPaymentAuditLogs);

/**
 * @route   POST /api/payments/admin/create-project
 * @desc    Create new project payment with EMI schedule
 * @access  Private (Admin)
 */
router.post("/admin/create-project", authMiddleware, adminOnly, createProjectPayment);

/**
 * @route   GET /api/payments/admin/all-projects
 * @desc    Get all project payments
 * @access  Private (Admin)
 */
router.get("/admin/all-projects", authMiddleware, adminOnly, getAllProjects);

/**
 * @route   DELETE /api/payments/admin/project/:projectPaymentId
 * @desc    Delete a project payment
 * @access  Private (Admin)
 */
router.delete("/admin/project/:projectPaymentId", authMiddleware, adminOnly, deleteProjectPayment);

export default router;
