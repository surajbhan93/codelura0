import mongoose from "mongoose";

const premiumMembershipSchema = new mongoose.Schema(
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

    transactionId: String,

    startDate: Date,
    endDate: Date,

    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled"],
      default: "active"
    },

    telegramJoined: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("PremiumMembership", premiumMembershipSchema);