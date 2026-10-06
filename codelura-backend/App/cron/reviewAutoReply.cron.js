/**
 * Review Auto-Reply Cron Job
 * Runs every 5 minutes to check for new reviews and auto-reply to unreplied reviews
 */

import cron from 'node-cron';
import mongoose from 'mongoose';
import GbpLocation from '../models/gbp/GbpLocation.js';
import GbpReviewAutomationSettings from '../models/gbp/GbpReviewAutomationSettings.js';
import { syncReviews, processLocationAutoReplies } from '../services/gbp/gbpReview.service.js';

let isRunning = false;

/**
 * Auto-reply worker - syncs reviews and processes auto-replies for all locations with automation enabled
 */
async function runAutoReplyWorker() {
  if (isRunning) {
    console.log('[Review Auto-Reply] Previous worker run still active, skipping...');
    return;
  }

  // Check database connection before executing queries
  if (mongoose.connection.readyState !== 1) {
    console.warn('[Review Auto-Reply] Database not connected, skipping worker run...');
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    console.log('[Review Auto-Reply] === STARTING REVIEW SYNC & AUTO-REPLY WORKER ===');

    // Find all locations with automation enabled
    const automationSettings = await GbpReviewAutomationSettings.find({
      automaticRepliesEnabled: true,
      autoPublishEnabled: true,
    }).populate('locationId');

    if (automationSettings.length === 0) {
      console.log('[Review Auto-Reply] No locations with automation enabled currently.');
      return;
    }

    console.log(`[Review Auto-Reply] Found ${automationSettings.length} locations with automation enabled.`);

    let totalSynced = 0;
    let totalReplied = 0;
    let errors = 0;

    for (const setting of automationSettings) {
      try {
        if (!setting.locationId || !setting.userId) {
          continue;
        }

        const location = setting.locationId;
        console.log(`[Review Auto-Reply] Processing location: ${location.locationName}`);

        // 1. Sync reviews to get latest from Google (if token valid)
        try {
          const syncRes = await syncReviews(setting.userId, location._id);
          totalSynced += syncRes.synced || 0;
          console.log(`[Review Auto-Reply] ✓ Synced ${syncRes.synced} reviews for ${location.locationName}`);
        } catch (syncErr) {
          console.warn(`[Review Auto-Reply] Sync warning for ${location.locationName}:`, syncErr.message);
        }

        // 2. Process all unreplied reviews in DB for this location
        const replyRes = await processLocationAutoReplies(setting.userId, location._id, { maxCount: 25 });
        totalReplied += replyRes.successful || 0;

        if (replyRes.successful > 0) {
          console.log(`[Review Auto-Reply] ✓ Published ${replyRes.successful} auto-replies for ${location.locationName}`);
        }

      } catch (locationError) {
        errors++;
        console.error(`[Review Auto-Reply] Error on location:`, locationError.message);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[Review Auto-Reply] ✓ Worker finished in ${duration}ms (${totalSynced} synced, ${totalReplied} auto-replies published, ${errors} errors)`);

  } catch (fatalError) {
    console.error('[Review Auto-Reply] Worker fatal error:', fatalError);
  } finally {
    isRunning = false;
  }
}

/**
 * Start the review auto-reply cron scheduler
 */
export function startReviewAutoReplyCron() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    runAutoReplyWorker();
  });

  console.log('[Review Auto-Reply] ✓ Cron scheduler initialized (runs every 5 minutes)');

  // Run initial check on server start (after 10s delay to allow DB/OAuth to initialize)
  setTimeout(() => {
    console.log('[Review Auto-Reply] Running initial review automation check...');
    runAutoReplyWorker();
  }, 10000);
}

export default {
  startReviewAutoReplyCron,
  runAutoReplyWorker,
};
