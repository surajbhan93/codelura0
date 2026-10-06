import cron from "node-cron";
import mongoose from "mongoose";
import { publishScheduledMedia } from "../services/gbp/gbpMedia.service.js";
import GbpMedia from "../models/gbp/GbpMedia.js";

let isRunning = false;
let lastHeartbeat = new Date();
let totalProcessed = 0;

/**
 * Server restart recovery for overdue scheduled media
 */
const recoverOverdueMedia = async () => {
  try {
    console.log("[GBP Media Scheduler] Checking for overdue scheduled media after restart...");
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    const overdueCount = await GbpMedia.countDocuments({
      status: "scheduled",
      scheduledAt: { $lte: now, $gte: tenMinutesAgo },
      retryCount: { $lt: 4 },
    });

    if (overdueCount > 0) {
      console.log(`[GBP Media Scheduler] Found ${overdueCount} overdue photo(s). Processing now...`);
      await publishScheduledMedia();
    }

    // Release stale locks
    const staleLocks = await GbpMedia.updateMany(
      {
        status: "processing",
        lockExpiry: { $lt: tenMinutesAgo },
      },
      {
        $set: {
          status: "scheduled",
          claimedAt: null,
          claimedBy: null,
          lockExpiry: null,
          errorMessage: "Lock expired - worker released",
        },
      }
    );

    if (staleLocks.modifiedCount > 0) {
      console.log(`[GBP Media Scheduler] Released ${staleLocks.modifiedCount} stale lock(s)`);
    }
  } catch (err) {
    console.error("[GBP Media Scheduler] Recovery notice:", err.message);
  }
};

/**
 * Main 1-minute media publishing task
 */
const mediaSchedulerTask = async () => {
  if (isRunning) return;
  if (mongoose.connection.readyState !== 1) return;

  isRunning = true;
  const startTime = Date.now();

  try {
    const count = await publishScheduledMedia();
    const duration = Date.now() - startTime;

    if (count > 0) {
      totalProcessed += count;
      console.log(`[GBP Media Scheduler] ✓ Published ${count} photo(s) to Google in ${duration}ms (total: ${totalProcessed})`);
    }

    lastHeartbeat = new Date();
  } catch (err) {
    console.error("[GBP Media Scheduler] Task error:", err.message);
  } finally {
    isRunning = false;
  }
};

/**
 * Start the GBP Media Scheduler
 */
export const startGbpMediaScheduler = () => {
  console.log("[GBP Media Scheduler] Starting media scheduler...");

  setTimeout(async () => {
    if (mongoose.connection.readyState === 1) {
      await recoverOverdueMedia();
    }
  }, 6000);

  // Run every minute
  cron.schedule("* * * * *", mediaSchedulerTask);
  console.log("[GBP Media Scheduler] ✓ Media Scheduler started (runs every minute)");
};

/**
 * Get Scheduler Status
 */
export const getMediaSchedulerStatus = async () => {
  const now = new Date();
  return {
    status: isRunning ? "running" : "idle",
    lastHeartbeat,
    totalProcessed,
    pending: await GbpMedia.countDocuments({ status: "scheduled", scheduledAt: { $lte: now } }),
    scheduled: await GbpMedia.countDocuments({ status: "scheduled" }),
    processing: await GbpMedia.countDocuments({ status: "processing" }),
    failed: await GbpMedia.countDocuments({ status: "failed" }),
  };
};
