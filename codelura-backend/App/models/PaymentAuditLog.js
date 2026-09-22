import mongoose from "mongoose";

const PaymentAuditLogSchema = new mongoose.Schema(
  {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "CREATED",
        "VERIFIED",
        "REJECTED",
        "CANCELLED",
        "MODIFIED",
        "RECEIPT_GENERATED",
      ],
      required: true,
    },
    previousStatus: {
      type: String,
    },
    newStatus: {
      type: String,
    },
    description: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PaymentAuditLog", PaymentAuditLogSchema);
