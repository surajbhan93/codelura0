import mongoose from "mongoose";

const gbpOAuthTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  googleEmail: { type: String },
  googleAccountId: { type: String },
  encryptedAccessToken: { type: String },
  encryptedRefreshToken: { type: String },
  accessTokenIV: { type: String },
  refreshTokenIV: { type: String },
  tokenExpiry: { type: Date },
  scopes: [String],
  isConnected: { type: Boolean, default: true },
  connectedAt: { type: Date, default: Date.now },
  lastRefreshedAt: { type: Date },
  revokedAt: { type: Date },
}, { timestamps: true });

gbpOAuthTokenSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model("GbpOAuthToken", gbpOAuthTokenSchema);
