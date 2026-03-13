import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
{
  submissionId: { type: String, required: true, index: true },
  hackathonId: { type: String, required: true },

  // Classification Result
  classification: {
    qualityLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"]
    },
    aiJudgingRequired: Boolean,
    flags: [String],
    reason: String
  },

  // Plagiarism Result
  plagiarism: {
    level: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"]
    },
    similarityScore: Number,
    flags: [String],
    reason: String
  },

  // Rule based score
  ruleScore: { type: Number, required: true },

  // Final score
  finalScore: { type: Number, required: true },

  evaluationType: {
    type: String,
    enum: ["RULE_BASED", "AI_ENHANCED"],
    default: "RULE_BASED"
  },

  remarks: { type: String },

  details: {

    ruleBreakdown: {
      descriptionScore: Number,
      techStackScore: Number,
      contentQualityScore: Number,
      isCapped: Boolean
    },

    aiScores: {
      innovation: Number,
      feasibility: Number,
      impact: Number
    }

  },

  evaluatedAt: { type: Date, default: Date.now }

},
{ timestamps: true }
);

// prevent duplicate evaluation
evaluationSchema.index({ submissionId: 1 }, { unique: true });

export default mongoose.model("Evaluation", evaluationSchema);