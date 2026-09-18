import api from "@/lib/api";

const BASE = "/google-business-profile";

// OAuth
export const gbpGetConnectUrl = () => api.get(`${BASE}/oauth/connect`);
export const gbpDisconnect = () => api.delete(`${BASE}/oauth/disconnect`);
export const gbpGetStatus = () => api.get(`${BASE}/oauth/status`);

// Locations
export const gbpGetLocations = () => api.get(`${BASE}/locations`);
export const gbpGetLocation = (id: string) => api.get(`${BASE}/locations/${id}`);
export const gbpSyncLocations = () => api.post(`${BASE}/locations/sync`);
export const gbpSetPrimary = (id: string) => api.post(`${BASE}/locations/${id}/primary`);

// Reviews
export const gbpGetReviews = (locationId: string, params?: Record<string, unknown>) =>
  api.get(`${BASE}/locations/${locationId}/reviews`, { params });
export const gbpSyncReviews = (locationId: string) =>
  api.post(`${BASE}/locations/${locationId}/reviews/sync`);
export const gbpReplyToReview = (locationId: string, reviewId: string, replyText: string) =>
  api.put(`${BASE}/locations/${locationId}/reviews/${reviewId}/reply`, { replyText });
export const gbpDeleteReviewReply = (locationId: string, reviewId: string) =>
  api.delete(`${BASE}/locations/${locationId}/reviews/${reviewId}/reply`);

// Posts
export const gbpGetPosts = (locationId: string, params?: Record<string, unknown>) =>
  api.get(`${BASE}/locations/${locationId}/posts`, { params });
export const gbpCreatePost = (locationId: string, data: Record<string, unknown>) =>
  api.post(`${BASE}/locations/${locationId}/posts`, data);
export const gbpUpdatePost = (locationId: string, postId: string, data: Record<string, unknown>) =>
  api.patch(`${BASE}/locations/${locationId}/posts/${postId}`, data);
export const gbpDeletePost = (locationId: string, postId: string) =>
  api.delete(`${BASE}/locations/${locationId}/posts/${postId}`);
export const gbpPublishPost = (locationId: string, postId: string) =>
  api.post(`${BASE}/locations/${locationId}/posts/${postId}/publish`);

// Performance
export const gbpGetPerformance = (locationId: string, params?: Record<string, unknown>) =>
  api.get(`${BASE}/locations/${locationId}/performance`, { params });
export const gbpGetKeywords = (locationId: string, params?: Record<string, unknown>) =>
  api.get(`${BASE}/locations/${locationId}/keywords`, { params });

// Audit
export const gbpRunAudit = (locationId: string) =>
  api.post(`${BASE}/locations/${locationId}/audit`);
export const gbpGetAudit = (locationId: string) =>
  api.get(`${BASE}/locations/${locationId}/audit`);

// AI
export const gbpAIReviewReply = (data: Record<string, unknown>) => api.post(`${BASE}/ai/review-reply`, data);
export const gbpAIPost = (data: Record<string, unknown>) => api.post(`${BASE}/ai/post`, data);
export const gbpAIDescription = (data: Record<string, unknown>) => api.post(`${BASE}/ai/description`, data);
export const gbpAISEORecommendations = (locationId: string, data?: Record<string, unknown>) =>
  api.post(`${BASE}/ai/seo-recommendations/${locationId}`, data || {});
export const gbpAI30DayPlan = (locationId: string) =>
  api.post(`${BASE}/ai/30-day-plan/${locationId}`);
export const gbpGet30DayPlan = (locationId: string) =>
  api.get(`${BASE}/ai/30-day-plan/${locationId}`);
export const gbpUpdatePlanDay = (locationId: string, planId: string, dayNumber: number, isCompleted: boolean) =>
  api.patch(`${BASE}/ai/30-day-plan/${locationId}/${planId}/days/${dayNumber}`, { isCompleted });
export const gbpAIFAQ = (data: Record<string, unknown>) => api.post(`${BASE}/ai/faq`, data);
export const gbpAIAnalyzeProfile = (locationId: string) =>
  api.post(`${BASE}/ai/analyze/${locationId}`);

// Notifications
export const gbpGetNotifications = (params?: Record<string, unknown>) =>
  api.get(`${BASE}/notifications`, { params });
export const gbpMarkRead = (id: string) => api.patch(`${BASE}/notifications/${id}/read`);
export const gbpMarkAllRead = () => api.patch(`${BASE}/notifications/read-all`);

// Competitors
export const gbpGetCompetitors = (locationId: string) =>
  api.get(`${BASE}/locations/${locationId}/competitors`);
export const gbpAddCompetitor = (locationId: string, data: Record<string, unknown>) =>
  api.post(`${BASE}/locations/${locationId}/competitors`, data);
export const gbpAutoDiscoverCompetitors = (locationId: string, data?: Record<string, unknown>) =>
  api.post(`${BASE}/locations/${locationId}/competitors/auto-discover`, data || {});
export const gbpUpdateCompetitor = (locationId: string, competitorId: string, data: Record<string, unknown>) =>
  api.patch(`${BASE}/locations/${locationId}/competitors/${competitorId}`, data);
export const gbpDeleteCompetitor = (locationId: string, competitorId: string) =>
  api.delete(`${BASE}/locations/${locationId}/competitors/${competitorId}`);

// Sync
export const gbpTriggerSync = () => api.post(`${BASE}/sync`);
export const gbpGetSyncStatus = () => api.get(`${BASE}/sync/status`);

// Scheduler APIs
export const gbpGetScheduledPosts = (locationId: string, params?: Record<string, unknown>) =>
  api.get(`${BASE}/locations/${locationId}/scheduled-posts`, { params });

export const gbpGetSchedulerStats = (locationId?: string) =>
  api.get(`${BASE}/scheduler/stats`, { params: locationId ? { locationId } : {} });

export const gbpGetSchedulerHealth = () =>
  api.get(`${BASE}/scheduler/health`);

export const gbpGetPublishHistory = (params?: Record<string, unknown>) =>
  api.get(`${BASE}/scheduler/history`, { params });

export const gbpBulkUpdatePosts = (postIds: string[], status: string) =>
  api.post(`${BASE}/scheduler/bulk-update`, { postIds, status });

// Recurring Schedules
export const gbpCreateRecurringSchedule = (data: Record<string, unknown>) =>
  api.post(`${BASE}/recurring-schedules`, data);

export const gbpGetRecurringSchedules = (locationId?: string) =>
  api.get(`${BASE}/recurring-schedules`, { params: locationId ? { locationId } : {} });

export const gbpUpdateRecurringSchedule = (scheduleId: string, data: Record<string, unknown>) =>
  api.patch(`${BASE}/recurring-schedules/${scheduleId}`, data);

export const gbpToggleRecurringSchedule = (scheduleId: string, pause: boolean) =>
  api.post(`${BASE}/recurring-schedules/${scheduleId}/toggle`, { pause });

export const gbpDeleteRecurringSchedule = (scheduleId: string) =>
  api.delete(`${BASE}/recurring-schedules/${scheduleId}`);

// Location Settings
export const gbpGetLocationSettings = (locationId: string) =>
  api.get(`${BASE}/locations/${locationId}/settings`);

export const gbpUpdateLocationSettings = (locationId: string, data: Record<string, unknown>) =>
  api.patch(`${BASE}/locations/${locationId}/settings`, data);

export const gbpToggleLocationScheduling = (locationId: string, pause: boolean) =>
  api.post(`${BASE}/locations/${locationId}/toggle-scheduling`, { pause });

// AI Calendar
export const gbpGenerateAICalendar = (locationId: string, options: Record<string, unknown>) =>
  api.post(`${BASE}/locations/${locationId}/ai-calendar`, options);

export const gbpApproveCalendarPosts = (postIds: string[]) =>
  api.post(`${BASE}/ai-calendar/approve`, { postIds });

// Campaigns
export const gbpCreateCampaign = (data: Record<string, unknown>) =>
  api.post(`${BASE}/campaigns`, data);

export const gbpCreateMultiLocationCampaign = (data: Record<string, unknown>) =>
  api.post(`${BASE}/campaigns/multi-location`, data);

export const gbpGetCampaigns = (params?: Record<string, unknown>) =>
  api.get(`${BASE}/campaigns`, { params });

export const gbpGetCampaign = (campaignId: string) =>
  api.get(`${BASE}/campaigns/${campaignId}`);

export const gbpUpdateCampaign = (campaignId: string, data: Record<string, unknown>) =>
  api.patch(`${BASE}/campaigns/${campaignId}`, data);

export const gbpToggleCampaign = (campaignId: string, pause: boolean) =>
  api.post(`${BASE}/campaigns/${campaignId}/toggle`, { pause });

export const gbpDeleteCampaign = (campaignId: string) =>
  api.delete(`${BASE}/campaigns/${campaignId}`);

export const gbpGetCampaignAnalytics = (campaignId: string) =>
  api.get(`${BASE}/campaigns/${campaignId}/analytics`);


// Performance Dashboard APIs
export const gbpGetPerformanceDashboard = (params?: Record<string, unknown>) =>
  api.get(`${BASE}/performance/dashboard`, { params });

export const gbpGetPerformanceStats = (params: Record<string, unknown>) =>
  api.get(`${BASE}/performance/stats`, { params });

export const gbpGetPerformanceTrend = (params: Record<string, unknown>) =>
  api.get(`${BASE}/performance/trend`, { params });

export const gbpGetAIAnalysis = (params: Record<string, unknown>) =>
  api.get(`${BASE}/performance/ai-analysis`, { params });

export const gbpGetPerformanceAlerts = (params?: Record<string, unknown>) =>
  api.get(`${BASE}/performance/alerts`, { params });

export const gbpGetLocationComparison = (params?: Record<string, unknown>) =>
  api.get(`${BASE}/performance/locations`, { params });

export const gbpGetLocationHealth = (locationId: string) =>
  api.get(`${BASE}/performance/health`, { params: { locationId } });

export const gbpSyncPerformanceData = (data: Record<string, unknown>) =>
  api.post(`${BASE}/performance/sync`, data);

export const gbpGetQuickStats = (locationId?: string) =>
  api.get(`${BASE}/performance/quick-stats`, { params: locationId ? { locationId } : {} });

export const gbpGetActionCenter = (locationId: string) =>
  api.get(`${BASE}/performance/action-center`, { params: { locationId } });

export const gbpGetIntegratedStats = (locationId: string) =>
  api.get(`${BASE}/performance/integrated-stats`, { params: { locationId } });

export const gbpGetPerformanceDebug = (params: Record<string, unknown>) =>
  api.get(`${BASE}/performance/debug`, { params });

// Local SEO Audit APIs
export const gbpRunLocalSEOAudit = (locationId: string) =>
  api.post(`${BASE}/audit/run`, { locationId });

export const gbpGetLatestAudit = (locationId: string) =>
  api.get(`${BASE}/audit/latest`, { params: { locationId } });

export const gbpGetAuditHistory = (locationId: string, limit = 10) =>
  api.get(`${BASE}/audit/history`, { params: { locationId, limit } });

export const gbpCompareAudits = (locationId: string) =>
  api.get(`${BASE}/audit/compare`, { params: { locationId } });

export const gbpGetActionPlan = (locationId: string) =>
  api.get(`${BASE}/audit/action-plan`, { params: { locationId } });

export const gbpGetFixQueue = (locationId: string) =>
  api.get(`${BASE}/audit/fix-queue`, { params: { locationId } });
