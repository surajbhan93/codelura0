import mongoose from "mongoose";

const gbpMediaPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  tenantId: { type: String },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
  month: { type: String, required: true }, // YYYY-MM
  recommendedCount: { type: Number, default: 8 },
  uploadedCount: { type: Number, default: 0 },
  weeks: [{
    weekNumber: Number,
    theme: String,
    targetCount: Number,
    goals: [{
      category: String,
      targetCount: Number,
      completedCount: { type: Number, default: 0 },
      description: String,
    }],
    ideas: [{
      title: String,
      category: String,
      composition: String,
      whyUseful: String,
      suggestedCaption: String,
    }]
  }],
  status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

gbpMediaPlanSchema.index({ locationId: 1, month: 1 }, { unique: true });

export default mongoose.model("GbpMediaPlan", gbpMediaPlanSchema);
