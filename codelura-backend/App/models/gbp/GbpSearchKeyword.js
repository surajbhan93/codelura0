import mongoose from "mongoose";

const gbpSearchKeywordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
  googleLocationId: { type: String },
  month: { type: String, required: true }, // YYYY-MM
  keywords: [{
    searchKeyword: { type: String },
    insightsValue: { 
      value: { type: String },
      threshold: { type: String }
    }
  }],
}, { timestamps: true });

gbpSearchKeywordSchema.index({ locationId: 1, month: -1 });

export default mongoose.model("GbpSearchKeyword", gbpSearchKeywordSchema);
