import mongoose from "mongoose";

const gbpMediaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tenantId: { type: String },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true },
  googleLocationId: { type: String, required: true },
  googleAccountId: { type: String },
  googleMediaName: { type: String }, // e.g. accounts/.../locations/.../media/...
  mediaFormat: { type: String, enum: ["PHOTO", "VIDEO"], default: "PHOTO" },
  category: { 
    type: String, 
    enum: [
      "PROFILE", 
      "COVER", 
      "EXTERIOR", 
      "INTERIOR", 
      "PRODUCT", 
      "AT_WORK", 
      "FOOD_AND_DRINK", 
      "MENU", 
      "COMMON_AREA", 
      "ROOMS", 
      "TEAMS", 
      "ADDITIONAL"
    ], 
    default: "ADDITIONAL" 
  },
  source: { type: String, enum: ["BUSINESS", "CUSTOMER", "CODELURA"], default: "BUSINESS" },
  sourceUrl: { type: String },
  googleUrl: { type: String },
  thumbnailUrl: { type: String },
  description: { type: String },
  attribution: {
    displayName: String,
    profilePhotoUrl: String,
    takedownUrl: String,
  },
  dimensions: {
    widthPixels: Number,
    heightPixels: Number,
  },
  fileSize: { type: Number },
  hash: { type: String },
  perceptualHash: { type: String },
  duplicateGroupId: { type: String },
  duplicateRatio: { type: Number, default: 0 },
  isDuplicate: { type: Boolean, default: false },
  duplicateOfMediaId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpMedia" },
  qualityScore: { type: Number, min: 0, max: 100, default: 85 },
  qualityStatus: { type: String, enum: ["EXCELLENT", "GOOD", "NEEDS_IMPROVEMENT", "POOR"], default: "GOOD" },
  aiAnalysis: {
    labels: [String],
    resolutionCheck: String,
    lightingCheck: String,
    blurCheck: String,
    compositionCheck: String,
    relevanceCheck: String,
    issues: [String],
    positives: [String],
    suggestedCategory: String,
    analyzedAt: Date,
  },
  insights: {
    viewCount: { type: Number, default: 0 },
    hasInsights: { type: Boolean, default: false },
  },
  uploadStatus: { type: String, enum: ["uploading", "uploaded", "failed"], default: "uploaded" },
  createTime: { type: Date, default: Date.now },
  lastSyncedAt: { type: Date, default: Date.now },
}, { timestamps: true });

gbpMediaSchema.index({ userId: 1, locationId: 1, createdAt: -1 });
gbpMediaSchema.index({ locationId: 1, category: 1 });
gbpMediaSchema.index({ locationId: 1, source: 1 });
gbpMediaSchema.index({ googleMediaName: 1 });
gbpMediaSchema.index({ hash: 1 });

export default mongoose.model("GbpMedia", gbpMediaSchema);
