import mongoose from "mongoose";

const ProjectPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentClient", // Changed from "User" to "PaymentClient"
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectDescription: {
      type: String,
    },
    totalProjectAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPaidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    emiAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    numberOfEmis: {
      type: Number,
      default: 0,
      min: 0,
    },
    emiStartDate: {
      type: Date,
    },
    emiFrequency: {
      type: String,
      enum: ["monthly", "weekly", "custom"],
      default: "monthly",
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "overdue"],
      default: "active",
    },
    projectStartDate: {
      type: Date,
      default: Date.now,
    },
    projectEndDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate remaining amount before saving
ProjectPaymentSchema.pre("save", function () {
  this.remainingAmount = this.totalProjectAmount - this.totalPaidAmount;
});

// Indexes for faster queries
ProjectPaymentSchema.index({ userId: 1, status: 1 });
ProjectPaymentSchema.index({ createdAt: -1 });

export default mongoose.model("ProjectPayment", ProjectPaymentSchema);
