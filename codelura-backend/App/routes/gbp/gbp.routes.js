import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";

import { connectGoogle, oauthCallback, disconnectGoogle, getStatus } from "../../controllers/gbp/gbpOAuth.controller.js";
import { listLocations, getLocation, syncLocations, setLocationPrimary } from "../../controllers/gbp/gbpLocation.controller.js";
import { listReviews, syncLocationReviews, postReviewReply, removeReviewReply, getReviewAutomationSettings, updateReviewAutomationSettings } from "../../controllers/gbp/gbpReview.controller.js";
import { listPosts, createNewPost, updateExistingPost, removePost, publishExistingPost } from "../../controllers/gbp/gbpPost.controller.js";
import { getPerformance, getKeywords } from "../../controllers/gbp/gbpPerformance.controller.js";
import { runAudit, getLatestAudit } from "../../controllers/gbp/gbpAudit.controller.js";
import {
  runAudit as runLocalSEOAudit,
  getLatestAudit as getLatestLocalSEOAudit,
  getAuditHistory,
  compareAudits,
  getActionPlan,
  getFixQueue,
} from "../../controllers/gbp/localSEOAudit.controller.js";
import { aiReviewReply, aiPost, aiDescription, aiSEORecommendations, ai30DayPlan, aiFAQ, aiAnalyzeProfile, getSEOActionPlan, updatePlanDay } from "../../controllers/gbp/gbpAI.controller.js";
import { getNotifications, markRead, markAllRead } from "../../controllers/gbp/gbpNotification.controller.js";
import { listCompetitors, addCompetitor, updateCompetitor, deleteCompetitor, autoDiscoverCompetitorsController } from "../../controllers/gbp/gbpCompetitor.controller.js";
import { triggerSync, getSyncStatus } from "../../controllers/gbp/gbpSync.controller.js";

const router = express.Router();
router.use(express.json());

// OAuth
router.get("/oauth/connect", authMiddleware, connectGoogle);
router.get("/oauth/callback", oauthCallback); // No auth — Google redirects here
router.delete("/oauth/disconnect", authMiddleware, disconnectGoogle);
router.get("/oauth/status", authMiddleware, getStatus);

// Locations
router.get("/locations", authMiddleware, listLocations);
router.get("/locations/:id", authMiddleware, getLocation);
router.post("/locations/sync", authMiddleware, syncLocations);
router.post("/locations/:id/primary", authMiddleware, setLocationPrimary);

// Reviews
router.get("/locations/:locationId/reviews", authMiddleware, listReviews);
router.post("/locations/:locationId/reviews/sync", authMiddleware, syncLocationReviews);
router.put("/locations/:locationId/reviews/:reviewId/reply", authMiddleware, postReviewReply);
router.delete("/locations/:locationId/reviews/:reviewId/reply", authMiddleware, removeReviewReply);

// Review Automation Settings
router.get("/locations/:locationId/reviews/automation/settings", authMiddleware, getReviewAutomationSettings);
router.put("/locations/:locationId/reviews/automation/settings", authMiddleware, updateReviewAutomationSettings);

// Posts
router.get("/locations/:locationId/posts", authMiddleware, listPosts);
router.post("/locations/:locationId/posts", authMiddleware, createNewPost);
router.patch("/locations/:locationId/posts/:postId", authMiddleware, updateExistingPost);
router.delete("/locations/:locationId/posts/:postId", authMiddleware, removePost);
router.post("/locations/:locationId/posts/:postId/publish", authMiddleware, publishExistingPost);

// Performance (Legacy)
router.get("/locations/:locationId/performance", authMiddleware, getPerformance);
router.get("/locations/:locationId/keywords", authMiddleware, getKeywords);

// Performance Dashboard (New)
import {
  getPerformanceDashboard,
  getPerformanceStats,
  getPerformanceTrend,
  getAIAnalysis,
  getPerformanceAlerts,
  getLocationComparison,
  getLocationHealth,
  syncPerformanceData,
  getQuickStats,
  getActionCenter,
  getIntegratedStats,
  getPerformanceDebug, // Add debug endpoint
} from "../../controllers/gbp/gbpPerformanceDashboard.controller.js";

router.get("/performance/dashboard", authMiddleware, getPerformanceDashboard);
router.get("/performance/stats", authMiddleware, getPerformanceStats);
router.get("/performance/trend", authMiddleware, getPerformanceTrend);
router.get("/performance/ai-analysis", authMiddleware, getAIAnalysis);
router.get("/performance/alerts", authMiddleware, getPerformanceAlerts);
router.get("/performance/locations", authMiddleware, getLocationComparison);
router.get("/performance/health", authMiddleware, getLocationHealth);
router.post("/performance/sync", authMiddleware, syncPerformanceData);
router.get("/performance/quick-stats", authMiddleware, getQuickStats);
router.get("/performance/action-center", authMiddleware, getActionCenter);
router.get("/performance/integrated-stats", authMiddleware, getIntegratedStats);
router.get("/performance/debug", authMiddleware, getPerformanceDebug); // Debug endpoint

// Audit (Legacy)
router.post("/locations/:locationId/audit", authMiddleware, runAudit);
router.get("/locations/:locationId/audit", authMiddleware, getLatestAudit);

// Local SEO Audit (New)
router.post("/audit/run", authMiddleware, runLocalSEOAudit);
router.get("/audit/latest", authMiddleware, getLatestLocalSEOAudit);
router.get("/audit/history", authMiddleware, getAuditHistory);
router.get("/audit/compare", authMiddleware, compareAudits);
router.get("/audit/action-plan", authMiddleware, getActionPlan);
router.get("/audit/fix-queue", authMiddleware, getFixQueue);

// AI
router.post("/ai/review-reply", authMiddleware, aiReviewReply);
router.post("/ai/post", authMiddleware, aiPost);
router.post("/ai/description", authMiddleware, aiDescription);
router.post("/ai/seo-recommendations/:locationId", authMiddleware, aiSEORecommendations);
router.post("/ai/30-day-plan/:locationId", authMiddleware, ai30DayPlan);
router.get("/ai/30-day-plan/:locationId", authMiddleware, getSEOActionPlan);
router.patch("/ai/30-day-plan/:locationId/:planId/days/:dayNumber", authMiddleware, updatePlanDay);
router.post("/ai/faq", authMiddleware, aiFAQ);
router.post("/ai/analyze/:locationId", authMiddleware, aiAnalyzeProfile);

// Scheduler
import {
  getScheduledPosts,
  createRecurringSchedule,
  getRecurringSchedules,
  updateRecurringSchedule,
  toggleRecurringSchedule,
  deleteRecurringSchedule,
  getLocationSettings,
  updateLocationSettings,
  toggleLocationScheduling,
  generateAICalendar,
  approveCalendarPosts,
  createCampaign,
  createMultiLocationCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  toggleCampaign,
  deleteCampaign,
  getCampaignAnalytics,
  getPublishHistory,
  getSchedulerHealth,
  bulkUpdatePosts,
  getSchedulerStats,
} from "../../controllers/gbp/gbpScheduler.controller.js";

router.get("/locations/:locationId/scheduled-posts", authMiddleware, getScheduledPosts);
router.get("/scheduler/stats", authMiddleware, getSchedulerStats);
router.get("/scheduler/health", authMiddleware, getSchedulerHealth);
router.get("/scheduler/history", authMiddleware, getPublishHistory);
router.post("/scheduler/bulk-update", authMiddleware, bulkUpdatePosts);

// Recurring Schedules
router.post("/recurring-schedules", authMiddleware, createRecurringSchedule);
router.get("/recurring-schedules", authMiddleware, getRecurringSchedules);
router.patch("/recurring-schedules/:scheduleId", authMiddleware, updateRecurringSchedule);
router.post("/recurring-schedules/:scheduleId/toggle", authMiddleware, toggleRecurringSchedule);
router.delete("/recurring-schedules/:scheduleId", authMiddleware, deleteRecurringSchedule);

// Location Settings
router.get("/locations/:locationId/settings", authMiddleware, getLocationSettings);
router.patch("/locations/:locationId/settings", authMiddleware, updateLocationSettings);
router.post("/locations/:locationId/toggle-scheduling", authMiddleware, toggleLocationScheduling);

// AI Calendar
router.post("/locations/:locationId/ai-calendar", authMiddleware, generateAICalendar);
router.post("/ai-calendar/approve", authMiddleware, approveCalendarPosts);

// Campaigns
router.post("/campaigns", authMiddleware, createCampaign);
router.post("/campaigns/multi-location", authMiddleware, createMultiLocationCampaign);
router.get("/campaigns", authMiddleware, getCampaigns);
router.get("/campaigns/:campaignId", authMiddleware, getCampaign);
router.patch("/campaigns/:campaignId", authMiddleware, updateCampaign);
router.post("/campaigns/:campaignId/toggle", authMiddleware, toggleCampaign);
router.delete("/campaigns/:campaignId", authMiddleware, deleteCampaign);
router.get("/campaigns/:campaignId/analytics", authMiddleware, getCampaignAnalytics);

// Notifications
router.get("/notifications", authMiddleware, getNotifications);
router.patch("/notifications/:id/read", authMiddleware, markRead);
router.patch("/notifications/read-all", authMiddleware, markAllRead);

// Competitors
router.get("/locations/:locationId/competitors", authMiddleware, listCompetitors);
router.post("/locations/:locationId/competitors", authMiddleware, addCompetitor);
router.post("/locations/:locationId/competitors/auto-discover", authMiddleware, autoDiscoverCompetitorsController);
router.patch("/locations/:locationId/competitors/:competitorId", authMiddleware, updateCompetitor);
router.delete("/locations/:locationId/competitors/:competitorId", authMiddleware, deleteCompetitor);

// Sync
router.post("/sync", authMiddleware, triggerSync);
router.get("/sync/status", authMiddleware, getSyncStatus);

export default router;
