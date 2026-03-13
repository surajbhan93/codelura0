import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    /* ================= CLIENT INFO ================= */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= PROJECT INFO ================= */

    message: {
      type: String,
      required: true,
    },

    budget: {
      type: String,
      enum: [
        "under-10k",
        "10k-25k",
        "25k-50k",
        "50k-1lakh",
        "1lakh-plus",
      ],
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    /* ================= STATUS CONTROL ================= */

    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);