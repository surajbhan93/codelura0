/**
 * GBP Campaign Service
 * Handles multi-location campaigns and AI-powered monthly calendars
 */

import GbpCampaign from "../../models/gbp/GbpCampaign.js";
import GbpPost from "../../models/gbp/GbpPost.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpLocationSettings from "../../models/gbp/GbpLocationSettings.js";
import { generateMonthlyCalendar } from "./gbpGrokAI.service.js";
import { toUTC, addDays, formatDateTime } from "../../utils/timezone.util.js";

/**
 * Create multi-location campaign
 */
export const createCampaign = async (userId, campaignData) => {
  const startDate = new Date(campaignData.startDate);
  const endDate = campaignData.endDate ? new Date(campaignData.endDate) : null;
  
  const campaign = await GbpCampaign.create({
    ...campaignData,
    userId,
    startDate,
    endDate,
    createdBy: userId.toString(),
  });
  
  return campaign;
};

/**
 * Generate AI-powered monthly calendar for location
 * Creates 30 days of optimized, SEO-friendly posts
 */
export const generateAIMonthlyCalendar = async (userId, locationId, options = {}) => {
  // Get location details
  const location = await GbpLocation.findOne({ _id: locationId, userId });
  if (!location) throw { code: 404, message: "Location not found" };
  
  // Get location settings for preferences
  const settings = await GbpLocationSettings.findOne({ userId, locationId });
  
  const {
    postsPerWeek = settings?.postsPerWeek || 3,
    duration = 30,
    allowedTypes = ["STANDARD", "EVENT", "OFFER"],
    tone = settings?.businessTone || "professional",
    timezone = settings?.timezone || "Asia/Kolkata",
    startDate = new Date(),
  } = options;
  
  console.log(`[GBP Campaign] Generating ${duration}-day AI calendar for ${location.locationName}`);
  
  // Prepare context for AI
  const context = {
    businessName: location.locationName,
    category: location.primaryCategory?.displayName || "Business",
    city: location.address?.locality || "",
    websiteUrl: location.websiteUri || "",
    postsPerWeek,
    duration,
    allowedTypes,
    tone,
    services: settings?.primaryServices || [],
    targetAudience: settings?.targetAudience || "",
  };
  
  // Generate calendar with AI
  const calendar = await generateMonthlyCalendar(context);
  
  if (!calendar || calendar.length === 0) {
    throw { code: 500, message: "AI failed to generate calendar" };
  }
  
  console.log(`[GBP Campaign] AI generated ${calendar.length} posts`);
  
  // Create posts (in draft status for user approval)
  const createdPosts = [];
  const baseDate = new Date(startDate);
  
  for (let i = 0; i < calendar.length; i++) {
    const calendarItem = calendar[i];
    const dayOffset = calendarItem.day - 1;
    const scheduledDate = addDays(baseDate, dayOffset);
    
    // Convert to UTC for storage
    const scheduledAt = toUTC(
      scheduledDate.toISOString().split('T')[0],
      calendarItem.time || "10:00",
      timezone
    );
    
    const postData = {
      userId,
      locationId,
      googleLocationId: location.googleLocationId,
      googleAccountId: location.googleAccountId,
      status: "draft", // User must approve before scheduling
      topicType: calendarItem.postType || "STANDARD",
      summary: calendarItem.content,
      callToAction: calendarItem.cta || null,
      media: calendarItem.imageUrl ? [{
        mediaFormat: "PHOTO",
        sourceUrl: calendarItem.imageUrl,
      }] : [],
      event: calendarItem.event || null,
      offer: calendarItem.offer || null,
      scheduledAt,
      scheduledTimezone: timezone,
      aiGenerated: true,
      aiPrompt: `30-day calendar, day ${calendarItem.day}`,
    };
    
    const post = await GbpPost.create(postData);
    createdPosts.push(post);
  }
  
  console.log(`[GBP Campaign] Created ${createdPosts.length} draft posts`);
  
  return {
    calendar,
    posts: createdPosts,
    summary: {
      total: createdPosts.length,
      byType: {
        STANDARD: createdPosts.filter(p => p.topicType === "STANDARD").length,
        EVENT: createdPosts.filter(p => p.topicType === "EVENT").length,
        OFFER: createdPosts.filter(p => p.topicType === "OFFER").length,
      }
    }
  };
};

/**
 * Approve AI-generated calendar posts and schedule them
 */
export const approveCalendarPosts = async (userId, postIds) => {
  const posts = await GbpPost.find({
    _id: { $in: postIds },
    userId,
    status: "draft",
    aiGenerated: true,
  });
  
  if (posts.length === 0) {
    throw { code: 404, message: "No draft posts found" };
  }
  
  // Change status to scheduled
  const updated = await GbpPost.updateMany(
    { _id: { $in: postIds }, userId, status: "draft" },
    { 
      $set: { 
        status: "scheduled",
        approvedBy: userId.toString(),
        approvedAt: new Date(),
      } 
    }
  );
  
  console.log(`[GBP Campaign] Approved ${updated.modifiedCount} posts for scheduling`);
  
  return {
    approved: updated.modifiedCount,
    posts: await GbpPost.find({ _id: { $in: postIds } }).sort({ scheduledAt: 1 }),
  };
};

/**
 * Create multi-location campaign with smart rotation
 */
export const createMultiLocationCampaign = async (userId, campaignData) => {
  const {
    name,
    locationIds,
    postsPerWeek,
    preferredDays,
    preferredTimes,
    postTypes,
    startDate,
    endDate,
    tone,
    allowedCTAs,
    targetServices,
  } = campaignData;
  
  // Create campaign
  const campaign = await GbpCampaign.create({
    userId,
    name,
    description: `Multi-location campaign for ${locationIds.length} location(s)`,
    locationIds,
    postsPerWeek,
    preferredDays,
    preferredTimes,
    postTypes,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
    tone,
    allowedCTAs,
    targetServices,
    status: "active",
    createdBy: userId.toString(),
  });
  
  console.log(`[GBP Campaign] Created campaign ${campaign._id} for ${locationIds.length} locations`);
  
  // Generate posts for each location
  const allPosts = [];
  
  for (const locationId of locationIds) {
    const location = await GbpLocation.findOne({ _id: locationId, userId });
    if (!location) continue;
    
    // Generate localized content for this location
    const locationPosts = await generateCampaignPosts(
      userId,
      location,
      campaign,
      { postsPerWeek, preferredDays, preferredTimes, postTypes, startDate }
    );
    
    allPosts.push(...locationPosts);
  }
  
  // Update campaign stats
  campaign.totalScheduled = allPosts.length;
  await campaign.save();
  
  return {
    campaign,
    posts: allPosts,
    summary: {
      locations: locationIds.length,
      totalPosts: allPosts.length,
      postsPerLocation: Math.floor(allPosts.length / locationIds.length),
    }
  };
};

/**
 * Generate campaign posts for a single location
 */
const generateCampaignPosts = async (userId, location, campaign, options) => {
  const { postsPerWeek, preferredDays, preferredTimes, postTypes, startDate } = options;
  
  const posts = [];
  const baseDate = new Date(startDate);
  const daysInCampaign = campaign.endDate 
    ? Math.ceil((campaign.endDate - campaign.startDate) / (1000 * 60 * 60 * 24))
    : 30;
  
  const totalPosts = Math.floor((daysInCampaign / 7) * postsPerWeek);
  
  // Distribute posts across preferred days
  let currentDay = 0;
  let postCount = 0;
  
  while (postCount < totalPosts && currentDay < daysInCampaign) {
    const date = addDays(baseDate, currentDay);
    const dayOfWeek = date.getDay();
    
    // Check if this day is preferred
    if (!preferredDays || preferredDays.includes(dayOfWeek)) {
      const time = preferredTimes && preferredTimes.length > 0
        ? preferredTimes[postCount % preferredTimes.length]
        : "10:00";
      
      const postType = postTypes && postTypes.length > 0
        ? postTypes[postCount % postTypes.length]
        : "STANDARD";
      
      const scheduledAt = toUTC(
        date.toISOString().split('T')[0],
        time,
        campaign.timezone || "Asia/Kolkata"
      );
      
      // Create placeholder - AI will generate actual content later
      const post = await GbpPost.create({
        userId,
        locationId: location._id,
        campaignId: campaign._id,
        googleLocationId: location.googleLocationId,
        googleAccountId: location.googleAccountId,
        status: "draft", // Will be populated with AI content
        topicType: postType,
        summary: `Campaign post ${postCount + 1} for ${location.locationName}`,
        scheduledAt,
        scheduledTimezone: campaign.timezone || "Asia/Kolkata",
        aiGenerated: false, // Will be set to true when AI generates content
      });
      
      posts.push(post);
      postCount++;
    }
    
    currentDay++;
  }
  
  return posts;
};

/**
 * Get campaign details with posts
 */
export const getCampaign = async (userId, campaignId) => {
  const campaign = await GbpCampaign.findOne({ _id: campaignId, userId });
  if (!campaign) throw { code: 404, message: "Campaign not found" };
  
  const posts = await GbpPost.find({ campaignId }).sort({ scheduledAt: 1 });
  
  // Calculate stats
  const stats = {
    total: posts.length,
    scheduled: posts.filter(p => p.status === "scheduled").length,
    published: posts.filter(p => p.status === "published").length,
    failed: posts.filter(p => p.status === "failed").length,
    draft: posts.filter(p => p.status === "draft").length,
  };
  
  return {
    campaign,
    posts,
    stats,
  };
};

/**
 * List campaigns
 */
export const getCampaigns = async (userId, filters = {}) => {
  const query = { userId };
  
  if (filters.status) query.status = filters.status;
  if (filters.locationId) query.locationIds = filters.locationId;
  
  return GbpCampaign.find(query).sort({ createdAt: -1 });
};

/**
 * Update campaign
 */
export const updateCampaign = async (userId, campaignId, updates) => {
  const campaign = await GbpCampaign.findOne({ _id: campaignId, userId });
  if (!campaign) throw { code: 404, message: "Campaign not found" };
  
  Object.assign(campaign, updates);
  await campaign.save();
  
  return campaign;
};

/**
 * Pause/Resume campaign
 */
export const toggleCampaign = async (userId, campaignId, pause = true) => {
  const campaign = await GbpCampaign.findOne({ _id: campaignId, userId });
  if (!campaign) throw { code: 404, message: "Campaign not found" };
  
  campaign.status = pause ? "paused" : "active";
  await campaign.save();
  
  // Also pause all scheduled posts in this campaign
  if (pause) {
    await GbpPost.updateMany(
      { campaignId, status: "scheduled" },
      { $set: { status: "cancelled" } }
    );
  }
  
  return campaign;
};

/**
 * Delete campaign
 */
export const deleteCampaign = async (userId, campaignId) => {
  const campaign = await GbpCampaign.findOne({ _id: campaignId, userId });
  if (!campaign) throw { code: 404, message: "Campaign not found" };
  
  campaign.status = "cancelled";
  await campaign.save();
  
  // Cancel all pending posts
  await GbpPost.updateMany(
    { campaignId, status: { $in: ["draft", "scheduled"] } },
    { $set: { status: "cancelled" } }
  );
  
  return campaign;
};

/**
 * Get campaign analytics
 */
export const getCampaignAnalytics = async (userId, campaignId) => {
  const campaign = await GbpCampaign.findOne({ _id: campaignId, userId });
  if (!campaign) throw { code: 404, message: "Campaign not found" };
  
  const posts = await GbpPost.find({ campaignId });
  
  const analytics = {
    totalPosts: posts.length,
    byStatus: {
      draft: posts.filter(p => p.status === "draft").length,
      scheduled: posts.filter(p => p.status === "scheduled").length,
      processing: posts.filter(p => p.status === "processing").length,
      published: posts.filter(p => p.status === "published").length,
      failed: posts.filter(p => p.status === "failed").length,
      cancelled: posts.filter(p => p.status === "cancelled").length,
    },
    byType: {
      STANDARD: posts.filter(p => p.topicType === "STANDARD").length,
      EVENT: posts.filter(p => p.topicType === "EVENT").length,
      OFFER: posts.filter(p => p.topicType === "OFFER").length,
      ALERT: posts.filter(p => p.topicType === "ALERT").length,
    },
    byLocation: {},
    publishRate: 0,
  };
  
  // Group by location
  for (const post of posts) {
    const locId = post.locationId.toString();
    if (!analytics.byLocation[locId]) {
      analytics.byLocation[locId] = { total: 0, published: 0 };
    }
    analytics.byLocation[locId].total++;
    if (post.status === "published") {
      analytics.byLocation[locId].published++;
    }
  }
  
  // Calculate publish rate
  const publishedCount = analytics.byStatus.published;
  const expectedCount = analytics.totalPosts - analytics.byStatus.draft;
  analytics.publishRate = expectedCount > 0 
    ? Math.round((publishedCount / expectedCount) * 100)
    : 0;
  
  return {
    campaign,
    analytics,
  };
};
