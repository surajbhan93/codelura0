import { syncAccountsAndLocations, getUserLocations } from "./gbpLocation.service.js";
import { syncReviews } from "./gbpReview.service.js";
import { fetchPerformanceMetrics, fetchSearchKeywords } from "./gbpPerformance.service.js";
import GbpSyncLog from "../../models/gbp/GbpSyncLog.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";

const getDefaultDateRange = (days = 30) => {
  const end = new Date();
  const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return { startDate: start.toISOString().split("T")[0], endDate: end.toISOString().split("T")[0] };
};

export const runFullSync = async (userId) => {
  const log = await GbpSyncLog.create({ userId, syncType: "full", status: "running" });
  let itemsSynced = 0;
  const errors = [];

  try {
    // 1. Sync locations
    await syncAccountsAndLocations(userId);
    itemsSynced++;

    // 2. Sync reviews, performance for each location
    const locations = await getUserLocations(userId);
    const { startDate, endDate } = getDefaultDateRange(30);
    const currentMonth = new Date().toISOString().slice(0, 7);

    for (const loc of locations) {
      try {
        await syncReviews(userId, loc._id.toString());
        itemsSynced++;
      } catch (e) { errors.push({ resource: `reviews:${loc.googleLocationId}`, message: e.message }); }

      try {
        await fetchPerformanceMetrics(userId, loc._id.toString(), startDate, endDate);
        itemsSynced++;
      } catch (e) { errors.push({ resource: `performance:${loc.googleLocationId}`, message: e.message }); }

      try {
        await fetchSearchKeywords(userId, loc._id.toString(), currentMonth);
        itemsSynced++;
      } catch (e) { errors.push({ resource: `keywords:${loc.googleLocationId}`, message: e.message }); }
    }

    await GbpSyncLog.findByIdAndUpdate(log._id, {
      status: errors.length > 0 ? "partial" : "success",
      completedAt: new Date(),
      itemsSynced,
      errors,
    });
  } catch (err) {
    await GbpSyncLog.findByIdAndUpdate(log._id, { status: "failed", completedAt: new Date(), errors: [{ resource: "full_sync", message: err.message }] });
    throw err;
  }
};

export const getLastSyncLog = async (userId) => {
  return GbpSyncLog.findOne({ userId, syncType: "full" }).sort({ createdAt: -1 });
};
