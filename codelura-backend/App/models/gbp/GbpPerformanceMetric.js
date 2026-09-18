import mongoose from "mongoose";

const gbpPerformanceMetricSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
  googleLocationId: { type: String, required: true },
  date: { type: Date, required: true },
  metrics: {
    BUSINESS_IMPRESSIONS_DESKTOP_MAPS: Number,
    BUSINESS_IMPRESSIONS_DESKTOP_SEARCH: Number,
    BUSINESS_IMPRESSIONS_MOBILE_MAPS: Number,
    BUSINESS_IMPRESSIONS_MOBILE_SEARCH: Number,
    BUSINESS_CONVERSATIONS: Number,
    BUSINESS_DIRECTION_REQUESTS: Number,
    CALL_CLICKS: Number,
    WEBSITE_CLICKS: Number,
    BUSINESS_BOOKINGS: Number,
    BUSINESS_FOOD_ORDERS: Number,
    BUSINESS_FOOD_MENU_CLICKS: Number,
  },
}, { timestamps: true });

gbpPerformanceMetricSchema.index({ locationId: 1, date: -1 });
gbpPerformanceMetricSchema.index({ locationId: 1, date: 1 }, { unique: true });

export default mongoose.model("GbpPerformanceMetric", gbpPerformanceMetricSchema);
