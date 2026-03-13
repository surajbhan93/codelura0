import mongoose from "mongoose";

const AutoGBPSchema = new mongoose.Schema(
{
  topic: {
    type: String,
    required: true
  },

  postContent: {
    type: String
  },

  status: {
    type: String,
    enum: ["generated", "published"],
    default: "generated"
  },

  publishedAt: {
    type: Date
  }

},
{ timestamps: true }
);

export default mongoose.model("AutoGBP", AutoGBPSchema);