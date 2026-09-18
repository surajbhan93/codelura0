import cron from "node-cron";
import { publishScheduledPosts } from "../services/gbp/gbpPost.service.js";
import mongoose from "mongoose";
import GbpPost from "../models/gbp/GbpPost.js";

let isRunning = false;
let lastHeartbeat = new Date();
let totalProcessed = 0;

/**
 * Server restart recovery
 * Process any posts that were due while server was down
 */
const recoverOverduePosts = async () => {
  try {
    console.log("[GBP Scheduler] Checking for overdue posts after server restart...");
    
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    
    // Find posts that should have been published but weren't
    const overduePosts = await GbpPost.countDocuments({
      status: "scheduled",
      scheduledAt: { $lte: now, $gte: tenMinutesAgo },
      retryCount: { $lt: 4 }
    });
    
    if (overduePosts > 0) {
      console.log(`[GBP Scheduler] Found ${overduePosts} overdue post(s). Processing now...`);
      await publishScheduledPosts();
    } else {
      console.log("[GBP Scheduler] No overdue posts found.");
    }
    
    // Clean up any stale locks (older than 10 minutes)
    const staleLocks = await GbpPost.updateMany(
      {
        status: "processing",
        lockExpiry: { $lt: tenMinutesAgo }
      },
      {
        $set: {
          status: "scheduled",
          claimedAt: null,
          claimedBy: null,
          lockExpiry: null,
          errorMessage: "Lock expired - worker may have crashed"
        }
      }
    );
    
    if (staleLocks.modifiedCount > 0) {
      console.log(`[GBP Scheduler] Released ${staleLocks.modifiedCount} stale lock(s)`);
    }
    
  } catch (err) {
    console.error("[GBP Scheduler] Recovery error:", err.message);
  }
};

/**
 * Main scheduler task
 */
const schedulerTask = async () => {
  // Prevent concurrent execution
  if (isRunning) {
    console.log("[GBP Scheduler] Previous task still running, skipping...");
    return;
  }
  
  // Check database connection
  if (mongoose.connection.readyState !== 1) {
    console.warn("[GBP Scheduler] Database not connected, skipping...");
    return;
  }
  
  isRunning = true;
  const startTime = Date.now();
  
  try {
    const count = await publishScheduledPosts();
    const duration = Date.now() - startTime;
    
    if (count > 0) {
      totalProcessed += count;
      console.log(`[GBP Scheduler] ✓ Published ${count} post(s) in ${duration}ms (total: ${totalProcessed})`);
    }
    
    lastHeartbeat = new Date();
    
  } catch (err) {
    console.error("[GBP Scheduler] Task error:", err.message);
  } finally {
    isRunning = false;
  }
};

/**
 * Health check and stats logging (every 5 minutes)
 */
const healthCheck = async () => {
  try {
    if (mongoose.connection.readyState !== 1) return;
    
    const now = new Date();
    const stats = {
      heartbeat: lastHeartbeat,
      totalProcessed,
      scheduled: await GbpPost.countDocuments({ status: "scheduled" }),
      processing: await GbpPost.countDocuments({ status: "processing" }),
      failed: await GbpPost.countDocuments({ status: "failed", retryCount: { $gte: 4 } }),
      overdue: await GbpPost.countDocuments({ status: "scheduled", scheduledAt: { $lt: now } }),
    };
    
    console.log(`[GBP Scheduler] Health: ${JSON.stringify(stats)}`);
    
    // Alert if too many overdue
    if (stats.overdue > 10) {
      console.warn(`[GBP Scheduler] ⚠️  ${stats.overdue} posts are overdue!`);
    }
    
  } catch (err) {
    console.error("[GBP Scheduler] Health check error:", err.message);
  }
};

/**
 * Start the GBP post scheduler
 */
export const startGbpPostScheduler = () => {
  console.log("[GBP Scheduler] Starting post scheduler...");
  
  // Wait for database connection, then recover
  setTimeout(async () => {
    if (mongoose.connection.readyState === 1) {
      await recoverOverduePosts();
    }
  }, 5000); // Wait 5 seconds for DB to be ready
  
  // Run every minute
  cron.schedule("* * * * *", schedulerTask);
  console.log("[GBP Scheduler] ✓ Scheduler started (runs every minute)");
  
  // Health check every 5 minutes
  cron.schedule("*/5 * * * *", healthCheck);
  console.log("[GBP Scheduler] ✓ Health check enabled (every 5 minutes)");
};

/**
 * Get scheduler status (for admin dashboard)
 */
export const getSchedulerStatus = async () => {
  const now = new Date();
  
  return {
    status: isRunning ? "running" : "idle",
    lastHeartbeat,
    totalProcessed,
    uptime: process.uptime(),
    pending: await GbpPost.countDocuments({ status: "scheduled", scheduledAt: { $lte: now } }),
    processing: await GbpPost.countDocuments({ status: "processing" }),
    failed: await GbpPost.countDocuments({ status: "failed", retryCount: { $gte: 4 } }),
    scheduled: await GbpPost.countDocuments({ status: "scheduled" }),
  };
};
