import mongoose from "mongoose";

const EMISchema = new mongoose.Schema(
  {
    projectPaymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectPayment",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentClient", // Changed from "User" to "PaymentClient"
      required: true,
    },
    emiNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    emiAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"],
      default: "PENDING",
    },
    relatedPayments: [
      {
        paymentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Payment",
        },
        amount: {
          type: Number,
        },
        paidAt: {
          type: Date,
        },
      },
    ],
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate remaining amount before saving
EMISchema.pre("save", function (next) {
  this.remainingAmount = this.emiAmount - this.paidAmount;
  
  // Update status based on payment
  if (this.paidAmount === 0) {
    if (new Date() > this.dueDate) {
      this.status = "OVERDUE";
    } else {
      this.status = "PENDING";
    }
  } else if (this.paidAmount >= this.emiAmount) {
    this.status = "PAID";
    this.remainingAmount = 0;
  } else {
    this.status = "PARTIALLY_PAID";
  }
  
  next();
});

// Indexes for faster queries
EMISchema.index({ projectPaymentId: 1, emiNumber: 1 });
EMISchema.index({ userId: 1, status: 1 });
EMISchema.index({ dueDate: 1 });

export default mongoose.model("EMI", EMISchema);
