import mongoose from "mongoose";

const campusPayoutSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampusParticipant",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["upi", "bank_transfer"],
      default: "upi",
    },
    paymentDetails: {
      upiId: String,
      bankAccount: String,
      ifsc: String,
      accountHolderName: String,
    },
    status: {
      type: String,
      enum: ["requested", "processing", "paid", "rejected"],
      default: "requested",
    },
    transactionId: {
      type: String,
      default: "",
    },
    receiptUrl: {
      type: String,
      default: "",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    processedAt: {
      type: Date,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampusPayout", campusPayoutSchema);
