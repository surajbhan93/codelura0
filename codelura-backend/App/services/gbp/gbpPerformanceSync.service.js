/**
 * GBP Performance Sync Service
 * Handles automatic syncing of performance data and snapshot generation
 */

import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpPerformanceSnapshot from "../../models/gbp/GbpPerformanceSnapshot.js";
import { analyzePerformance, calculateLocationHealth } from "./gbpPerformanceAnalyzer.service.js";
import { fetchPerformanceMetrics } from "./gbpPerformance.service.js";
import cacheService from "../cache.service.js";

/**
 * Sync performance data for a location
 */
export const syncLocationPerformance = async (userId, locationId, startDate, endDate) => {
  console.log(`[Performance Sync] Starting sync for location ${locationId}`);
  console.log(`[Performance Sync] Period: ${startDate} to ${endDate}`);
  
  try {
    // Fetch latest data from Google API
    const { dailyMap, errors } = await fetchPerformanceMetrics(userId, locationId, startDate, endDate);
    
    if (errors.length > 0) {
      console.log(`[Performance Sync] ⚠ ${errors.length} metrics had errors`);
    }
    
    // Analyze performance
    const analysis = await analyzePerformance(userId, locationId, startDate, endDate);
    
    if (!analysis.hasData) {
      console.log(`[Performance Sync] ✗ No data available for this period`);
      return { success: false, message: 'No data available' };
    }
    
    // Calculate health score
    const health = await calculateLocationHealth(userId, locationId);
    
    // Determine period type
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    let periodType = 'custom';
    if (days === 1) periodType = 'daily';
    else if (days === 7) periodType = 'weekly';
    else if (days >= 28 && days <= 31) periodType = 'monthly';
    
    // Create or update snapshot
    const snapshot = await GbpPerformanceSnapshot.findOneAndUpdate(
      {
        userId,
        locationId,
        periodType,
        startDate: new Date(startDate),
      },
      {
        userId,
        locationId,
        periodType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        performanceScore: analysis.score,
        metrics: analysis.score.rawMetrics,
        trend: analysis.comparison?.trend || {
          status: 'INSUFFICIENT_DATA',
          direction: '→',
          message: 'Not enough historical data',
          confidence: 0,
        },
        comparison: analysis.comparison ? {
          previousScore: analysis.comparison.previous.score,
          metricChanges: analysis.comparison.metricChanges,
        } : null,
        health,
        reviews: analysis.reviews,
        posts: analysis.posts,
        syncedAt: new Date(),
        dataQuality: errors.length > 5 ? 'partial' : 'complete',
      },
      { upsert: true, new: true }
    );
    
    // Invalidate specific cache for this snapshot
    const snapshotCacheKey = cacheService.generateKey(userId, 'performance-snapshot', `${locationId}:${startDate}:${endDate}`);
    const metricsCacheKey = cacheService.generateKey(userId, 'performance', `${locationId}:${startDate}:${endDate}`);
    cacheService.delete(snapshotCacheKey);
    cacheService.delete(metricsCacheKey);
    
    console.log(`[Performance Sync] ✓ Snapshot saved (Score: ${snapshot.performanceScore.score}), cache cleared`);
    
    return {
      success: true,
      snapshot,
    };
    
  } catch (error) {
    console.error(`[Performance Sync] ✗ Error:`, error.message);
    throw error;
  }
};

/**
 * Sync all locations for a user
 */
export const syncAllLocations = async (userId, startDate, endDate) => {
  console.log(`[Performance Sync] Syncing all locations for user ${userId}`);
  
  const locations = await GbpLocation.find({ userId, status: 'active' }).lean();
  
  console.log(`[Performance Sync] Found ${locations.length} active locations`);
  
  const results = [];
  
  for (const location of locations) {
    try {
      const result = await syncLocationPerformance(userId, location._id, startDate, endDate);
      results.push({
        locationId: location._id,
        locationName: location.locationName,
        ...result,
      });
    } catch (error) {
      console.error(`[Performance Sync] Failed for ${location.locationName}:`, error.message);
      results.push({
        locationId: location._id,
        locationName: location.locationName,
        success: false,
        error: error.message,
      });
    }
  }
  
  console.log(`[Performance Sync] ✓ Completed: ${results.filter(r => r.success).length}/${results.length} successful`);
  
  return results;
};

/**
 * Get or create snapshot (with caching)
 */
export const getPerformanceSnapshot = async (userId, locationId, startDate, endDate, options = {}) => {
  const { forceSync = false } = options;
  
  console.log(`[Performance Snapshot] Request for ${locationId}:`, { startDate, endDate, forceSync });
  
  // Check cache first (use date-specific cache key)
  const cacheKey = cacheService.generateKey(userId, 'performance-snapshot', `${locationId}:${startDate}:${endDate}`);
  
  if (!forceSync) {
    const cached = cacheService.get(cacheKey);
    if (cached) {
      const cacheAge = Math.round((Date.now() - new Date(cached.syncedAt).getTime()) / 1000 / 60);
      console.log(`[Cache HIT] Performance snapshot for ${locationId} (${cacheAge} min old)`);
      return cached;
    }
  }
  
  // Try to get existing snapshot from database
  const snapshot = await GbpPerformanceSnapshot.findOne({
    userId,
    locationId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  })
  .sort({ syncedAt: -1 }) // Get most recent
  .lean();
  
  // If snapshot exists and is fresh (< 1 hour old for this specific date range), use it
  if (snapshot && !forceSync) {
    const age = Date.now() - new Date(snapshot.syncedAt).getTime();
    const maxAge = 1 * 60 * 60 * 1000; // 1 hour (reduced from 6 hours)
    
    if (age < maxAge) {
      const ageMinutes = Math.round(age / 1000 / 60);
      console.log(`[Performance Snapshot] Using existing snapshot (${ageMinutes} minutes old)`);
      cacheService.set(cacheKey, snapshot, 3600); // Cache for 1 hour
      return snapshot;
    } else {
      console.log(`[Performance Snapshot] Snapshot exists but is stale (${Math.round(age / 1000 / 60 / 60)} hours old), syncing fresh data`);
    }
  }
  
  // Need to sync new data for this date range
  console.log(`[Performance Snapshot] No fresh snapshot found, syncing new data for ${startDate} to ${endDate}`);
  const result = await syncLocationPerformance(userId, locationId, startDate, endDate);
  
  if (result.success) {
    cacheService.set(cacheKey, result.snapshot, 3600);
    return result.snapshot;
  }
  
  // Return old snapshot if sync failed
  if (snapshot) {
    console.log(`[Performance Snapshot] Using stale snapshot (sync failed)`);
    return snapshot;
  }
  
  return null;
};

/**
 * Get snapshots for all locations (for comparison)
 */
export const getAllLocationSnapshots = async (userId, startDate, endDate) => {
  const locations = await GbpLocation.find({ userId, status: 'active' }).lean();
  
  const snapshots = [];
  
  for (const location of locations) {
    try {
      const snapshot = await getPerformanceSnapshot(userId, location._id, startDate, endDate);
      if (snapshot) {
        snapshots.push({
          ...snapshot,
          location: {
            id: location._id,
            name: location.locationName,
            address: location.storefrontAddress,
          },
        });
      }
    } catch (error) {
      console.error(`[Performance Snapshot] Error for ${location.locationName}:`, error.message);
    }
  }
  
  // Sort by performance score
  snapshots.sort((a, b) => b.performanceScore.score - a.performanceScore.score);
  
  return snapshots;
};

export default {
  syncLocationPerformance,
  syncAllLocations,
  getPerformanceSnapshot,
  getAllLocationSnapshots,
};
