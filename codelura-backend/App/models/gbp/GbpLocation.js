import mongoose from "mongoose";

const gbpLocationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  googleAccountId: { type: String, required: true },
  googleLocationId: { type: String, required: true },
  locationName: { type: String },
  
  // Phone Numbers (Current Google API structure)
  phoneNumbers: {
    primaryPhone: String,
    additionalPhones: [String],
  },
  // Legacy support
  primaryPhone: { type: String },
  
  websiteUri: { type: String },
  primaryCategory: {
    displayName: String,
    categoryId: String,
  },
  additionalCategories: [{ displayName: String, categoryId: String }],
  
  // Storefront Address (Current Google API structure)
  storefrontAddress: {
    regionCode: String,
    postalCode: String,
    administrativeArea: String,
    locality: String,
    addressLines: [String],
  },
  // Legacy support
  address: {
    regionCode: String,
    postalCode: String,
    administrativeArea: String,
    locality: String,
    addressLines: [String],
  },
  
  regularHours: { periods: [mongoose.Schema.Types.Mixed] },
  specialHours: mongoose.Schema.Types.Mixed,
  profile: { description: String },
  serviceArea: mongoose.Schema.Types.Mixed,
  labels: [String],
  adWordsLocationExtensions: mongoose.Schema.Types.Mixed,
  latlng: { latitude: Number, longitude: Number },
  openInfo: { status: String, canReopen: Boolean },
  metadata: mongoose.Schema.Types.Mixed,
  moreHours: [mongoose.Schema.Types.Mixed],
  serviceItems: [mongoose.Schema.Types.Mixed],
  storefront: mongoose.Schema.Types.Mixed,
  
  // Derived
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  verificationState: { type: String, default: "UNVERIFIED" },
  profileCompleteness: { type: Number, default: 0 },
  isPrimary: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastSyncedAt: { type: Date },
  syncStatus: { type: String, enum: ["idle", "syncing", "error"], default: "idle" },
  rawData: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

gbpLocationSchema.index({ userId: 1, googleLocationId: 1 }, { unique: true });
gbpLocationSchema.index({ userId: 1 });

export default mongoose.model("GbpLocation", gbpLocationSchema);
