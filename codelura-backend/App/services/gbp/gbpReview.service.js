import axios from "axios";
import { getValidAccessToken } from "./gbpOAuth.service.js";
import GbpReview from "../../models/gbp/GbpReview.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpReviewAutomationSettings from "../../models/gbp/GbpReviewAutomationSettings.js";
import { generateReviewReply } from "./gbpGrokAI.service.js";

const GBP_V4 = "https://mybusiness.googleapis.com/v4";
const STAR_MAP = { FIVE: 5, FOUR: 4, THREE: 3, TWO: 2, ONE: 1 };

/**
 * Sync reviews from Google Business Profile API
 */
export const syncReviews = async (userId, locationDbId) => {
  const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!loc) throw { code: 404, message: "Location not found" };

  const accessToken = await getValidAccessToken(userId);
  let nextPageToken = null;
  let synced = 0;
  let newUnrepliedCount = 0;

  do {
    const params = { pageSize: 50 };
    if (nextPageToken) params.pageToken = nextPageToken;

    const res = await axios.get(
      `${GBP_V4}/accounts/${loc.googleAccountId}/locations/${loc.googleLocationId}/reviews`,
      { params, headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const reviews = res.data.reviews || [];
    for (const r of reviews) {
      const reviewId = r.reviewId;
      const hasReplyOnGoogle = !!(r.reviewReply && r.reviewReply.comment);
      
      // Check existing record
      const existing = await GbpReview.findOne({ googleReviewId: reviewId, userId });
      const isNew = !existing;

      // Determine automation status
      let automationStatus = 'NEW';
      if (hasReplyOnGoogle) {
        automationStatus = 'REPLIED';
      } else if (existing?.automationStatus && existing.automationStatus !== 'NEW') {
        automationStatus = existing.automationStatus;
      }

      await GbpReview.findOneAndUpdate(
        { googleReviewId: reviewId },
        {
          userId,
          locationId: locationDbId,
          googleLocationId: loc.googleLocationId,
          googleReviewId: reviewId,
          reviewer: r.reviewer,
          starRating: r.starRating,
          comment: r.comment,
          createTime: new Date(r.createTime),
          updateTime: r.updateTime ? new Date(r.updateTime) : null,
          reviewReply: r.reviewReply,
          name: r.name,
          automationStatus,
          isAutoReplied: existing?.isAutoReplied || false,
        },
        { upsert: true, new: true }
      );

      synced++;
      if (!hasReplyOnGoogle) {
        newUnrepliedCount++;
      }
    }

    // Update location average rating & review count
    const allReviews = await GbpReview.find({ locationId: locationDbId });
    const count = allReviews.length;
    let avg = 0;
    if (count > 0) {
      const sum = allReviews.reduce((acc, r) => acc + (STAR_MAP[r.starRating] || 0), 0);
      avg = Math.round((sum / count) * 10) / 10;
    }
    await GbpLocation.findByIdAndUpdate(locationDbId, {
      averageRating: res.data.averageRating ?? avg,
      reviewCount: res.data.totalReviewCount ?? count,
      lastSyncedAt: new Date(),
    });

    nextPageToken = res.data.nextPageToken || null;
  } while (nextPageToken);

  // Check if automation is enabled, and trigger auto-replies for unreplied reviews
  try {
    const settings = await GbpReviewAutomationSettings.findOne({
      userId,
      locationId: locationDbId,
      automaticRepliesEnabled: true,
      autoPublishEnabled: true,
    });

    if (settings && newUnrepliedCount > 0) {
      console.log(`[Review Sync] Auto-reply enabled for ${loc.locationName} (${newUnrepliedCount} unreplied). Triggering auto-reply worker...`);
      // Run auto-reply in background
      processLocationAutoReplies(userId, locationDbId).catch(err => {
        console.error(`[Review Sync] Background auto-reply error for ${loc.locationName}:`, err.message);
      });
    }
  } catch (err) {
    console.warn(`[Review Sync] Error checking automation settings:`, err.message);
  }

  return { synced, unrepliedCount: newUnrepliedCount };
};

/**
 * Get Reviews with Filtering & Pagination
 */
export const getReviews = async (userId, locationDbId, { page = 1, limit = 20, rating, replied, sort = "newest" } = {}) => {
  const query = { userId };
  if (locationDbId && locationDbId !== "all") {
    query.locationId = locationDbId;
  }
  if (rating) query.starRating = rating.toUpperCase();
  
  if (replied === "true") {
    query["reviewReply.comment"] = { $exists: true, $ne: null, $nin: ["", null] };
  } else if (replied === "false") {
    query.$or = [
      { reviewReply: { $exists: false } },
      { "reviewReply.comment": null },
      { "reviewReply.comment": "" }
    ];
  } else if (replied === "auto") {
    query.isAutoReplied = true;
  }

  const sortObj = sort === "rating" ? { starRating: -1 } : { createTime: -1 };
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Math.min(200, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [reviews, total] = await Promise.all([
    GbpReview.find(query)
      .populate("locationId", "locationName storefrontAddress address primaryCategory")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    GbpReview.countDocuments(query),
  ]);

  return { reviews, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) };
};

/**
 * Reply directly to a Review on Google Business Profile
 */
export const replyToReview = async (userId, locationDbId, googleReviewId, replyText) => {
  const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!loc) throw { code: 404, message: "Location not found" };

  const accessToken = await getValidAccessToken(userId);

  await axios.put(
    `${GBP_V4}/accounts/${loc.googleAccountId}/locations/${loc.googleLocationId}/reviews/${googleReviewId}/reply`,
    { comment: replyText },
    { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
  );

  const updated = await GbpReview.findOneAndUpdate(
    { googleReviewId, userId },
    {
      reviewReply: { comment: replyText, updateTime: new Date() },
      automationStatus: "REPLIED",
      publishedAt: new Date(),
      publishError: null,
    },
    { new: true }
  );

  return updated;
};

/**
 * Delete a Review Reply
 */
export const deleteReviewReply = async (userId, locationDbId, googleReviewId) => {
  const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!loc) throw { code: 404, message: "Location not found" };

  const accessToken = await getValidAccessToken(userId);

  await axios.delete(
    `${GBP_V4}/accounts/${loc.googleAccountId}/locations/${loc.googleLocationId}/reviews/${googleReviewId}/reply`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  await GbpReview.findOneAndUpdate(
    { googleReviewId, userId },
    {
      $unset: { reviewReply: 1 },
      automationStatus: "NEW",
      isAutoReplied: false,
    }
  );
};

/**
 * Process all pending unreplied reviews for a single location with AI Auto-Replies
 */
export const processLocationAutoReplies = async (userId, locationDbId, { maxCount = 50, force = false } = {}) => {
  const location = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!location) throw new Error("Location not found");

  const settings = await GbpReviewAutomationSettings.findOne({ userId, locationId: locationDbId });
  if (!settings && !force) {
    console.log(`[Auto Reply] No settings found for ${location.locationName}, skipping.`);
    return { processed: 0, successful: 0, failed: 0 };
  }

  // If automation not enabled and not forced, return
  if (!force && (!settings?.automaticRepliesEnabled || !settings?.autoPublishEnabled)) {
    console.log(`[Auto Reply] Automation disabled for ${location.locationName}`);
    return { processed: 0, successful: 0, failed: 0 };
  }

  // Find all unreplied reviews for this location
  const unrepliedQuery = {
    userId,
    locationId: locationDbId,
    $or: [
      { reviewReply: { $exists: false } },
      { "reviewReply.comment": null },
      { "reviewReply.comment": "" }
    ],
    automationStatus: { $ne: "REPLIED" }
  };

  const pendingReviews = await GbpReview.find(unrepliedQuery)
    .sort({ createTime: -1 })
    .limit(maxCount);

  if (pendingReviews.length === 0) {
    console.log(`[Auto Reply] No pending reviews for ${location.locationName}`);
    return { processed: 0, successful: 0, failed: 0 };
  }

  console.log(`[Auto Reply] Processing ${pendingReviews.length} pending reviews for ${location.locationName}...`);

  let successCount = 0;
  let failCount = 0;
  const businessCity = location.storefrontAddress?.locality || location.address?.locality || "";
  const tone = settings?.businessTone || "professional";

  for (const review of pendingReviews) {
    try {
      const numericRating = STAR_MAP[review.starRating] || 5;

      // Apply minimum rating rule (if not forced)
      if (!force && settings?.minimumRating === "5only" && numericRating < 5) {
        await GbpReview.findByIdAndUpdate(review._id, { automationStatus: "SKIPPED" });
        continue;
      }
      if (!force && settings?.minimumRating === "4+" && numericRating < 4) {
        await GbpReview.findByIdAndUpdate(review._id, { automationStatus: "SKIPPED" });
        continue;
      }
      if (!force && numericRating <= 3 && !settings?.negativeReviewAutoReply) {
        await GbpReview.findByIdAndUpdate(review._id, { automationStatus: "SKIPPED" });
        continue;
      }

      // 1. Generate AI Reply using multi-tier AI generator (Groq -> Gemini -> Smart template)
      const reviewerDisplayName = review.reviewer?.isAnonymous ? "Customer" : (review.reviewer?.displayName || "Customer");
      
      const aiReply = await generateReviewReply({
        businessName: location.locationName,
        reviewerName: reviewerDisplayName,
        rating: numericRating,
        reviewText: review.comment || "",
        businessTone: tone,
      });

      if (!aiReply || aiReply.length < 5) {
        throw new Error("Failed to generate AI reply text");
      }

      // Save generated reply draft
      await GbpReview.findByIdAndUpdate(review._id, {
        aiGeneratedReply: aiReply,
        aiGeneratedAt: new Date(),
        automationStatus: "AI_PROCESSING",
      });

      // 2. Publish reply to Google Business Profile
      try {
        await replyToReview(userId, locationDbId, review.googleReviewId, aiReply);

        await GbpReview.findByIdAndUpdate(review._id, {
          automationStatus: "REPLIED",
          publishedAt: new Date(),
          isAutoReplied: true,
          publishError: null,
          reviewReply: {
            comment: aiReply,
            updateTime: new Date(),
          },
        });

        successCount++;
        console.log(`[Auto Reply] ✓ Successfully replied to ${reviewerDisplayName} (${numericRating}★) on Google!`);

        // Small rate limit delay between Google API calls (300ms)
        await new Promise(r => setTimeout(r, 300));
      } catch (pubErr) {
        console.error(`[Auto Reply] ✗ Google Publish failed for review ${review.googleReviewId}:`, pubErr.message);
        
        // Still save the AI generated reply in DB so the user can see it
        await GbpReview.findByIdAndUpdate(review._id, {
          automationStatus: "PUBLISH_FAILED",
          publishError: pubErr.message || "Google API publish error",
          $inc: { retryCount: 1 },
        });
        failCount++;
      }
    } catch (itemErr) {
      console.error(`[Auto Reply] Error processing review ${review._id}:`, itemErr.message);
      await GbpReview.findByIdAndUpdate(review._id, {
        automationStatus: "PUBLISH_FAILED",
        publishError: itemErr.message,
      });
      failCount++;
    }
  }

  // Update automation statistics
  if (successCount > 0 && settings) {
    await GbpReviewAutomationSettings.findOneAndUpdate(
      { userId, locationId: locationDbId },
      {
        $inc: { totalAutoReplies: successCount },
        lastAutoReplyAt: new Date(),
      }
    );
  }

  console.log(`[Auto Reply] Finished for ${location.locationName}: ${successCount} successful, ${failCount} failed.`);
  return { processed: pendingReviews.length, successful: successCount, failed: failCount };
};

/**
 * Auto-reply all locations for a user
 */
export const autoReplyAllLocations = async (userId, { locationId = null, force = false } = {}) => {
  const query = { userId };
  if (locationId && locationId !== "all") {
    query._id = locationId;
  }

  const locations = await GbpLocation.find(query);
  const results = [];

  for (const loc of locations) {
    try {
      const res = await processLocationAutoReplies(userId, loc._id, { maxCount: 100, force });
      results.push({ locationId: loc._id, locationName: loc.locationName, ...res });
    } catch (err) {
      results.push({ locationId: loc._id, locationName: loc.locationName, error: err.message });
    }
  }

  return results;
};

/**
 * Get or create automation settings for a location
 */
export const getAutomationSettings = async (userId, locationId) => {
  let settings = await GbpReviewAutomationSettings.findOne({ userId, locationId });
  
  if (!settings) {
    settings = await GbpReviewAutomationSettings.create({
      userId,
      locationId,
      automaticRepliesEnabled: true,
      aiRepliesEnabled: true,
      autoPublishEnabled: true,
      seoOptimizationEnabled: true,
      minimumRating: "all",
      negativeReviewAutoReply: true,
      replyLanguage: "en",
      businessTone: "professional",
    });
  }
  
  return settings;
};

/**
 * Update automation settings
 */
export const updateAutomationSettings = async (userId, locationId, updates) => {
  const settings = await GbpReviewAutomationSettings.findOneAndUpdate(
    { userId, locationId },
    { $set: updates },
    { upsert: true, new: true }
  );
  
  return settings;
};
