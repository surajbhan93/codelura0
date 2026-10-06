import mongoose from "mongoose";

/**
 * GbpService - Stores synced Google Business Profile services for a location.
 * Supports both StructuredServiceItem and FreeFormServiceItem from Google's API.
 */
const gbpServiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
    googleLocationId: { type: String, required: true },
    googleAccountId: { type: String, required: true },

    // "STRUCTURED" | "FREE_FORM"
    serviceType: { type: String, enum: ["STRUCTURED", "FREE_FORM"], required: true },

    // For structured services: Google's canonical serviceTypeId (e.g. "gcid:web_design_service")
    serviceTypeId: { type: String, default: null },

    // For structured: the Google categoryId this service belongs to
    categoryId: { type: String, default: null },

    // Category display name (e.g. "Private Tutor", "Education Centre", "Tutor", etc.)
    categoryName: { type: String, default: null },

    // Service description from Google Business Profile
    description: { type: String, default: null },

    // Price string (e.g. "Free", "₹5,000", etc.)
    price: { type: String, default: null },

    // Display name as stored in Google (canonical for structured, user-defined for free-form)
    displayName: { type: String, required: true },

    // Normalized lowercase name for deduplication
    normalizedName: { type: String, required: true },

    // Whether the service is currently offered (isOffered=true in Google API)
    isOffered: { type: Boolean, default: true },

    // Where this service came from
    source: {
      type: String,
      enum: ["GOOGLE_SYNC", "MANUAL", "AI_SUGGESTED"],
      default: "GOOGLE_SYNC",
    },

    // Whether Google confirmed this service in the last sync/patch response
    googleSynced: { type: Boolean, default: false },

    // Whether this was generated/recommended by AI (may differ from source if user edited)
    aiGenerated: { type: Boolean, default: false },

    // AI-generated description for UI/reporting (NEVER sent to Google API)
    aiDescription: { type: String, default: null },

    lastSyncedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevent duplicate structured services per location
gbpServiceSchema.index(
  { locationId: 1, serviceTypeId: 1 },
  { unique: true, sparse: true, partialFilterExpression: { serviceType: "STRUCTURED", serviceTypeId: { $ne: null } } }
);

// Prevent duplicate free-form services per location (by normalized name)
gbpServiceSchema.index(
  { locationId: 1, normalizedName: 1 },
  { unique: true, sparse: true, partialFilterExpression: { serviceType: "FREE_FORM" } }
);

gbpServiceSchema.index({ userId: 1, locationId: 1 });

export default mongoose.model("GbpService", gbpServiceSchema);
