import mongoose from "mongoose";

const linkedInPromotionSchema = new mongoose.Schema(
  {
    // Reference to the job
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    // User who created this promotion
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // LinkedIn page/profile where post will be published
    linkedInPageId: {
      type: String,
      default: null,
    },

    linkedInPageName: {
      type: String,
      default: null,
    },

    // Post content
    postContent: {
      type: String,
      required: true,
    },

    // Media URL (optional image/banner)
    mediaUrl: {
      type: String,
      default: null,
    },

    // Hashtags
    hashtags: {
      type: [String],
      default: [],
    },

    // Publishing mode
    publishMode: {
      type: String,
      enum: ["now", "scheduled"],
      default: "now",
    },

    // Scheduled date/time (for scheduled posts)
    scheduledAt: {
      type: Date,
      default: null,
      index: true,
    },

    // Actual published date/time
    publishedAt: {
      type: Date,
      default: null,
    },

    // LinkedIn post ID (URN from LinkedIn API)
    linkedInPostId: {
      type: String,
      default: null,
      index: true,
    },

    linkedInPostUrl: {
      type: String,
      default: null,
    },

    // Status tracking
    status: {
      type: String,
      enum: ["draft", "scheduled", "publishing", "published", "failed", "cancelled"],
      default: "draft",
      index: true,
    },

    // Error tracking
    errorMessage: {
      type: String,
      default: null,
    },

    retryCount: {
      type: Number,
      default: 0,
    },

    lastRetryAt: {
      type: Date,
      default: null,
    },

    // AI auto-reply settings
    aiAutoReply: {
      enabled: {
        type: Boolean,
        default: false,
      },
      mode: {
        type: String,
        enum: ["automatic", "approval_required"],
        default: "approval_required",
      },
      lastCheckedAt: {
        type: Date,
        default: null,
      },
    },

    // Metrics
    metrics: {
      impressions: {
        type: Number,
        default: 0,
      },
      clicks: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
      comments: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for efficient queries
linkedInPromotionSchema.index({ jobId: 1, userId: 1 });
linkedInPromotionSchema.index({ status: 1, scheduledAt: 1 });
linkedInPromotionSchema.index({ linkedInPostId: 1 });
linkedInPromotionSchema.index({ createdAt: -1 });

// Virtual for job details
linkedInPromotionSchema.virtual("job", {
  ref: "Job",
  localField: "jobId",
  foreignField: "_id",
  justOne: true,
});

// Method to check if ready to publish
linkedInPromotionSchema.methods.isReadyToPublish = function() {
  if (this.status !== "scheduled") return false;
  if (!this.scheduledAt) return false;
  return new Date() >= this.scheduledAt;
};

// Method to mark as published
linkedInPromotionSchema.methods.markAsPublished = function(postId, postUrl) {
  this.status = "published";
  this.linkedInPostId = postId;
  this.linkedInPostUrl = postUrl;
  this.publishedAt = new Date();
  this.errorMessage = null;
  return this.save();
};

// Method to mark as failed
linkedInPromotionSchema.methods.markAsFailed = function(error) {
  this.status = "failed";
  this.errorMessage = error;
  this.retryCount += 1;
  this.lastRetryAt = new Date();
  return this.save();
};

// Static method to get pending scheduled posts
linkedInPromotionSchema.statics.getPendingScheduled = function() {
  return this.find({
    status: "scheduled",
    scheduledAt: { $lte: new Date() },
  }).populate("jobId");
};

const LinkedInPromotion = mongoose.models.LinkedInPromotion || 
  mongoose.model("LinkedInPromotion", linkedInPromotionSchema);

export default LinkedInPromotion;
