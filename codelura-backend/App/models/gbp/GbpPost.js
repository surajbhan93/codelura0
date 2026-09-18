import mongoose from "mongoose";

const gbpPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpCampaign" },
  recurringScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpRecurringSchedule" },
  
  // Google identifiers
  googleLocationId: { type: String },
  googleAccountId: { type: String },
  googlePostId: { type: String },
  googleResourceName: { type: String },
  
  // Status and scheduling
  status: {
    type: String,
    enum: ["draft", "scheduled", "processing", "published", "failed", "cancelled", "deleted"],
    default: "draft",
    index: true,
  },
  scheduledAt: { type: Date, index: true },
  scheduledTimezone: { type: String, default: "Asia/Kolkata" },
  publishedAt: { type: Date },
  
  // Content
  topicType: {
    type: String,
    enum: ["STANDARD", "EVENT", "OFFER", "ALERT"],
    default: "STANDARD",
  },
  summary: { type: String },
  callToAction: {
    actionType: String,
    url: String,
  },
  media: [{
    mediaFormat: String,
    sourceUrl: String,
    googleName: String,
  }],
  
  // Event details
  event: {
    title: String,
    schedule: {
      startDate: mongoose.Schema.Types.Mixed,
      startTime: mongoose.Schema.Types.Mixed,
      endDate: mongoose.Schema.Types.Mixed,
      endTime: mongoose.Schema.Types.Mixed,
    },
  },
  
  // Offer details
  offer: {
    couponCode: String,
    redeemOnlineUrl: String,
    termsConditions: String,
  },
  
  // Publishing control
  claimedAt: { type: Date },
  claimedBy: { type: String }, // worker process ID
  lockExpiry: { type: Date },
  
  // Retry logic
  retryCount: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  nextRetryAt: { type: Date },
  lastAttemptAt: { type: Date },
  
  // Error tracking
  errorMessage: { type: String },
  errorCode: { type: String },
  lastError: mongoose.Schema.Types.Mixed,
  
  // Metadata
  aiGenerated: { type: Boolean, default: false },
  aiPrompt: String,
  createdBy: String,
  approvedBy: String,
  approvedAt: Date,
}, { timestamps: true });

// Indexes for efficient querying
gbpPostSchema.index({ locationId: 1, createdAt: -1 });
gbpPostSchema.index({ status: 1, scheduledAt: 1 });
gbpPostSchema.index({ userId: 1, status: 1, scheduledAt: 1 });
gbpPostSchema.index({ campaignId: 1, status: 1 });
gbpPostSchema.index({ status: 1, nextRetryAt: 1 });
gbpPostSchema.index({ claimedAt: 1, lockExpiry: 1 });

export default mongoose.model("GbpPost", gbpPostSchema);
