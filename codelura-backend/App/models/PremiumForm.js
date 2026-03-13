import mongoose from "mongoose";

const premiumFormSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PremiumService",
      required: true
    },

    transactionId: {
      type: String,
      required: true
    },

    careerGoal: String,
    experience: String,
    telegramUsername: String,

    approved: {
      type: Boolean,
      default: false
    },

    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("PremiumForm", premiumFormSchema);