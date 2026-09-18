import mongoose from "mongoose";

const gbpSEOAuditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
  auditType: { type: String, enum: ["profile", "local_seo", "full"], default: "full" },
  overallScore: { type: Number, min: 0, max: 100 },
  categoryScores: {
    profile: Number,
    reviews: Number,
    content: Number,
    localRelevance: Number,
    website: Number,
  },
  criticalIssues: [{ field: String, issue: String, impact: String, recommendation: String }],
  warnings: [{ field: String, issue: String, recommendation: String }],
  recommendations: [{ priority: String, action: String, estimatedImpact: String }],
  completedItems: [{ field: String, label: String }],
  auditData: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

gbpSEOAuditSchema.index({ locationId: 1, createdAt: -1 });

export default mongoose.model("GbpSEOAudit", gbpSEOAuditSchema);
