import Payment from "../models/Payment.js";
import ProjectPayment from "../models/ProjectPayment.js";
import EMI from "../models/EMI.js";
import PaymentAuditLog from "../models/PaymentAuditLog.js";
import {
  allocatePaymentToEmis,
  updateProjectPaymentTotals,
  createAuditLog,
  generateReceiptData,
} from "../services/payment.service.js";

/**
 * Submit payment by client
 */
export const submitPayment = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      projectPaymentId,
      amount,
      paymentMethod,
      utrNumber,
      paymentDate,
      notes,
    } = req.body;

    // Validate project payment exists and belongs to user
    const projectPayment = await ProjectPayment.findOne({
      _id: projectPaymentId,
      userId,
    });

    if (!projectPayment) {
      return res.status(404).json({
        success: false,
        message: "Project payment not found",
      });
    }

    // Check if payment amount is valid
    if (amount <= 0 || amount > projectPayment.remainingAmount) {
      return res.status(400).json({
        success: false,
        message: `Invalid amount. Must be between ₹1 and ₹${projectPayment.remainingAmount}`,
      });
    }

    // Check for duplicate UTR
    const existingPayment = await Payment.findOne({ utrNumber });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment with this UTR number already exists",
      });
    }

    // Create payment
    const payment = new Payment({
      projectPaymentId,
      userId,
      amount,
      paymentMethod,
      utrNumber,
      paymentDate,
      screenshotUrl: req.file?.path || req.body.screenshotUrl,
      screenshotPublicId: req.file?.filename || req.body.screenshotPublicId,
      notes,
      status: "VERIFICATION_PENDING",
    });

    await payment.save();

    // Create audit log
    await createAuditLog({
      paymentId: payment._id,
      userId,
      performedBy: userId,
      action: "CREATED",
      newStatus: "VERIFICATION_PENDING",
      description: "Payment submitted for verification",
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: "Payment submitted successfully. Waiting for admin verification.",
      payment,
    });
  } catch (error) {
    console.error("Error submitting payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit payment",
      error: error.message,
    });
  }
};

/**
 * Verify payment by admin
 */
export const verifyPayment = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { paymentId } = req.params;
    const { verificationNotes } = req.body;

    console.log("Verifying payment:", { paymentId, adminId, verificationNotes });

    const payment = await Payment.findById(paymentId).populate("projectPaymentId");

    if (!payment) {
      console.error("Payment not found:", paymentId);
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status !== "VERIFICATION_PENDING") {
      console.error("Payment status invalid:", payment.status);
      return res.status(400).json({
        success: false,
        message: `Payment is already ${payment.status}`,
      });
    }

    const previousStatus = payment.status;

    // Update payment status
    payment.status = "PAID";
    payment.verificationStatus = {
      verifiedBy: adminId,
      verifiedAt: new Date(),
      verificationNotes,
    };

    // Generate receipt number
    console.log("Generating receipt number...");
    payment.generateReceiptNumber();
    console.log("Receipt number generated:", payment.receiptNumber);

    // Allocate payment to EMIs
    console.log("Allocating payment to EMIs...");
    const allocation = await allocatePaymentToEmis(
      payment.projectPaymentId._id,
      payment.amount,
      payment._id
    );
    console.log("Allocation result:", allocation);

    if (allocation.allocated) {
      payment.relatedEmis = allocation.emis.map((e) => e.emiId);
    }

    console.log("Saving payment...");
    await payment.save();
    console.log("Payment saved successfully");

    // Update project payment totals
    console.log("Updating project totals...");
    await updateProjectPaymentTotals(payment.projectPaymentId._id);
    console.log("Project totals updated");

    // Create audit log
    console.log("Creating audit logs...");
    await createAuditLog({
      paymentId: payment._id,
      userId: payment.userId,
      performedBy: adminId,
      action: "VERIFIED",
      previousStatus,
      newStatus: "PAID",
      description: "Payment verified by admin",
      metadata: {
        allocation,
        verificationNotes,
      },
      ipAddress: req.ip,
    });

    // Create receipt generation audit log
    await createAuditLog({
      paymentId: payment._id,
      userId: payment.userId,
      performedBy: adminId,
      action: "RECEIPT_GENERATED",
      description: `Receipt ${payment.receiptNumber} generated`,
      ipAddress: req.ip,
    });
    console.log("Audit logs created");

    const updatedPayment = await Payment.findById(payment._id)
      .populate("userId", "name email")
      .populate("projectPaymentId")
      .populate("relatedEmis");

    console.log("Payment verification completed successfully");
    res.json({
      success: true,
      message: "Payment verified successfully",
      payment: updatedPayment,
      allocation,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

/**
 * Reject payment by admin
 */
export const rejectPayment = async (req, res) => {
  try {
    const adminId = req.user._id;
    const { paymentId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status !== "VERIFICATION_PENDING") {
      return res.status(400).json({
        success: false,
        message: `Payment is already ${payment.status}`,
      });
    }

    const previousStatus = payment.status;

    payment.status = "REJECTED";
    payment.verificationStatus = {
      verifiedBy: adminId,
      verifiedAt: new Date(),
      rejectionReason,
    };

    await payment.save();

    // Create audit log
    await createAuditLog({
      paymentId: payment._id,
      userId: payment.userId,
      performedBy: adminId,
      action: "REJECTED",
      previousStatus,
      newStatus: "REJECTED",
      description: "Payment rejected by admin",
      metadata: { rejectionReason },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: "Payment rejected",
      payment,
    });
  } catch (error) {
    console.error("Error rejecting payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject payment",
      error: error.message,
    });
  }
};

/**
 * Get pending payments for admin verification
 */
export const getPendingPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const payments = await Payment.find({
      status: "VERIFICATION_PENDING",
    })
      .populate("userId", "name email phone")
      .populate("projectPaymentId", "projectName totalProjectAmount")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Payment.countDocuments({
      status: "VERIFICATION_PENDING",
    });

    res.json({
      success: true,
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending payments",
      error: error.message,
    });
  }
};

/**
 * Get payment history for a user
 */
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectPaymentId, page = 1, limit = 20 } = req.query;

    const query = { userId };
    if (projectPaymentId) {
      query.projectPaymentId = projectPaymentId;
    }

    const payments = await Payment.find(query)
      .populate("projectPaymentId", "projectName")
      .populate("relatedEmis", "emiNumber emiAmount")
      .populate("verificationStatus.verifiedBy", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message,
    });
  }
};

/**
 * Get payment receipt
 */
export const getPaymentReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user._id;

    const payment = await Payment.findOne({
      _id: paymentId,
      userId,
      status: { $in: ["PAID", "PARTIALLY_PAID"] },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment receipt not found",
      });
    }

    const receiptData = await generateReceiptData(paymentId);

    res.json({
      success: true,
      receipt: receiptData,
    });
  } catch (error) {
    console.error("Error fetching payment receipt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment receipt",
      error: error.message,
    });
  }
};

/**
 * Get audit logs for a payment (admin only)
 */
export const getPaymentAuditLogs = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const auditLogs = await PaymentAuditLog.find({ paymentId })
      .populate("performedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      auditLogs,
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      error: error.message,
    });
  }
};
