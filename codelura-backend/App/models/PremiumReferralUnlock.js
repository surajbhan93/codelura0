import mongoose from "mongoose";

const premiumReferralUnlockSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    referralId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    creditCost: {
      type: Number,
      required: true,
      default: 10,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent double unlock by compound index
premiumReferralUnlockSchema.index({ userId: 1, referralId: 1 }, { unique: true });

const PremiumReferralUnlock =
  mongoose.models.PremiumReferralUnlock ||
  mongoose.model("PremiumReferralUnlock", premiumReferralUnlockSchema);

export default PremiumReferralUnlock;
