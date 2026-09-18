/**
 * GBP Performance Snapshot Model
 * Stores pre-calculated performance scores and trends for fast dashboard loading
 */

import mongoose from "mongoose";

const gbpPerformanceSnapshotSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: "GbpLocation", required: true, index: true },
  
  // Period information
  periodType: { 
    type: String, 
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // Codelura Performance Score
  performanceScore: {
    score: { type: Number, required: true }, // 0-100
    breakdown: {
      visibility: Number,
      engagement: Number,
      conversionRate: Number,
    },
  },
  
  // Raw metrics aggregated over period
  metrics: {
    totalImpressions: Number,
    searchImpressions: Number,
    mapsImpressions: Number,
    profileViews: Number,
    websiteClicks: Number,
    callClicks: Number,
    directions: Number,
    bookings: Number,
    engagementRate: Number,
  },
  
  // Trend analysis
  trend: {
    status: { type: String, enum: ['IMPROVING', 'STABLE', 'DECLINING', 'INSUFFICIENT_DATA'] },
    direction: String, // ↑, →, ↓
    message: String,
    confidence: Number, // 0-100
    scoreChange: Number,
    improvingMetrics: Number,
    decliningMetrics: Number,
  },
  
  // Comparison with previous period
  comparison: {
    previousScore: Number,
    metricChanges: mongoose.Schema.Types.Mixed, // Detailed metric-by-metric changes
  },
  
  // Location health
  health: {
    score: Number, // 0-100
    issues: [{
      type: { type: String }, // Explicitly define 'type' field
      severity: String,
      message: String,
      action: String,
    }],
    strengths: [String],
    details: {
      profileCompleteness: Number,
      reviewActivity: Number,
      contentActivity: Number,
      visibility: Number,
    },
  },
  
  // Additional context
  reviews: {
    total: Number,
    average: Number,
    unanswered: Number,
    responseRate: Number,
  },
  
  posts: {
    total: Number,
    published: Number,
    scheduled: Number,
  },
  
  // Sync metadata
  syncedAt: { type: Date, default: Date.now },
  dataQuality: { 
    type: String, 
    enum: ['complete', 'partial', 'insufficient'],
    default: 'complete' 
  },
  
}, { timestamps: true });

// Indexes for fast queries
gbpPerformanceSnapshotSchema.index({ locationId: 1, startDate: -1 });
gbpPerformanceSnapshotSchema.index({ userId: 1, periodType: 1, startDate: -1 });
gbpPerformanceSnapshotSchema.index({ locationId: 1, periodType: 1, startDate: -1 }, { unique: true });

export default mongoose.model("GbpPerformanceSnapshot", gbpPerformanceSnapshotSchema);
