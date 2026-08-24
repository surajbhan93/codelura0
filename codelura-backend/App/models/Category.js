import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    // ===========================
    // Basic Information
    // ===========================

    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      default: "",
    },

    shortDescription: {
      type: String,
      default: "",
    },

    // ===========================
    // Images
    // ===========================

    thumbnail: {
      type: String,
      default: "",
    },

    banner: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "#4F46E5",
    },

    // ===========================
    // Statistics
    // ===========================

    totalCareerTracks: {
      type: Number,
      default: 0,
    },

    totalCourses: {
      type: Number,
      default: 0,
    },

    totalStudents: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    // ===========================
    // Display
    // ===========================

    featured: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    popular: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },

    // ===========================
    // SEO
    // ===========================

    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },

    metaKeywords: [
      {
        type: String,
      },
    ],

    canonicalUrl: {
      type: String,
      default: "",
    },

    ogImage: {
      type: String,
      default: "",
    },

    robots: {
      type: String,
      default: "index,follow",
    },

    // ===========================
    // Tags
    // ===========================

    tags: [
      {
        type: String,
      },
    ],

    // ===========================
    // Created By
    // ===========================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);