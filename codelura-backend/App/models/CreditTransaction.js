import mongoose from "mongoose";

const creditTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["PURCHASE", "REFERRAL_UNLOCK", "REFUND", "ADMIN_CREDIT", "ADMIN_DEBIT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    referenceId: {
      type: String,
      default: "",
    },
    referenceType: {
      type: String,
      enum: ["PAYMENT", "REFERRAL", "ADMIN"],
      default: "REFERRAL",
    },
    description: {
      type: String,
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    referralId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
  },
  { timestamps: true }
);

const CreditTransaction =
  mongoose.models.CreditTransaction ||
  mongoose.model("CreditTransaction", creditTransactionSchema);

export default CreditTransaction;
