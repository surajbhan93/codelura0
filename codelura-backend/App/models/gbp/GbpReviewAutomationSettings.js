/**
 * GBP Review Automation Settings
 * Per-location configuration for automatic AI review replies
 */

import mongoose from "mongoose";

const gbpReviewAutomationSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GbpLocation',
    required: true,
    index: true,
  },
  
  // Automation Controls
  automaticRepliesEnabled: {
    type: Boolean,
    default: false, // Safe default - requires explicit opt-in
  },
  aiRepliesEnabled: {
    type: Boolean,
    default: true,
  },
  autoPublishEnabled: {
    type: Boolean,
    default: false, // Safe default - requires explicit opt-in
  },
  seoOptimizationEnabled: {
    type: Boolean,
    default: true,
  },
  
  // Rating Filters
  minimumRating: {
    type: String,
    enum: ['all', '4+', '5only'],
    default: 'all',
  },
  negativeReviewAutoReply: {
    type: Boolean,
    default: false, // Safe default for 1-3 star reviews
  },
  
  // Reply Style
  replyLanguage: {
    type: String,
    default: 'en',
  },
  businessTone: {
    type: String,
    enum: ['professional', 'friendly', 'casual'],
    default: 'professional',
  },
  
  // Keywords (for SEO context)
  preferredKeywords: [String],
  
  // Stats
  totalAutoReplies: {
    type: Number,
    default: 0,
  },
  lastAutoReplyAt: Date,
  
}, {
  timestamps: true,
});

// Unique constraint: one setting per location
gbpReviewAutomationSettingsSchema.index({ userId: 1, locationId: 1 }, { unique: true });

export default mongoose.model('GbpReviewAutomationSettings', gbpReviewAutomationSettingsSchema);
