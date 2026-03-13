import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
{
  hackathon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hackathon",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  projectTitle: {
    type: String,
    required: true,
    trim: true
  },

  projectDescription: {
    type: String,
    required: true
  },

  problemStatement: {
    type: String
  },

  solution: {
    type: String
  },

  techStack: [
    {
      type: String
    }
  ],

  githubRepo: {
    type: String
  },

  demoVideo: {
    type: String
  },

  liveUrl: {
    type: String
  },

  pitchDeck: {
    type: String
  },

  screenshots: [
    {
      type: String
    }
  ],

  // AI evaluation fields
  aiClassification: {
    type: String
  },

  plagiarismScore: {
    type: Number,
    default: 0
  },

  innovationScore: {
    type: Number,
    default: 0
  },

  technicalScore: {
    type: Number,
    default: 0
  },

  impactScore: {
    type: Number,
    default: 0
  },

  score: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["submitted", "evaluating", "evaluated", "rejected"],
    default: "submitted"
  }

},
{ timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);