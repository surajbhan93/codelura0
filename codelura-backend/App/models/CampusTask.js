import mongoose from "mongoose";

const campusTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["social", "workshop", "outreach", "feedback", "content", "referral", "other"],
      default: "social",
      lowercase: true,
      trim: true,
    },
    points: {
      type: Number,
      required: true,
      default: 50,
    },
    rewardAmount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
    },
    targetColleges: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    actionLink: {
      type: String,
      default: "",
    },
    instructions: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CampusTask", campusTaskSchema);
