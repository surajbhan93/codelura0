/**
 * GBP Performance Dashboard Controller
 * Handles all performance dashboard endpoints
 */

import { analyzePerformance, calculateLocationHealth } from "../../services/gbp/gbpPerformanceAnalyzer.service.js";
import { getPerformanceSnapshot, getAllLocationSnapshots, syncLocationPerformance, syncAllLocations } from "../../services/gbp/gbpPerformanceSync.service.js";
import { analyzePerformanceData } from "../../services/gbp/gbpGrokAI.service.js";
import { getLocationAlerts, getAllLocationAlerts } from "../../services/gbp/gbpPerformanceAlerts.service.js";
import { getStoredMetrics } from "../../services/gbp/gbpPerformance.service.js";
import GbpPerformanceSnapshot from "../../models/gbp/GbpPerformanceSnapshot.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpReview from "../../models/gbp/GbpReview.js";
import GbpPost from "../../models/gbp/GbpPost.js";
import GbpSearchKeyword from "../../models/gbp/GbpSearchKeyword.js";

/**
 * GET /api/google-business-profile/performance/dashboard
 * Get complete dashboard data for a location
 */
export const getPerformanceDashboard = async (req, res) => {
  try {
    const { locationId, startDate, endDate } = req.query;
    const userId = req.user._id;
    
    // Use provided dates or default to last 30 days
    let startDateStr, endDateStr;
    
    if (startDate && endDate) {
      startDateStr = startDate;
      endDateStr = endDate;
      console.log('[Performance Dashboard] Using provided date range:', { startDate, endDate });
    } else {
      const endDateObj = new Date();
      const startDateObj = new Date(endDateObj.getTime() - 30 * 24 * 60 * 60 * 1000);
      startDateStr = startDateObj.toISOString().split('T')[0];
      endDateStr = endDateObj.toISOString().split('T')[0];
      console.log('[Performance Dashboard] Using default 30-day range:', { startDateStr, endDateStr });
    }
    
    if (!locationId || locationId === 'all') {
      // Get all locations overview
      const snapshots = await getAllLocationSnapshots(userId, startDateStr, endDateStr);
      
      return res.json({
        success: true,
        mode: 'all_locations',
        period: { start: startDateStr, end: endDateStr },
        locations: snapshots,
        summary: {
          totalLocations: snapshots.length,
          avgScore: snapshots.length > 0 
            ? Math.round(snapshots.reduce((sum, s) => sum + s.performanceScore.score, 0) / snapshots.length)
            : 0,
          improving: snapshots.filter(s => s.trend.status === 'IMPROVING').length,
          declining: snapshots.filter(s => s.trend.status === 'DECLINING').length,
          stable: snapshots.filter(s => s.trend.status === 'STABLE').length,
        },
      });
    }
    
    // Get single location dashboard
    const snapshot = await getPerformanceSnapshot(userId, locationId, startDateStr, endDateStr);
    
    if (!snapshot) {
      return res.status(404).json({
        success: false,
        message: 'No performance data available for this period',
      });
    }
    
    res.json({
      success: true,
      mode: 'single_location',
      period: { start: startDateStr, end: endDateStr },
      snapshot,
    });
    
  } catch (error) {
    console.error('[Performance Dashboard] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load performance dashboard',
    });
  }
};

/**
 * GET /api/google-business-profile/performance/stats
 * Get performance stats for period comparison selector
 */
export const getPerformanceStats = async (req, res) => {
  try {
    const { locationId, startDate, endDate, compareWith } = req.query;
    const userId = req.user._id;
    
    if (!locationId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'locationId, startDate, and endDate are required',
      });
    }
    
    const snapshot = await getPerformanceSnapshot(userId, locationId, startDate, endDate);
    
    if (!snapshot) {
      return res.status(404).json({
        success: false,
        message: 'No performance data available',
      });
    }
    
    // If comparison period is specified, get that too
    let comparisonSnapshot = null;
    if (compareWith) {
      const [compareStart, compareEnd] = compareWith.split(',');
      if (compareStart && compareEnd) {
        comparisonSnapshot = await getPerformanceSnapshot(userId, locationId, compareStart, compareEnd);
      }
    }
    
    res.json({
      success: true,
      current: snapshot,
      comparison: comparisonSnapshot,
    });
    
  } catch (error) {
    console.error('[Performance Stats] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load performance stats',
    });
  }
};

/**
 * GET /api/google-business-profile/performance/trend
 * Get time-series trend data for charts
 */
export const getPerformanceTrend = async (req, res) => {
  try {
    const { locationId, startDate, endDate, metric } = req.query;
    const userId = req.user._id;
    
    if (!locationId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'locationId, startDate, and endDate are required',
      });
    }
    
    // Get daily metrics for the period
    const metrics = await getStoredMetrics(userId, locationId, startDate, endDate);
    
    if (!metrics || metrics.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No trend data available',
      });
    }
    
    // Format for chart
    const trendData = metrics.map(m => {
      const date = new Date(m.date).toISOString().split('T')[0];
      
      const totalImpressions = 
        (m.metrics.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0) +
        (m.metrics.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0) +
        (m.metrics.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0) +
        (m.metrics.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0);
      
      const searchImpressions = 
        (m.metrics.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0) +
        (m.metrics.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0);
      
      const mapsImpressions = 
        (m.metrics.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0) +
        (m.metrics.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0);
      
      return {
        date,
        totalImpressions,
        searchImpressions,
        mapsImpressions,
        profileViews: (m.metrics.VIEWS_MAPS || 0) + (m.metrics.VIEWS_SEARCH || 0),
        websiteClicks: m.metrics.WEBSITE_CLICKS || m.metrics.ACTIONS_WEBSITE || 0,
        callClicks: m.metrics.CALL_CLICKS || m.metrics.ACTIONS_PHONE || 0,
        directions: m.metrics.BUSINESS_DIRECTION_REQUESTS || m.metrics.ACTIONS_DRIVING_DIRECTIONS || 0,
        bookings: m.metrics.BUSINESS_BOOKINGS || 0,
      };
    });
    
    // If specific metric requested, return only that
    if (metric && metric !== 'all') {
      const metricData = trendData.map(d => ({
        date: d.date,
        value: d[metric] || 0,
      }));
      
      return res.json({
        success: true,
        metric,
        data: metricData,
      });
    }
    
    res.json({
      success: true,
      data: trendData,
    });
    
  } catch (error) {
    console.error('[Performance Trend] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load trend data',
    });
  }
};

/**
 * GET /api/google-business-profile/performance/ai-analysis
 * Get AI-generated performance insights
 */
export const getAIAnalysis = async (req, res) => {
  try {
    const { locationId, startDate, endDate } = req.query;
    const userId = req.user._id;
    
    if (!locationId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'locationId, startDate, and endDate are required',
      });
    }
    
    // Get performance analysis
    const performanceData = await analyzePerformance(userId, locationId, startDate, endDate);
    
    if (!performanceData.hasData) {
      return res.status(404).json({
        success: false,
        message: 'Not enough data for AI analysis',
      });
    }
    
    // Generate AI insights
    console.log('[AI Analysis] Generating insights for', locationId);
    const aiAnalysis = await analyzePerformanceData(performanceData);
    
    res.json({
      success: true,
      analysis: aiAnalysis,
    });
    
  } catch (error) {
    console.error('[AI Analysis] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI analysis',
    });
  }
};

/**
 * GET /api/google-business-profile/performance/alerts
 * Get performance alerts for location(s)
 */
export const getPerformanceAlerts = async (req, res) => {
  try {
    const { locationId, startDate, endDate } = req.query;
    const userId = req.user._id;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required',
      });
    }
    
    let alerts;
    
    if (!locationId || locationId === 'all') {
      // Get alerts for all locations
      alerts = await getAllLocationAlerts(userId, startDate, endDate);
    } else {
      // Get alerts for specific location
      alerts = await getLocationAlerts(userId, locationId, startDate, endDate);
    }
    
    // Group by severity
    const grouped = {
      critical: alerts.filter(a => a.severity === 'critical'),
      warning: alerts.filter(a => a.severity === 'warning'),
      positive: alerts.filter(a => a.severity === 'positive'),
      info: alerts.filter(a => a.severity === 'info'),
    };
    
    res.json({
      success: true,
      alerts,
      grouped,
      summary: {
        total: alerts.length,
        critical: grouped.critical.length,
        warning: grouped.warning.length,
        positive: grouped.positive.length,
      },
    });
    
  } catch (error) {
    console.error('[Performance Alerts] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load alerts',
    });
  }
};

/**
 * GET /api/google-business-profile/performance/locations
 * Get performance comparison for all locations
 */
export const getLocationComparison = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user._id;
    
    // Default to last 30 days
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];
    
    const snapshots = await getAllLocationSnapshots(userId, startDateStr, endDateStr);
    
    // Format for table
    const locations = snapshots.map(s => ({
      locationId: s.locationId,
      locationName: s.location.name,
      address: s.location.address,
      performanceScore: s.performanceScore.score,
      trend: s.trend,
      metrics: s.metrics,
      health: s.health?.score || 0,
      reviews: s.reviews,
      posts: s.posts,
    }));
    
    res.json({
      success: true,
      period: { start: startDateStr, end: endDateStr },
      locations,
      summary: {
        totalLocations: locations.length,
        avgScore: locations.length > 0 
          ? Math.round(locations.reduce((sum, l) => sum + l.performanceScore, 0) / locations.length)
          : 0,
        topPerformer: locations[0] || null,
        needsAttention: locations.filter(l => l.trend.status === 'DECLINING'),
      },
    });
    
  } catch (error) {
    console.error('[Location Comparison] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load location comparison',
    });
  }
};

/**
 * GET /api/google-business-profile/performance/health
 * Get location health score and details
 */
export const getLocationHealth = async (req, res) => {
  try {
    const { locationId } = req.query;
    const userId = req.user._id;
    
    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: 'locationId is required',
      });
    }
    
    const health = await calculateLocationHealth(userId, locationId);
    
    if (!health) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }
    
    res.json({
      success: true,
      health,
    });
    
  } catch (error) {
    console.error('[Location Health] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate health score',
    });
  }
};

/**
 * POST /api/google-business-profile/performance/sync
 * Trigger performance data sync
 */
export const syncPerformanceData = async (req, res) => {
  try {
    const { locationId, startDate, endDate } = req.body;
    const userId = req.user._id;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required',
      });
    }
    
    if (!locationId || locationId === 'all') {
      // Sync all locations
      console.log('[Performance Sync] Syncing all locations');
      const results = await syncAllLocations(userId, startDate, endDate);
      
      return res.json({
        success: true,
        message: 'All locations synced',
        results,
      });
    }
    
    // Sync single location
    console.log('[Performance Sync] Syncing location:', locationId);
    const result = await syncLocationPerformance(userId, locationId, startDate, endDate);
    
    res.json({
      success: result.success,
      message: result.success ? 'Performance data synced successfully' : 'Sync failed',
      snapshot: result.snapshot,
    });
    
  } catch (error) {
    console.error('[Performance Sync] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to sync performance data',
    });
  }
};

/**
 * GET /api/google-business-profile/performance/quick-stats
 * Get quick stats for top cards
 */
export const getQuickStats = async (req, res) => {
  try {
    const { locationId } = req.query;
    const userId = req.user._id;
    
    // Last 30 days
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    if (!locationId || locationId === 'all') {
      // All locations summary
      const snapshots = await getAllLocationSnapshots(userId, startDateStr, endDateStr);
      
      const totalMetrics = snapshots.reduce((acc, s) => {
        acc.impressions += s.metrics.totalImpressions || 0;
        acc.websiteClicks += s.metrics.websiteClicks || 0;
        acc.callClicks += s.metrics.callClicks || 0;
        acc.directions += s.metrics.directions || 0;
        return acc;
      }, { impressions: 0, websiteClicks: 0, callClicks: 0, directions: 0 });
      
      return res.json({
        success: true,
        mode: 'all_locations',
        stats: {
          totalLocations: snapshots.length,
          avgScore: snapshots.length > 0 
            ? Math.round(snapshots.reduce((sum, s) => sum + s.performanceScore.score, 0) / snapshots.length)
            : 0,
          ...totalMetrics,
        },
      });
    }
    
    // Single location
    const snapshot = await getPerformanceSnapshot(userId, locationId, startDateStr, endDateStr);
    
    if (!snapshot) {
      return res.status(404).json({
        success: false,
        message: 'No data available',
      });
    }
    
    res.json({
      success: true,
      mode: 'single_location',
      stats: {
        score: snapshot.performanceScore.score,
        trend: snapshot.trend,
        ...snapshot.metrics,
      },
    });
    
  } catch (error) {
    console.error('[Quick Stats] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load quick stats',
    });
  }
};

/**
 * GET /api/google-business-profile/performance/action-center
 * Get priority actions for "Improve My GBP" feature
 */
export const getActionCenter = async (req, res) => {
  try {
    const { locationId } = req.query;
    const userId = req.user._id;
    
    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: 'locationId is required',
      });
    }
    
    // Get location
    const location = await GbpLocation.findOne({ _id: locationId, userId }).lean();
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }
    
    // Get health score
    const health = await calculateLocationHealth(userId, locationId);
    
    // Get reviews
    const reviews = await GbpReview.find({ locationId }).lean();
    const unansweredReviews = reviews.filter(r => !r.reviewReply).length;
    
    // Get recent posts
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentPosts = await GbpPost.find({
      locationId,
      createdAt: { $gte: thirtyDaysAgo },
    }).lean();
    
    // Build priority actions
    const actions = [];
    
    // Priority 1: Unanswered reviews
    if (unansweredReviews > 0) {
      actions.push({
        id: 'respond_to_reviews',
        priority: 'high',
        category: 'reviews',
        title: 'Respond to Customer Reviews',
        description: `You have ${unansweredReviews} unanswered review${unansweredReviews > 1 ? 's' : ''}`,
        impact: 'Improves customer trust and engagement',
        action: {
          label: 'Review & Respond',
          link: `/google-business-profile/reviews?locationId=${locationId}`,
        },
        estimatedTime: `${unansweredReviews * 5} minutes`,
      });
    }
    
    // Priority 2: Low post activity
    if (recentPosts.length < 8) {
      actions.push({
        id: 'increase_post_frequency',
        priority: 'high',
        category: 'content',
        title: 'Increase Post Activity',
        description: `Only ${recentPosts.length} posts in the last 30 days`,
        impact: 'Regular content signals active business to Google',
        action: {
          label: 'Create Posts',
          link: `/google-business-profile/post-scheduler?locationId=${locationId}`,
        },
        estimatedTime: '15 minutes',
      });
    }
    
    // Priority 3: Profile issues from health
    if (health && health.issues) {
      for (const issue of health.issues.slice(0, 3)) { // Top 3 issues
        actions.push({
          id: `health_${issue.type}`,
          priority: issue.severity === 'high' ? 'high' : 'medium',
          category: 'profile',
          title: issue.message,
          description: issue.action,
          impact: 'Improves profile completeness and visibility',
          action: {
            label: 'Fix Now',
            link: `/google-business-profile/locations/${locationId}`,
          },
          estimatedTime: '10 minutes',
        });
      }
    }
    
    // Priority 4: Performance declining
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const snapshot = await getPerformanceSnapshot(
      userId,
      locationId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    
    if (snapshot && snapshot.trend.status === 'DECLINING') {
      actions.push({
        id: 'performance_declining',
        priority: 'medium',
        category: 'performance',
        title: 'Performance is Declining',
        description: snapshot.trend.message,
        impact: 'Reverse the decline and recover visibility',
        action: {
          label: 'View Insights',
          link: `/google-business-profile/performance?locationId=${locationId}`,
        },
        estimatedTime: '20 minutes',
      });
    }
    
    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    res.json({
      success: true,
      locationId,
      locationName: location.locationName,
      healthScore: health?.score || 0,
      actions,
      summary: {
        totalActions: actions.length,
        highPriority: actions.filter(a => a.priority === 'high').length,
        mediumPriority: actions.filter(a => a.priority === 'medium').length,
        lowPriority: actions.filter(a => a.priority === 'low').length,
      },
    });
    
  } catch (error) {
    console.error('[Action Center] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load action center',
    });
  }
};

/**
 * GET /api/google-business-profile/performance/integrated-stats
 * Get integrated stats for keywords, reviews, and posts
 */
export const getIntegratedStats = async (req, res) => {
  try {
    const { locationId } = req.query;
    const userId = req.user._id;
    
    if (!locationId) {
      return res.status(400).json({
        success: false,
        message: 'locationId is required',
      });
    }
    
    // Get current month for keywords
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Get search keywords
    const keywordData = await GbpSearchKeyword.findOne({
      locationId,
      month: currentMonth,
    }).lean();
    
    const topKeywords = keywordData?.keywords?.slice(0, 5) || [];
    
    // Get reviews
    const reviews = await GbpReview.find({ locationId }).lean();
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + (r.starRating || 0), 0) / totalReviews
      : 0;
    const unansweredReviews = reviews.filter(r => !r.reviewReply).length;
    const responseRate = totalReviews > 0
      ? Math.round(((totalReviews - unansweredReviews) / totalReviews) * 100)
      : 0;
    
    // Get recent reviews (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentReviews = reviews.filter(r => {
      const reviewDate = new Date(r.createTime || r.updateTime);
      return reviewDate > thirtyDaysAgo;
    });
    
    // Get posts
    const allPosts = await GbpPost.find({ locationId }).lean();
    const recentPosts = allPosts.filter(p => {
      const postDate = new Date(p.createdAt);
      return postDate > thirtyDaysAgo;
    });
    
    const publishedPosts = allPosts.filter(p => p.state === 'LIVE').length;
    const scheduledPosts = await GbpPost.countDocuments({
      locationId,
      status: 'scheduled',
    });
    
    res.json({
      success: true,
      keywords: {
        topQueries: topKeywords.map(k => ({
          keyword: k.searchKeyword,
          impressions: k.insightsValue?.value || 'UNKNOWN',
        })),
        month: currentMonth,
      },
      reviews: {
        total: totalReviews,
        average: isNaN(avgRating) ? 0 : parseFloat(avgRating.toFixed(1)),
        unanswered: unansweredReviews,
        responseRate,
        recent: recentReviews.length,
      },
      posts: {
        total: allPosts.length,
        published: publishedPosts,
        scheduled: scheduledPosts,
        recentActivity: recentPosts.length,
      },
    });
    
  } catch (error) {
    console.error('[Integrated Stats] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load integrated stats',
    });
  }
};

/**
 * GET /api/google-business-profile/performance/debug
 * Get raw Google API data for debugging
 * DEVELOPMENT/ADMIN ONLY
 */
export const getPerformanceDebug = async (req, res) => {
  try {
    // Only allow in development or for admin users
    if (process.env.NODE_ENV === 'production' && !req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Debug endpoint is only available in development or for admin users',
      });
    }
    
    const { locationId, startDate, endDate } = req.query;
    const userId = req.user._id;
    
    if (!locationId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'locationId, startDate, and endDate are required',
      });
    }
    
    console.log('[DEBUG] Fetching raw performance data');
    console.log('[DEBUG] Location:', locationId);
    console.log('[DEBUG] Date Range:', startDate, 'to', endDate);
    
    // Get location
    const location = await GbpLocation.findOne({ _id: locationId, userId }).lean();
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found',
      });
    }
    
    // Get stored metrics from database
    const storedMetrics = await getStoredMetrics(userId, locationId, startDate, endDate);
    
    // Aggregate daily metrics
    const aggregated = {};
    const dailyBreakdown = [];
    
    for (const dayData of storedMetrics) {
      const dateStr = new Date(dayData.date).toISOString().split('T')[0];
      const dayMetrics = {};
      
      for (const [key, value] of Object.entries(dayData.metrics || {})) {
        aggregated[key] = (aggregated[key] || 0) + (value || 0);
        dayMetrics[key] = value;
      }
      
      dailyBreakdown.push({
        date: dateStr,
        metrics: dayMetrics,
      });
    }
    
    // Calculate summaries
    const searchImpressions = 
      (aggregated.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0) +
      (aggregated.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0);
    
    const mapsImpressions = 
      (aggregated.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0) +
      (aggregated.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0);
    
    const totalBusinessImpressions = searchImpressions + mapsImpressions;
    
    const websiteClicks = aggregated.WEBSITE_CLICKS || 0;
    const callClicks = aggregated.CALL_CLICKS || 0;
    const directions = aggregated.BUSINESS_DIRECTION_REQUESTS || 0;
    const bookings = aggregated.BUSINESS_BOOKINGS || 0;
    
    const totalCustomerActions = websiteClicks + callClicks + directions + bookings;
    
    const actionRate = totalBusinessImpressions > 0
      ? ((totalCustomerActions / totalBusinessImpressions) * 100).toFixed(2)
      : null;
    
    res.json({
      success: true,
      debug: true,
      location: {
        name: location.locationName,
        googleLocationId: location.googleLocationId,
      },
      request: {
        startDate,
        endDate,
        daysRequested: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1,
      },
      dataAvailability: {
        daysWithData: storedMetrics.length,
        missingDays: Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1 - storedMetrics.length,
      },
      rawApiMetrics: {
        BUSINESS_IMPRESSIONS_DESKTOP_SEARCH: aggregated.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0,
        BUSINESS_IMPRESSIONS_MOBILE_SEARCH: aggregated.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0,
        BUSINESS_IMPRESSIONS_DESKTOP_MAPS: aggregated.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0,
        BUSINESS_IMPRESSIONS_MOBILE_MAPS: aggregated.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0,
        BUSINESS_CONVERSATIONS: aggregated.BUSINESS_CONVERSATIONS || 0,
        BUSINESS_DIRECTION_REQUESTS: aggregated.BUSINESS_DIRECTION_REQUESTS || 0,
        CALL_CLICKS: aggregated.CALL_CLICKS || 0,
        WEBSITE_CLICKS: aggregated.WEBSITE_CLICKS || 0,
        BUSINESS_BOOKINGS: aggregated.BUSINESS_BOOKINGS || 0,
        BUSINESS_FOOD_ORDERS: aggregated.BUSINESS_FOOD_ORDERS || 0,
        BUSINESS_FOOD_MENU_CLICKS: aggregated.BUSINESS_FOOD_MENU_CLICKS || 0,
      },
      calculatedMetrics: {
        totalBusinessImpressions: {
          value: totalBusinessImpressions,
          calculation: 'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH + BUSINESS_IMPRESSIONS_MOBILE_SEARCH + BUSINESS_IMPRESSIONS_DESKTOP_MAPS + BUSINESS_IMPRESSIONS_MOBILE_MAPS',
          note: 'This is what Google shows as "Business Impressions" - times your business appeared in Search and Maps. Multiple views by same user on same day count as 1.',
        },
        searchImpressions: {
          value: searchImpressions,
          calculation: 'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH + BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
        },
        mapsImpressions: {
          value: mapsImpressions,
          calculation: 'BUSINESS_IMPRESSIONS_DESKTOP_MAPS + BUSINESS_IMPRESSIONS_MOBILE_MAPS',
        },
        totalCustomerActions: {
          value: totalCustomerActions,
          calculation: 'WEBSITE_CLICKS + CALL_CLICKS + BUSINESS_DIRECTION_REQUESTS + BUSINESS_BOOKINGS',
          note: 'Total of all customer actions taken from your Business Profile',
        },
        actionRate: {
          value: actionRate !== null ? `${actionRate}%` : 'N/A',
          calculation: '(totalCustomerActions / totalBusinessImpressions) * 100',
          note: 'Percentage of impressions that led to a customer action',
        },
      },
      apiLimitations: {
        profileViewsNotAvailable: {
          googleUiShows: 'People viewed your Business Profile',
          apiProvides: 'NOT AVAILABLE',
          explanation: 'Google\'s UI shows "People viewed your Business Profile" but this exact metric is NOT exposed through the Business Profile Performance API. The API only provides BUSINESS_IMPRESSIONS which counts how many times your business appeared in search/maps results, not profile page views.',
        },
        searchesShowedProfileNotAvailable: {
          googleUiShows: 'Searches showed your Business Profile in search results',
          apiProvides: 'BUSINESS_IMPRESSIONS_*_SEARCH',
          explanation: 'The API provides BUSINESS_IMPRESSIONS which may differ from what Google shows in their UI',
        },
      },
      dailyBreakdown: dailyBreakdown.slice(0, 10), // Show first 10 days only
      totalDays: dailyBreakdown.length,
    });
    
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to load debug data',
    });
  }
};

export default {
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
};
