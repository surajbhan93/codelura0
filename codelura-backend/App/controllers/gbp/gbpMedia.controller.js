/**
 * GBP Media Controller
 * REST API handlers for Google Business Profile Media Manager
 */

import multer from "multer";
import {
  syncGoogleMedia,
  getMediaList,
  uploadGoogleMedia,
  deleteGoogleMedia,
  calculateMediaHealth,
  detectDuplicates,
  getMissingPhotoOpportunities,
  scheduleMedia,
  bulkScheduleMedia,
  getScheduledMediaList,
  publishSingleScheduledMedia,
} from "../../services/gbp/gbpMedia.service.js";

import {
  analyzeMediaQuality,
  generateMediaRecommendations,
  generateMonthlyMediaPlan,
  getPhotoIdeas,
  generateAIMediaCalendar,
} from "../../services/gbp/gbpMediaAI.service.js";
import GbpMedia from "../../models/gbp/GbpMedia.js";

// Multer in-memory storage for handling image uploads
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per GBP guidelines
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format. Please upload JPG, PNG, or WEBP."));
    }
  },
});

/**
 * List Media for Location
 */
export const listLocationMedia = async (req, res) => {
  try {
    const { locationId } = req.params;
    const result = await getMediaList(req.user._id, locationId, req.query);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[Media Controller] listLocationMedia error:", err);
    res.status(err.code || 500).json({ 
      success: false, 
      message: err.message || "Failed to fetch media list",
      errorCode: err.code,
      googleError: err.googleError,
      requestContext: err.requestContext,
    });
  }
};

/**
 * Trigger Sync Google Media
 */
export const syncMedia = async (req, res) => {
  try {
    const { locationId } = req.params;
    console.log("[Media Controller] Sync started for location:", locationId);
    const result = await syncGoogleMedia(req.user._id, locationId);
    res.json({
      success: true,
      data: result,
      message: `Successfully synced ${result.syncedCount} media items from Google.`,
    });
  } catch (err) {
    console.error("[Media Controller] syncMedia error:", err);
    res.status(err.code || 500).json({ 
      success: false, 
      message: err.message || "Failed to sync Google media",
      errorCode: err.code,
      googleError: err.googleError,
      requestContext: err.requestContext,
    });
  }
};

/**
 * Upload Photo(s) to Google Business Profile (Direct or Scheduled)
 */
export const uploadMedia = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { category = "ADDITIONAL", description = "", title = "", sourceUrl, scheduledAt } = req.body;

    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0 && !sourceUrl) {
      return res.status(400).json({ success: false, message: "Please select at least one photo or provide a source URL." });
    }

    // If scheduledAt is provided, schedule it instead of instant upload
    if (scheduledAt) {
      if (!sourceUrl) {
        return res.status(400).json({ success: false, message: "Source URL is required for scheduled photos. Please upload the photo first." });
      }

      const scheduledItem = await scheduleMedia(req.user._id, locationId, {
        sourceUrl,
        category,
        title,
        description,
        scheduledAt,
      });

      return res.json({
        success: true,
        data: scheduledItem,
        message: "Photo scheduled successfully for Google Business Profile.",
      });
    }

    const results = [];

    if (sourceUrl) {
      try {
        const record = await uploadGoogleMedia(req.user._id, locationId, null, {
          category,
          description,
          title,
          sourceUrl,
        });
        results.push({ success: true, filename: sourceUrl, record });
      } catch (err) {
        results.push({ 
          success: false, 
          filename: sourceUrl, 
          error: err.message,
          statusCode: err.code,
          googleError: err.googleError,
        });
      }
    } else {
      for (const file of files) {
        try {
          const record = await uploadGoogleMedia(req.user._id, locationId, file.buffer, {
            category,
            description,
            title,
            contentType: file.mimetype,
          });
          results.push({ success: true, filename: file.originalname, record });
        } catch (err) {
          results.push({ 
            success: false, 
            filename: file.originalname, 
            error: err.message,
            statusCode: err.code,
            googleError: err.googleError,
          });
        }
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.json({
      success: successCount > 0,
      data: results,
      message: failureCount === 0 
        ? `${successCount} photo(s) uploaded successfully to Google Business Profile.`
        : `${successCount} uploaded successfully, ${failureCount} failed.`,
    });
  } catch (err) {
    console.error("[Media Controller] uploadMedia error:", err);
    res.status(err.code || 500).json({ 
      success: false, 
      message: err.message || "Failed to upload media to Google",
      errorCode: err.code,
      googleError: err.googleError,
    });
  }
};

/**
 * Generate AI Media Calendar with Opposite-Days Auto-Scheduling
 */
export const generateAIMediaCalendarController = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { month, year, numPhotos, categories, preferOppositeDays } = req.body;

    const calendar = await generateAIMediaCalendar(req.user._id, locationId, {
      month,
      year,
      numPhotos: Number(numPhotos) || 8,
      categories,
      preferOppositeDays: preferOppositeDays !== false,
    });

    res.json({
      success: true,
      data: calendar,
      message: `Generated AI Media Calendar with ${calendar.photos.length} photos.`,
    });
  } catch (err) {
    console.error("[Media Controller] generateAIMediaCalendar error:", err);
    res.status(err.code || 500).json({
      success: false,
      message: err.message || "Failed to generate AI media calendar",
    });
  }
};

/**
 * Approve & Schedule AI Media Calendar Photos
 */
export const approveAIMediaCalendarController = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { photos, publishFirstNow } = req.body;

    if (!Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ success: false, message: "No photos provided to approve." });
    }

    let firstPublished = null;
    let photosToSchedule = photos;

    // If publishFirstNow is requested, upload 1st photo immediately
    if (publishFirstNow && photos.length > 0) {
      const first = photos[0];
      try {
        firstPublished = await uploadGoogleMedia(req.user._id, locationId, null, {
          category: first.category,
          title: first.title,
          description: first.description,
          sourceUrl: first.imageUrl || first.sourceUrl,
          aiGenerated: true,
        });
        photosToSchedule = photos.slice(1);
      } catch (fErr) {
        console.warn("[Media Controller] Immediate publish of first photo warning:", fErr.message);
      }
    }

    const scheduled = await bulkScheduleMedia(req.user._id, locationId, photosToSchedule);

    res.json({
      success: true,
      data: {
        firstPublished,
        scheduledCount: scheduled.scheduledCount,
        items: scheduled.items,
      },
      message: `Successfully scheduled ${scheduled.scheduledCount} photos to auto-publish on Google Business Profile.${firstPublished ? ' First photo uploaded now!' : ''}`,
    });
  } catch (err) {
    console.error("[Media Controller] approveAIMediaCalendar error:", err);
    res.status(err.code || 500).json({
      success: false,
      message: err.message || "Failed to schedule media calendar",
    });
  }
};

/**
 * Schedule Single Media Item
 */
export const scheduleSingleMediaController = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { sourceUrl, category, title, description, scheduledAt, aiGenerated } = req.body;

    const item = await scheduleMedia(req.user._id, locationId, {
      sourceUrl,
      category,
      title,
      description,
      scheduledAt,
      aiGenerated,
    });

    res.json({
      success: true,
      data: item,
      message: "Photo scheduled successfully!",
    });
  } catch (err) {
    console.error("[Media Controller] scheduleSingleMedia error:", err);
    res.status(err.code || 500).json({
      success: false,
      message: err.message || "Failed to schedule media",
    });
  }
};

/**
 * List Scheduled Media Queue
 */
export const listScheduledMediaController = async (req, res) => {
  try {
    const { locationId } = req.params;
    const result = await getScheduledMediaList(req.user._id, locationId, req.query);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[Media Controller] listScheduledMedia error:", err);
    res.status(err.code || 500).json({
      success: false,
      message: err.message || "Failed to fetch scheduled media queue",
    });
  }
};

/**
 * Publish Scheduled Media Now ("Upload to Google Now 🚀")
 */
export const publishScheduledMediaNowController = async (req, res) => {
  try {
    const { locationId, mediaId } = req.params;
    const published = await publishSingleScheduledMedia(req.user._id, locationId, mediaId);
    res.json({
      success: true,
      data: published,
      message: "Photo published to Google Business Profile successfully! 🚀",
    });
  } catch (err) {
    console.error("[Media Controller] publishScheduledMediaNow error:", err);
    res.status(err.code || 500).json({
      success: false,
      message: err.message || "Failed to upload scheduled media to Google",
      googleError: err.googleError,
    });
  }
};

/**
 * Update Scheduled Media
 */
export const updateScheduledMediaController = async (req, res) => {
  try {
    const { locationId, mediaId } = req.params;
    const { category, title, description, scheduledAt, sourceUrl } = req.body;

    const item = await GbpMedia.findOne({ _id: mediaId, userId: req.user._id, locationId });
    if (!item) return res.status(404).json({ success: false, message: "Media not found" });

    if (category) item.category = category;
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (scheduledAt) item.scheduledAt = new Date(scheduledAt);
    if (sourceUrl) item.sourceUrl = sourceUrl;

    await item.save();

    res.json({ success: true, data: item, message: "Scheduled photo updated successfully." });
  } catch (err) {
    console.error("[Media Controller] updateScheduledMedia error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to update scheduled media" });
  }
};

/**
 * Cancel / Delete Scheduled Media
 */
export const cancelScheduledMediaController = async (req, res) => {
  try {
    const { locationId, mediaId } = req.params;
    const result = await deleteGoogleMedia(req.user._id, locationId, mediaId);
    res.json({ success: true, data: result, message: "Scheduled photo removed from queue." });
  } catch (err) {
    console.error("[Media Controller] cancelScheduledMedia error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to cancel scheduled media" });
  }
};

/**
 * Replace Profile Photo
 */
export const replaceProfilePhoto = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { sourceUrl } = req.body;
    const file = req.file;

    if (!file && !sourceUrl) {
      return res.status(400).json({ success: false, message: "Profile photo file or URL is required." });
    }

    const record = await uploadGoogleMedia(req.user._id, locationId, file?.buffer, {
      category: "PROFILE",
      description: "Official Profile Logo",
      sourceUrl,
      contentType: file?.mimetype,
    });

    res.json({
      success: true,
      data: record,
      message: "Profile photo replaced successfully on Google Business Profile.",
    });
  } catch (err) {
    console.error("[Media Controller] replaceProfilePhoto error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to replace profile photo" });
  }
};

/**
 * Replace Cover Photo
 */
export const replaceCoverPhoto = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { sourceUrl } = req.body;
    const file = req.file;

    if (!file && !sourceUrl) {
      return res.status(400).json({ success: false, message: "Cover photo file or URL is required." });
    }

    const record = await uploadGoogleMedia(req.user._id, locationId, file?.buffer, {
      category: "COVER",
      description: "Official Cover Banner",
      sourceUrl,
      contentType: file?.mimetype,
    });

    res.json({
      success: true,
      data: record,
      message: "Cover photo replaced successfully on Google Business Profile.",
    });
  } catch (err) {
    console.error("[Media Controller] replaceCoverPhoto error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to replace cover photo" });
  }
};

/**
 * Delete Media Item
 */
export const removeMedia = async (req, res) => {
  try {
    const { locationId, mediaId } = req.params;
    const result = await deleteGoogleMedia(req.user._id, locationId, mediaId);
    res.json({ success: true, data: result, message: "Photo deleted successfully from Google Business Profile." });
  } catch (err) {
    console.error("[Media Controller] removeMedia error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to delete media" });
  }
};

/**
 * Get Media Health Score & Breakdown
 */
export const getMediaHealth = async (req, res) => {
  try {
    const { locationId } = req.params;
    const health = await calculateMediaHealth(req.user._id, locationId);
    res.json({ success: true, data: health });
  } catch (err) {
    console.error("[Media Controller] getMediaHealth error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to calculate media health" });
  }
};

/**
 * Get Duplicate Photos Report
 */
export const getDuplicates = async (req, res) => {
  try {
    const { locationId } = req.params;
    const duplicates = await detectDuplicates(req.user._id, locationId);
    res.json({ success: true, data: duplicates });
  } catch (err) {
    console.error("[Media Controller] getDuplicates error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to scan for duplicate photos" });
  }
};

/**
 * Get Missing Photo Opportunities
 */
export const getOpportunities = async (req, res) => {
  try {
    const { locationId } = req.params;
    const opportunities = await getMissingPhotoOpportunities(req.user._id, locationId);
    res.json({ success: true, data: opportunities });
  } catch (err) {
    console.error("[Media Controller] getOpportunities error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to fetch missing photo opportunities" });
  }
};

/**
 * Get AI Recommendations
 */
export const getRecommendations = async (req, res) => {
  try {
    const { locationId } = req.params;
    const recs = await generateMediaRecommendations(req.user._id, locationId);
    res.json({ success: true, data: recs });
  } catch (err) {
    console.error("[Media Controller] getRecommendations error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to generate recommendations" });
  }
};

/**
 * Get or Generate Monthly Media Plan
 */
export const getMediaPlan = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { month } = req.query;
    const plan = await generateMonthlyMediaPlan(req.user._id, locationId, month);
    res.json({ success: true, data: plan });
  } catch (err) {
    console.error("[Media Controller] getMediaPlan error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to get monthly media plan" });
  }
};

/**
 * Get AI Photo Ideas on Demand
 */
export const getAIPhotoIdeas = async (req, res) => {
  try {
    const { locationId } = req.params;
    const { prompt } = req.body;
    const ideas = await getPhotoIdeas(req.user._id, locationId, prompt);
    res.json({ success: true, data: ideas });
  } catch (err) {
    console.error("[Media Controller] getAIPhotoIdeas error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to generate photo ideas" });
  }
};

/**
 * Analyze Media Item Quality on Demand
 */
export const analyzeQuality = async (req, res) => {
  try {
    const { locationId, mediaId } = req.params;
    const analyzed = await analyzeMediaQuality(req.user._id, locationId, mediaId);
    res.json({ success: true, data: analyzed, message: "AI Quality Analysis completed." });
  } catch (err) {
    console.error("[Media Controller] analyzeQuality error:", err);
    res.status(err.code || 500).json({ success: false, message: err.message || "Failed to analyze photo quality" });
  }
};
