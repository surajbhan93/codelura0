import mongoose from "mongoose";

const gbpPublishAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpPost", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true },
  
  // Attempt details
  attemptNumber: { type: Number, required: true },
  attemptedAt: { type: Date, default: Date.now },
  
  // Result
  status: {
    type: String,
    enum: ["success", "failed", "timeout", "auth_error", "rate_limited"],
    required: true,
  },
  
  // Google API response
  googleResponseCode: Number,
  googleResponseMessage: String,
  googleResourceName: String,
  googlePostId: String,
  
  // Error details
  errorCode: String,
  errorMessage: String,
  errorDetails: mongoose.Schema.Types.Mixed,
  
  // Timing
  durationMs: Number,
  
  // Next retry
  nextRetryAt: Date,
  willRetry: { type: Boolean, default: false },
}, { timestamps: true });

gbpPublishAttemptSchema.index({ postId: 1, attemptNumber: 1 });
gbpPublishAttemptSchema.index({ status: 1, attemptedAt: -1 });

export default mongoose.model("GbpPublishAttempt", gbpPublishAttemptSchema);
