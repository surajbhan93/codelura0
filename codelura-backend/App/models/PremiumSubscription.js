import mongoose from "mongoose";

const premiumSubscriptionSchema = new mongoose.Schema(
  {
    /* ================= USER & PLAN ================= */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    premiumService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PremiumService",
      required: true,
    },

    /* ================= USER FILLED DETAILS ================= */

    name: String,
    telegramUsername: String,
    mobile: String,              // ✅ added
    email: String,               // ✅ added
    note: String,                // ✅ added
    transactionId: String,

    paymentScreenshot: String,   // Cloudinary URL (optional)

    /* ================= COUPON & PRICING ================= */

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
    },

    referralCommission: {
      type: Number,
      default: 0,
    },

    /* ================= STATUS MANAGEMENT ================= */

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "suspended",
        "expired",
      ],
      default: "pending",
    },

    startDate: Date,
    endDate: Date,

    adminNote: String,

    /* ================= DISPLAY CONTENT (OPTIONAL) ================= */
    /* (Usually PremiumService me hona chahiye,
       but since tumne bola kuch hataana nahi,
       isko rehne diya) */

    faqs: [
      {
        question: String,
        answer: String,
      },
    ],

    processSteps: [
      {
        title: String,
        description: String,
      },
    ],

    bannerImage: String,

    galleryImages: [
      {
        type: String,
      },
    ],

    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "PremiumSubscription",
  premiumSubscriptionSchema
);