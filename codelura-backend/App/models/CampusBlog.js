import mongoose from "mongoose";

const campusBlogSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampusParticipant",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Tech",
    },
    tags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "published", "rejected"],
      default: "submitted",
    },
    publishedBlog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    views: {
      type: Number,
      default: 0,
    },
    uniqueIps: [
      {
        type: String,
      },
    ],
    reached500Views: {
      type: Boolean,
      default: false,
    },
    reached500At: {
      type: Date,
    },
    rewardAmount: {
      type: Number,
      default: 20,
    },
    rewardStatus: {
      type: String,
      enum: ["ineligible", "eligible", "approved", "paid"],
      default: "ineligible",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampusBlog", campusBlogSchema);
