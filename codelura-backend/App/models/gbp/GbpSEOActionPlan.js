import mongoose from "mongoose";

const gbpSEOActionPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
  planType: { type: String, default: "30_day" },
  days: [{
    day: Number,
    title: String,
    description: String,
    category: String,
    isCompleted: { type: Boolean, default: false },
    completedAt: Date,
  }],
  generatedAt: { type: Date, default: Date.now },
  aiModel: { type: String },
}, { timestamps: true });

export default mongoose.model("GbpSEOActionPlan", gbpSEOActionPlanSchema);
