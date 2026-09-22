import mongoose from "mongoose";

const PaymentSettingsSchema = new mongoose.Schema(
  {
    upiNumber: {
      type: String,
      required: true,
      default: "9336289192",
    },
    qrCodeUrl: {
      type: String,
      default: null,
    },
    qrCodePublicId: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PaymentSettings", PaymentSettingsSchema);
