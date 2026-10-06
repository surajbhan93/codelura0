import {
  fetchServicesFromGoogle,
  fetchSupportedServicesFromGoogle,
  getLocationServices,
  applyServiceChangesToGoogle,
  approveRecommendation,
  rejectRecommendation,
  applyBulkApprovals,
  manualAddService,
  manualRemoveService,
  getPendingRecommendations,
  getRecommendationHistory,
  getActivityLogs,
  calculateServiceHealth,
  resolveLocation,
} from "../../services/gbp/gbpServices.service.js";
import { runFullAnalysis } from "../../services/gbp/gbpServicesAI.service.js";
import GbpServiceRecommendation from "../../models/gbp/GbpServiceRecommendation.js";
import GbpLocationSettings from "../../models/gbp/GbpLocationSettings.js";

/**
 * Standardized error response helper.
 * Maps our internal error codes to HTTP status codes.
 */
const sendError = (res, err) => {
  const status =
    err.code === 401 ? 401
    : err.code === 403 ? 403
    : err.code === 404 ? 404
    : err.code === 400 ? 400
    : err.code === 429 ? 429
    : err.code === 503 ? 503
    : 500;
  const message = err.message || "An unexpected error occurred.";
  console.error(`[GBP Services] ${status}: ${message}`, err.googleError ? "(Google API error)" : "");
  res.status(status).json({ success: false, message, googleError: err.googleError || false, raw: err.raw });
};

/**
 * GET /api/google-business-profile/locations/:locationId/services
 * Returns current services from DB. Query param ?sync=true re-fetches from Google.
 */
export const getServices = async (req, res) => {
  try {
    const { locationId } = req.params;
    const forceSync = req.query.sync === "true";
    const result = await getLocationServices(req.user._id, locationId, forceSync);
    res.json({ success: true, data: result });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * POST /api/google-business-profile/locations/:locationId/services/sync
 * Force-syncs services from Google and updates DB.
 */
export const syncServices = async (req, res) => {
  try {
    const { locationId } = req.params;
    const result = await fetchServicesFromGoogle(req.user._id, locationId);
    res.json({ success: true, message: "Services synced from Google.", data: result });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * GET /api/google-business-profile/locations/:locationId/services/supported
 * Fetches Google-supported service types for this location's category.
 */
export const getSupportedServices = async (req, res) => {
  try {
    const { locationId } = req.params;
    const result = await fetchSupportedServicesFromGoogle(req.user._id, locationId);
    res.json({ success: true, data: result });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * POST /api/google-business-profile/locations/:locationId/services/analyze
 * Runs AI analysis using Grok and generates recommendations.
 * Also fetches supported services to give AI the Google service catalog.
 */
export const analyzeServices = async (req, res) => {
  try {
    const { locationId } = req.params;

    // Fetch supported services to give AI full context
    let supportedServices = [];
    try {
      const supported = await fetchSupportedServicesFromGoogle(req.user._id, locationId);
      supportedServices = supported.supportedServices || [];
    } catch (_) {
      // Non-fatal: AI can still analyze without supported services list
    }

    const result = await runFullAnalysis(req.user._id, locationId, supportedServices);
    res.json({ success: true, data: result });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * POST /api/google-business-profile/locations/:locationId/services/apply
 * Applies a set of changes directly (for advanced use / manual changes).
 * Body: { additions: [], modifications: [], removals: [] }
 */
export const applyServices = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { additions = [], modifications = [], removals = [] } = req.body;

    if (!additions.length && !modifications.length && !removals.length) {
      return res.status(400).json({ success: false, message: "No changes provided." });
    }

    const result = await applyServiceChangesToGoogle(
      req.user._id,
      locationId,
      { additions, modifications, removals },
      "USER"
    );
    res.json({ success: true, message: "Services applied to Google.", data: result });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * POST /api/google-business-profile/locations/:locationId/services
 * Manually add a service.
 * Body: { displayName, serviceTypeId?, categoryId? }
 */
export const addService = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { displayName, serviceTypeId, categoryId } = req.body;

    if (!displayName) {
      return res.status(400).json({ success: false, message: "displayName is required." });
    }

    const result = await manualAddService(req.user._id, locationId, { displayName, serviceTypeId, categoryId });
    res.json({ success: true, message: `Service "${displayName}" added to Google.`, data: result });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * DELETE /api/google-business-profile/locations/:locationId/services/:serviceId
 * Remove a service. Requires serviceId from DB (not Google ID directly).
 */
export const removeService = async (req, res) => {
  try {
    const { locationId, serviceId } = req.params;

    // Load the service from DB to get its Google identifiers
    const GbpService = (await import("../../models/gbp/GbpService.js")).default;
    const svc = await GbpService.findOne({ _id: serviceId, locationId });
    if (!svc) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    const result = await manualRemoveService(req.user._id, locationId, {
      serviceTypeId: svc.serviceTypeId,
      displayName: svc.displayName,
    });
    res.json({ success: true, message: `Service "${svc.displayName}" removed from Google.`, data: result });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * GET /api/google-business-profile/locations/:locationId/services/recommendations
 * Returns pending AI recommendations for this location.
 */
export const getRecommendations = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { status } = req.query;

    let recs;
    if (status === "history") {
      recs = await getRecommendationHistory(req.user._id, locationId);
    } else {
      recs = await getPendingRecommendations(req.user._id, locationId);
    }
    res.json({ success: true, data: recs });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * POST /api/google-business-profile/locations/:locationId/services/recommendations/:recommendationId/approve
 * Approve a single recommendation and apply it to Google.
 */
export const approveRec = async (req, res) => {
  try {
    const { locationId, recommendationId } = req.params;
    const result = await approveRecommendation(req.user._id, locationId, recommendationId);
    res.json({ success: true, message: "Recommendation approved and applied to Google.", data: result });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * POST /api/google-business-profile/locations/:locationId/services/recommendations/:recommendationId/reject
 * Reject a recommendation.
 */
export const rejectRec = async (req, res) => {
  try {
    const { locationId, recommendationId } = req.params;
    const result = await rejectRecommendation(req.user._id, locationId, recommendationId);
    res.json({ success: true, message: "Recommendation rejected.", data: result });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * POST /api/google-business-profile/locations/:locationId/services/bulk-apply
 * Apply multiple approved recommendations at once in one atomic Google PATCH.
 * Body: { recommendationIds: [] }
 */
export const bulkApply = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { recommendationIds = [] } = req.body;

    if (!recommendationIds.length) {
      return res.status(400).json({ success: false, message: "No recommendation IDs provided." });
    }

    const result = await applyBulkApprovals(req.user._id, locationId, recommendationIds);
    res.json({ success: true, message: "Bulk changes applied to Google.", data: result });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * GET /api/google-business-profile/locations/:locationId/services/activity
 * Returns activity/audit log for this location.
 */
export const getActivity = async (req, res) => {
  try {
    const { locationId } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const logs = await getActivityLogs(req.user._id, locationId, limit);
    res.json({ success: true, data: logs });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * GET /api/google-business-profile/locations/:locationId/services/health
 * Returns the service health score for this location.
 */
export const getHealth = async (req, res) => {
  try {
    const { locationId } = req.params;
    const health = await calculateServiceHealth(req.user._id, locationId);
    res.json({ success: true, data: health });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * POST /api/google-business-profile/services/bulk-analyze
 * Analyze multiple locations at once (for bulk optimization UI).
 * Body: { locationIds: [] }
 */
export const bulkAnalyze = async (req, res) => {
  try {
    const { locationIds = [] } = req.body;

    if (!locationIds.length) {
      return res.status(400).json({ success: false, message: "No location IDs provided." });
    }

    if (locationIds.length > 20) {
      return res.status(400).json({ success: false, message: "Maximum 20 locations per bulk analysis." });
    }

    // Process locations with controlled concurrency (max 3 at a time to respect API rate limits)
    const results = [];
    const CONCURRENCY = 3;

    for (let i = 0; i < locationIds.length; i += CONCURRENCY) {
      const batch = locationIds.slice(i, i + CONCURRENCY);
      const batchPromises = batch.map(async (locationId) => {
        try {
          // Get supported services for this location
          let supportedServices = [];
          try {
            const supported = await fetchSupportedServicesFromGoogle(req.user._id, locationId);
            supportedServices = supported.supportedServices || [];
          } catch (_) {}

          const result = await runFullAnalysis(req.user._id, locationId, supportedServices);
          return { locationId, success: true, data: result };
        } catch (err) {
          return {
            locationId,
            success: false,
            error: err.message,
            code: err.code,
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults.map((r) => (r.status === "fulfilled" ? r.value : { locationId: null, success: false, error: r.reason?.message })));

      // Respect rate limits between batches
      if (i + CONCURRENCY < locationIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    res.json({
      success: true,
      data: {
        results,
        totalLocations: locationIds.length,
        successCount: results.filter((r) => r.success).length,
        failureCount: results.filter((r) => !r.success).length,
      },
    });
  } catch (err) {
    sendError(res, err);
  }
};
