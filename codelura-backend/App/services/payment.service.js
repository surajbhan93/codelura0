import Payment from "../models/Payment.js";
import ProjectPayment from "../models/ProjectPayment.js";
import EMI from "../models/EMI.js";
import PaymentAuditLog from "../models/PaymentAuditLog.js";

/**
 * Auto-allocate payment to EMIs
 */
export const allocatePaymentToEmis = async (projectPaymentId, paymentAmount, paymentId) => {
  try {
    // Get all pending/partial EMIs sorted by EMI number
    const emis = await EMI.find({
      projectPaymentId,
      status: { $in: ["PENDING", "PARTIALLY_PAID", "OVERDUE"] },
    }).sort({ emiNumber: 1 });

    if (emis.length === 0) {
      return { allocated: false, emis: [] };
    }

    let remainingAmount = paymentAmount;
    const allocatedEmis = [];

    for (const emi of emis) {
      if (remainingAmount <= 0) break;

      const emiRemaining = emi.emiAmount - emi.paidAmount;
      const amountToAllocate = Math.min(remainingAmount, emiRemaining);

      // Update EMI
      emi.paidAmount += amountToAllocate;
      emi.relatedPayments.push({
        paymentId,
        amount: amountToAllocate,
        paidAt: new Date(),
      });

      await emi.save(); // This will trigger pre-save hook to update status

      allocatedEmis.push({
        emiId: emi._id,
        emiNumber: emi.emiNumber,
        amountAllocated: amountToAllocate,
        newStatus: emi.status,
      });

      remainingAmount -= amountToAllocate;
    }

    return {
      allocated: true,
      emis: allocatedEmis,
      remainingUnallocated: remainingAmount,
    };
  } catch (error) {
    console.error("Error allocating payment to EMIs:", error);
    throw error;
  }
};

/**
 * Update project payment totals after verification
 */
export const updateProjectPaymentTotals = async (projectPaymentId) => {
  try {
    const projectPayment = await ProjectPayment.findById(projectPaymentId);
    if (!projectPayment) {
      throw new Error("Project payment not found");
    }

    // Calculate total paid from all verified payments
    const payments = await Payment.find({
      projectPaymentId,
      status: { $in: ["PAID", "PARTIALLY_PAID"] },
    });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    projectPayment.totalPaidAmount = totalPaid;
    projectPayment.remainingAmount = projectPayment.totalProjectAmount - totalPaid;

    // Update project status
    if (projectPayment.remainingAmount <= 0) {
      projectPayment.status = "completed";
    }

    await projectPayment.save();

    return projectPayment;
  } catch (error) {
    console.error("Error updating project payment totals:", error);
    throw error;
  }
};

/**
 * Create audit log entry
 */
export const createAuditLog = async (data) => {
  try {
    const auditLog = new PaymentAuditLog(data);
    await auditLog.save();
    return auditLog;
  } catch (error) {
    console.error("Error creating audit log:", error);
    throw error;
  }
};

/**
 * Generate payment receipt data
 */
export const generateReceiptData = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId)
      .populate("userId", "name email")
      .populate("projectPaymentId")
      .populate("relatedEmis");

    if (!payment) {
      throw new Error("Payment not found");
    }

    const projectPayment = payment.projectPaymentId;

    const receiptData = {
      receiptNumber: payment.receiptNumber,
      clientName: payment.userId.name,
      clientEmail: payment.userId.email,
      projectName: projectPayment.projectName,
      projectDescription: projectPayment.projectDescription,
      paymentAmount: payment.amount,
      paymentMethod: payment.paymentMethod,
      utrNumber: payment.utrNumber,
      paymentDate: payment.paymentDate,
      verifiedAt: payment.verificationStatus.verifiedAt,
      verifiedBy: payment.verificationStatus.verifiedBy,
      relatedEmis: payment.relatedEmis,
      previousBalance: projectPayment.totalProjectAmount - (projectPayment.totalPaidAmount - payment.amount),
      amountPaid: payment.amount,
      remainingBalance: projectPayment.remainingAmount,
      status: payment.status,
      receiptGeneratedAt: payment.receiptGeneratedAt,
    };

    return receiptData;
  } catch (error) {
    console.error("Error generating receipt data:", error);
    throw error;
  }
};
