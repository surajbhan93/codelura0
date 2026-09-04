import mongoose from "mongoose";

const campusJobPromotionSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampusParticipant",
      required: true,
    },
    platform: {
      type: String,
      enum: ["whatsapp", "telegram", "linkedin", "college_group", "instagram", "discord", "other"],
      default: "whatsapp",
      lowercase: true,
      trim: true,
    },
    proofLink: {
      type: String,
      default: "",
    },
    proofImage: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    rewardAmount: {
      type: Number,
      default: 2,
    },
    status: {
      type: String,
      enum: ["submitted", "under_review", "approved", "rejected", "paid"],
      default: "submitted",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampusJobPromotion", campusJobPromotionSchema);
