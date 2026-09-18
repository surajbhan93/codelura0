/**
 * GBP Performance Alerts Service
 * Detects significant metric changes and generates alerts
 */

import GbpPerformanceSnapshot from "../../models/gbp/GbpPerformanceSnapshot.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";

/**
 * Alert severity levels
 */
export const ALERT_SEVERITY = {
  CRITICAL: 'critical',  // 🔴 Needs immediate attention
  WARNING: 'warning',    // 🟠 Should be monitored
  INFO: 'info',          // 🔵 Informational
  POSITIVE: 'positive',  // 🟢 Good news
};

/**
 * Alert types
 */
export const ALERT_TYPES = {
  PERFORMANCE_DROP: 'performance_drop',
  PERFORMANCE_SPIKE: 'performance_spike',
  METRIC_DECLINE: 'metric_decline',
  METRIC_IMPROVEMENT: 'metric_improvement',
  LOW_VISIBILITY: 'low_visibility',
  HIGH_ENGAGEMENT: 'high_engagement',
  REVIEW_ISSUE: 'review_issue',
  CONTENT_GAP: 'content_gap',
  HEALTH_ISSUE: 'health_issue',
};

/**
 * Default alert thresholds (customizable per user)
 */
export const DEFAULT_THRESHOLDS = {
  criticalDrop: 20,      // -20% or more is critical
  warningDrop: 10,       // -10% to -19% is warning
  significantImprovement: 15, // +15% or more is noteworthy
  minImpressions: 50,    // Below 50 impressions/week is concerning
  minEngagement: 5,      // Below 5% engagement is low
  maxUnansweredReviews: 5, // More than 5 unanswered reviews
  minPostFrequency: 4,   // Less than 4 posts/month
};

/**
 * Generate alerts from performance comparison
 */
export const generateAlertsFromComparison = (comparison, options = {}) => {
  const thresholds = { ...DEFAULT_THRESHOLDS, ...options.thresholds };
  const alerts = [];
  
  if (!comparison || !comparison.metricChanges) {
    return alerts;
  }
  
  const { metricChanges, trend, current, previous } = comparison;
  
  // Overall performance trend alert
  if (trend.status === 'DECLINING' && Math.abs(trend.scoreChange) >= thresholds.criticalDrop) {
    alerts.push({
      id: `alert_${Date.now()}_performance_drop`,
      type: ALERT_TYPES.PERFORMANCE_DROP,
      severity: ALERT_SEVERITY.CRITICAL,
      title: 'Critical Performance Decline',
      message: `Your performance score dropped by ${Math.abs(trend.scoreChange)} points`,
      details: trend.message,
      metric: 'performanceScore',
      change: trend.scoreChange,
      recommendation: 'Review declining metrics and take immediate corrective action',
      timestamp: new Date(),
    });
  } else if (trend.status === 'DECLINING' && Math.abs(trend.scoreChange) >= thresholds.warningDrop) {
    alerts.push({
      id: `alert_${Date.now()}_performance_warning`,
      type: ALERT_TYPES.PERFORMANCE_DROP,
      severity: ALERT_SEVERITY.WARNING,
      title: 'Performance Declining',
      message: `Your performance score decreased by ${Math.abs(trend.scoreChange)} points`,
      details: trend.message,
      metric: 'performanceScore',
      change: trend.scoreChange,
      recommendation: 'Monitor closely and implement improvements',
      timestamp: new Date(),
    });
  } else if (trend.status === 'IMPROVING' && trend.scoreChange >= thresholds.significantImprovement) {
    alerts.push({
      id: `alert_${Date.now()}_performance_improvement`,
      type: ALERT_TYPES.PERFORMANCE_SPIKE,
      severity: ALERT_SEVERITY.POSITIVE,
      title: 'Performance Improving',
      message: `Your performance score increased by ${trend.scoreChange} points`,
      details: trend.message,
      metric: 'performanceScore',
      change: trend.scoreChange,
      recommendation: 'Great work! Continue current strategies',
      timestamp: new Date(),
    });
  }
  
  // Metric-specific alerts
  for (const [metric, change] of Object.entries(metricChanges)) {
    const percentChange = change.percentChange;
    const metricName = formatMetricName(metric);
    
    // Critical decline
    if (percentChange <= -thresholds.criticalDrop) {
      alerts.push({
        id: `alert_${Date.now()}_${metric}_critical`,
        type: ALERT_TYPES.METRIC_DECLINE,
        severity: ALERT_SEVERITY.CRITICAL,
        title: `${metricName} Dropped Significantly`,
        message: `${metricName} decreased by ${Math.abs(percentChange).toFixed(1)}%`,
        details: `From ${change.previous} to ${change.current}`,
        metric,
        change: change.change,
        percentChange,
        recommendation: getMetricRecommendation(metric, 'decline'),
        timestamp: new Date(),
      });
    }
    // Warning decline
    else if (percentChange <= -thresholds.warningDrop) {
      alerts.push({
        id: `alert_${Date.now()}_${metric}_warning`,
        type: ALERT_TYPES.METRIC_DECLINE,
        severity: ALERT_SEVERITY.WARNING,
        title: `${metricName} Declining`,
        message: `${metricName} decreased by ${Math.abs(percentChange).toFixed(1)}%`,
        details: `From ${change.previous} to ${change.current}`,
        metric,
        change: change.change,
        percentChange,
        recommendation: getMetricRecommendation(metric, 'decline'),
        timestamp: new Date(),
      });
    }
    // Significant improvement
    else if (percentChange >= thresholds.significantImprovement) {
      alerts.push({
        id: `alert_${Date.now()}_${metric}_improvement`,
        type: ALERT_TYPES.METRIC_IMPROVEMENT,
        severity: ALERT_SEVERITY.POSITIVE,
        title: `${metricName} Increased`,
        message: `${metricName} improved by ${percentChange.toFixed(1)}%`,
        details: `From ${change.previous} to ${change.current}`,
        metric,
        change: change.change,
        percentChange,
        recommendation: getMetricRecommendation(metric, 'improvement'),
        timestamp: new Date(),
      });
    }
  }
  
  // Low visibility alert
  if (current && current.rawMetrics && current.rawMetrics.totalImpressions < thresholds.minImpressions) {
    alerts.push({
      id: `alert_${Date.now()}_low_visibility`,
      type: ALERT_TYPES.LOW_VISIBILITY,
      severity: ALERT_SEVERITY.WARNING,
      title: 'Low Search Visibility',
      message: `Only ${current.rawMetrics.totalImpressions} total impressions`,
      details: 'Your profile is not appearing frequently in searches',
      metric: 'totalImpressions',
      recommendation: 'Optimize profile, add posts, collect reviews, and update business information',
      timestamp: new Date(),
    });
  }
  
  // Low engagement alert
  const engagementRate = current && current.rawMetrics ? parseFloat(current.rawMetrics.engagementRate) : 0;
  if (engagementRate > 0 && engagementRate < thresholds.minEngagement) {
    alerts.push({
      id: `alert_${Date.now()}_low_engagement`,
      type: ALERT_TYPES.LOW_VISIBILITY,
      severity: ALERT_SEVERITY.WARNING,
      title: 'Low Engagement Rate',
      message: `Engagement rate is ${engagementRate.toFixed(1)}%`,
      details: 'Few visitors are taking actions on your profile',
      metric: 'engagementRate',
      recommendation: 'Improve your call-to-actions, add compelling photos, and highlight key services',
      timestamp: new Date(),
    });
  }
  
  // Sort by severity
  const severityOrder = [
    ALERT_SEVERITY.CRITICAL,
    ALERT_SEVERITY.WARNING,
    ALERT_SEVERITY.POSITIVE,
    ALERT_SEVERITY.INFO,
  ];
  
  alerts.sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity));
  
  return alerts;
};

/**
 * Generate alerts from health data
 */
export const generateHealthAlerts = (health, reviews, posts, options = {}) => {
  const thresholds = { ...DEFAULT_THRESHOLDS, ...options.thresholds };
  const alerts = [];
  
  // Review alerts
  if (reviews && reviews.unanswered > thresholds.maxUnansweredReviews) {
    alerts.push({
      id: `alert_${Date.now()}_unanswered_reviews`,
      type: ALERT_TYPES.REVIEW_ISSUE,
      severity: ALERT_SEVERITY.CRITICAL,
      title: 'Multiple Unanswered Reviews',
      message: `${reviews.unanswered} reviews need responses`,
      details: 'Unanswered reviews hurt your reputation and customer trust',
      recommendation: 'Respond to all reviews within 24-48 hours',
      action: {
        label: 'Review & Respond',
        link: '/google-business-profile/reviews',
      },
      timestamp: new Date(),
    });
  }
  
  if (reviews && reviews.responseRate < 70) {
    alerts.push({
      id: `alert_${Date.now()}_low_response_rate`,
      type: ALERT_TYPES.REVIEW_ISSUE,
      severity: ALERT_SEVERITY.WARNING,
      title: 'Low Review Response Rate',
      message: `Response rate is ${reviews.responseRate}%`,
      details: 'Target response rate is 90% or higher',
      recommendation: 'Set up review notifications and respond promptly',
      timestamp: new Date(),
    });
  }
  
  // Post activity alerts
  if (posts && posts.total < thresholds.minPostFrequency) {
    alerts.push({
      id: `alert_${Date.now()}_low_post_activity`,
      type: ALERT_TYPES.CONTENT_GAP,
      severity: ALERT_SEVERITY.WARNING,
      title: 'Low Post Activity',
      message: `Only ${posts.total} posts in the last 30 days`,
      details: 'Regular posting signals an active business to Google',
      recommendation: 'Post 2-3 times per week for optimal engagement',
      action: {
        label: 'Create Post',
        link: '/google-business-profile/post-scheduler',
      },
      timestamp: new Date(),
    });
  }
  
  // Health issues
  if (health && health.issues) {
    for (const issue of health.issues) {
      if (issue.severity === 'high') {
        alerts.push({
          id: `alert_${Date.now()}_health_${issue.type}`,
          type: ALERT_TYPES.HEALTH_ISSUE,
          severity: ALERT_SEVERITY.WARNING,
          title: issue.message,
          message: issue.action,
          details: issue.message,
          recommendation: issue.action,
          timestamp: new Date(),
        });
      }
    }
  }
  
  return alerts;
};

/**
 * Get all alerts for a location
 */
export const getLocationAlerts = async (userId, locationId, startDate, endDate, options = {}) => {
  const snapshot = await GbpPerformanceSnapshot.findOne({
    userId,
    locationId,
    startDate: new Date(startDate),
  }).lean();
  
  if (!snapshot) {
    return [];
  }
  
  const alerts = [];
  
  // Performance alerts
  if (snapshot.comparison) {
    const performanceAlerts = generateAlertsFromComparison(
      {
        ...snapshot.comparison,
        current: snapshot.performanceScore,
        previous: { score: snapshot.comparison.previousScore, rawMetrics: {} },
        trend: snapshot.trend,
      },
      options
    );
    alerts.push(...performanceAlerts);
  }
  
  // Health alerts
  const healthAlerts = generateHealthAlerts(
    snapshot.health,
    snapshot.reviews,
    snapshot.posts,
    options
  );
  alerts.push(...healthAlerts);
  
  // Get location name
  const location = await GbpLocation.findById(locationId).select('locationName').lean();
  
  // Add location context to all alerts
  return alerts.map(alert => ({
    ...alert,
    locationId,
    locationName: location?.locationName,
  }));
};

/**
 * Get alerts for all locations
 */
export const getAllLocationAlerts = async (userId, startDate, endDate, options = {}) => {
  const locations = await GbpLocation.find({ userId, status: 'active' }).lean();
  
  const allAlerts = [];
  
  for (const location of locations) {
    try {
      const locationAlerts = await getLocationAlerts(userId, location._id, startDate, endDate, options);
      allAlerts.push(...locationAlerts);
    } catch (error) {
      console.error(`[Alerts] Error for location ${location.locationName}:`, error.message);
    }
  }
  
  // Sort by severity and timestamp
  const severityOrder = [
    ALERT_SEVERITY.CRITICAL,
    ALERT_SEVERITY.WARNING,
    ALERT_SEVERITY.POSITIVE,
    ALERT_SEVERITY.INFO,
  ];
  
  allAlerts.sort((a, b) => {
    const severityDiff = severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
    if (severityDiff !== 0) return severityDiff;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
  
  return allAlerts;
};

/**
 * Helper: Format metric name for display
 */
function formatMetricName(metric) {
  const names = {
    totalImpressions: 'Total Impressions',
    searchImpressions: 'Search Impressions',
    mapsImpressions: 'Maps Impressions',
    profileViews: 'Profile Views',
    websiteClicks: 'Website Clicks',
    callClicks: 'Phone Calls',
    directions: 'Direction Requests',
    bookings: 'Bookings',
    engagementRate: 'Engagement Rate',
  };
  return names[metric] || metric;
}

/**
 * Helper: Get recommendation for metric change
 */
function getMetricRecommendation(metric, changeType) {
  const recommendations = {
    totalImpressions: {
      decline: 'Optimize your business profile, add more posts, and collect reviews to improve visibility',
      improvement: 'Great! Continue your current SEO and content strategies',
    },
    websiteClicks: {
      decline: 'Review your website URL, add compelling CTAs in your profile and posts',
      improvement: 'Excellent! Your website CTA is working well',
    },
    callClicks: {
      decline: 'Ensure your phone number is prominent and easy to find',
      improvement: 'Great! Customers are finding it easy to contact you',
    },
    directions: {
      decline: 'Verify your address is accurate and add directions instructions',
      improvement: 'Good! Your location information is clear and helpful',
    },
    profileViews: {
      decline: 'Increase your search visibility through regular posts and reviews',
      improvement: 'Excellent! More people are discovering your profile',
    },
    engagementRate: {
      decline: 'Add clear CTAs, high-quality photos, and compelling business description',
      improvement: 'Excellent! Your profile is converting visitors to customers',
    },
  };
  
  return recommendations[metric]?.[changeType] || 'Monitor this metric and adjust your strategy accordingly';
}

export default {
  generateAlertsFromComparison,
  generateHealthAlerts,
  getLocationAlerts,
  getAllLocationAlerts,
  ALERT_SEVERITY,
  ALERT_TYPES,
  DEFAULT_THRESHOLDS,
};
