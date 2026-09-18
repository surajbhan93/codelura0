/**
 * GBP Scheduler Controllers
 */

import * as schedulerService from "../../services/gbp/gbpScheduler.service.js";
import * as campaignService from "../../services/gbp/gbpCampaign.service.js";
import { getSchedulerStatus } from "../../cron/gbpPostScheduler.cron.js";
import GbpPost from "../../models/gbp/GbpPost.js";
import GbpPublishAttempt from "../../models/gbp/GbpPublishAttempt.js";
import { fromUTC } from "../../utils/timezone.util.js";

/**
 * Get scheduled posts for location
 */
export const getScheduledPosts = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { status, page = 1, limit = 50 } = req.query;
    
    const query = {
      userId: req.user._id,
      locationId,
      status: status || { $in: ["draft", "scheduled", "processing"] },
    };
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [posts, total] = await Promise.all([
      GbpPost.find(query)
        .sort({ scheduledAt: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("campaignId", "name")
        .lean(),
      GbpPost.countDocuments(query),
    ]);
    
    // Convert scheduledAt to user timezone for display
    const postsWithTimezone = posts.map(post => ({
      ...post,
      scheduledAtLocal: post.scheduledAt ? fromUTC(post.scheduledAt, post.scheduledTimezone) : null,
    }));
    
    res.json({
      success: true,
      posts: postsWithTimezone,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Create recurring schedule
 */
export const createRecurringSchedule = async (req, res) => {
  try {
    const schedule = await schedulerService.createRecurringSchedule(req.user._id, req.body);
    res.status(201).json({ success: true, data: schedule });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Get recurring schedules
 */
export const getRecurringSchedules = async (req, res) => {
  try {
    const { locationId } = req.query;
    const schedules = await schedulerService.getRecurringSchedules(req.user._id, locationId);
    res.json({ success: true, data: schedules });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Update recurring schedule
 */
export const updateRecurringSchedule = async (req, res) => {
  try {
    const schedule = await schedulerService.updateRecurringSchedule(
      req.user._id,
      req.params.scheduleId,
      req.body
    );
    res.json({ success: true, data: schedule });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Toggle recurring schedule (pause/resume)
 */
export const toggleRecurringSchedule = async (req, res) => {
  try {
    const { pause } = req.body;
    const schedule = await schedulerService.toggleRecurringSchedule(
      req.user._id,
      req.params.scheduleId,
      pause
    );
    res.json({ success: true, data: schedule });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Delete recurring schedule
 */
export const deleteRecurringSchedule = async (req, res) => {
  try {
    await schedulerService.deleteRecurringSchedule(req.user._id, req.params.scheduleId);
    res.json({ success: true, message: "Recurring schedule cancelled" });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Get location settings
 */
export const getLocationSettings = async (req, res) => {
  try {
    const settings = await schedulerService.getLocationSettings(req.user._id, req.params.locationId);
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Update location settings
 */
export const updateLocationSettings = async (req, res) => {
  try {
    const settings = await schedulerService.updateLocationSettings(
      req.user._id,
      req.params.locationId,
      req.body
    );
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Pause/Resume location scheduling
 */
export const toggleLocationScheduling = async (req, res) => {
  try {
    const { pause } = req.body;
    const settings = await schedulerService.toggleLocationScheduling(
      req.user._id,
      req.params.locationId,
      pause
    );
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Generate AI monthly calendar
 */
export const generateAICalendar = async (req, res) => {
  try {
    const result = await campaignService.generateAIMonthlyCalendar(
      req.user._id,
      req.params.locationId,
      req.body
    );
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Approve AI calendar posts
 */
export const approveCalendarPosts = async (req, res) => {
  try {
    const { postIds } = req.body;
    const result = await campaignService.approveCalendarPosts(req.user._id, postIds);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Create campaign
 */
export const createCampaign = async (req, res) => {
  try {
    const campaign = await campaignService.createCampaign(req.user._id, req.body);
    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Create multi-location campaign
 */
export const createMultiLocationCampaign = async (req, res) => {
  try {
    const result = await campaignService.createMultiLocationCampaign(req.user._id, req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Get campaigns
 */
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignService.getCampaigns(req.user._id, req.query);
    res.json({ success: true, data: campaigns });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Get campaign details
 */
export const getCampaign = async (req, res) => {
  try {
    const result = await campaignService.getCampaign(req.user._id, req.params.campaignId);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Update campaign
 */
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await campaignService.updateCampaign(
      req.user._id,
      req.params.campaignId,
      req.body
    );
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Toggle campaign (pause/resume)
 */
export const toggleCampaign = async (req, res) => {
  try {
    const { pause } = req.body;
    const campaign = await campaignService.toggleCampaign(req.user._id, req.params.campaignId, pause);
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Delete campaign
 */
export const deleteCampaign = async (req, res) => {
  try {
    await campaignService.deleteCampaign(req.user._id, req.params.campaignId);
    res.json({ success: true, message: "Campaign cancelled" });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Get campaign analytics
 */
export const getCampaignAnalytics = async (req, res) => {
  try {
    const result = await campaignService.getCampaignAnalytics(req.user._id, req.params.campaignId);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Get publishing history
 */
export const getPublishHistory = async (req, res) => {
  try {
    const { locationId, status, limit = 50 } = req.query;
    
    const query = { userId: req.user._id };
    if (locationId) query.locationId = locationId;
    if (status) query.status = status;
    
    const attempts = await GbpPublishAttempt.find(query)
      .sort({ attemptedAt: -1 })
      .limit(parseInt(limit))
      .populate("postId", "summary topicType")
      .populate("locationId", "locationName")
      .lean();
    
    res.json({ success: true, data: attempts });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Get scheduler health status
 */
export const getSchedulerHealth = async (req, res) => {
  try {
    const status = await getSchedulerStatus();
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Bulk update post status
 */
export const bulkUpdatePosts = async (req, res) => {
  try {
    const { postIds, status } = req.body;
    
    const result = await GbpPost.updateMany(
      { _id: { $in: postIds }, userId: req.user._id },
      { $set: { status } }
    );
    
    res.json({ success: true, updated: result.modifiedCount });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};

/**
 * Get scheduler dashboard stats
 */
export const getSchedulerStats = async (req, res) => {
  try {
    const { locationId } = req.query;
    const query = { userId: req.user._id };
    if (locationId) query.locationId = locationId;
    
    const now = new Date();
    const [
      scheduled,
      processing,
      publishedToday,
      failed,
      overdue,
      recurring,
      activeCampaigns,
    ] = await Promise.all([
      GbpPost.countDocuments({ ...query, status: "scheduled" }),
      GbpPost.countDocuments({ ...query, status: "processing" }),
      GbpPost.countDocuments({
        ...query,
        status: "published",
        publishedAt: { $gte: new Date(now.setHours(0, 0, 0, 0)) },
      }),
      GbpPost.countDocuments({ ...query, status: "failed", retryCount: { $gte: 4 } }),
      GbpPost.countDocuments({ ...query, status: "scheduled", scheduledAt: { $lt: now } }),
      schedulerService.getRecurringSchedules(req.user._id, locationId).then(s => s.filter(r => r.status === "active").length),
      campaignService.getCampaigns(req.user._id, { status: "active", locationId }).then(c => c.length),
    ]);
    
    res.json({
      success: true,
      stats: {
        scheduled,
        processing,
        publishedToday,
        failed,
        overdue,
        recurringSchedules: recurring,
        activeCampaigns,
      },
    });
  } catch (err) {
    res.status(err.code || 500).json({ success: false, message: err.message });
  }
};
