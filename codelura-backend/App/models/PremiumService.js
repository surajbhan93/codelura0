// import mongoose from "mongoose";

// const premiumServiceSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true, trim: true },
//     slug:  { type: String, unique: true },
//     description: { type: String, required: true },

//     price:           { type: Number, required: true },
//     discountedPrice: { type: Number, default: null },
//     durationInMonths:{ type: Number, required: true },

//     features: [{ type: String }],

//     // ── Images ──────────────────────────────
//     bannerImage:   { type: String, default: "" },
//     galleryImages: [{ type: String }],

//     // ── FAQs ────────────────────────────────
//     faqs: [
//       {
//         question: { type: String },
//         answer:   { type: String },
//       },
//     ],

//     // ── Process Steps ────────────────────────
//     processSteps: [
//       {
//         title:       { type: String },
//         description: { type: String },
//       },
//     ],

//     // ── SEO ──────────────────────────────────
//     seo: {
//       metaTitle:       { type: String, default: "" },
//       metaDescription: { type: String, default: "" },
//       ogImage:         { type: String, default: "" },
//     },

//     isActive:  { type: Boolean, default: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("PremiumService", premiumServiceSchema);


import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },

    type: {
      type: String,
      enum: [
        "text",
        "textarea",
        "email",
        "phone",
        "number",
        "url",
        "file",
        "date",
        "select",
        "radio",
        "checkbox",
      ],
      default: "text",
    },

    placeholder: String,
    options: [String],

    required: {
      type: Boolean,
      default: false,
    },

    validation: {
      min: Number,
      max: Number,
      regex: String,
    },
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountedPrice: Number,

    deliveryTime: {
      value: Number,
      unit: {
        type: String,
        enum: ["hours", "days", "weeks"],
        default: "hours",
      },
    },

    features: [String],

    isRecommended: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

const processSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
  },
  { _id: false }
);

const deliverableSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    icon: String,
  },
  { _id: false }
);

const premiumServiceSchema = new mongoose.Schema(
  {
    // Basic
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: String,

    description: {
      type: String,
      required: true,
    },

    // Category
    category: {
      type: String,
      enum: [
        "resume",
        "linkedin",
        "mock-interview",
        "career-guidance",
        "mentorship",
        "referral",
        "portfolio",
        "website-review",
        "other",
      ],
      default: "other",
    },

    // Service Type
    serviceType: {
      type: String,
      enum: [
        "digital",
        "document-review",
        "meeting",
        "consultation",
        "subscription",
      ],
      default: "digital",
    },

    // Pricing
    price: Number,

    discountedPrice: Number,

    plans: [planSchema],

    durationInMonths: Number,

    // Dynamic Form
    requiredFields: [fieldSchema],

    // Features
    features: [String],

    deliverables: [deliverableSchema],

    // Delivery
    turnaroundTime: {
      value: {
        type: Number,
        default: 24,
      },
      unit: {
        type: String,
        enum: ["hours", "days"],
        default: "hours",
      },
    },

    revision: {
      count: {
        type: Number,
        default: 0,
      },

      validityDays: {
        type: Number,
        default: 0,
      },
    },

    reviewMode: {
      type: String,
      enum: ["AI", "Human", "AI + Human"],
      default: "Human",
    },

    meeting: {
      required: {
        type: Boolean,
        default: false,
      },

      provider: {
        type: String,
        default: "Google Meet",
      },

      duration: {
        type: Number,
        default: 30,
      },
    },

    attachments: {
      maxFiles: {
        type: Number,
        default: 5,
      },

      maxSizeMB: {
        type: Number,
        default: 10,
      },

      allowedTypes: {
        type: [String],
        default: ["pdf", "doc", "docx"],
      },
    },

    // Badge
    badge: {
      type: String,
      enum: [
        "",
        "Best Seller",
        "Popular",
        "Recommended",
        "Premium",
        "New",
      ],
      default: "",
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },

    // Images
    bannerImage: {
      type: String,
      default: "",
    },

    galleryImages: [String],

    // FAQs
    faqs: [faqSchema],

    // Process
    processSteps: [processSchema],

    // Related Services
    relatedServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PremiumService",
      },
    ],

    // CTA
    primaryCTA: {
      type: String,
      default: "Buy Now",
    },

    secondaryCTA: {
      type: String,
      default: "Talk to Expert",
    },

    // Coupon
    allowCoupons: {
      type: Boolean,
      default: true,
    },

    // SEO
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      canonicalUrl: String,
      ogImage: String,
    },

    // Stats
    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    // Status
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PremiumService", premiumServiceSchema);