import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    projectPaymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectPayment",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentClient", // Changed from "User"
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "QR"],
      required: true,
    },
    utrNumber: {
      type: String,
      required: true,
      trim: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    screenshotUrl: {
      type: String,
    },
    screenshotPublicId: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "VERIFICATION_PENDING",
        "PAID",
        "PARTIALLY_PAID",
        "REJECTED",
        "CANCELLED",
      ],
      default: "VERIFICATION_PENDING",
    },
    verificationStatus: {
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: {
        type: Date,
      },
      verificationNotes: {
        type: String,
      },
      rejectionReason: {
        type: String,
      },
    },
    relatedEmis: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EMI",
      },
    ],
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    receiptGeneratedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate receipt number on verification
PaymentSchema.methods.generateReceiptNumber = function () {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  this.receiptNumber = `CL-${year}${month}-${random}`;
  this.receiptGeneratedAt = date;
};

export default mongoose.model("Payment", PaymentSchema);
