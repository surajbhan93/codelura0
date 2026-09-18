import mongoose from "mongoose";

const gbpNotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation" },
  type: { type: String, enum: ["new_review", "review_updated", "media_updated", "location_updated", "google_update", "post_published", "post_failed", "system"] },
  title: { type: String },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

gbpNotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export default mongoose.model("GbpNotification", gbpNotificationSchema);
