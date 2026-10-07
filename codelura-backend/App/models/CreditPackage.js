import mongoose from "mongoose";

const creditPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
    },
    badge: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CreditPackage =
  mongoose.models.CreditPackage ||
  mongoose.model("CreditPackage", creditPackageSchema);

export default CreditPackage;
