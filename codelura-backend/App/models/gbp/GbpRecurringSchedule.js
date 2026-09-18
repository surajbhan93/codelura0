import mongoose from "mongoose";

const gbpRecurringScheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpCampaign" },
  
  name: { type: String, required: true },
  description: String,
  
  // Recurrence pattern
  recurrenceType: {
    type: String,
    enum: ["daily", "weekly", "biweekly", "monthly", "custom"],
    required: true,
  },
  
  // For weekly/biweekly
  daysOfWeek: [{ type: Number, min: 0, max: 6 }], // 0=Sunday, 6=Saturday
  
  // For monthly
  dayOfMonth: { type: Number, min: 1, max: 31 },
  
  // Time
  timeOfDay: { type: String, required: true }, // "10:00"
  timezone: { type: String, default: "Asia/Kolkata" },
  
  // Post template
  postType: {
    type: String,
    enum: ["STANDARD", "EVENT", "OFFER", "ALERT"],
    default: "STANDARD",
  },
  summaryTemplate: String,
  callToAction: {
    actionType: String,
    url: String,
  },
  media: [{
    mediaFormat: String,
    sourceUrl: String,
  }],
  
  // Event/Offer templates (if applicable)
  eventTemplate: mongoose.Schema.Types.Mixed,
  offerTemplate: mongoose.Schema.Types.Mixed,
  
  // Schedule duration
  startDate: { type: Date, required: true },
  endDate: Date,
  maxOccurrences: Number,
  
  // Status
  status: {
    type: String,
    enum: ["active", "paused", "completed", "cancelled"],
    default: "active",
    index: true,
  },
  
  // Tracking
  lastGeneratedAt: Date,
  nextScheduledAt: Date,
  occurrenceCount: { type: Number, default: 0 },
  
  // AI settings
  aiGenerated: { type: Boolean, default: false },
  aiContentRotation: { type: Boolean, default: false },
}, { timestamps: true });

gbpRecurringScheduleSchema.index({ userId: 1, locationId: 1, status: 1 });
gbpRecurringScheduleSchema.index({ nextScheduledAt: 1, status: 1 });

export default mongoose.model("GbpRecurringSchedule", gbpRecurringScheduleSchema);
