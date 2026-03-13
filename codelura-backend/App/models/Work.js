import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },

    description: {
      type: String,
      required: true
    },

    shortDescription: {
      type: String,
      maxlength: 200
    },

    caseStudy: {
  problem: String,
  solution: String,
  result: String
},

featuredOrder: {
  type: Number,
  default: 0
},
metrics: {
  users: String,
  performanceGain: String,
  revenueImpact: String
},
duration: {
  type: String
},
role: {
  type: String
},
industry: {
  type: String
},
isConfidential: {
  type: Boolean,
  default: false
},
views: {
  type: Number,
  default: 0
},


    clientName: String,

    category: {
      type: String,
      enum: ["project", "client", "startup"],
      default: "project"
    },

    techStack: {
      type: [String],
      default: []
    },

    thumbnail: String,
    images: {
      type: [String],
      default: []
    },

    liveUrl: String,
    githubUrl: String,

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Work", workSchema);
