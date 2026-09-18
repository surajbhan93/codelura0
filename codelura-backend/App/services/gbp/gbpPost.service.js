import axios from "axios";
import { getValidAccessToken } from "./gbpOAuth.service.js";
import GbpPost from "../../models/gbp/GbpPost.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import cacheService from "../cache.service.js";

const GBP_V4 = "https://mybusiness.googleapis.com/v4";

const buildGooglePostPayload = (post) => {
  const payload = { 
    summary: post.summary?.trim() || "",
    topicType: post.topicType || "STANDARD"
  };
  
  // Validate summary length (Google limit: 1500 characters)
  if (payload.summary.length > 1500) {
    payload.summary = payload.summary.substring(0, 1497) + "...";
  }
  
  // Add call to action if provided
  if (post.callToAction?.actionType && post.callToAction?.url) {
    payload.callToAction = {
      actionType: post.callToAction.actionType,
      url: post.callToAction.url
    };
  }
  
  // Add event if provided
  if (post.event?.title && post.event?.schedule) {
    payload.event = post.event;
  }
  
  // Add offer if provided
  if (post.offer?.couponCode && post.offer?.redeemOnlineUrl) {
    payload.offer = post.offer;
  }
  
  // Add media if provided (validate image URLs)
  if (post.media?.length > 0) {
    payload.media = post.media
      .filter(m => m.sourceUrl && m.sourceUrl.startsWith('http'))
      .map(m => ({ 
        mediaFormat: m.mediaFormat || "PHOTO",
        sourceUrl: m.sourceUrl 
      }));
  }
  
  return payload;
};

export const createPost = async (userId, locationDbId, postData) => {
  const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!loc) throw { code: 404, message: "Location not found" };

  // If scheduled, save as scheduled
  if (postData.scheduledAt) {
    const post = await GbpPost.create({
      userId, locationId: locationDbId, googleLocationId: loc.googleLocationId,
      status: "scheduled", scheduledAt: new Date(postData.scheduledAt), ...postData,
    });
    
    // Invalidate cache
    cacheService.delete(cacheService.generateKey(userId, 'posts', `${locationDbId}:all`));
    cacheService.delete(cacheService.generateKey(userId, 'posts', `${locationDbId}:scheduled`));
    
    return post;
  }

  // If draft
  if (postData.status === "draft") {
    const post = await GbpPost.create({ userId, locationId: locationDbId, googleLocationId: loc.googleLocationId, status: "draft", ...postData });
    
    // Invalidate cache
    cacheService.delete(cacheService.generateKey(userId, 'posts', `${locationDbId}:all`));
    cacheService.delete(cacheService.generateKey(userId, 'posts', `${locationDbId}:draft`));
    
    return post;
  }

  // Publish immediately
  const post = await GbpPost.create({ userId, locationId: locationDbId, googleLocationId: loc.googleLocationId, status: "draft", ...postData });
  
  // Invalidate cache
  cacheService.delete(cacheService.generateKey(userId, 'posts', `${locationDbId}:all`));
  cacheService.delete(cacheService.generateKey(userId, 'posts', `${locationDbId}:draft`));
  
  return publishPost(userId, locationDbId, post._id);
};

export const publishPost = async (userId, locationDbId, postDbId) => {
  const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!loc) throw { code: 404, message: "Location not found" };

  const post = await GbpPost.findOne({ _id: postDbId, userId });
  if (!post) throw { code: 404, message: "Post not found" };

  // Validate post data
  if (!post.summary || post.summary.trim().length < 10) {
    throw { code: 400, message: "Post content is too short. Minimum 10 characters required." };
  }

  const accessToken = await getValidAccessToken(userId);
  const payload = buildGooglePostPayload(post);

  console.log(`[Codelura GBP Post] Publishing post for location: ${loc.googleLocationId}`);
  console.log(`[Codelura GBP Post] Payload:`, JSON.stringify(payload, null, 2));

  try {
    const res = await axios.post(
      `${GBP_V4}/accounts/${loc.googleAccountId}/locations/${loc.googleLocationId}/localPosts`,
      payload,
      { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
    );

    console.log(`[Codelura GBP Post] ✓ Post published successfully`);

    post.status = "published";
    post.googleResourceName = res.data.name;
    post.googlePostId = res.data.name?.split("/").pop();
    post.publishedAt = new Date();
    post.errorMessage = null; // Clear any previous errors
    await post.save();
    return post;
  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || err.message;
    const errorDetails = err.response?.data?.error?.details || [];
    
    console.error(`[Codelura GBP Post] ✗ Failed to publish:`, errorMsg);
    console.error(`[Codelura GBP Post] Error details:`, JSON.stringify(errorDetails, null, 2));

    post.status = "failed";
    post.errorMessage = errorMsg;
    post.retryCount = (post.retryCount || 0) + 1;
    await post.save();

    // Provide helpful error messages
    let userMessage = errorMsg;
    if (errorMsg.includes("invalid argument")) {
      userMessage = "Post validation failed. Please check:\n• Post content length (10-1500 characters)\n• Image URL is valid and accessible\n• Call-to-action URL is valid (if provided)\n• No special characters that might cause issues";
    } else if (errorMsg.includes("media")) {
      userMessage = "Image validation failed. Please ensure:\n• Image URL is accessible\n• Image is in JPEG or PNG format\n• Image size is reasonable (< 5MB)\n• Image URL starts with https://";
    } else if (errorMsg.includes("permission")) {
      userMessage = "Permission denied. Please reconnect your Google Business Profile.";
    }

    throw { code: 400, message: `Google rejected this post: ${userMessage}` };
  }
};

export const updatePost = async (userId, locationDbId, postDbId, updates) => {
  const post = await GbpPost.findOne({ _id: postDbId, userId, locationId: locationDbId });
  if (!post) throw { code: 404, message: "Post not found" };

  if (post.status === "published" && post.googleResourceName) {
    const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
    const accessToken = await getValidAccessToken(userId);
    const payload = buildGooglePostPayload({ ...post.toObject(), ...updates });
    try {
      await axios.patch(
        `${GBP_V4}/${post.googleResourceName}`,
        payload,
        { params: { updateMask: "summary,callToAction,event,offer,media" }, headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
      );
    } catch (err) {
      throw { code: 400, message: `Google rejected this update: ${err.response?.data?.error?.message || err.message}` };
    }
  }

  Object.assign(post, updates);
  await post.save();
  return post;
};

export const deletePost = async (userId, locationDbId, postDbId) => {
  const post = await GbpPost.findOne({ _id: postDbId, userId, locationId: locationDbId });
  if (!post) throw { code: 404, message: "Post not found" };

  if (post.status === "published" && post.googleResourceName) {
    const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
    const accessToken = await getValidAccessToken(userId);
    try {
      await axios.delete(`${GBP_V4}/${post.googleResourceName}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    } catch (err) {
      if (err.response?.status !== 404) throw { code: 400, message: err.message };
    }
  }

  post.status = "deleted";
  await post.save();
};

export const getPosts = async (userId, locationDbId, { status, page = 1, limit = 20 } = {}) => {
  // Check cache for first page only (2 minute TTL)
  const cacheKey = page === 1 ? cacheService.generateKey(userId, 'posts', `${locationDbId}:${status || 'all'}`) : null;
  
  if (cacheKey) {
    const cached = cacheService.get(cacheKey);
    if (cached) {
      console.log(`[Cache HIT] Posts for location ${locationDbId}`);
      return cached;
    }
  }

  const query = { userId, locationId: locationDbId };
  if (status) query.status = status;
  else query.status = { $ne: "deleted" };

  const skip = (page - 1) * limit;
  
  // Use lean() for better performance and select only needed fields
  const [posts, total] = await Promise.all([
    GbpPost.find(query)
      .select('summary status topicType media callToAction publishedAt createdAt googlePostId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    GbpPost.countDocuments(query),
  ]);
  
  const result = { posts, total, page, totalPages: Math.ceil(total / limit) };
  
  // Cache first page only for 2 minutes
  if (cacheKey) {
    cacheService.set(cacheKey, result, 120);
    console.log(`[Cache SET] Posts for location ${locationDbId}`);
  }
  
  return result;
};

export const syncPosts = async (userId, locationDbId) => {
  const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!loc) return { synced: 0 };
  const accessToken = await getValidAccessToken(userId);
  try {
    const res = await axios.get(
      `${GBP_V4}/accounts/${loc.googleAccountId}/locations/${loc.googleLocationId}/localPosts`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const googlePosts = res.data.localPosts || [];
    for (const p of googlePosts) {
      const postId = p.name?.split("/").pop();
      await GbpPost.findOneAndUpdate(
        { googlePostId: postId },
        {
          userId,
          locationId: locationDbId,
          googleLocationId: loc.googleLocationId,
          googleResourceName: p.name,
          googlePostId: postId,
          status: "published",
          topicType: p.topicType || "STANDARD",
          summary: p.summary,
          publishedAt: p.createTime ? new Date(p.createTime) : new Date(),
          createdAt: p.createTime ? new Date(p.createTime) : new Date(),
        },
        { upsert: true }
      );
    }
    return { synced: googlePosts.length };
  } catch (err) {
    console.warn(`[GBP Sync] Posts fetch notice for ${loc.locationName}:`, err.response?.data?.error?.message || err.message);
    return { synced: 0 };
  }
};

/**
 * Atomic job claiming with duplicate-publish protection
 * Only one worker can claim a job at a time
 */
const claimScheduledPost = async (postId) => {
  const now = new Date();
  const lockDuration = 5 * 60 * 1000; // 5 minutes
  const workerId = `worker-${process.pid}-${Date.now()}`;
  
  // Atomic update: claim only if not already claimed or lock expired
  const claimed = await GbpPost.findOneAndUpdate(
    {
      _id: postId,
      status: "scheduled",
      $or: [
        { claimedAt: null },
        { lockExpiry: { $lt: now } }
      ]
    },
    {
      $set: {
        status: "processing",
        claimedAt: now,
        claimedBy: workerId,
        lockExpiry: new Date(now.getTime() + lockDuration),
        lastAttemptAt: now,
      },
      $inc: { retryCount: 1 }
    },
    { new: true }
  );
  
  return claimed;
};

/**
 * Release lock if publishing fails
 */
const releaseLock = async (postId, errorMsg) => {
  await GbpPost.findByIdAndUpdate(postId, {
    $set: {
      status: "failed",
      claimedAt: null,
      claimedBy: null,
      lockExpiry: null,
      errorMessage: errorMsg,
    }
  });
};

/**
 * Calculate next retry time with exponential backoff
 */
const calculateNextRetry = (retryCount) => {
  const delays = [
    2 * 60 * 1000,   // Attempt 1: +2 minutes
    10 * 60 * 1000,  // Attempt 2: +10 minutes
    30 * 60 * 1000,  // Attempt 3: +30 minutes
    2 * 60 * 60 * 1000, // Attempt 4: +2 hours
  ];
  
  const delay = delays[retryCount - 1] || delays[delays.length - 1];
  return new Date(Date.now() + delay);
};

/**
 * Main scheduled post publisher with atomic claiming
 */
export const publishScheduledPosts = async () => {
  const now = new Date();
  
  // Find posts that are due and not locked
  const dueQuery = {
    status: "scheduled",
    scheduledAt: { $lte: now },
    retryCount: { $lt: 4 }, // Max 4 attempts
    $or: [
      { claimedAt: null },
      { lockExpiry: { $lt: now } }
    ]
  };
  
  // Also check for failed posts ready for retry
  const retryQuery = {
    status: "failed",
    nextRetryAt: { $lte: now },
    retryCount: { $lt: 4 },
    $or: [
      { claimedAt: null },
      { lockExpiry: { $lt: now } }
    ]
  };
  
  const [duePosts, retryPosts] = await Promise.all([
    GbpPost.find(dueQuery).limit(10).sort({ scheduledAt: 1 }),
    GbpPost.find(retryQuery).limit(5).sort({ nextRetryAt: 1 }),
  ]);
  
  const allPosts = [...duePosts, ...retryPosts];
  let published = 0;
  
  for (const post of allPosts) {
    try {
      // Atomic claim
      const claimed = await claimScheduledPost(post._id);
      
      if (!claimed) {
        console.log(`[GBP Scheduler] Post ${post._id} already claimed by another worker`);
        continue;
      }
      
      console.log(`[GBP Scheduler] Claimed post ${post._id} for publishing (attempt ${claimed.retryCount}/${claimed.maxRetries})`);
      
      // Attempt to publish
      const startTime = Date.now();
      await publishPostInternal(claimed);
      const duration = Date.now() - startTime;
      
      // Log successful attempt
      await logPublishAttempt(claimed, "success", duration);
      
      published++;
      console.log(`[GBP Scheduler] ✓ Published post ${post._id} successfully`);
      
    } catch (err) {
      console.error(`[GBP Scheduler] ✗ Failed to publish post ${post._id}:`, err.message);
      
      const errorCode = err.code || err.response?.status || "UNKNOWN";
      const errorMsg = err.message || "Unknown error";
      
      // Log failed attempt
      await logPublishAttempt(post, "failed", 0, errorCode, errorMsg);
      
      // Determine if we should retry
      const shouldRetry = post.retryCount < post.maxRetries && !isPermanentError(errorCode);
      
      if (shouldRetry) {
        const nextRetry = calculateNextRetry(post.retryCount);
        await GbpPost.findByIdAndUpdate(post._id, {
          $set: {
            status: "scheduled", // Back to scheduled for retry
            errorMessage: errorMsg,
            errorCode: errorCode,
            nextRetryAt: nextRetry,
            claimedAt: null,
            claimedBy: null,
            lockExpiry: null,
          }
        });
        console.log(`[GBP Scheduler] Will retry post ${post._id} at ${nextRetry.toISOString()}`);
      } else {
        // Permanent failure or max retries reached
        await GbpPost.findByIdAndUpdate(post._id, {
          $set: {
            status: "failed",
            errorMessage: errorMsg,
            errorCode: errorCode,
            claimedAt: null,
            claimedBy: null,
            lockExpiry: null,
          }
        });
        console.log(`[GBP Scheduler] Post ${post._id} permanently failed after ${post.retryCount} attempts`);
      }
    }
  }
  
  return published;
};

/**
 * Check if error is permanent (don't retry)
 */
const isPermanentError = (errorCode) => {
  const permanentErrors = [
    400, // Bad request - likely validation issue
    403, // Forbidden - likely permission issue
    404, // Not found - location may be deleted
    "AUTH_INVALID", // Invalid credentials
    "PERMISSION_DENIED",
  ];
  
  return permanentErrors.includes(errorCode);
};

/**
 * Log publish attempt for audit trail
 */
const logPublishAttempt = async (post, status, duration, errorCode = null, errorMsg = null) => {
  try {
    const GbpPublishAttempt = (await import("../../models/gbp/GbpPublishAttempt.js")).default;
    
    await GbpPublishAttempt.create({
      userId: post.userId,
      postId: post._id,
      locationId: post.locationId,
      attemptNumber: post.retryCount,
      attemptedAt: new Date(),
      status,
      googleResponseCode: status === "success" ? 200 : errorCode,
      googleResponseMessage: errorMsg,
      googleResourceName: post.googleResourceName,
      googlePostId: post.googlePostId,
      errorCode,
      errorMessage: errorMsg,
      durationMs: duration,
      nextRetryAt: post.nextRetryAt,
      willRetry: status === "failed" && post.retryCount < post.maxRetries,
    });
  } catch (err) {
    console.warn("[GBP Scheduler] Failed to log publish attempt:", err.message);
  }
};

/**
 * Internal publish method (used by scheduler)
 */
const publishPostInternal = async (post) => {
  const GbpLocation = (await import("../../models/gbp/GbpLocation.js")).default;
  const loc = await GbpLocation.findById(post.locationId);
  
  if (!loc) {
    throw { code: 404, message: "Location not found or deleted" };
  }
  
  // Validate post content
  if (!post.summary || post.summary.trim().length < 10) {
    throw { code: 400, message: "Post content too short (minimum 10 characters)" };
  }
  
  // Get valid access token (handles refresh automatically)
  const accessToken = await getValidAccessToken(post.userId.toString());
  const payload = buildGooglePostPayload(post);
  
  console.log(`[GBP Scheduler] Publishing to Google: ${loc.googleAccountId}/${loc.googleLocationId}`);
  
  try {
    const res = await axios.post(
      `${GBP_V4}/accounts/${loc.googleAccountId}/locations/${loc.googleLocationId}/localPosts`,
      payload,
      { 
        headers: { 
          Authorization: `Bearer ${accessToken}`, 
          "Content-Type": "application/json" 
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    // Success! Update post
    post.status = "published";
    post.googleResourceName = res.data.name;
    post.googlePostId = res.data.name?.split("/").pop();
    post.publishedAt = new Date();
    post.errorMessage = null;
    post.errorCode = null;
    post.claimedAt = null;
    post.claimedBy = null;
    post.lockExpiry = null;
    
    await post.save();
    
    // Update campaign stats if applicable
    if (post.campaignId) {
      const GbpCampaign = (await import("../../models/gbp/GbpCampaign.js")).default;
      await GbpCampaign.findByIdAndUpdate(post.campaignId, {
        $inc: { totalPublished: 1 },
        $set: { lastPostAt: new Date() }
      });
    }
    
    return post;
    
  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || err.message;
    const errorCode = err.response?.status || err.code;
    
    console.error(`[GBP Scheduler] Google API error:`, errorMsg);
    
    throw { 
      code: errorCode, 
      message: errorMsg,
      response: err.response 
    };
  }
};
