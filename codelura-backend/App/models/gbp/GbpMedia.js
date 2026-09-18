import mongoose from "mongoose";

const gbpMediaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
  googleLocationId: { type: String },
  googleName: { type: String },
  mediaFormat: { type: String, enum: ["PHOTO", "VIDEO"] },
  category: { type: String }, // EXTERIOR, INTERIOR, PRODUCT, etc.
  sourceUrl: { type: String },
  googleUrl: { type: String },
  thumbnailUrl: { type: String },
  dimensions: { widthPixels: Number, heightPixels: Number },
  locationAssociation: { category: String },
  uploadStatus: { type: String, enum: ["uploading", "uploaded", "failed"], default: "uploading" },
  createTime: { type: Date },
}, { timestamps: true });

gbpMediaSchema.index({ locationId: 1, createdAt: -1 });

export default mongoose.model("GbpMedia", gbpMediaSchema);
