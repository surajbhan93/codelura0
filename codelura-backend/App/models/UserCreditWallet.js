import mongoose from "mongoose";

const userCreditWalletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPurchased: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    freeTrialClaimed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserCreditWallet =
  mongoose.models.UserCreditWallet ||
  mongoose.model("UserCreditWallet", userCreditWalletSchema);

export default UserCreditWallet;
