/**
 * Review Auto-Reply Cron Job
 * Runs every 5 minutes to check for new reviews and auto-reply
 */

import cron from 'node-cron';
import GbpLocation from '../models/gbp/GbpLocation.js';
import GbpReviewAutomationSettings from '../models/gbp/GbpReviewAutomationSettings.js';
import { syncReviews } from '../services/gbp/gbpReview.service.js';

let isRunning = false;

/**
 * Auto-reply worker - syncs reviews for all locations with automation enabled
 */
async function runAutoReplyWorker() {
  if (isRunning) {
    console.log('[Review Auto-Reply] Previous job still running, skipping...');
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    console.log('[Review Auto-Reply] Starting review sync worker...');

    // Find all locations with automation enabled
    const automationSettings = await GbpReviewAutomationSettings.find({
      automaticRepliesEnabled: true,
      autoPublishEnabled: true,
    }).populate('locationId');

    if (automationSettings.length === 0) {
      console.log('[Review Auto-Reply] No locations with automation enabled');
      return;
    }

    console.log(`[Review Auto-Reply] Found ${automationSettings.length} locations with automation enabled`);

    // Process each location
    let totalSynced = 0;
    let totalNewReviews = 0;
    let errors = 0;

    for (const setting of automationSettings) {
      try {
        if (!setting.locationId) {
          console.warn('[Review Auto-Reply] Location not found for setting:', setting._id);
          continue;
        }

        const location = setting.locationId;
        console.log(`[Review Auto-Reply] Syncing reviews for: ${location.locationName}`);

        // Sync reviews (which will trigger auto-reply processing)
        const result = await syncReviews(setting.userId, location._id);

        totalSynced += result.synced || 0;
        totalNewReviews += result.newReviews || 0;

        console.log(`[Review Auto-Reply] ✓ ${location.locationName}: ${result.synced} synced, ${result.newReviews} new`);

      } catch (error) {
        errors++;
        console.error(`[Review Auto-Reply] Error syncing location ${setting.locationId._id}:`, error.message);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[Review Auto-Reply] ✓ Worker completed in ${duration}ms`);
    console.log(`[Review Auto-Reply] Stats: ${totalSynced} reviews synced, ${totalNewReviews} new reviews, ${errors} errors`);

  } catch (error) {
    console.error('[Review Auto-Reply] Fatal error:', error);
  } finally {
    isRunning = false;
  }
}

/**
 * Start the cron job
 */
export function startReviewAutoReplyCron() {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    runAutoReplyWorker();
  });

  console.log('[Review Auto-Reply] ✓ Cron job started (runs every 5 minutes)');

  // Run immediately on startup (after 30 seconds delay)
  setTimeout(() => {
    console.log('[Review Auto-Reply] Running initial check...');
    runAutoReplyWorker();
  }, 30000);
}

export default {
  startReviewAutoReplyCron,
};
