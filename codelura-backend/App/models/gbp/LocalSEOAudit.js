/**
 * Local SEO Audit Model
 * Stores complete audit results with history
 */

import mongoose from "mongoose";

const auditCheckSchema = new mongoose.Schema({
  id: { type: String, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], required: true },
  status: { type: String, enum: ['PASS', 'WARNING', 'CRITICAL', 'NOT_AVAILABLE'], required: true },
  description: { type: String, required: true },
  whyItMatters: { type: String, required: true },
  currentValue: { type: String },
  expectedValue: { type: String },
  recommendation: { type: String },
  actionRoute: { type: String },
  evidence: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const localSEOAuditSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GbpLocation',
    required: true,
    index: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  checks: [auditCheckSchema],
  summary: {
    total: { type: Number, required: true },
    critical: { type: Number, required: true },
    warnings: { type: Number, required: true },
    passed: { type: Number, required: true },
    notAvailable: { type: Number, required: true },
  },
  breakdown: {
    profile: [auditCheckSchema],
    reviews: [auditCheckSchema],
    media: [auditCheckSchema],
    posts: [auditCheckSchema],
    website: [auditCheckSchema],
    nap: [auditCheckSchema],
    performance: [auditCheckSchema],
    visibility: [auditCheckSchema],
    competitors: [auditCheckSchema],
  },
  auditedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index for finding latest audit
localSEOAuditSchema.index({ userId: 1, locationId: 1, auditedAt: -1 });

const LocalSEOAudit = mongoose.model('LocalSEOAudit', localSEOAuditSchema);

export default LocalSEOAudit;
