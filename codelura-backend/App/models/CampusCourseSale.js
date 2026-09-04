import mongoose from "mongoose";

const campusCourseSaleSchema = new mongoose.Schema(
  {
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampusParticipant",
      required: true,
    },
    referralCode: {
      type: String,
      required: true,
    },
    coursePrice: {
      type: Number,
      required: true,
    },
    commissionRate: {
      type: Number,
      default: 10, // 10%
    },
    commissionAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "refunded"],
      default: "approved",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampusCourseSale", campusCourseSaleSchema);
