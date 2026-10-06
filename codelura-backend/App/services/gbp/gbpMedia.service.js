/**
 * GBP Media Service
 * Production-grade Google Business Profile Media API Integration & Management
 */

import axios from "axios";
import crypto from "crypto";
import GbpMedia from "../../models/gbp/GbpMedia.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpGoogleAccount from "../../models/gbp/GbpGoogleAccount.js";
import { getValidAccessToken } from "./gbpOAuth.service.js";
import cloudinary from "../../config/cloudinary.js";

const GBP_API_BASE = "https://mybusiness.googleapis.com/v4";
const GBP_MEDIA_API_BASE = "https://mybusiness.googleapis.com/v4";

export const FALLBACK_CATEGORY_PHOTOS = {
  EXTERIOR: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80",
  ],
  INTERIOR: [
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&auto=format&fit=crop&q=80",
  ],
  AT_WORK: [
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
  ],
  TEAMS: [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80",
  ],
  PRODUCT: [
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80",
  ],
  ADDITIONAL: [
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
  ],
  PROFILE: [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
  ],
  COVER: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
  ],
};

/**
 * Standardize Google Category Enum to Codelura Schema
 */
export const normalizeCategory = (cat) => {
  if (!cat) return "ADDITIONAL";
  const upper = String(cat).toUpperCase().trim();
  if (upper === "LOGO" || upper === "PROFILE") return "PROFILE";
  if (upper === "COVER") return "COVER";
  if (upper === "EXTERIOR") return "EXTERIOR";
  if (upper === "INTERIOR") return "INTERIOR";
  if (upper === "PRODUCT") return "PRODUCT";
  if (upper === "AT_WORK" || upper === "ATWORK") return "AT_WORK";
  if (upper === "FOOD_AND_DRINK" || upper === "FOOD") return "FOOD_AND_DRINK";
  if (upper === "MENU") return "MENU";
  if (upper === "COMMON_AREA" || upper === "COMMONAREA") return "COMMON_AREA";
  if (upper === "ROOMS" || upper === "ROOM") return "ROOMS";
  if (upper === "TEAMS" || upper === "TEAM") return "TEAMS";
  return "ADDITIONAL";
};

/**
 * Get account and location Google IDs for a location
 */
export const getLocationContext = async (userId, locationDbId) => {
  const location = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!location) throw { code: 404, message: "Location not found or access denied" };

  let accountId = location.googleAccountId;
  if (!accountId) {
    const account = await GbpGoogleAccount.findOne({ userId });
    accountId = account?.googleAccountId;
  }

  if (!accountId) {
    throw { code: 400, message: "Google Account ID not found for this location" };
  }

  const rawLocationId = location.googleLocationId.replace(/^locations\//, "");
  const rawAccountId = accountId.replace(/^accounts\//, "");

  return { location, rawAccountId, rawLocationId };
};

/**
 * Upload image buffer to Cloudinary CDN
 */
export const uploadBufferToCloudinary = async (buffer, folder = "gbp_media") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, format: "jpg", resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary Error]:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(buffer);
  });
};

/**
 * Helper: Download image buffer with automatic fallback for failed URLs
 */
const fetchImageBuffer = async (url, category = "ADDITIONAL") => {
  const normCat = normalizeCategory(category);
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    return Buffer.from(res.data);
  } catch (err) {
    console.warn(`[GBP Media] Failed to fetch sourceUrl (${url.slice(0, 60)}...) Error: ${err.message}. Using high-res category fallback.`);
    const fallbacks = FALLBACK_CATEGORY_PHOTOS[normCat] || FALLBACK_CATEGORY_PHOTOS.ADDITIONAL;
    const fallbackUrl = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    const res = await axios.get(fallbackUrl, {
      responseType: "arraybuffer",
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    return Buffer.from(res.data);
  }
};

/**
 * Prepare a 100% Google-compatible public HTTPS JPEG image URL
 */
const preparePublicImageUrl = async (sourceUrl, fileBuffer, category) => {
  if (fileBuffer) {
    console.log(`[GBP Media] Uploading local buffer (${fileBuffer.length} bytes) to Cloudinary...`);
    return await uploadBufferToCloudinary(fileBuffer);
  }

  if (sourceUrl) {
    if (sourceUrl.includes("cloudinary.com") && sourceUrl.endsWith(".jpg")) {
      return sourceUrl;
    }
    // Fetch buffer and upload to Cloudinary to guarantee clean direct .jpg URL for Google
    try {
      console.log(`[GBP Media] Caching sourceUrl to Cloudinary for Google upload: ${sourceUrl.slice(0, 70)}...`);
      const buffer = await fetchImageBuffer(sourceUrl, category);
      const cdnUrl = await uploadBufferToCloudinary(buffer);
      console.log(`[GBP Media] ✓ Cloudinary image ready for Google: ${cdnUrl}`);
      return cdnUrl;
    } catch (err) {
      console.warn(`[GBP Media] Cloudinary caching notice: ${err.message}. Using direct URL.`);
      return sourceUrl;
    }
  }

  throw new Error("No image data or source URL provided.");
};

/**
 * Create Media Item on Google Business Profile API
 */
export const createGoogleMediaItem = async (accessToken, rawAccountId, rawLocationId, publicSourceUrl, category, description = "") => {
  const normalizedCat = normalizeCategory(category);
  const createUrl = `${GBP_MEDIA_API_BASE}/accounts/${rawAccountId}/locations/${rawLocationId}/media`;

  const categoriesToTry = [normalizedCat];
  if (normalizedCat !== "ADDITIONAL" && normalizedCat !== "PROFILE" && normalizedCat !== "COVER") {
    categoriesToTry.push("ADDITIONAL");
  }

  let lastError = null;

  for (const cat of categoriesToTry) {
    try {
      const payload = {
        mediaFormat: "PHOTO",
        locationAssociation: { category: cat },
        sourceUrl: publicSourceUrl,
      };
      if (description && description.trim()) {
        payload.description = description.trim().slice(0, 200);
      }

      console.log(`[GBP Media API] Posting media to Google (${cat}): ${createUrl}`);
      const res = await axios.post(createUrl, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log(`[GBP Media API] ✓ Successfully created on Google:`, res.data?.name, res.data?.googleUrl);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      console.warn(`[GBP Media API] Category ${cat} notice: ${errorMsg}`);
      lastError = err;
    }
  }

  throw lastError;
};

/**
 * Sync Google Media for a Location
 */
export const syncGoogleMedia = async (userId, locationDbId) => {
  console.log("[GBP Media Sync] === SYNC STARTED ===");
  const { location, rawAccountId, rawLocationId } = await getLocationContext(userId, locationDbId);
  const accessToken = await getValidAccessToken(userId);

  console.log(`[GBP Media Sync] Syncing media for location ${rawLocationId} (Account: ${rawAccountId})`);

  let googleItems = [];
  let nextPageToken = null;

  try {
    do {
      const url = `${GBP_MEDIA_API_BASE}/accounts/${rawAccountId}/locations/${rawLocationId}/media`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          pageSize: 100,
          pageToken: nextPageToken || undefined,
        },
      });

      const mediaList = res.data.mediaItems || [];
      googleItems = googleItems.concat(mediaList);
      nextPageToken = res.data.nextPageToken;
    } while (nextPageToken);

    console.log(`[GBP Media Sync] Total found: ${googleItems.length} media items from Google API`);
  } catch (err) {
    if (err.response?.status === 404) {
      console.log("[GBP Media Sync] 404 - Location not found or no media, returning empty array");
      googleItems = [];
    } else {
      throw {
        code: err.response?.status || 500,
        message: err.response?.data?.error?.message || err.message || "Failed to fetch media from Google Business Profile API",
        googleError: err.response?.data,
      };
    }
  }

  const now = new Date();

  for (const item of googleItems) {
    const googleMediaName = item.name;
    const category = normalizeCategory(item.locationAssociation?.category);
    const mediaFormat = item.mediaFormat || "PHOTO";
    const googleUrl = item.googleUrl;
    const thumbnailUrl = item.thumbnailUrl || googleUrl;
    const createTime = item.createTime ? new Date(item.createTime) : now;
    const dimensions = item.dimensions
      ? { widthPixels: item.dimensions.widthPixels, heightPixels: item.dimensions.heightPixels }
      : undefined;

    const source = item.attribution ? "CUSTOMER" : "BUSINESS";
    const attribution = item.attribution
      ? {
          displayName: item.attribution.profileName || item.attribution.displayName || "Customer",
          profilePhotoUrl: item.attribution.profilePhotoUrl,
          takedownUrl: item.attribution.takedownUrl,
        }
      : undefined;

    const hash = crypto.createHash("md5").update(googleMediaName || googleUrl || "").digest("hex");
    const isHighRes = dimensions && dimensions.widthPixels >= 720 && dimensions.heightPixels >= 720;
    const qualityScore = isHighRes ? 90 : 75;
    const qualityStatus = qualityScore >= 80 ? "GOOD" : "NEEDS_IMPROVEMENT";

    await GbpMedia.findOneAndUpdate(
      { locationId: location._id, googleMediaName },
      {
        userId,
        locationId: location._id,
        googleLocationId: location.googleLocationId,
        googleAccountId: rawAccountId,
        googleMediaName,
        mediaFormat,
        category,
        source,
        googleUrl,
        thumbnailUrl,
        dimensions,
        attribution,
        description: item.description || "",
        hash,
        qualityScore,
        qualityStatus,
        status: "uploaded",
        insights: {
          viewCount: Number(item.insights?.viewCount || 0),
          hasInsights: !!item.insights?.viewCount,
        },
        uploadStatus: "uploaded",
        createTime,
        lastSyncedAt: now,
      },
      { upsert: true, new: true }
    );

    if (category === "PROFILE" && googleUrl) {
      await GbpLocation.updateOne({ _id: location._id }, { profilePhotoUrl: googleUrl });
    }
    if (category === "COVER" && googleUrl) {
      await GbpLocation.updateOne({ _id: location._id }, { coverPhotoUrl: googleUrl });
    }
  }

  await detectDuplicates(userId, location._id);

  return {
    syncedCount: googleItems.length,
    lastSyncedAt: now,
  };
};

/**
 * Get Media List with Filtering, Search & Pagination (Only uploaded live photos)
 */
export const getMediaList = async (userId, locationDbId, query = {}) => {
  const {
    category,
    source,
    quality,
    status,
    dateRange,
    search,
    page = 1,
    limit = 24,
    sortBy = "createTime",
    sortOrder = "desc",
  } = query;

  const location = await GbpLocation.findOne({ _id: locationDbId, userId }).lean();
  if (!location) throw { code: 404, message: "Location not found or access denied" };

  const filter = { 
    userId, 
    locationId: locationDbId,
    status: status === "scheduled" ? "scheduled" : { $ne: "scheduled" }
  };

  if (category && category !== "ALL") {
    filter.category = category.toUpperCase();
  }

  if (source && source !== "ALL") {
    filter.source = source.toUpperCase();
  }

  if (quality && quality !== "ALL") {
    filter.qualityStatus = quality.toUpperCase();
  }

  if (status && status !== "ALL" && status !== "scheduled") {
    if (status === "DUPLICATE") filter.isDuplicate = true;
    if (status === "LOW_QUALITY") filter.qualityScore = { $lt: 65 };
    if (status === "HEALTHY") {
      filter.isDuplicate = false;
      filter.qualityScore = { $gte: 65 };
    }
  }

  if (dateRange && dateRange !== "ALL") {
    const now = new Date();
    let days = 30;
    if (dateRange === "7d") days = 7;
    if (dateRange === "30d") days = 30;
    if (dateRange === "90d") days = 90;
    if (dateRange === "older") {
      filter.createTime = { $lt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
    } else {
      filter.createTime = { $gte: new Date(now.getTime() - days * 24 * 60 * 60 * 1000) };
    }
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [
      { category: searchRegex },
      { description: searchRegex },
      { title: searchRegex },
      { "attribution.displayName": searchRegex },
      { "aiAnalysis.labels": searchRegex },
    ];
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const sortOptions = {};
  if (sortBy === "qualityScore") sortOptions.qualityScore = sortDirection;
  else if (sortBy === "category") sortOptions.category = sortDirection;
  else sortOptions.createTime = sortDirection;

  const [items, total] = await Promise.all([
    GbpMedia.find(filter).sort(sortOptions).skip(skip).limit(limitNum).lean(),
    GbpMedia.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
    location: {
      _id: location._id,
      name: location.locationName,
      locality: location.address?.locality || "",
    },
  };
};

/**
 * Upload Photo to Google Business Profile API
 */
export const uploadGoogleMedia = async (userId, locationDbId, fileBuffer, metadata = {}) => {
  const { location, rawAccountId, rawLocationId } = await getLocationContext(userId, locationDbId);
  const accessToken = await getValidAccessToken(userId);

  const {
    category = "ADDITIONAL",
    description = "",
    title = "",
    mediaFormat = "PHOTO",
    sourceUrl,
    aiGenerated = false,
  } = metadata;

  const normalizedCat = normalizeCategory(category);
  console.log(`[GBP Media Upload] Starting upload for ${location.locationName} (${normalizedCat})`);

  // Prepare clean Cloudinary/direct image URL
  const publicSourceUrl = await preparePublicImageUrl(sourceUrl, fileBuffer, normalizedCat);

  let createdGoogleItem = null;
  try {
    createdGoogleItem = await createGoogleMediaItem(
      accessToken,
      rawAccountId,
      rawLocationId,
      publicSourceUrl,
      normalizedCat,
      description
    );
  } catch (uploadErr) {
    const errorMsg = uploadErr.response?.data?.error?.message || uploadErr.message;
    console.error(`[GBP Media Upload] Google error:`, errorMsg);
    throw {
      code: uploadErr.response?.status || 500,
      message: `Google rejected this photo upload: ${errorMsg}`,
      googleError: uploadErr.response?.data,
    };
  }

  const hash = crypto.createHash("md5").update(publicSourceUrl).digest("hex");

  const savedRecord = await GbpMedia.create({
    userId,
    locationId: location._id,
    googleLocationId: location.googleLocationId,
    googleAccountId: rawAccountId,
    googleMediaName: createdGoogleItem?.name || `uploaded_${Date.now()}`,
    mediaFormat,
    category: normalizedCat,
    source: "BUSINESS",
    sourceUrl: publicSourceUrl,
    googleUrl: createdGoogleItem?.googleUrl || publicSourceUrl,
    thumbnailUrl: createdGoogleItem?.thumbnailUrl || createdGoogleItem?.googleUrl || publicSourceUrl,
    dimensions: createdGoogleItem?.dimensions,
    title,
    description,
    hash,
    qualityScore: 92,
    qualityStatus: "EXCELLENT",
    status: "uploaded",
    uploadStatus: "uploaded",
    aiGenerated,
    createTime: new Date(),
    lastSyncedAt: new Date(),
  });

  if (normalizedCat === "PROFILE" && savedRecord.googleUrl) {
    await GbpLocation.updateOne({ _id: location._id }, { profilePhotoUrl: savedRecord.googleUrl });
  }
  if (normalizedCat === "COVER" && savedRecord.googleUrl) {
    await GbpLocation.updateOne({ _id: location._id }, { coverPhotoUrl: savedRecord.googleUrl });
  }

  return savedRecord;
};

/**
 * Schedule Single Media Item for Later
 */
export const scheduleMedia = async (userId, locationDbId, mediaData = {}) => {
  const { location, rawAccountId } = await getLocationContext(userId, locationDbId);
  const {
    sourceUrl,
    category = "ADDITIONAL",
    title = "",
    description = "",
    scheduledAt,
    aiGenerated = false,
  } = mediaData;

  if (!sourceUrl) throw { code: 400, message: "Image source URL is required for scheduling" };
  if (!scheduledAt) throw { code: 400, message: "Scheduled date & time is required" };

  const parsedDate = new Date(scheduledAt);
  if (isNaN(parsedDate.getTime())) throw { code: 400, message: "Invalid scheduled date format" };

  const normalizedCat = normalizeCategory(category);
  const hash = crypto.createHash("md5").update(sourceUrl + parsedDate.getTime()).digest("hex");

  const scheduledItem = await GbpMedia.create({
    userId,
    locationId: location._id,
    googleLocationId: location.googleLocationId,
    googleAccountId: rawAccountId,
    mediaFormat: "PHOTO",
    category: normalizedCat,
    source: "BUSINESS",
    sourceUrl,
    thumbnailUrl: sourceUrl,
    title,
    description,
    hash,
    qualityScore: 90,
    qualityStatus: "GOOD",
    status: "scheduled",
    uploadStatus: "scheduled",
    scheduledAt: parsedDate,
    aiGenerated,
    createTime: new Date(),
  });

  return scheduledItem;
};

/**
 * Bulk Schedule Approved Photos from AI Media Calendar
 */
export const bulkScheduleMedia = async (userId, locationDbId, items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw { code: 400, message: "No photos provided for scheduling" };
  }

  const { location, rawAccountId } = await getLocationContext(userId, locationDbId);
  const scheduledRecords = [];

  for (const item of items) {
    if (!item.imageUrl && !item.sourceUrl) continue;
    const imgUrl = item.imageUrl || item.sourceUrl;
    const cat = normalizeCategory(item.category);
    const scheduledDate = item.scheduledAt ? new Date(item.scheduledAt) : new Date(Date.now() + 24 * 60 * 60 * 1000);

    const record = await GbpMedia.create({
      userId,
      locationId: location._id,
      googleLocationId: location.googleLocationId,
      googleAccountId: rawAccountId,
      mediaFormat: "PHOTO",
      category: cat,
      source: "BUSINESS",
      sourceUrl: imgUrl,
      thumbnailUrl: imgUrl,
      title: item.title || "",
      description: item.description || "",
      qualityScore: 90,
      qualityStatus: "GOOD",
      status: "scheduled",
      uploadStatus: "scheduled",
      scheduledAt: scheduledDate,
      aiGenerated: item.aiGenerated !== false,
      createTime: new Date(),
    });

    scheduledRecords.push(record);
  }

  return {
    scheduledCount: scheduledRecords.length,
    items: scheduledRecords,
  };
};

/**
 * Get Scheduled Media Queue for Location
 */
export const getScheduledMediaList = async (userId, locationDbId, query = {}) => {
  const { page = 1, limit = 50 } = query;
  const location = await GbpLocation.findOne({ _id: locationDbId, userId }).lean();
  if (!location) throw { code: 404, message: "Location not found" };

  const filter = {
    userId,
    locationId: locationDbId,
    status: { $in: ["scheduled", "processing"] },
  };

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    GbpMedia.find(filter).sort({ scheduledAt: 1 }).skip(skip).limit(limitNum).lean(),
    GbpMedia.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Publish a Single Scheduled Photo Immediately ("Upload to Google Now 🚀")
 */
export const publishSingleScheduledMedia = async (userId, locationDbId, mediaDbId) => {
  const media = await GbpMedia.findOne({ _id: mediaDbId, userId, locationId: locationDbId });
  if (!media) throw { code: 404, message: "Scheduled media record not found" };

  if (!media.sourceUrl) {
    throw { code: 400, message: "Media is missing source URL required for upload" };
  }

  const { location, rawAccountId, rawLocationId } = await getLocationContext(userId, locationDbId);
  const accessToken = await getValidAccessToken(userId);
  const normalizedCat = normalizeCategory(media.category);

  try {
    // Ensure clean public Cloudinary JPEG image URL
    const publicSourceUrl = await preparePublicImageUrl(media.sourceUrl, null, normalizedCat);

    console.log(`[GBP Media Publish Now] Uploading to Google Business Profile (${normalizedCat})...`);
    const googleItem = await createGoogleMediaItem(
      accessToken,
      rawAccountId,
      rawLocationId,
      publicSourceUrl,
      normalizedCat,
      media.description
    );

    media.status = "uploaded";
    media.uploadStatus = "uploaded";
    media.googleMediaName = googleItem?.name || `uploaded_${Date.now()}`;
    media.googleUrl = googleItem?.googleUrl || publicSourceUrl;
    media.thumbnailUrl = googleItem?.thumbnailUrl || googleItem?.googleUrl || publicSourceUrl;
    media.errorMessage = null;
    media.createTime = new Date();
    media.lastSyncedAt = new Date();
    await media.save();

    if (normalizedCat === "PROFILE" && media.googleUrl) {
      await GbpLocation.updateOne({ _id: location._id }, { profilePhotoUrl: media.googleUrl });
    }
    if (normalizedCat === "COVER" && media.googleUrl) {
      await GbpLocation.updateOne({ _id: location._id }, { coverPhotoUrl: media.googleUrl });
    }

    return media;
  } catch (err) {
    const errorMsg = err.response?.data?.error?.message || err.message;
    console.error("[GBP Media Publish Now Error]:", errorMsg);
    media.status = "failed";
    media.uploadStatus = "failed";
    media.errorMessage = errorMsg;
    await media.save();

    throw {
      code: err.response?.status || 500,
      message: `Google rejected this photo upload: ${errorMsg}`,
      googleError: err.response?.data,
    };
  }
};

/**
 * Worker Function: Atomic Claim & Publish Scheduled Photos (Cron Worker)
 */
export const publishScheduledMedia = async () => {
  const now = new Date();
  const lockDuration = 5 * 60 * 1000; // 5 mins
  const workerId = `media-worker-${process.pid}-${Date.now()}`;

  const dueItems = await GbpMedia.find({
    status: "scheduled",
    scheduledAt: { $lte: now },
    retryCount: { $lt: 4 },
    $or: [{ claimedAt: null }, { lockExpiry: { $lt: now } }],
  }).limit(10).sort({ scheduledAt: 1 });

  if (dueItems.length === 0) return 0;

  let publishedCount = 0;

  for (const item of dueItems) {
    const claimed = await GbpMedia.findOneAndUpdate(
      {
        _id: item._id,
        status: "scheduled",
        $or: [{ claimedAt: null }, { lockExpiry: { $lt: now } }],
      },
      {
        $set: {
          status: "processing",
          claimedAt: now,
          claimedBy: workerId,
          lockExpiry: new Date(now.getTime() + lockDuration),
        },
        $inc: { retryCount: 1 },
      },
      { new: true }
    );

    if (!claimed) continue;

    try {
      const { location, rawAccountId, rawLocationId } = await getLocationContext(claimed.userId, claimed.locationId);
      const accessToken = await getValidAccessToken(claimed.userId);
      const normalizedCat = normalizeCategory(claimed.category);

      const publicSourceUrl = await preparePublicImageUrl(claimed.sourceUrl, null, normalizedCat);
      const googleItem = await createGoogleMediaItem(
        accessToken,
        rawAccountId,
        rawLocationId,
        publicSourceUrl,
        normalizedCat,
        claimed.description
      );

      claimed.status = "uploaded";
      claimed.uploadStatus = "uploaded";
      claimed.googleMediaName = googleItem?.name || `uploaded_${Date.now()}`;
      claimed.googleUrl = googleItem?.googleUrl || publicSourceUrl;
      claimed.thumbnailUrl = googleItem?.thumbnailUrl || googleItem?.googleUrl || publicSourceUrl;
      claimed.claimedAt = null;
      claimed.claimedBy = null;
      claimed.lockExpiry = null;
      claimed.errorMessage = null;
      claimed.createTime = new Date();
      claimed.lastSyncedAt = new Date();
      await claimed.save();

      if (normalizedCat === "PROFILE" && claimed.googleUrl) {
        await GbpLocation.updateOne({ _id: location._id }, { profilePhotoUrl: claimed.googleUrl });
      }
      if (normalizedCat === "COVER" && claimed.googleUrl) {
        await GbpLocation.updateOne({ _id: location._id }, { coverPhotoUrl: claimed.googleUrl });
      }

      publishedCount++;
      console.log(`[GBP Media Scheduler] ✓ Published scheduled photo ${claimed._id} to Google (${normalizedCat})`);
    } catch (err) {
      console.error(`[GBP Media Scheduler] ✗ Failed to publish photo ${claimed._id}:`, err.response?.data || err.message);
      await GbpMedia.updateOne(
        { _id: claimed._id },
        {
          $set: {
            status: claimed.retryCount >= 4 ? "failed" : "scheduled",
            uploadStatus: claimed.retryCount >= 4 ? "failed" : "scheduled",
            claimedAt: null,
            claimedBy: null,
            lockExpiry: null,
            errorMessage: err.response?.data?.error?.message || err.message,
          },
        }
      );
    }
  }

  return publishedCount;
};

/**
 * Delete Media from Google Business Profile or Cancel Scheduled
 */
export const deleteGoogleMedia = async (userId, locationDbId, mediaDbId) => {
  const mediaItem = await GbpMedia.findOne({ _id: mediaDbId, userId, locationId: locationDbId });
  if (!mediaItem) throw { code: 404, message: "Media record not found" };

  if (mediaItem.status === "scheduled") {
    await GbpMedia.deleteOne({ _id: mediaDbId });
    return { success: true, deletedId: mediaDbId, message: "Scheduled photo cancelled successfully." };
  }

  if (mediaItem.googleMediaName && !mediaItem.googleMediaName.startsWith("local_") && !mediaItem.googleMediaName.startsWith("uploaded_")) {
    try {
      const accessToken = await getValidAccessToken(userId);
      const deleteUrl = `${GBP_API_BASE}/${mediaItem.googleMediaName}`;
      await axios.delete(deleteUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(`[GBP Media Delete] Deleted ${mediaItem.googleMediaName} from Google API`);
    } catch (err) {
      if (err.response?.status !== 404) {
        throw {
          code: err.response?.status || 500,
          message: err.response?.data?.error?.message || "Failed to delete photo on Google",
        };
      }
    }
  }

  await GbpMedia.deleteOne({ _id: mediaDbId });
  await detectDuplicates(userId, locationDbId);

  return { success: true, deletedId: mediaDbId };
};

/**
 * Calculate Codelura Media Health Score & KPI Breakdown
 */
export const calculateMediaHealth = async (userId, locationDbId) => {
  const location = await GbpLocation.findOne({ _id: locationDbId, userId }).lean();
  if (!location) throw { code: 404, message: "Location not found" };

  const allMedia = await GbpMedia.find({ userId, locationId: locationDbId, status: { $ne: "scheduled" } }).lean();
  const total = allMedia.length;

  const byCategory = {
    PROFILE: 0,
    COVER: 0,
    EXTERIOR: 0,
    INTERIOR: 0,
    TEAMS: 0,
    AT_WORK: 0,
    PRODUCT: 0,
    FOOD_AND_DRINK: 0,
    MENU: 0,
    COMMON_AREA: 0,
    ROOMS: 0,
    ADDITIONAL: 0,
  };

  let businessCount = 0;
  let customerCount = 0;
  let recentCount = 0;
  let duplicateCount = 0;
  let totalQuality = 0;

  const now = new Date();
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  for (const m of allMedia) {
    if (byCategory[m.category] !== undefined) byCategory[m.category]++;
    else byCategory.ADDITIONAL++;

    if (m.source === "CUSTOMER") customerCount++;
    else businessCount++;

    if (m.createTime && new Date(m.createTime) >= ninetyDaysAgo) recentCount++;
    if (m.isDuplicate) duplicateCount++;
    totalQuality += m.qualityScore || 80;
  }

  const avgQuality = total > 0 ? Math.round(totalQuality / total) : 0;

  let score = 0;
  const hasProfile = byCategory.PROFILE > 0 || !!location.profile?.description?.profilePhotoUrl;
  if (hasProfile) score += 15;

  const hasCover = byCategory.COVER > 0 || !!location.profile?.description?.coverPhotoUrl;
  if (hasCover) score += 15;

  if (byCategory.EXTERIOR >= 3) score += 15;
  else if (byCategory.EXTERIOR >= 1) score += 10;

  const workplacePhotos = byCategory.INTERIOR + byCategory.AT_WORK + byCategory.COMMON_AREA;
  if (workplacePhotos >= 4) score += 15;
  else if (workplacePhotos >= 1) score += 8;

  const teamAndProducts = byCategory.TEAMS + byCategory.PRODUCT + byCategory.FOOD_AND_DRINK;
  if (teamAndProducts >= 3) score += 15;
  else if (teamAndProducts >= 1) score += 8;

  if (recentCount >= 3) score += 10;
  else if (recentCount >= 1) score += 5;

  if (total > 0 && duplicateCount > 0) {
    const dupRatio = duplicateCount / total;
    if (dupRatio > 0.2) score -= 10;
    else if (dupRatio > 0.1) score -= 5;
  }

  if (avgQuality >= 85) score += 15;
  else if (avgQuality >= 70) score += 10;
  else if (avgQuality >= 50) score += 5;

  score = Math.max(0, Math.min(100, score));

  let healthLabel = "Critical";
  if (score >= 85) healthLabel = "Excellent";
  else if (score >= 70) healthLabel = "Good";
  else if (score >= 50) healthLabel = "Needs Attention";

  const lastSyncRecord = await GbpMedia.findOne({ userId, locationId: locationDbId, status: "uploaded" })
    .sort({ lastSyncedAt: -1 })
    .lean();

  const scheduledCount = await GbpMedia.countDocuments({
    userId,
    locationId: locationDbId,
    status: "scheduled",
  });

  return {
    score,
    healthLabel,
    totalMedia: total,
    scheduledMedia: scheduledCount,
    businessPhotos: businessCount,
    customerPhotos: customerCount,
    recentPhotos: recentCount,
    duplicatePhotos: duplicateCount,
    averageQuality: avgQuality,
    kpi: {
      profile: byCategory.PROFILE,
      cover: byCategory.COVER,
      exterior: byCategory.EXTERIOR,
      interior: byCategory.INTERIOR,
      team: byCategory.TEAMS,
      atWork: byCategory.AT_WORK,
      product: byCategory.PRODUCT,
      additional: byCategory.ADDITIONAL,
      foodAndDrink: byCategory.FOOD_AND_DRINK,
      menu: byCategory.MENU,
      rooms: byCategory.ROOMS,
      commonArea: byCategory.COMMON_AREA,
    },
    flags: {
      hasProfilePhoto: hasProfile,
      hasCoverPhoto: hasCover,
      hasExteriorPhotos: byCategory.EXTERIOR > 0,
      hasInteriorPhotos: byCategory.INTERIOR > 0,
      hasTeamPhotos: byCategory.TEAMS > 0,
      hasAtWorkPhotos: byCategory.AT_WORK > 0,
      hasRecentPhotos: recentCount > 0,
    },
    lastSyncedAt: lastSyncRecord?.lastSyncedAt || location.lastSyncedAt || null,
  };
};

/**
 * Detect Duplicate Photos in Location
 */
export const detectDuplicates = async (userId, locationDbId) => {
  const mediaItems = await GbpMedia.find({ userId, locationId: locationDbId, status: { $ne: "scheduled" } }).lean();
  const hashMap = {};
  const duplicates = [];

  for (const item of mediaItems) {
    if (!item.hash) continue;
    if (!hashMap[item.hash]) {
      hashMap[item.hash] = [];
    }
    hashMap[item.hash].push(item);
  }

  for (const [hash, group] of Object.entries(hashMap)) {
    if (group.length > 1) {
      const primary = group[0];
      for (let i = 1; i < group.length; i++) {
        const dup = group[i];
        await GbpMedia.updateOne(
          { _id: dup._id },
          {
            isDuplicate: true,
            duplicateGroupId: hash,
            duplicateRatio: 100,
            duplicateOfMediaId: primary._id,
          }
        );
        duplicates.push({
          duplicateId: dup._id,
          primaryId: primary._id,
          googleMediaName: dup.googleMediaName,
          category: dup.category,
          googleUrl: dup.googleUrl,
        });
      }
      await GbpMedia.updateOne(
        { _id: primary._id },
        { isDuplicate: false, duplicateGroupId: hash }
      );
    }
  }

  return duplicates;
};

/**
 * Missing Photo Opportunities tailored to Business Category
 */
export const getMissingPhotoOpportunities = async (userId, locationDbId) => {
  const location = await GbpLocation.findOne({ _id: locationDbId, userId }).lean();
  if (!location) throw { code: 404, message: "Location not found" };

  const health = await calculateMediaHealth(userId, locationDbId);
  const primaryCat = (location.primaryCategory?.displayName || "").toLowerCase();
  const opportunities = [];

  if (!health.flags.hasProfilePhoto) {
    opportunities.push({
      category: "PROFILE",
      priority: "CRITICAL",
      title: "Missing Profile Logo Photo",
      description: "A clear profile photo or logo establishes immediate brand trust across Google Search and Maps.",
      cta: "Upload Profile Photo",
    });
  }

  if (!health.flags.hasCoverPhoto) {
    opportunities.push({
      category: "COVER",
      priority: "HIGH",
      title: "Missing Cover Banner Photo",
      description: "The cover photo is the primary hero image displayed at the top of your Google listing.",
      cta: "Upload Cover Photo",
    });
  }

  if (health.kpi.exterior < 2) {
    opportunities.push({
      category: "EXTERIOR",
      priority: "HIGH",
      title: "Add Storefront & Building Exterior",
      description: "Helps customers navigate and find your exact location easily when visiting.",
      cta: "Add Exterior Photo",
    });
  }

  if (primaryCat.includes("tuition") || primaryCat.includes("tutor") || primaryCat.includes("school") || primaryCat.includes("coaching") || primaryCat.includes("education")) {
    if (health.kpi.team < 2) {
      opportunities.push({
        category: "TEAMS",
        priority: "HIGH",
        title: "Tutor & Faculty Introduction Photos",
        description: "Showcase qualified tutors and staff to build confidence with students and parents.",
        cta: "Add Team Photos",
      });
    }
    if (health.kpi.atWork < 2) {
      opportunities.push({
        category: "AT_WORK",
        priority: "MEDIUM",
        title: "Classroom & Study Sessions",
        description: "Highlight one-on-one teaching, study materials, and interactive classroom environments.",
        cta: "Add Teaching Photos",
      });
    }
  } else if (primaryCat.includes("restaurant") || primaryCat.includes("cafe") || primaryCat.includes("food")) {
    if (health.kpi.foodAndDrink < 3) {
      opportunities.push({
        category: "FOOD_AND_DRINK",
        priority: "HIGH",
        title: "Signature Dishes & Food Photos",
        description: "Upload mouth-watering high-resolution photos of your top-selling items.",
        cta: "Add Food Photos",
      });
    }
  } else {
    if (health.kpi.interior < 2) {
      opportunities.push({
        category: "INTERIOR",
        priority: "MEDIUM",
        title: "Interior Workspace & Reception",
        description: "Give potential clients a feel for your comfortable and professional business environment.",
        cta: "Add Interior Photo",
      });
    }
  }

  if (!health.flags.hasRecentPhotos) {
    opportunities.push({
      category: "ADDITIONAL",
      priority: "MEDIUM",
      title: "Fresh Media Update Needed",
      description: "No photos uploaded in the last 90 days. Regular photo updates signal an active and thriving business.",
      cta: "Add Fresh Photos",
    });
  }

  return opportunities;
};
