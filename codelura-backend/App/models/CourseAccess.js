import mongoose from "mongoose";

const courseAccessSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  accessType: {
    type: String,
    enum: ["read", "full"],
    default: "read"
  },

  grantedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("CourseAccess", courseAccessSchema);