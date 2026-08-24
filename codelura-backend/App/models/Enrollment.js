import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemType: {
      type: String,
      enum: ["Course", "Program", "CareerTrack"],
      required: true,
    },
    itemRef: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "itemType",
      required: true,
    },
    itemTitle: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    couponCode: {
      type: String,
      default: "",
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    enrollmentStatus: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    enrolledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, itemRef: 1, paymentStatus: 1 });

export default mongoose.models.Enrollment ||
  mongoose.model("Enrollment", enrollmentSchema);
