import mongoose from "mongoose";

/**
 * GbpServiceActivityLog - Immutable audit trail for every service change.
 * Records who approved it, what Google returned, and when it happened.
 */
const gbpServiceActivityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true },
    googleLocationId: { type: String },
    locationName: { type: String },

    // Type of activity
    activityType: {
      type: String,
      enum: [
        "SERVICE_ADD",
        "SERVICE_MODIFY",
        "SERVICE_REMOVE",
        "SERVICE_SYNC",
        "AI_ANALYSIS",
        "AI_AUTO_OPTIMIZATION",
        "RECOMMENDATION_APPROVED",
        "RECOMMENDATION_REJECTED",
        "BULK_APPLY",
      ],
      required: true,
    },

    // What triggered this
    trigger: {
      type: String,
      enum: ["USER", "AI_AUTO", "SCHEDULED", "SYNC"],
      default: "USER",
    },

    // Human-readable summary
    description: { type: String },

    // Service details involved
    serviceName: { type: String },
    serviceTypeId: { type: String },
    action: { type: String, enum: ["ADD", "MODIFY", "REMOVE", "KEEP", "REVIEW", "SYNC", "ANALYZE"] },

    // AI confidence if applicable
    aiConfidence: { type: Number },

    // Google API result
    googleSuccess: { type: Boolean, default: null },
    googleMessage: { type: String },

    // Reference to the recommendation that was applied (if any)
    recommendationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpServiceRecommendation" },

    // Extra metadata
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

gbpServiceActivityLogSchema.index({ userId: 1, locationId: 1, createdAt: -1 });

export default mongoose.model("GbpServiceActivityLog", gbpServiceActivityLogSchema);
