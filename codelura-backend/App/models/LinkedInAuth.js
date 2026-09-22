import mongoose from "mongoose";

const linkedInAuthSchema = new mongoose.Schema(
  {
    // User who connected LinkedIn
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // OAuth tokens
    accessToken: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    // LinkedIn user/organization info
    linkedInUserId: {
      type: String,
      required: true,
    },

    linkedInUserName: {
      type: String,
      default: null,
    },

    linkedInUserEmail: {
      type: String,
      default: null,
    },

    linkedInProfileUrl: {
      type: String,
      default: null,
    },

    linkedInProfilePicture: {
      type: String,
      default: null,
    },

    // Organization pages (if user has access to company pages)
    organizationPages: [
      {
        id: String,
        name: String,
        vanityName: String,
        logoUrl: String,
      },
    ],

    // Connection status
    isActive: {
      type: Boolean,
      default: true,
    },

    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true 
  }
);

// Index for token expiry checks
linkedInAuthSchema.index({ expiresAt: 1, isActive: 1 });

// Method to check if token is expired
linkedInAuthSchema.methods.isTokenExpired = function() {
  return new Date() >= this.expiresAt;
};

// Method to check if token needs refresh (expires in < 7 days)
linkedInAuthSchema.methods.needsRefresh = function() {
  const daysUntilExpiry = (this.expiresAt - new Date()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry < 7;
};

// Static method to find active auth for user
linkedInAuthSchema.statics.findActiveAuth = function(userId) {
  return this.findOne({
    userId,
    isActive: true,
    expiresAt: { $gt: new Date() },
  });
};

const LinkedInAuth = mongoose.models.LinkedInAuth || 
  mongoose.model("LinkedInAuth", linkedInAuthSchema);

export default LinkedInAuth;
