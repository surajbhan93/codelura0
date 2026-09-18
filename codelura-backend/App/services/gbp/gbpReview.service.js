import axios from "axios";
import { getValidAccessToken } from "./gbpOAuth.service.js";
import GbpReview from "../../models/gbp/GbpReview.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpReviewAutomationSettings from "../../models/gbp/GbpReviewAutomationSettings.js";
import { generateAIReviewReply } from "../ai.service.js";

const GBP_V4 = "https://mybusiness.googleapis.com/v4";

export const syncReviews = async (userId, locationDbId) => {
  const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!loc) throw { code: 404, message: "Location not found" };

  const accessToken = await getValidAccessToken(userId);
  let nextPageToken = null;
  let synced = 0;
  const newReviews = []; // Track new reviews for auto-reply

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
      
      // Check if review already exists
      const existingReview = await GbpReview.findOne({ googleReviewId: reviewId });
      const isNew = !existingReview;
      
      const savedReview = await GbpReview.findOneAndUpdate(
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
          // Set automation status for new reviews
          automationStatus: isNew ? 'NEW' : (r.reviewReply ? 'REPLIED' : existingReview?.automationStatus || 'NEW'),
        },
        { upsert: true, new: true }
      );
      
      synced++;
      
      // Track new reviews without replies for auto-reply
      if (isNew && !r.reviewReply) {
        newReviews.push(savedReview);
      }
    }

    // Update location rating/count
    const STAR_VALS = { FIVE: 5, FOUR: 4, THREE: 3, TWO: 2, ONE: 1 };
    const allReviews = await GbpReview.find({ locationId: locationDbId });
    const count = allReviews.length;
    let avg = 0;
    if (count > 0) {
      const sum = allReviews.reduce((acc, r) => acc + (STAR_VALS[r.starRating] || 0), 0);
      avg = Math.round((sum / count) * 10) / 10;
    }
    await GbpLocation.findByIdAndUpdate(locationDbId, {
      averageRating: res.data.averageRating ?? avg,
      reviewCount: res.data.totalReviewCount ?? count,
    });

    nextPageToken = res.data.nextPageToken || null;
  } while (nextPageToken);

  // Process new reviews for auto-reply
  if (newReviews.length > 0) {
    console.log(`[Review Sync] Found ${newReviews.length} new reviews - checking auto-reply settings`);
    processNewReviewsForAutoReply(userId, locationDbId, newReviews).catch(err => {
      console.error('[Review Sync] Auto-reply processing failed:', err);
    });
  }

  return { synced, newReviews: newReviews.length };
};

export const getReviews = async (userId, locationDbId, { page = 1, limit = 20, rating, replied, sort = "newest" } = {}) => {
  const query = { userId };
  if (locationDbId && locationDbId !== "all") {
    query.locationId = locationDbId;
  }
  if (rating) query.starRating = rating.toUpperCase();
  if (replied === "true") query["reviewReply.comment"] = { $exists: true, $ne: null };
  if (replied === "false") query["reviewReply.comment"] = { $exists: false };

  const sortObj = sort === "rating" ? { starRating: -1 } : { createTime: -1 };
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    GbpReview.find(query).populate("locationId", "locationName").sort(sortObj).skip(skip).limit(limit),
    GbpReview.countDocuments(query),
  ]);

  return { reviews, total, page, totalPages: Math.ceil(total / limit) };
};

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
    { reviewReply: { comment: replyText, updateTime: new Date() } },
    { new: true }
  );

  return updated;
};

export const deleteReviewReply = async (userId, locationDbId, googleReviewId) => {
  const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!loc) throw { code: 404, message: "Location not found" };

  const accessToken = await getValidAccessToken(userId);

  await axios.delete(
    `${GBP_V4}/accounts/${loc.googleAccountId}/locations/${loc.googleLocationId}/reviews/${googleReviewId}/reply`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  await GbpReview.findOneAndUpdate({ googleReviewId, userId }, { $unset: { reviewReply: 1 } });
};


/**
 * Process new reviews for automatic AI reply
 */
async function processNewReviewsForAutoReply(userId, locationDbId, newReviews) {
  try {
    // Get automation settings for this location
    const settings = await GbpReviewAutomationSettings.findOne({
      userId,
      locationId: locationDbId,
    });

    // Check if automation is enabled
    if (!settings || !settings.automaticRepliesEnabled || !settings.autoPublishEnabled) {
      console.log('[Auto Reply] Automation not enabled for this location');
      return;
    }

    console.log(`[Auto Reply] Processing ${newReviews.length} reviews with automation enabled`);

    // Get location data for context
    const location = await GbpLocation.findById(locationDbId);

    for (const review of newReviews) {
      try {
        // Check rating filter
        const STAR_MAP = { FIVE: 5, FOUR: 4, THREE: 3, TWO: 2, ONE: 1 };
        const numericRating = STAR_MAP[review.starRating] || 0;

        // Apply minimum rating filter
        if (settings.minimumRating === '5only' && numericRating < 5) {
          console.log(`[Auto Reply] Skipping review ${review.googleReviewId} - below minimum rating (5 only)`);
          await GbpReview.findByIdAndUpdate(review._id, { automationStatus: 'SKIPPED' });
          continue;
        }

        if (settings.minimumRating === '4+' && numericRating < 4) {
          console.log(`[Auto Reply] Skipping review ${review.googleReviewId} - below minimum rating (4+)`);
          await GbpReview.findByIdAndUpdate(review._id, { automationStatus: 'SKIPPED' });
          continue;
        }

        // Check negative review setting
        if (numericRating <= 3 && !settings.negativeReviewAutoReply) {
          console.log(`[Auto Reply] Skipping negative review ${review.googleReviewId} - negative auto-reply disabled`);
          await GbpReview.findByIdAndUpdate(review._id, { automationStatus: 'SKIPPED' });
          continue;
        }

        // Mark as processing
        await GbpReview.findByIdAndUpdate(review._id, {
          automationStatus: 'AI_PROCESSING'
        });

        // Generate AI reply
        console.log(`[Auto Reply] Generating AI reply for review ${review.googleReviewId}`);
        
        const context = {
          businessName: location.locationName,
          category: location.primaryCategory?.displayName,
          city: location.storefrontAddress?.locality || location.address?.locality,
          description: location.profile?.description,
          reviewText: review.comment || '',
          rating: numericRating,
          reviewerName: review.reviewer?.displayName,
          tone: settings.businessTone || 'professional',
          seoEnabled: settings.seoOptimizationEnabled,
          keywords: settings.preferredKeywords || [],
        };

        const aiReply = await generateAIReviewReply(context);

        if (!aiReply) {
          throw new Error('AI failed to generate reply');
        }

        // Save AI generated reply
        await GbpReview.findByIdAndUpdate(review._id, {
          aiGeneratedReply: aiReply,
          aiGeneratedAt: new Date(),
          automationStatus: 'AI_GENERATED',
        });

        // Auto-publish to Google
        console.log(`[Auto Reply] Publishing reply for review ${review.googleReviewId}`);
        
        await GbpReview.findByIdAndUpdate(review._id, {
          automationStatus: 'PUBLISHING'
        });

        try {
          await replyToReview(userId, locationDbId, review.googleReviewId, aiReply);

          // Mark as successfully replied
          await GbpReview.findByIdAndUpdate(review._id, {
            automationStatus: 'REPLIED',
            publishedAt: new Date(),
            isAutoReplied: true,
            publishError: null,
          });

          // Update settings stats
          await GbpReviewAutomationSettings.findOneAndUpdate(
            { userId, locationId: locationDbId },
            {
              $inc: { totalAutoReplies: 1 },
              lastAutoReplyAt: new Date(),
            }
          );

          console.log(`[Auto Reply] ✓ Successfully published reply for review ${review.googleReviewId}`);

        } catch (publishError) {
          console.error(`[Auto Reply] Failed to publish reply:`, publishError);
          
          await GbpReview.findByIdAndUpdate(review._id, {
            automationStatus: 'PUBLISH_FAILED',
            publishError: publishError.message,
            $inc: { retryCount: 1 },
          });
        }

      } catch (reviewError) {
        console.error(`[Auto Reply] Error processing review ${review.googleReviewId}:`, reviewError);
        
        await GbpReview.findByIdAndUpdate(review._id, {
          automationStatus: 'PUBLISH_FAILED',
          publishError: reviewError.message,
        });
      }
    }

  } catch (error) {
    console.error('[Auto Reply] Fatal error in auto-reply processing:', error);
  }
}

/**
 * Get or create automation settings for a location
 */
export const getAutomationSettings = async (userId, locationId) => {
  let settings = await GbpReviewAutomationSettings.findOne({ userId, locationId });
  
  if (!settings) {
    settings = await GbpReviewAutomationSettings.create({
      userId,
      locationId,
      automaticRepliesEnabled: false,
      aiRepliesEnabled: true,
      autoPublishEnabled: false,
      seoOptimizationEnabled: true,
      minimumRating: 'all',
      negativeReviewAutoReply: false,
      replyLanguage: 'en',
      businessTone: 'professional',
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
