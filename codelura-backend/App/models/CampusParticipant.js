import mongoose from "mongoose";

const campusParticipantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    branch: {
      type: String,
      trim: true,
      default: "",
    },
    year: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    campusId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    referralCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["ambassador", "lead", "coordinator"],
      default: "ambassador",
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "graduated"],
      default: "active",
    },
    points: {
      type: Number,
      default: 0,
    },
    weeklyPoints: {
      type: Number,
      default: 0,
    },
    monthlyPoints: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    pendingEarnings: {
      type: Number,
      default: 0,
    },
    approvedEarnings: {
      type: Number,
      default: 0,
    },
    paidEarnings: {
      type: Number,
      default: 0,
    },
    payoutDetails: {
      upiId: { type: String, default: "" },
      bankAccount: { type: String, default: "" },
      ifsc: { type: String, default: "" },
      accountHolderName: { type: String, default: "" },
    },
    bio: {
      type: String,
      default: "",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampusParticipant", campusParticipantSchema);
