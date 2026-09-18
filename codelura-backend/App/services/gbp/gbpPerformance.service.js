import axios from "axios";
import { getValidAccessToken } from "./gbpOAuth.service.js";
import GbpPerformanceMetric from "../../models/gbp/GbpPerformanceMetric.js";
import GbpSearchKeyword from "../../models/gbp/GbpSearchKeyword.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import cacheService from "../cache.service.js";

const PERF_URL = "https://businessprofileperformance.googleapis.com/v1";

const DAILY_METRICS = [
  "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
  "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
  "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
  "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
  "BUSINESS_CONVERSATIONS",
  "BUSINESS_DIRECTION_REQUESTS",
  "CALL_CLICKS",
  "WEBSITE_CLICKS",
  "BUSINESS_BOOKINGS",
  "BUSINESS_FOOD_ORDERS",
  "BUSINESS_FOOD_MENU_CLICKS",
];

export const fetchPerformanceMetrics = async (userId, locationDbId, startDate, endDate) => {
  const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!loc) throw { code: 404, message: "Location not found" };

  const accessToken = await getValidAccessToken(userId);

  const results = {};
  const errors = [];

  console.log(`[Codelura Performance] Fetching metrics for location: ${loc.googleLocationId}`);
  console.log(`[Codelura Performance] Date range: ${startDate} to ${endDate}`);

  for (const metric of DAILY_METRICS) {
    try {
      const res = await axios.get(
        `${PERF_URL}/locations/${loc.googleLocationId}:getDailyMetricsTimeSeries`,
        {
          params: {
            dailyMetric: metric,
            "dailyRange.startDate.year": new Date(startDate).getFullYear(),
            "dailyRange.startDate.month": new Date(startDate).getMonth() + 1,
            "dailyRange.startDate.day": new Date(startDate).getDate(),
            "dailyRange.endDate.year": new Date(endDate).getFullYear(),
            "dailyRange.endDate.month": new Date(endDate).getMonth() + 1,
            "dailyRange.endDate.day": new Date(endDate).getDate(),
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const values = res.data.timeSeries?.datedValues || [];
      results[metric] = values;
      
      // Log successful metric fetch with detailed breakdown
      const total = values.reduce((sum, v) => sum + parseInt(v.value || "0", 10), 0);
      if (total > 0) {
        console.log(`[Codelura Performance] ✓ ${metric}: ${total} (${values.length} days)`);
        
        // DEBUG: Log first few daily values in development
        if (process.env.NODE_ENV === 'development' && values.length > 0) {
          console.log(`[DEBUG] ${metric} daily breakdown (first 3 days):`, 
            values.slice(0, 3).map(v => `${v.date.year}-${v.date.month}-${v.date.day}: ${v.value}`).join(', ')
          );
        }
      } else {
        console.log(`[Codelura Performance] ○ ${metric}: 0 (${values.length} days)`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      errors.push({ metric, message: errorMsg });
      results[metric] = [];
      console.log(`[Codelura Performance] ✗ ${metric}: ${errorMsg}`);
    }
  }

  // Merge into daily rows and save
  const dailyMap = {};
  for (const [metric, values] of Object.entries(results)) {
    for (const { date, value } of values) {
      const key = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
      if (!dailyMap[key]) dailyMap[key] = {};
      dailyMap[key][metric] = parseInt(value || "0", 10);
    }
  }

  // Calculate totals for detailed logging
  let totalSearchImpressions = 0;
  let totalMapsImpressions = 0;
  let totalWebsiteClicks = 0;
  let totalCallClicks = 0;
  let totalDirections = 0;
  let totalBookings = 0;
  
  for (const [dateStr, metrics] of Object.entries(dailyMap)) {
    totalSearchImpressions += (metrics.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0) + (metrics.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0);
    totalMapsImpressions += (metrics.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0) + (metrics.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0);
    totalWebsiteClicks += (metrics.WEBSITE_CLICKS || 0);
    totalCallClicks += (metrics.CALL_CLICKS || 0);
    totalDirections += (metrics.BUSINESS_DIRECTION_REQUESTS || 0);
    totalBookings += (metrics.BUSINESS_BOOKINGS || 0);
    
    await GbpPerformanceMetric.findOneAndUpdate(
      { locationId: locationDbId, date: new Date(dateStr) },
      { userId, locationId: locationDbId, googleLocationId: loc.googleLocationId, date: new Date(dateStr), metrics },
      { upsert: true }
    );
  }

  const totalBusinessImpressions = totalSearchImpressions + totalMapsImpressions;
  const totalCustomerActions = totalWebsiteClicks + totalCallClicks + totalDirections + totalBookings;

  console.log(`[Codelura Performance] === SUMMARY ===`);
  console.log(`[Codelura Performance] Date Range: ${startDate} to ${endDate}`);
  console.log(`[Codelura Performance] Days of Data: ${Object.keys(dailyMap).length}`);
  console.log(`[Codelura Performance] ────────────────────────────────`);
  console.log(`[Codelura Performance] BUSINESS IMPRESSIONS (Search + Maps): ${totalBusinessImpressions}`);
  console.log(`[Codelura Performance]   ├─ Search Impressions: ${totalSearchImpressions}`);
  console.log(`[Codelura Performance]   │   ├─ Desktop: ${Object.values(dailyMap).reduce((sum, m) => sum + (m.BUSINESS_IMPRESSIONS_DESKTOP_SEARCH || 0), 0)}`);
  console.log(`[Codelura Performance]   │   └─ Mobile: ${Object.values(dailyMap).reduce((sum, m) => sum + (m.BUSINESS_IMPRESSIONS_MOBILE_SEARCH || 0), 0)}`);
  console.log(`[Codelura Performance]   └─ Maps Impressions: ${totalMapsImpressions}`);
  console.log(`[Codelura Performance]       ├─ Desktop: ${Object.values(dailyMap).reduce((sum, m) => sum + (m.BUSINESS_IMPRESSIONS_DESKTOP_MAPS || 0), 0)}`);
  console.log(`[Codelura Performance]       └─ Mobile: ${Object.values(dailyMap).reduce((sum, m) => sum + (m.BUSINESS_IMPRESSIONS_MOBILE_MAPS || 0), 0)}`);
  console.log(`[Codelura Performance] ────────────────────────────────`);
  console.log(`[Codelura Performance] CUSTOMER ACTIONS (Total): ${totalCustomerActions}`);
  console.log(`[Codelura Performance]   ├─ Website Clicks: ${totalWebsiteClicks}`);
  console.log(`[Codelura Performance]   ├─ Phone Calls: ${totalCallClicks}`);
  console.log(`[Codelura Performance]   ├─ Direction Requests: ${totalDirections}`);
  console.log(`[Codelura Performance]   └─ Bookings: ${totalBookings}`);
  console.log(`[Codelura Performance] ────────────────────────────────`);
  console.log(`[Codelura Performance] ACTION RATE: ${totalBusinessImpressions > 0 ? ((totalCustomerActions / totalBusinessImpressions) * 100).toFixed(2) : 0}%`);
  console.log(`[Codelura Performance] ════════════════════════════════`);
  
  // Return structured data including errors
  return { 
    dailyMap, 
    errors,
    summary: {
      dateRange: { startDate, endDate },
      daysOfData: Object.keys(dailyMap).length,
      totalBusinessImpressions,
      searchImpressions: totalSearchImpressions,
      mapsImpressions: totalMapsImpressions,
      totalCustomerActions,
      websiteClicks: totalWebsiteClicks,
      callClicks: totalCallClicks,
      directions: totalDirections,
      bookings: totalBookings,
      actionRate: totalBusinessImpressions > 0 ? ((totalCustomerActions / totalBusinessImpressions) * 100).toFixed(2) : '0.00',
    }
  };
};

export const getStoredMetrics = async (userId, locationDbId, startDate, endDate) => {
  // Check cache first (30 minute TTL for performance metrics)
  const cacheKey = cacheService.generateKey(userId, 'performance', `${locationDbId}:${startDate}:${endDate}`);
  const cached = cacheService.get(cacheKey);
  
  if (cached) {
    console.log(`[Cache HIT] Performance metrics for location ${locationDbId}`);
    return cached;
  }

  // Use lean() for faster query - returns plain JS objects instead of Mongoose documents
  const metrics = await GbpPerformanceMetric.find({
    userId,
    locationId: locationDbId,
    date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  })
  .select('date metrics') // Only select needed fields
  .sort({ date: 1 })
  .lean(); // Convert to plain objects for better performance
  
  // Cache for 30 minutes
  cacheService.set(cacheKey, metrics, 1800);
  console.log(`[Cache SET] Performance metrics for location ${locationDbId}`);
  
  return metrics;
};

export const fetchSearchKeywords = async (userId, locationDbId, month) => {
  const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!loc) throw { code: 404, message: "Location not found" };

  const accessToken = await getValidAccessToken(userId);
  const [year, mon] = month.split("-").map(Number);

  try {
    console.log(`[Codelura] Fetching keywords for location: ${loc.googleLocationId}, month: ${month}`);
    
    const res = await axios.get(
      `${PERF_URL}/locations/${loc.googleLocationId}/searchkeywords/impressions/monthly`,
      {
        params: { 
          "monthlyRange.startMonth.year": year, 
          "monthlyRange.startMonth.month": mon, 
          "monthlyRange.endMonth.year": year, 
          "monthlyRange.endMonth.month": mon 
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    console.log(`[Codelura] Keywords API response:`, JSON.stringify(res.data, null, 2));

    // Google returns searchKeywordsCounts array
    const rawKeywords = res.data.searchKeywordsCounts || [];
    
    // Format the keywords properly
    const keywords = rawKeywords.map(item => ({
      searchKeyword: item.searchKeyword || '',
      insightsValue: {
        value: item.insightsValue?.value || 'UNKNOWN',
        threshold: item.insightsValue?.threshold || '0'
      }
    }));
    
    // Save to database
    await GbpSearchKeyword.findOneAndUpdate(
      { locationId: locationDbId, month },
      { userId, locationId: locationDbId, googleLocationId: loc.googleLocationId, month, keywords },
      { upsert: true }
    );
    
    console.log(`[Codelura] ✓ Saved ${keywords.length} keywords for ${month}`);
    return keywords;
  } catch (err) {
    console.error(`[Codelura] ✗ Error fetching keywords:`, err.response?.data || err.message);
    
    // Return empty array for common cases where data isn't available
    if (err.response?.status === 404) {
      console.log(`[Codelura] No keyword data available for this location/month (404)`);
      // Still save empty result to avoid repeated API calls
      await GbpSearchKeyword.findOneAndUpdate(
        { locationId: locationDbId, month },
        { userId, locationId: locationDbId, googleLocationId: loc.googleLocationId, month, keywords: [] },
        { upsert: true }
      );
      return [];
    }
    
    if (err.response?.status === 400) {
      console.log(`[Codelura] Invalid request parameters (400)`);
      await GbpSearchKeyword.findOneAndUpdate(
        { locationId: locationDbId, month },
        { userId, locationId: locationDbId, googleLocationId: loc.googleLocationId, month, keywords: [] },
        { upsert: true }
      );
      return [];
    }
    
    throw {
      code: err.response?.status || 500,
      message: err.response?.data?.error?.message || err.message,
      details: err.response?.data
    };
  }
};
