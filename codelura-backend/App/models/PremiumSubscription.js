// import mongoose from "mongoose";

// const premiumSubscriptionSchema = new mongoose.Schema(
//   {
//     /* ================= USER & PLAN ================= */

//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     premiumService: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "PremiumService",
//       required: true,
//     },

//     /* ================= USER FILLED DETAILS ================= */

//     name: String,
//     telegramUsername: String,
//     mobile: String,              // ✅ added
//     email: String,               // ✅ added
//     note: String,                // ✅ added
//     transactionId: String,

//     paymentScreenshot: String,   // Cloudinary URL (optional)

//     /* ================= COUPON & PRICING ================= */

//     coupon: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Coupon",
//     },

//     discountAmount: {
//       type: Number,
//       default: 0,
//     },

//     finalAmount: {
//       type: Number,
//       required: true,
//     },

//     referralCommission: {
//       type: Number,
//       default: 0,
//     },

//     /* ================= STATUS MANAGEMENT ================= */

//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "approved",
//         "rejected",
//         "suspended",
//         "expired",
//       ],
//       default: "pending",
//     },

//     startDate: Date,
//     endDate: Date,

//     adminNote: String,

//     /* ================= DISPLAY CONTENT (OPTIONAL) ================= */
//     /* (Usually PremiumService me hona chahiye,
//        but since tumne bola kuch hataana nahi,
//        isko rehne diya) */

//     faqs: [
//       {
//         question: String,
//         answer: String,
//       },
//     ],

//     processSteps: [
//       {
//         title: String,
//         description: String,
//       },
//     ],

//     bannerImage: String,

//     galleryImages: [
//       {
//         type: String,
//       },
//     ],

//     seo: {
//       metaTitle: String,
//       metaDescription: String,
//       ogImage: String,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model(
//   "PremiumSubscription",
//   premiumSubscriptionSchema
// );


import mongoose from "mongoose";

const premiumSubscriptionSchema = new mongoose.Schema(
  {
    // ================= USER =================

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

    selectedPlan: {
      type: String,
      default: "Basic",
    },

    // ================= USER DETAILS =================

    name: String,
    email: String,
    mobile: String,
    telegramUsername: String,
    note: String,

    // Dynamic Form Data
    formData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Uploaded Files
    attachments: [
      {
        title: String,
        url: String,
      },
    ],

    // ================= PAYMENT =================

    transactionId: String,

    paymentMethod: {
      type: String,
      enum: ["UPI", "Razorpay", "Stripe", "Cash", "Bank Transfer"],
    },

    paymentScreenshot: String,

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

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

    // ================= ORDER / SUBSCRIPTION STATUS =================

    // NOTE: merged do alag workflows ek hi enum me —
    // 1) order-delivery flow: payment_verified → assigned → in_progress → revision_requested → completed
    // 2) subscription-lifecycle flow: approved → suspended → expired
    // Controller dono tarah ke status set karta hai, isliye enum me dono chahiye
    // warna .save() par "validation failed: status: `approved` is not a valid enum value" crash aayega.
    status: {
      type: String,
      enum: [
        "pending",
        "payment_verified",
        "assigned",
        "in_progress",
        "revision_requested",
        "completed",
        "cancelled",
        "rejected",
        "approved",
        "suspended",
        "expired",
      ],
      default: "pending",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    completedAt: Date,

    startDate: Date,
    endDate: Date,

    adminNote: String,

    // Final Review / Result
    feedback: String,

    resultFiles: [
      {
        title: String,
        url: String,
      },
    ],

    rating: Number,

    review: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PremiumSubscription", premiumSubscriptionSchema);