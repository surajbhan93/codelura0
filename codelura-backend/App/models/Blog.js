import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    excerpt: String,
    content: String,

    summary: {
  type: String,
  default: ""
},
    /* ---------------- MEDIA ---------------- */
    coverImage: String,
    ogImage: String,

    /* ---------------- SEO ---------------- */
    metaTitle: String,
    metaDescription: String,
    canonicalUrl: String,

    /* ---------------- ORGANIZATION ---------------- */
    tags: [String],
    category: String,
    authorName: String,

    /* ---------------- ENGAGEMENT ---------------- */
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },

    /* ---------------- STATUS ---------------- */
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true },

    /* ---------------- TIME ---------------- */
    readingTime: String,
    publishedAt: { type: Date },

    // 🔥 Custom Date Breakdown (Optional but useful)
    publishDay: String,        // Monday
    publishDate: Number,       // 23
    publishMonth: String,      // March
    publishYear: Number,       // 2026
    publishTime: String        // 10:45 AM
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);