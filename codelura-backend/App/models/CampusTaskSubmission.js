import mongoose from "mongoose";

const campusTaskSubmissionSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampusTask",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CampusParticipant",
      required: true,
    },
    proofText: {
      type: String,
      default: "",
    },
    proofLinks: [
      {
        type: String,
        trim: true,
      },
    ],
    proofImages: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["submitted", "under_review", "approved", "rejected"],
      default: "submitted",
    },
    pointsAwarded: {
      type: Number,
      default: 0,
    },
    rewardAwarded: {
      type: Number,
      default: 0,
    },
    adminNotes: {
      type: String,
      default: "",
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

campusTaskSubmissionSchema.index({ task: 1, participant: 1 });

export default mongoose.model("CampusTaskSubmission", campusTaskSubmissionSchema);
