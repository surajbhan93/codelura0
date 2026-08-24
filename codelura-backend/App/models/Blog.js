// import mongoose from "mongoose";

// const blogSchema = new mongoose.Schema(
//   {
//     title: String,
//     slug: { type: String, unique: true },
//     excerpt: String,
//     content: String,

//     summary: {
//   type: String,
//   default: ""
// },
// /* ---------------- FAQ (AEO/GEO) ---------------- */
//     faqs: [
//       {
//         question: { type: String, required: true },
//         answer: { type: String, required: true },
//       },
//     ],
//     /* ---------------- MEDIA ---------------- */
//     coverImage: String,
//     ogImage: String,

//     /* ---------------- SEO ---------------- */
//     metaTitle: String,
//     metaDescription: String,
//     canonicalUrl: String,

//     /* ---------------- ORGANIZATION ---------------- */
//     tags: [String],
//     category: String,
//     authorName: String,

//     /* ---------------- ENGAGEMENT ---------------- */
//     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     likesCount: { type: Number, default: 0 },
//     views: { type: Number, default: 0 },
//     shareCount: { type: Number, default: 0 },

//     /* ---------------- STATUS ---------------- */
//     isPublished: { type: Boolean, default: false },
//     isFeatured: { type: Boolean, default: false },
//     allowComments: { type: Boolean, default: true },

//     /* ---------------- TIME ---------------- */
//     readingTime: String,
//     publishedAt: { type: Date },

//     // 🔥 Custom Date Breakdown (Optional but useful)
//     publishDay: String,        // Monday
//     publishDate: Number,       // 23
//     publishMonth: String,      // March
//     publishYear: Number,       // 2026
//     publishTime: String        // 10:45 AM
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Blog", blogSchema);


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

    /* ---------------- FAQ (AEO/GEO) ---------------- */
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],

    /* ---------------- MEDIA ---------------- */
    coverImage: String,
    coverImageAlt: String,        // 👈 NEW - image SEO ke liye
    ogImage: String,

    /* ---------------- SEO ---------------- */
    metaTitle: String,
    metaDescription: String,
    canonicalUrl: String,
    focusKeyword: String,          // 👈 NEW - primary keyword track karne ke liye
    secondaryKeywords: [String],   // 👈 NEW - related keywords

    /* ---------------- ORGANIZATION ---------------- */
    tags: [String],
    category: String,
    authorName: String,
    authorBio: String,             // 👈 NEW - E-E-A-T ke liye
    authorImage: String,           // 👈 NEW - E-E-A-T ke liye

    /* ---------------- ENGAGEMENT ---------------- */
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    avgReadTime: Number,           // 👈 NEW - optional, engagement signal

    /* ---------------- STATUS ---------------- */
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true },
    noIndex: { type: Boolean, default: false },   // 👈 NEW - thin/duplicate content ko manually noindex karne ke liye

    /* ---------------- TIME ---------------- */
    readingTime: String,
    publishedAt: { type: Date },
    lastModifiedAt: { type: Date },    // 👈 NEW - AEO ke liye critical (Google isko "freshness" signal maanta hai)

    publishDay: String,
    publishDate: Number,
    publishMonth: String,
    publishYear: Number,
    publishTime: String,

    /* ---------------- RELATED CONTENT (GEO) ---------------- */
    relatedBlogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],  // 👈 NEW - internal linking signal

    /* ---------------- SCHEMA TYPE CONTROL ---------------- */
    schemaType: {                  // 👈 NEW - kabhi HowTo, kabhi Article chahiye hota hai
      type: String,
      enum: ["BlogPosting", "Article", "NewsArticle", "TechArticle"],
      default: "BlogPosting"
    },
  },
  { timestamps: true }
);

// 🔥 lastModifiedAt auto-update
blogSchema.pre("save", async function () {
  this.lastModifiedAt = new Date();
});

export default mongoose.model("Blog", blogSchema);