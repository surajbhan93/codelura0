import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  city: String,
  locationId: String
});

const autogbpSettingsSchema = new mongoose.Schema({

  accountId: {
    type: String,
    required: true
  },

  locations: [locationSchema],

  enabled: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("AutoGBPSettings", autogbpSettingsSchema);