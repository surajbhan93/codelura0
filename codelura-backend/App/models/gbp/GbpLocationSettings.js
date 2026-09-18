import mongoose from "mongoose";

const gbpLocationSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true },
  
  // Posting preferences
  postsPerWeek: { type: Number, default: 3, min: 0, max: 20 },
  preferredDays: [{ type: Number, min: 0, max: 6 }], // 0=Sunday, 6=Saturday
  preferredTimes: [String], // ["10:00", "14:00", "18:00"]
  timezone: { type: String, default: "Asia/Kolkata" },
  
  // Content preferences
  businessTone: {
    type: String,
    enum: ["professional", "friendly", "casual", "formal", "enthusiastic"],
    default: "professional",
  },
  primaryServices: [String],
  targetAudience: String,
  preferredCTAs: [String],
  excludedTopics: [String],
  
  // Templates
  offerTemplates: [{
    name: String,
    description: String,
    termsTemplate: String,
  }],
  
  // Scheduling controls
  isPaused: { type: Boolean, default: false },
  pausedAt: Date,
  pausedReason: String,
  
  // Blackout dates (no posting)
  blackoutDates: [{
    startDate: Date,
    endDate: Date,
    reason: String,
  }],
  
  // AI settings
  aiAutopilotEnabled: { type: Boolean, default: false },
  aiMaxPostsPerWeek: { type: Number, default: 3 },
  aiAllowedPostTypes: [{
    type: String,
    enum: ["STANDARD", "EVENT", "OFFER"],
  }],
  
  // Stats
  totalScheduled: { type: Number, default: 0 },
  totalPublished: { type: Number, default: 0 },
  lastPostAt: Date,
}, { timestamps: true });

gbpLocationSettingsSchema.index({ userId: 1, locationId: 1 }, { unique: true });

export default mongoose.model("GbpLocationSettings", gbpLocationSettingsSchema);
