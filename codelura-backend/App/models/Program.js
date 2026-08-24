import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema(
  {
    // ===========================
    // Basic Information
    // ===========================
    name: {
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
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    image: {
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
    // Category / Relations
    // ===========================

    category: {
      type: String,
      enum: ["DSA", "Web Development", "Backend", "Other"],
      default: "Other",
    },

    careerTrack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CareerTrack",
    },

    // ===========================
    // Pricing / Platform Link
    // ===========================

    price: {
      type: Number,
      required: false,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    platformLink: {
      type: String,
      required: false,
      default: "",
    },

    clickCount: {
      type: Number,
      default: 0,
    },

    // ===========================
    // CodeHelp Style Attributes
    // ===========================

    badge: {
      type: String,
      default: "",
    },

    totalHours: {
      type: String,
      default: "",
    },

    totalSectionsCount: {
      type: Number,
      default: 0,
    },

    totalStudentsCount: {
      type: String,
      default: "",
    },

    includedInSubscription: {
      type: Boolean,
      default: true,
    },

    sections: [
      {
        title: { type: String, required: true },
        description: { type: String, default: "" },
        order: { type: Number, default: 0 },
        lessons: [
          {
            title: { type: String, required: true },
            duration: { type: String, default: "" },
            videoUrl: { type: String, default: "" },
            isFreePreview: { type: Boolean, default: false },
          },
        ],
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

    reviews: [
      {
        userName: { type: String, required: true },
        userRole: { type: String, default: "" },
        userAvatar: { type: String, default: "" },
        rating: { type: Number, default: 5 },
        comment: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // ===========================
    // Learning Path
    // ===========================

    points: {
      type: [String],
      default: [],
    },

    roadmap: [
      {
        title: String,
        description: String,
        duration: String,
        order: Number,
      },
    ],

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

    isActive: {
      type: Boolean,
      default: true,
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

export default mongoose.models.Program ||
  mongoose.model("Program", ProgramSchema);