import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    // ✅ Banner image (Cloudinary) — shown as hero on detail page
    bannerImage: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

   type: {
  type: String,
  enum: [
    "internship",
    "full-time",
    "part-time",
    "contract",
    "off-campus",
    "walk-in",
    "codelura",
  ],
  required: [true, "Job type is required"],
},

    salary: {
      type: String,
      default: "",
    },

    // Short one-liner shown on cards
    description: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },

    // ✅ Full rich-text HTML (ReactQuill) — shown on detail page
    content: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    careerPageUrl: {
      type: String,
      required: [true, "Career page URL is required"],
      trim: true,
    },
    /* ─────────────────────────────────────
       SEO FIELDS
    ───────────────────────────────────── */

    seo: {
      // Google title
      metaTitle: {
        type: String,
        trim: true,
        maxlength: 70,
        default: "",
      },

      // Google description
      metaDescription: {
        type: String,
        trim: true,
        maxlength: 180,
        default: "",
      },

      // Mainly useful internally/content organization.
      // Google does not rely on meta keywords for ranking.
      keywords: {
        type: [String],
        default: [],
      },

      // Optional custom canonical.
      // Normally leave empty and generate canonical from slug.
      canonicalUrl: {
        type: String,
        trim: true,
        default: "",
      },

      // Optional custom social-sharing image
      ogImage: {
        type: String,
        default: "",
      },

      // Keep false for normal public jobs.
      noIndex: {
        type: Boolean,
        default: false,
      },
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isExpired: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },

    postedAt: {
      type: Date,
      default: Date.now,
    },

    deadline: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

/* ── Auto slug from title ── */
jobSchema.pre("save", async function () {
  if (!this.slug && this.title) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      Date.now().toString(36);
  }
});

jobSchema.index({ slug: 1 });
jobSchema.index({ type: 1 });
jobSchema.index({ isExpired: 1 });
jobSchema.index({ isFeatured: 1 });
jobSchema.index({ postedAt: -1 });
jobSchema.index({ tags: 1 });

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);
export default Job;