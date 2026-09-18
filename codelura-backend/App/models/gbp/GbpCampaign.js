import mongoose from "mongoose";

const gbpCampaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["active", "paused", "completed", "cancelled"],
    default: "active",
    index: true,
  },
  
  // Multi-location support
  locationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation" }],
  
  // Campaign schedule settings
  postTypes: [{
    type: String,
    enum: ["STANDARD", "EVENT", "OFFER", "ALERT"],
  }],
  postsPerWeek: { type: Number, default: 3 },
  preferredDays: [{ type: Number, min: 0, max: 6 }], // 0=Sunday, 6=Saturday
  preferredTimes: [String], // ["10:00", "14:00", "18:00"]
  timezone: { type: String, default: "Asia/Kolkata" },
  
  // Campaign duration
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  
  // Content settings
  tone: { type: String, default: "professional" },
  allowedCTAs: [String],
  targetServices: [String],
  targetAudience: String,
  excludedTopics: [String],
  
  // AI settings
  aiEnabled: { type: Boolean, default: false },
  aiAutopilot: { type: Boolean, default: false },
  
  // Stats
  totalScheduled: { type: Number, default: 0 },
  totalPublished: { type: Number, default: 0 },
  totalFailed: { type: Number, default: 0 },
  
  // Metadata
  createdBy: String,
  lastPostAt: Date,
}, { timestamps: true });

gbpCampaignSchema.index({ userId: 1, status: 1 });
gbpCampaignSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model("GbpCampaign", gbpCampaignSchema);
