/**
 * GBP Command Center Dashboard Controller
 * Aggregates all dashboard data in a single optimized endpoint
 */

import GbpLocation from '../../models/gbp/GbpLocation.js';
import GbpReview from '../../models/gbp/GbpReview.js';
import GbpPost from '../../models/gbp/GbpPost.js';
import GbpSearchKeyword from '../../models/gbp/GbpSearchKeyword.js';
import GbpNotification from '../../models/gbp/GbpNotification.js';
import GbpSEOAudit from '../../models/gbp/GbpSEOAudit.js';
import { getLatestAudit } from './localSEOAudit.controller.js';
import { getStoredMetrics } from '../../services/gbp/gbpPerformance.service.js';

/**
 * Get aggregated dashboard data for a location
 */
export const getDashboardData = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { dateRange = '30' } = req.query; // days
    
    // Verify location ownership
    const location = await GbpLocation.findOne({
      _id: locationId,
      userId: req.user._id
    }).lean();
    
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found or access denied'
      });
    }
    
    // Parallel data fetching
    const [
      reviewsData,
      postsData,
      performanceData,
      keywordsData,
      auditData,
      notificationsData,
      activityData
    ] = await Promise.allSettled([
      getReviewsOverview(req.user._id, locationId),
      getPostsOverview(req.user._id, locationId),
      getPerformanceOverview(req.user._id, locationId, parseInt(dateRange)),
      getSearchKeywordsOverview(req.user._id, locationId),
      getAuditOverview(req.user._id, locationId),
      getNotificationsOverview(req.user._id, locationId),
      getRecentActivity(req.user._id, locationId)
    ]);
    
    // Calculate profile health
    const profileHealth = calculateProfileHealth(location, auditData.status === 'fulfilled' ? auditData.value : null);
    
    // Generate AI recommendations
    const recommendations = generateRecommendations(
      location,
      reviewsData.status === 'fulfilled' ? reviewsData.value : {},
      postsData.status === 'fulfilled' ? postsData.value : {},
      performanceData.status === 'fulfilled' ? performanceData.value : {},
      auditData.status === 'fulfilled' ? auditData.value : {}
    );
    
    // Get alerts
    const alerts = generateAlerts(
      reviewsData.status === 'fulfilled' ? reviewsData.value : {},
      postsData.status === 'fulfilled' ? postsData.value : {},
      location
    );
    
    res.json({
      success: true,
      data: {
        location: {
          _id: location._id,
          name: location.locationName,
          address: location.address,
          phoneNumber: location.phoneNumbers?.[0]?.phoneNumber,
          websiteUri: location.websiteUri,
          primaryCategory: location.primaryCategory,
          openInfo: location.openInfo,
          profileImageUrl: location.profile?.description?.profilePhotoUrl,
          googleMapsUri: location.googleMapsUri,
          lastSynced: location.lastSyncedAt
        },
        profileHealth,
        performance: performanceData.status === 'fulfilled' ? performanceData.value : { 
          totalViews: 0, 
          totalSearches: 0, 
          totalActions: 0,
          callClicks: 0,
          websiteClicks: 0,
          directionClicks: 0,
          viewsChange: 0,
          searchesChange: 0,
          actionsChange: 0
        },
        reviews: reviewsData.status === 'fulfilled' ? reviewsData.value : { 
          total: 0, 
          averageRating: 0,
          unrepliedCount: 0,
          recentReviews: [],
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        },
        searchKeywords: keywordsData.status === 'fulfilled' ? keywordsData.value : { 
          topKeywords: [],
          totalKeywords: 0
        },
        posts: postsData.status === 'fulfilled' ? postsData.value : { 
          total: 0,
          published: 0,
          scheduled: 0,
          draft: 0,
          lastPublished: null
        },
        seoSnapshot: auditData.status === 'fulfilled' ? auditData.value : { 
          overallScore: 0,
          onPageScore: 0,
          technicalScore: 0,
          contentScore: 0,
          lastAuditDate: null
        },
        recentActivity: activityData.status === 'fulfilled' ? activityData.value : [],
        alerts: alerts || [],
        recommendations: recommendations || [],
        syncStatus: {
          isActive: false,
          lastSyncAt: location.lastSyncedAt,
          nextScheduledSync: null
        }
      }
    });
    
  } catch (err) {
    console.error('[Dashboard] Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to load dashboard data'
    });
  }
};

/**
 * Get reviews overview
 */
async function getReviewsOverview(userId, locationId) {
  const reviews = await GbpReview.find({ userId, locationId }).lean();
  
  const total = reviews.length;
  const avgRating = total > 0 
    ? reviews.reduce((sum, r) => sum + (r.starRating === 'FIVE' ? 5 : r.starRating === 'FOUR' ? 4 : r.starRating === 'THREE' ? 3 : r.starRating === 'TWO' ? 2 : 1), 0) / total 
    : 0;
  
  const unreplied = reviews.filter(r => !r.reviewReply).length;
  
  const ratingDistribution = {
    5: reviews.filter(r => r.starRating === 'FIVE').length,
    4: reviews.filter(r => r.starRating === 'FOUR').length,
    3: reviews.filter(r => r.starRating === 'THREE').length,
    2: reviews.filter(r => r.starRating === 'TWO').length,
    1: reviews.filter(r => r.starRating === 'ONE').length,
  };
  
  // Map star rating enum to number
  const mapStarRating = (rating) => {
    const map = { 'FIVE': 5, 'FOUR': 4, 'THREE': 3, 'TWO': 2, 'ONE': 1 };
    return map[rating] || 0;
  };
  
  const recentReviews = reviews
    .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    .slice(0, 5)
    .map(r => ({
      _id: r._id,
      reviewer: { displayName: r.reviewer?.displayName || 'Anonymous' },
      starRating: mapStarRating(r.starRating),
      comment: r.comment || '',
      createTime: r.createTime
    }));
  
  return {
    total,
    averageRating: parseFloat(avgRating.toFixed(1)),
    unrepliedCount: unreplied,
    recentReviews,
    ratingDistribution
  };
}

/**
 * Get posts overview
 */
async function getPostsOverview(userId, locationId) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const [total, published, scheduled, drafts, nextScheduled] = await Promise.all([
    GbpPost.countDocuments({ userId, locationId }),
    GbpPost.countDocuments({
      userId,
      locationId,
      status: 'published'
    }),
    GbpPost.countDocuments({ userId, locationId, status: 'scheduled' }),
    GbpPost.countDocuments({ userId, locationId, status: 'draft' }),
    GbpPost.findOne({
      userId,
      locationId,
      status: 'scheduled',
      scheduledAt: { $gt: now }
    }).sort({ scheduledAt: 1 }).lean()
  ]);
  
  // Get last published post
  const lastPublishedPost = await GbpPost.findOne({
    userId,
    locationId,
    status: 'published'
  }).sort({ publishedAt: -1 }).lean();
  
  return {
    total,
    published,
    scheduled,
    draft: drafts,
    lastPublished: lastPublishedPost?.publishedAt || null
  };
}

/**
 * Get performance overview
 */
async function getPerformanceOverview(userId, locationId, days) {
  try {
    // Use existing performance service
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    const stats = await getStoredMetrics(
      userId,
      locationId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    
    // Calculate totals and changes
    const totalViews = stats?.totalViews || 0;
    const totalSearches = stats?.totalSearches || 0;
    const totalActions = stats?.totalActions || 0;
    const callClicks = stats?.callClicks || 0;
    const websiteClicks = stats?.websiteClicks || 0;
    const directionClicks = stats?.directionClicks || 0;
    
    // Calculate percentage changes (simplified - you can enhance this with actual previous period data)
    const viewsChange = 0; // TODO: Calculate from previous period
    const searchesChange = 0;
    const actionsChange = 0;
    
    return {
      totalViews,
      totalSearches,
      totalActions,
      callClicks,
      websiteClicks,
      directionClicks,
      viewsChange,
      searchesChange,
      actionsChange
    };
  } catch (err) {
    console.error('[Dashboard] Performance error:', err);
    return {
      totalViews: 0,
      totalSearches: 0,
      totalActions: 0,
      callClicks: 0,
      websiteClicks: 0,
      directionClicks: 0,
      viewsChange: 0,
      searchesChange: 0,
      actionsChange: 0,
      available: false,
      error: err.message
    };
  }
}

/**
 * Get search keywords overview
 */
async function getSearchKeywordsOverview(userId, locationId) {
  const latestKeywords = await GbpSearchKeyword.findOne({ userId, locationId })
    .sort({ createdAt: -1 })
    .lean();
  
  if (!latestKeywords || !latestKeywords.keywords || latestKeywords.keywords.length === 0) {
    return { topKeywords: [], totalKeywords: 0 };
  }
  
  const topKeywords = latestKeywords.keywords
    .sort((a, b) => {
      const thresholdA = parseInt(a.insightsValue?.threshold || '0');
      const thresholdB = parseInt(b.insightsValue?.threshold || '0');
      return thresholdB - thresholdA;
    })
    .slice(0, 10)
    .map((k, index) => ({
      keyword: k.searchKeyword,
      impressions: parseInt(k.insightsValue?.threshold || '0'),
      rank: index + 1
    }));
  
  return {
    topKeywords,
    totalKeywords: latestKeywords.keywords.length
  };
}

/**
 * Get audit overview
 */
async function getAuditOverview(userId, locationId) {
  try {
    const latestAudit = await GbpSEOAudit.findOne({ userId, locationId })
      .sort({ createdAt: -1 })
      .lean();
      
    if (!latestAudit) {
      return {
        overallScore: 0,
        onPageScore: 0,
        technicalScore: 0,
        contentScore: 0,
        lastAuditDate: null
      };
    }
    
    return {
      overallScore: latestAudit.overallScore || 0,
      onPageScore: latestAudit.categoryScores?.profile || 0,
      technicalScore: latestAudit.categoryScores?.website || 0,
      contentScore: latestAudit.categoryScores?.content || 0,
      lastAuditDate: latestAudit.createdAt || null
    };
  } catch (err) {
    return {
      overallScore: 0,
      onPageScore: 0,
      technicalScore: 0,
      contentScore: 0,
      lastAuditDate: null
    };
  }
}

/**
 * Get notifications overview
 */
async function getNotificationsOverview(userId, locationId) {
  const unread = await GbpNotification.countDocuments({
    userId,
    locationId,
    read: false
  });
  
  return { unread };
}

/**
 * Get recent activity
 */
async function getRecentActivity(userId, locationId) {
  const activities = [];
  
  // Recent reviews
  const recentReview = await GbpReview.findOne({ userId, locationId })
    .sort({ createTime: -1 })
    .lean();
  
  if (recentReview) {
    activities.push({
      type: 'review_received',
      message: 'New review received',
      timestamp: recentReview.createTime,
      icon: 'star'
    });
  }
  
  // Recent posts
  const recentPost = await GbpPost.findOne({
    userId,
    locationId,
    status: 'published'
  }).sort({ publishedAt: -1 }).lean();
  
  if (recentPost) {
    activities.push({
      type: 'post_published',
      message: 'Post published',
      timestamp: recentPost.publishedAt,
      icon: 'file'
    });
  }
  
  return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
}

/**
 * Calculate profile health score
 */
function calculateProfileHealth(location, audit) {
  const items = [];
  let totalScore = 0;
  let maxScore = 0;
  
  // Business Name (10 points)
  const hasName = !!location.locationName;
  if (hasName) {
    items.push({ field: 'businessName', label: 'Business Name', score: 10 });
    totalScore += 10;
  }
  maxScore += 10;
  
  // Primary Category (10 points)
  const hasCategory = !!location.primaryCategory;
  if (hasCategory) {
    items.push({ field: 'primaryCategory', label: 'Primary Category', score: 10 });
    totalScore += 10;
  }
  maxScore += 10;
  
  // Description (15 points)
  const hasDescription = !!location.profile?.description;
  if (hasDescription) {
    items.push({ field: 'description', label: 'Description', score: 15 });
    totalScore += 15;
  }
  maxScore += 15;
  
  // Phone (10 points)
  const hasPhone = !!(location.phoneNumbers && location.phoneNumbers.length > 0);
  if (hasPhone) {
    items.push({ field: 'phone', label: 'Phone Number', score: 10 });
    totalScore += 10;
  }
  maxScore += 10;
  
  // Website (10 points)
  const hasWebsite = !!location.websiteUri;
  if (hasWebsite) {
    items.push({ field: 'website', label: 'Website', score: 10 });
    totalScore += 10;
  }
  maxScore += 10;
  
  // Address (10 points)
  const hasAddress = !!location.address;
  if (hasAddress) {
    items.push({ field: 'address', label: 'Address', score: 10 });
    totalScore += 10;
  }
  maxScore += 10;
  
  // Hours (15 points)
  const hasHours = !!location.regularHours;
  if (hasHours) {
    items.push({ field: 'hours', label: 'Business Hours', score: 15 });
    totalScore += 15;
  }
  maxScore += 15;
  
  // Photos (20 points)
  const hasPhotos = !!location.profile?.description?.profilePhotoUrl;
  if (hasPhotos) {
    items.push({ field: 'photos', label: 'Photos', score: 20 });
    totalScore += 20;
  }
  maxScore += 20;
  
  // Build completed and missing arrays
  const completedItems = [];
  const missingItems = [];
  
  if (hasName) completedItems.push({ field: 'businessName', label: 'Business Name', score: 10 });
  else missingItems.push({ field: 'businessName', label: 'Business Name', maxScore: 10 });
  
  if (hasCategory) completedItems.push({ field: 'primaryCategory', label: 'Primary Category', score: 10 });
  else missingItems.push({ field: 'primaryCategory', label: 'Primary Category', maxScore: 10 });
  
  if (hasDescription) completedItems.push({ field: 'description', label: 'Description', score: 15 });
  else missingItems.push({ field: 'description', label: 'Description', maxScore: 15 });
  
  if (hasPhone) completedItems.push({ field: 'phone', label: 'Phone Number', score: 10 });
  else missingItems.push({ field: 'phone', label: 'Phone Number', maxScore: 10 });
  
  if (hasWebsite) completedItems.push({ field: 'website', label: 'Website', score: 10 });
  else missingItems.push({ field: 'website', label: 'Website', maxScore: 10 });
  
  if (hasAddress) completedItems.push({ field: 'address', label: 'Address', score: 10 });
  else missingItems.push({ field: 'address', label: 'Address', maxScore: 10 });
  
  if (hasHours) completedItems.push({ field: 'hours', label: 'Business Hours', score: 15 });
  else missingItems.push({ field: 'hours', label: 'Business Hours', maxScore: 15 });
  
  if (hasPhotos) completedItems.push({ field: 'photos', label: 'Photos', score: 20 });
  else missingItems.push({ field: 'photos', label: 'Photos', maxScore: 20 });
  
  return {
    score: totalScore,
    maxScore,
    completedItems,
    missingItems
  };
}

/**
 * Generate AI recommendations
 */
function generateRecommendations(location, reviews, posts, performance, audit) {
  const recommendations = [];
  
  // Unreplied reviews
  if (reviews.available && reviews.unreplied > 0) {
    recommendations.push({
      id: 'unreplied_reviews',
      priority: 'high',
      title: reviews.unreplied + ' reviews need replies',
      description: 'Generate and publish replies to improve customer engagement and trust.',
      action: 'Review & Reply',
      actionUrl: '/google-business-profile/reviews',
      icon: 'star'
    });
  }
  
  // No scheduled posts
  if (posts.available && posts.scheduled === 0) {
    recommendations.push({
      id: 'no_scheduled_posts',
      priority: 'medium',
      title: 'No posts scheduled for the next 7 days',
      description: 'Create a weekly content schedule to maintain consistent visibility.',
      action: 'Schedule Posts',
      actionUrl: '/google-business-profile/post-scheduler',
      icon: 'calendar'
    });
  }
  
  // Missing website
  if (!location.websiteUri) {
    recommendations.push({
      id: 'missing_website',
      priority: 'high',
      title: 'Website URL missing',
      description: 'Add your website to drive more traffic from Google searches.',
      action: 'Add Website',
      actionUrl: '/google-business-profile/locations',
      icon: 'globe'
    });
  }
  
  // Low profile completeness
  if (location.profileCompleteness < 80) {
    recommendations.push({
      id: 'incomplete_profile',
      priority: 'medium',
      title: 'Profile is ' + location.profileCompleteness + '% complete',
      description: 'Complete your profile to improve search visibility and customer trust.',
      action: 'Complete Profile',
      actionUrl: '/google-business-profile/audit',
      icon: 'check'
    });
  }
  
  return recommendations.slice(0, 5);
}

/**
 * Generate alerts
 */
function generateAlerts(reviews, posts, location) {
  const alerts = [];
  
  if (reviews.available && reviews.unreplied >= 5) {
    alerts.push({
      severity: 'warning',
      message: reviews.unreplied + ' reviews need replies',
      actionUrl: '/google-business-profile/reviews'
    });
  }
  
  if (posts.available && posts.failed > 0) {
    alerts.push({
      severity: 'critical',
      message: posts.failed + ' scheduled posts failed',
      actionUrl: '/google-business-profile/post-scheduler'
    });
  }
  
  if (!location.lastSyncedAt || (Date.now() - new Date(location.lastSyncedAt).getTime()) > 7 * 24 * 60 * 60 * 1000) {
    alerts.push({
      severity: 'warning',
      message: 'Profile sync needed',
      actionUrl: '/google-business-profile/dashboard'
    });
  }
  
  return alerts;
}
