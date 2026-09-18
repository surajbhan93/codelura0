import mongoose from "mongoose";

const gbpCompetitorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
  businessName: { type: String, required: true },
  googlePlaceId: { type: String },
  address: { type: String },
  phone: { type: String },
  website: { type: String },
  mapsUrl: { type: String },
  rating: { type: Number },
  reviewCount: { type: Number },
  category: { type: String },
  notes: { type: String },
  lastUpdatedManually: { type: Date },
}, { timestamps: true });

export default mongoose.model("GbpCompetitor", gbpCompetitorSchema);
