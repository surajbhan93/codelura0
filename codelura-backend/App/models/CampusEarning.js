import mongoose from "mongoose";

const campusEarningSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampusParticipant",
      required: true,
    },
    source: {
      type: String,
      enum: [
        "course_commission",
        "job_promotion",
        "blog_reward",
        "task_reward",
        "referral_bonus",
        "manual_adjustment",
      ],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    referenceModel: {
      type: String,
    },
    amount: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "paid"],
      default: "approved",
    },
    description: {
      type: String,
      required: true,
    },
    payoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampusPayout",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampusEarning", campusEarningSchema);
