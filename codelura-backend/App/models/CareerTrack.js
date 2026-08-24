import mongoose from "mongoose";

const CareerTrackSchema = new mongoose.Schema(
  {
    // ===========================
    // Basic Information
    // ===========================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

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
    // Advanced Pricing & Badges
    // ===========================
    badge: {
      type: String,
      default: "CAREER ACCELERATOR",
    },

    price: {
      type: Number,
      default: 14999,
    },

    discountPrice: {
      type: Number,
      default: 9999,
    },

    totalHours: {
      type: String,
      default: "450+ Hours",
    },

    totalProjects: {
      type: Number,
      default: 8,
    },

    salaryRange: {
      type: String,
      default: "₹8 LPA - ₹24 LPA",
    },

    hiringPartners: [
      {
        type: String,
      },
    ],

    perks: [
      {
        type: String,
      },
    ],

    instructors: [
      {
        name: { type: String, required: true },
        title: { type: String, default: "" },
        company: { type: String, default: "" },
        image: { type: String, default: "" },
        bio: { type: String, default: "" },
        highlights: [{ type: String }],
      },
    ],

    // ===========================
    // Learning Path
    // ===========================

    learningPathTitle: {
      type: String,
      default: "Learning Path",
    },

    learningPathDescription: {
      type: String,
      default: "",
    },

    roadmap: [
      {
        title: String,
        description: String,
        duration: String,
        order: Number,
      },
    ],

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Program", 
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    // ===========================
    // Skills
    // ===========================

    skills: [
      {
        type: String,
      },
    ],

    tools: [
      {
        type: String,
      },
    ],

    technologies: [
      {
        type: String,
      },
    ],

    // ===========================
    // Difficulty
    // ===========================

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    duration: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "English",
    },

    certificate: {
      type: Boolean,
      default: true,
    },

    internship: {
      type: Boolean,
      default: false,
    },

    placementSupport: {
      type: Boolean,
      default: false,
    },

    mentorSupport: {
      type: Boolean,
      default: false,
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

    structuredData: {
      type: Object,
      default: {},
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
    // FAQs
    // ===========================

    faqs: [
      {
        question: String,
        answer: String,
      },
    ],

    // ===========================
    // Statistics
    // ===========================

    views: {
      type: Number,
      default: 0,
    },

    uniqueVisitors: {
      type: Number,
      default: 0,
    },

    enrollments: {
      type: Number,
      default: 0,
    },

    completedStudents: {
      type: Number,
      default: 0,
    },

    certificatesIssued: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    shares: {
      type: Number,
      default: 0,
    },

    bookmarks: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 5,
    },

    totalReviews: {
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

    recommended: {
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

    publishedAt: {
      type: Date,
    },

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

export default mongoose.models.CareerTrack ||
  mongoose.model("CareerTrack", CareerTrackSchema);