import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    icon: {
      type: String, // emoji OR icon name
    },

    image: {
      type: String, // Cloudinary URL
    },

    category: {
      type: String,
      enum: ["website", "app", "design", "software", "marketing", "other"],
      default: "other",
    },

    /* ================= CONTENT ================= */
    features: [String],

    process: [String],

    techStack: [String], // NEW

    idealFor: [String], // NEW (Startups, SMEs etc.)

    /* ================= PRICING ================= */
    startingPrice: {
      type: Number,
    },

    pricing: [
      {
        name: String, // Basic / Standard / Premium
        price: Number,
        features: [String],
      },
    ],

    /* ================= FAQ ================= */
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],

    /* ================= SEO ================= */
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },

    /* ================= CONTROL ================= */
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    /* ================= ANALYTICS ================= */
    views: {
      type: Number,
      default: 0,
    },

    enquiries: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
