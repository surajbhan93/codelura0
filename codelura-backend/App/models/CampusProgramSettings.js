import mongoose from "mongoose";

const campusProgramSettingsSchema = new mongoose.Schema(
  {
    courseCommissionPercent: {
      type: Number,
      default: 10,
    },
    jobPromotionReward: {
      type: Number,
      default: 2,
    },
    blogViewsThreshold: {
      type: Number,
      default: 500,
    },
    blogViewsReward: {
      type: Number,
      default: 20,
    },
    referralSignupPoints: {
      type: Number,
      default: 10,
    },
    minPayoutAmount: {
      type: Number,
      default: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    announcement: {
      type: String,
      default: "Welcome to Codelura Campus Program! Learn, Create, Promote & Earn.",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampusProgramSettings", campusProgramSettingsSchema);
