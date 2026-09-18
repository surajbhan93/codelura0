import mongoose from "mongoose";

const gbpGoogleAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  googleAccountId: { type: String, required: true },
  accountName: { type: String },
  type: { type: String },
  role: { type: String },
  verificationState: { type: String },
  vettedState: { type: String },
  lastSyncedAt: { type: Date },
}, { timestamps: true });

gbpGoogleAccountSchema.index({ userId: 1, googleAccountId: 1 }, { unique: true });

export default mongoose.model("GbpGoogleAccount", gbpGoogleAccountSchema);
