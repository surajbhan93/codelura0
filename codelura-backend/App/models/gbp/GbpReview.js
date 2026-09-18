import mongoose from "mongoose";

const gbpReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
  googleLocationId: { type: String, required: true },
  googleReviewId: { type: String, required: true, unique: true },
  reviewer: {
    profilePhotoUrl: String,
    displayName: String,
    isAnonymous: Boolean,
  },
  starRating: { type: String }, // ONE, TWO, THREE, FOUR, FIVE
  comment: { type: String },
  createTime: { type: Date },
  updateTime: { type: Date },
  reviewReply: {
    comment: String,
    updateTime: Date,
  },
  name: { type: String }, // Google resource name
  
  // Automation fields
  automationStatus: {
    type: String,
    enum: ['NEW', 'AI_PROCESSING', 'AI_GENERATED', 'PUBLISHING', 'REPLIED', 'PUBLISH_FAILED', 'SKIPPED', 'MANUAL'],
    default: 'NEW',
  },
  aiGeneratedReply: { type: String },
  aiGeneratedAt: { type: Date },
  publishedAt: { type: Date },
  publishError: { type: String },
  retryCount: { type: Number, default: 0 },
  isAutoReplied: { type: Boolean, default: false },
  
}, { timestamps: true });

gbpReviewSchema.index({ locationId: 1, createTime: -1 });

export default mongoose.model("GbpReview", gbpReviewSchema);
