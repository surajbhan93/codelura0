/**
 * Codelura Performance Analyzer
 * Calculates performance scores, trends, and comparisons from real Google API data
 * 
 * IMPORTANT: This service never claims Google guarantees ranking improvement.
 * All scores and trends are Codelura's analysis of the available metrics.
 */

import GbpPerformanceMetric from "../../models/gbp/GbpPerformanceMetric.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpReview from "../../models/gbp/GbpReview.js";
import GbpPost from "../../models/gbp/GbpPost.js";

/**
 * Calculate Codelura Performance Score (0-100)
 * Transparent weighted calculation based on available metrics
 */
export const calculatePerformanceScore = (metrics, previousMetrics = null) => {
  // Calculate totals from real Google API data
  const searchImpressions = 
    (metrics.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0) +
    (metrics.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0);
  
  const mapsImpressions = 
    (metrics.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0) +
    (metrics.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0);
  
  const totalImpressions = searchImpressions + mapsImpressions;
  
  const websiteClicks = metrics.WEBSITE_CLICKS || 0;
  const callClicks = metrics.CALL_CLICKS || 0;
  const directions = metrics.BUSINESS_DIRECTION_REQUESTS || 0;
  const bookings = metrics.BUSINESS_BOOKINGS || 0;
  
  // Calculate total interactions (like Google's "Business Profile interactions")
  const totalInteractions = websiteClicks + callClicks + directions + bookings;
  
  // Calculate action rate (percentage of impressions that led to customer action)
  // IMPORTANT: Handle division by zero
  const actionRate = totalImpressions > 0 
    ? ((totalInteractions / totalImpressions) * 100).toFixed(2)
    : null; // Use null instead of 0 to indicate N/A
  
  // Weighted scoring (transparent calculation)
  const weights = {
    impressions: 0.30,    // 30% - Visibility (how many people see you)
    website: 0.25,        // 25% - Website actions
    calls: 0.20,          // 20% - Call actions  
    directions: 0.15,     // 15% - Direction requests
    actionRate: 0.10,     // 10% - Action rate (conversion efficiency)
  };
  
  // Normalize to 0-100 scale (using reasonable benchmarks)
  const normalizeImpression = (val) => Math.min((val / 1000) * 100, 100);
  const normalizeActions = (val) => Math.min((val / 100) * 100, 100);
  const normalizeRate = (val) => Math.min(val * 10, 100); // 10% action rate = 100 score
  
  const scores = {
    impressions: normalizeImpression(totalImpressions) * weights.impressions,
    website: normalizeActions(websiteClicks) * weights.website,
    calls: normalizeActions(callClicks) * weights.calls,
    directions: normalizeActions(directions) * weights.directions,
    actionRate: normalizeRate(actionRate) * weights.actionRate,
  };
  
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  
  // Calculate breakdown for transparency
  const breakdown = {
    visibility: Math.round(scores.impressions / weights.impressions * 100),
    engagement: Math.round((scores.website + scores.calls + scores.directions) / (weights.website + weights.calls + weights.directions) * 100),
    conversionRate: Math.round(scores.actionRate / weights.actionRate * 100),
  };
  
  return {
    score: Math.round(totalScore),
    breakdown,
    rawMetrics: {
      totalImpressions,
      searchImpressions,
      mapsImpressions,
      totalInteractions,
      websiteClicks,
      callClicks,
      directions,
      bookings,
      actionRate: actionRate, // Can be null if no impressions
    },
  };
};

/**
 * Aggregate metrics over a period
 */
export const aggregateMetrics = (metricsArray) => {
  if (!metricsArray || metricsArray.length === 0) {
    return null;
  }
  
  const aggregated = {};
  
  // Sum all numeric metrics
  for (const dayMetric of metricsArray) {
    for (const [key, value] of Object.entries(dayMetric.metrics || {})) {
      aggregated[key] = (aggregated[key] || 0) + (value || 0);
    }
  }
  
  return aggregated;
};

/**
 * Calculate percentage change safely
 */
export const calculateChange = (current, previous) => {
  if (!previous || previous === 0) {
    return current > 0 ? 100 : 0; // Show 100% increase if previous was 0
  }
  
  return ((current - previous) / previous) * 100;
};

/**
 * Detect trend direction: IMPROVING, STABLE, DECLINING, INSUFFICIENT_DATA
 */
export const detectTrend = (currentScore, previousScore, metricChanges) => {
  // Need at least 2 periods to detect trend
  if (!previousScore || !metricChanges) {
    return {
      status: 'INSUFFICIENT_DATA',
      direction: '→',
      message: 'Not enough historical data to determine trend',
      confidence: 0,
    };
  }
  
  const scoreChange = currentScore.score - previousScore.score;
  
  // Count improving vs declining metrics
  let improvingCount = 0;
  let decliningCount = 0;
  let significantChanges = 0;
  
  const significanceThreshold = 5; // 5% change is significant
  
  for (const [metric, change] of Object.entries(metricChanges)) {
    if (Math.abs(change.percentChange) >= significanceThreshold) {
      significantChanges++;
      if (change.percentChange > 0) improvingCount++;
      if (change.percentChange < 0) decliningCount++;
    }
  }
  
  // Determine overall trend
  let status;
  let direction;
  let message;
  let confidence;
  
  if (scoreChange > 5) {
    status = 'IMPROVING';
    direction = '↑';
    message = `Your GBP performance is improving (+${Math.round(scoreChange)} points)`;
    confidence = Math.min(improvingCount / significantChanges * 100, 100);
  } else if (scoreChange < -5) {
    status = 'DECLINING';
    direction = '↓';
    message = `Your GBP performance is declining (${Math.round(scoreChange)} points)`;
    confidence = Math.min(decliningCount / significantChanges * 100, 100);
  } else {
    status = 'STABLE';
    direction = '→';
    message = 'Your GBP performance is stable';
    confidence = 100 - Math.abs(scoreChange) * 10;
  }
  
  // Add reason
  const reasons = [];
  if (improvingCount > 0) reasons.push(`${improvingCount} metrics improved`);
  if (decliningCount > 0) reasons.push(`${decliningCount} metrics declined`);
  
  if (reasons.length > 0) {
    message += ` because ${reasons.join(' and ')}`;
  }
  
  return {
    status,
    direction,
    message,
    confidence: Math.round(confidence),
    scoreChange: Math.round(scoreChange),
    improvingMetrics: improvingCount,
    decliningMetrics: decliningCount,
  };
};

/**
 * Compare two periods and calculate metric changes
 */
export const comparePerformances = (currentMetrics, previousMetrics) => {
  if (!currentMetrics || !previousMetrics) {
    return null;
  }
  
  const current = calculatePerformanceScore(currentMetrics);
  const previous = calculatePerformanceScore(previousMetrics);
  
  const metricChanges = {};
  
  for (const [key, value] of Object.entries(current.rawMetrics)) {
    const prevValue = previous.rawMetrics[key];
    const change = calculateChange(value, prevValue);
    
    metricChanges[key] = {
      current: value,
      previous: prevValue,
      change: value - prevValue,
      percentChange: change,
      trending: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
    };
  }
  
  return {
    current,
    previous,
    metricChanges,
    trend: detectTrend(current, previous, metricChanges),
  };
};

/**
 * Get performance data for a location and period
 */
export const getLocationPerformance = async (userId, locationId, startDate, endDate) => {
  const metrics = await GbpPerformanceMetric.find({
    userId,
    locationId,
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  }).sort({ date: 1 }).lean();
  
  if (metrics.length === 0) {
    return null;
  }
  
  const aggregated = aggregateMetrics(metrics);
  const score = calculatePerformanceScore(aggregated);
  
  return {
    metrics,
    aggregated,
    score,
    period: {
      start: startDate,
      end: endDate,
      days: metrics.length,
    },
  };
};

/**
 * Calculate previous period dates
 */
export const calculatePreviousPeriod = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const durationMs = end - start;
  
  const prevEnd = new Date(start.getTime() - 24 * 60 * 60 * 1000); // Day before start
  const prevStart = new Date(prevEnd.getTime() - durationMs);
  
  return {
    startDate: prevStart.toISOString().split('T')[0],
    endDate: prevEnd.toISOString().split('T')[0],
  };
};

/**
 * Get comprehensive performance analysis
 */
export const analyzePerformance = async (userId, locationId, startDate, endDate) => {
  // Get current period performance
  const current = await getLocationPerformance(userId, locationId, startDate, endDate);
  
  if (!current) {
    return {
      hasData: false,
      message: 'No performance data available for this period',
    };
  }
  
  // Get previous period for comparison
  const { startDate: prevStart, endDate: prevEnd } = calculatePreviousPeriod(startDate, endDate);
  const previous = await getLocationPerformance(userId, locationId, prevStart, prevEnd);
  
  // Calculate comparison if previous data exists
  let comparison = null;
  if (previous) {
    comparison = comparePerformances(current.aggregated, previous.aggregated);
  }
  
  // Get location details
  const location = await GbpLocation.findOne({ _id: locationId, userId }).lean();
  
  // Get review stats
  const reviews = await GbpReview.find({ locationId }).lean();
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? reviews.reduce((sum, r) => sum + (r.starRating || 0), 0) / totalReviews 
    : 0;
  const unansweredReviews = reviews.filter(r => !r.reviewReply).length;
  
  // Get post activity
  const posts = await GbpPost.find({
    locationId,
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
  }).lean();
  
  return {
    hasData: true,
    location: {
      id: location._id,
      name: location.locationName,
      address: location.storefrontAddress,
    },
    period: current.period,
    score: current.score,
    comparison,
    reviews: {
      total: totalReviews,
      average: isNaN(avgRating) ? 0 : parseFloat(avgRating.toFixed(1)), // Fix NaN issue
      unanswered: unansweredReviews,
      responseRate: totalReviews > 0 
        ? Math.round(((totalReviews - unansweredReviews) / totalReviews) * 100) 
        : 0,
    },
    posts: {
      total: posts.length,
      published: posts.filter(p => p.status === 'published').length,
      scheduled: posts.filter(p => p.status === 'scheduled').length,
    },
  };
};

/**
 * Calculate location health score
 */
export const calculateLocationHealth = async (userId, locationId) => {
  const location = await GbpLocation.findOne({ _id: locationId, userId }).lean();
  if (!location) return null;
  
  let healthScore = 0;
  const issues = [];
  const strengths = [];
  
  // Profile completeness (30 points)
  const profileFields = [
    'locationName',
    'primaryCategory',
    'phoneNumbers',
    'websiteUri',
    'regularHours',
    'profile.description',
  ];
  
  const completedFields = profileFields.filter(field => {
    const keys = field.split('.');
    let value = location;
    for (const key of keys) {
      value = value?.[key];
    }
    return value && (typeof value !== 'object' || Object.keys(value).length > 0);
  }).length;
  
  const completenessScore = (completedFields / profileFields.length) * 30;
  healthScore += completenessScore;
  
  if (completenessScore < 20) {
    issues.push({
      type: 'profile_incomplete',
      severity: 'high',
      message: 'Profile information is incomplete',
      action: 'Complete your business profile',
    });
  } else {
    strengths.push('Profile information is complete');
  }
  
  // Review activity (30 points)
  const reviews = await GbpReview.find({ locationId }).lean();
  const recentReviews = reviews.filter(r => {
    const reviewDate = new Date(r.createTime || r.updateTime);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return reviewDate > thirtyDaysAgo;
  });
  
  const unanswered = reviews.filter(r => !r.reviewReply).length;
  const responseRate = reviews.length > 0 ? ((reviews.length - unanswered) / reviews.length) * 100 : 0;
  
  let reviewScore = 0;
  if (reviews.length > 10) reviewScore += 10;
  if (responseRate > 80) reviewScore += 20;
  else if (responseRate > 50) reviewScore += 10;
  
  healthScore += reviewScore;
  
  if (unanswered > 5) {
    issues.push({
      type: 'unanswered_reviews',
      severity: 'high',
      message: `${unanswered} unanswered reviews`,
      action: 'Respond to customer reviews',
    });
  } else if (responseRate > 90) {
    strengths.push('Excellent review response rate');
  }
  
  // Content activity (20 points)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentPosts = await GbpPost.find({
    locationId,
    createdAt: { $gte: thirtyDaysAgo },
  }).lean();
  
  let contentScore = 0;
  if (recentPosts.length >= 8) contentScore = 20; // ~2 per week
  else if (recentPosts.length >= 4) contentScore = 15;
  else if (recentPosts.length >= 2) contentScore = 10;
  else if (recentPosts.length >= 1) contentScore = 5;
  
  healthScore += contentScore;
  
  if (recentPosts.length < 4) {
    issues.push({
      type: 'low_content_activity',
      severity: 'medium',
      message: 'Low post activity in the last 30 days',
      action: 'Create regular Google Posts',
    });
  } else {
    strengths.push('Active post creation');
  }
  
  // Performance metrics (20 points)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentMetrics = await GbpPerformanceMetric.find({
    locationId,
    date: { $gte: sevenDaysAgo },
  }).lean();
  
  if (recentMetrics.length > 0) {
    const aggregated = aggregateMetrics(recentMetrics);
    const totalImpressions = 
      (aggregated.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0) +
      (aggregated.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0) +
      (aggregated.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0) +
      (aggregated.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0);
    
    if (totalImpressions > 500) healthScore += 20;
    else if (totalImpressions > 100) healthScore += 15;
    else if (totalImpressions > 50) healthScore += 10;
    else healthScore += 5;
    
    if (totalImpressions < 100) {
      issues.push({
        type: 'low_visibility',
        severity: 'medium',
        message: 'Low search visibility',
        action: 'Optimize profile and create more content',
      });
    } else {
      strengths.push('Good search visibility');
    }
  }
  
  return {
    score: Math.round(healthScore),
    issues,
    strengths,
    details: {
      profileCompleteness: Math.round(completenessScore),
      reviewActivity: Math.round(reviewScore),
      contentActivity: Math.round(contentScore),
      visibility: Math.round(healthScore - completenessScore - reviewScore - contentScore),
    },
  };
};

export default {
  calculatePerformanceScore,
  aggregateMetrics,
  calculateChange,
  detectTrend,
  comparePerformances,
  getLocationPerformance,
  calculatePreviousPeriod,
  analyzePerformance,
  calculateLocationHealth,
};
