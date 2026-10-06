import mongoose from "mongoose";

/**
 * GbpServiceRecommendation - Stores AI-generated service recommendations per location.
 * Every recommendation is auditable: who approved it, when, what Google returned.
 */
const gbpServiceRecommendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
    googleLocationId: { type: String },
    googleAccountId: { type: String },

    // Recommendation action type
    action: {
      type: String,
      enum: ["ADD", "MODIFY", "REMOVE", "KEEP", "REVIEW"],
      required: true,
    },

    // For MODIFY: the current service name on Google
    existingServiceName: { type: String, default: null },
    existingServiceTypeId: { type: String, default: null },

    // The proposed/suggested service
    proposedServiceName: { type: String, required: true },
    proposedServiceTypeId: { type: String, default: null },
    proposedServiceType: {
      type: String,
      enum: ["STRUCTURED", "FREE_FORM"],
      default: "FREE_FORM",
    },

    // AI confidence score (0-100)
    confidence: { type: Number, min: 0, max: 100 },

    // AI reasoning
    reason: { type: String },

    // Evidence array (e.g. ["Website content", "GBP category", "Search keywords"])
    evidence: [{ type: String }],

    // Whether Google supports this as a structured service for this category
    googleSupported: { type: Boolean, default: false },

    // Category compatibility info
    categoryId: { type: String, default: null },

    // Workflow status
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "APPLIED", "FAILED", "SUPERSEDED"],
      default: "PENDING",
      index: true,
    },

    // AI provider details for auditability
    aiProvider: { type: String, default: "grok" },
    aiModel: { type: String, default: null },

    // Timestamps for the workflow
    reviewedAt: { type: Date, default: null },
    appliedAt: { type: Date, default: null },

    // Google API response after applying (success/failure details)
    googleResult: {
      success: { type: Boolean, default: null },
      message: { type: String, default: null },
      rawResponse: { type: mongoose.Schema.Types.Mixed, default: null },
    },

    // Batch ID: ties recommendations from the same AI analysis run together
    batchId: { type: String, index: true },
  },
  { timestamps: true }
);

gbpServiceRecommendationSchema.index({ userId: 1, locationId: 1, status: 1 });
gbpServiceRecommendationSchema.index({ batchId: 1 });

export default mongoose.model("GbpServiceRecommendation", gbpServiceRecommendationSchema);
