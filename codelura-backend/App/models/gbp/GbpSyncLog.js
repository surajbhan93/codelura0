import mongoose from "mongoose";

const gbpSyncLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation" },
  syncType: { type: String, enum: ["full", "locations", "reviews", "posts", "performance", "keywords", "media"] },
  status: { type: String, enum: ["running", "success", "partial", "failed"], default: "running" },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  errors: [{ resource: String, message: String }],
  itemsSynced: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("GbpSyncLog", gbpSyncLogSchema);
