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

const GBP_API_BASE = "https://mybusiness.googleapis.com/v4";
const GBP_MEDIA_API_BASE = "https://mybusiness.googleapis.com/v4";

/**
 * Standardize Google Category Enum to Codelura Schema
 */
const normalizeCategory = (cat) => {
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
const getLocationContext = async (userId, locationDbId) => {
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

  console.log("[GBP Media Context] Debug Info:");
  console.log("  Location DB ID:", locationDbId);
  console.log("  Google Account ID:", rawAccountId);
  console.log("  Google Location ID:", rawLocationId);
  console.log("  Location Name:", location.locationName);

  return { location, rawAccountId, rawLocationId };
};

/**
 * Sync Google Media for a Location
 */
export const syncGoogleMedia = async (userId, locationDbId) => {
  console.log("[GBP Media Sync] === SYNC STARTED ===");
  console.log("[GBP Media Sync] User ID:", userId);
  console.log("[GBP Media Sync] Location DB ID:", locationDbId);

  let location, rawAccountId, rawLocationId, accessToken;

  try {
    // Step 1: Get location context
    const context = await getLocationContext(userId, locationDbId);
    location = context.location;
    rawAccountId = context.rawAccountId;
    rawLocationId = context.rawLocationId;
    console.log("[GBP Media Sync] ✓ Location context retrieved");

    // Step 2: Get OAuth token
    accessToken = await getValidAccessToken(userId);
    console.log("[GBP Media Sync] ✓ OAuth token retrieved");
  } catch (err) {
    console.error("[GBP Media Sync] Pre-flight check failed:", err);
    throw err;
  }

  console.log(`[GBP Media Sync] Syncing media for location ${rawLocationId} (Account: ${rawAccountId})`);

  let googleItems = [];
  let nextPageToken = null;

  try {
    do {
      // Google Business Profile Media API v4 (still active for media operations)
      const url = `${GBP_MEDIA_API_BASE}/accounts/${rawAccountId}/locations/${rawLocationId}/media`;
      console.log(`[GBP Media Sync] Fetching from: ${url}`);
      
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
      
      console.log(`[GBP Media Sync] Page fetched: ${mediaList.length} items, nextPageToken: ${nextPageToken ? 'yes' : 'no'}`);
    } while (nextPageToken);

    console.log(`[GBP Media Sync] Total found: ${googleItems.length} media items from Google API`);
  } catch (err) {
    console.error("[GBP Media Sync] === ERROR DETAILS ===");
    console.error("[GBP Media Sync] Status:", err.response?.status);
    console.error("[GBP Media Sync] Status Text:", err.response?.statusText);
    console.error("[GBP Media Sync] Response Data:", JSON.stringify(err.response?.data, null, 2));
    console.error("[GBP Media Sync] Error Message:", err.message);
    console.error("[GBP Media Sync] Request URL:", err.config?.url);
    
    if (err.response?.status === 404) {
      console.log("[GBP Media Sync] 404 - Location not found or no media, returning empty array");
      googleItems = [];
    } else {
      throw {
        code: err.response?.status || 500,
        message: err.response?.data?.error?.message || err.message || "Failed to fetch media from Google Business Profile API",
        googleError: err.response?.data,
        requestContext: {
          accountId: rawAccountId,
          locationId: rawLocationId,
          url: `${GBP_MEDIA_API_BASE}/accounts/${rawAccountId}/locations/${rawLocationId}/media`,
          statusCode: err.response?.status,
          statusText: err.response?.statusText,
        },
      };
    }
  }

  const syncedMediaIds = [];
  const now = new Date();

  for (const item of googleItems) {
    const googleMediaName = item.name; // accounts/.../locations/.../media/...
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

    // Calculate perceptual/simple hash if googleUrl exists
    const hash = crypto.createHash("md5").update(googleMediaName || googleUrl || "").digest("hex");

    // Default image quality analysis placeholder (refined by AI quality analyzer)
    const isHighRes = dimensions && dimensions.widthPixels >= 720 && dimensions.heightPixels >= 720;
    const qualityScore = isHighRes ? 90 : 75;
    const qualityStatus = qualityScore >= 80 ? "GOOD" : "NEEDS_IMPROVEMENT";

    const updated = await GbpMedia.findOneAndUpdate(
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

    syncedMediaIds.push(updated._id);

    // Update location profile/cover photo pointers
    if (category === "PROFILE" && googleUrl) {
      await GbpLocation.updateOne(
        { _id: location._id },
        { profilePhotoUrl: googleUrl }
      );
    }
    if (category === "COVER" && googleUrl) {
      await GbpLocation.updateOne(
        { _id: location._id },
        { coverPhotoUrl: googleUrl }
      );
    }
  }

  // Update duplicate statuses for this location
  await detectDuplicates(userId, location._id);

  return {
    syncedCount: googleItems.length,
    lastSyncedAt: now,
  };
};

/**
 * Get Media List with Filtering, Search & Pagination
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

  // Validate location ownership
  const location = await GbpLocation.findOne({ _id: locationDbId, userId }).lean();
  if (!location) throw { code: 404, message: "Location not found or access denied" };

  const filter = { userId, locationId: locationDbId };

  if (category && category !== "ALL") {
    filter.category = category.toUpperCase();
  }

  if (source && source !== "ALL") {
    filter.source = source.toUpperCase();
  }

  if (quality && quality !== "ALL") {
    filter.qualityStatus = quality.toUpperCase();
  }

  if (status && status !== "ALL") {
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
    mediaFormat = "PHOTO",
    sourceUrl,
    contentType = "image/jpeg",
  } = metadata;

  const normalizedCat = normalizeCategory(category);
  console.log(`[GBP Media Upload] Starting upload for ${location.locationName} (${normalizedCat})`);

  let createdGoogleItem = null;

  if (sourceUrl) {
    // Flow A: Upload via Public Source URL
    const createUrl = `${GBP_MEDIA_API_BASE}/accounts/${rawAccountId}/locations/${rawLocationId}/media`;
    console.log(`[GBP Media Upload] Creating media from sourceUrl: ${createUrl}`);
    
    const payload = {
      mediaFormat: mediaFormat.toUpperCase(),
      locationAssociation: { category: normalizedCat },
      sourceUrl,
      description: description || undefined,
    };

    const res = await axios.post(createUrl, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    createdGoogleItem = res.data;
    console.log(`[GBP Media Upload] Created from sourceUrl:`, createdGoogleItem?.name);
  } else if (fileBuffer) {
    // Flow B: Binary direct upload via startUpload
    const startUrl = `${GBP_MEDIA_API_BASE}/accounts/${rawAccountId}/locations/${rawLocationId}/media:startUpload`;
    console.log(`[GBP Media Upload] Step 1: StartUpload to ${startUrl}`);
    
    const startRes = await axios.post(startUrl, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const resourceUrl = startRes.data.resourceUrl;
    if (!resourceUrl) {
      console.error("[GBP Media Upload] startUpload response missing resourceUrl:", startRes.data);
      throw { 
        code: 500, 
        message: "Google did not return an upload resource URL. This may indicate API permissions issue or incorrect API version.",
        googleResponse: startRes.data,
      };
    }

    console.log(`[GBP Media Upload] Step 2: Uploading ${fileBuffer.length} bytes to ${resourceUrl}`);

    // Upload raw binary stream
    await axios.post(resourceUrl, fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "X-Goog-Upload-Protocol": "raw",
        "X-Goog-Upload-Content-Length": String(fileBuffer.length),
        Authorization: `Bearer ${accessToken}`,
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    console.log(`[GBP Media Upload] Step 3: Creating media record`);

    // Finalize media create
    const createUrl = `${GBP_MEDIA_API_BASE}/accounts/${rawAccountId}/locations/${rawLocationId}/media`;
    const createRes = await axios.post(createUrl, {
      mediaFormat: mediaFormat.toUpperCase(),
      locationAssociation: { category: normalizedCat },
      dataRef: {
        resourceName: resourceUrl,
      },
      description: description || undefined,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    createdGoogleItem = createRes.data;
    console.log(`[GBP Media Upload] Created:`, createdGoogleItem?.name);
  } else {
    throw { code: 400, message: "Either file data or sourceUrl is required" };
  }

  const hash = fileBuffer
    ? crypto.createHash("md5").update(fileBuffer).digest("hex")
    : crypto.createHash("md5").update(sourceUrl || "").digest("hex");

  const savedRecord = await GbpMedia.create({
    userId,
    locationId: location._id,
    googleLocationId: location.googleLocationId,
    googleAccountId: rawAccountId,
    googleMediaName: createdGoogleItem?.name || `local_${Date.now()}`,
    mediaFormat,
    category: normalizedCat,
    source: "BUSINESS",
    sourceUrl: sourceUrl || undefined,
    googleUrl: createdGoogleItem?.googleUrl || sourceUrl,
    thumbnailUrl: createdGoogleItem?.thumbnailUrl || createdGoogleItem?.googleUrl || sourceUrl,
    dimensions: createdGoogleItem?.dimensions,
    description,
    fileSize: fileBuffer ? fileBuffer.length : undefined,
    hash,
    qualityScore: 88,
    qualityStatus: "GOOD",
    uploadStatus: "uploaded",
    createTime: new Date(),
    lastSyncedAt: new Date(),
  });

  // If PROFILE or COVER, update GbpLocation pointer
  if (normalizedCat === "PROFILE" && savedRecord.googleUrl) {
    await GbpLocation.updateOne(
      { _id: location._id },
      { profilePhotoUrl: savedRecord.googleUrl }
    );
  }
  if (normalizedCat === "COVER" && savedRecord.googleUrl) {
    await GbpLocation.updateOne(
      { _id: location._id },
      { coverPhotoUrl: savedRecord.googleUrl }
    );
  }

  return savedRecord;
};

/**
 * Delete Media from Google Business Profile
 */
export const deleteGoogleMedia = async (userId, locationDbId, mediaDbId) => {
  const { location, rawAccountId, rawLocationId } = await getLocationContext(userId, locationDbId);
  const accessToken = await getValidAccessToken(userId);

  const mediaItem = await GbpMedia.findOne({ _id: mediaDbId, userId, locationId: locationDbId });
  if (!mediaItem) throw { code: 404, message: "Media record not found" };

  if (mediaItem.googleMediaName && !mediaItem.googleMediaName.startsWith("local_")) {
    try {
      const deleteUrl = `${GBP_API_BASE}/${mediaItem.googleMediaName}`;
      await axios.delete(deleteUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(`[GBP Media Delete] Deleted ${mediaItem.googleMediaName} from Google API`);
    } catch (err) {
      console.warn("[GBP Media Delete] Google API warning:", err.response?.data || err.message);
      // If 404 on Google, proceed to remove local record
      if (err.response?.status !== 404) {
        throw {
          code: err.response?.status || 500,
          message: err.response?.data?.error?.message || "Failed to delete photo on Google",
        };
      }
    }
  }

  await GbpMedia.deleteOne({ _id: mediaDbId });

  // Recalculate duplicates after deletion
  await detectDuplicates(userId, locationDbId);

  return { success: true, deletedId: mediaDbId };
};

/**
 * Calculate Codelura Media Health Score & KPI Breakdown
 */
export const calculateMediaHealth = async (userId, locationDbId) => {
  const location = await GbpLocation.findOne({ _id: locationDbId, userId }).lean();
  if (!location) throw { code: 404, message: "Location not found" };

  const allMedia = await GbpMedia.find({ userId, locationId: locationDbId }).lean();
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

  // Media Health Scoring Formula (0-100)
  let score = 0;

  // 1. Profile Photo (15 pts)
  const hasProfile = byCategory.PROFILE > 0 || !!location.profile?.description?.profilePhotoUrl;
  if (hasProfile) score += 15;

  // 2. Cover Photo (15 pts)
  const hasCover = byCategory.COVER > 0 || !!location.profile?.description?.coverPhotoUrl;
  if (hasCover) score += 15;

  // 3. Exterior & Location photos (15 pts)
  if (byCategory.EXTERIOR >= 3) score += 15;
  else if (byCategory.EXTERIOR >= 1) score += 10;

  // 4. Interior / Work / Environment (15 pts)
  const workplacePhotos = byCategory.INTERIOR + byCategory.AT_WORK + byCategory.COMMON_AREA;
  if (workplacePhotos >= 4) score += 15;
  else if (workplacePhotos >= 1) score += 8;

  // 5. Team / Service / Product photos (15 pts)
  const teamAndProducts = byCategory.TEAMS + byCategory.PRODUCT + byCategory.FOOD_AND_DRINK;
  if (teamAndProducts >= 3) score += 15;
  else if (teamAndProducts >= 1) score += 8;

  // 6. Freshness (10 pts)
  if (recentCount >= 3) score += 10;
  else if (recentCount >= 1) score += 5;

  // 7. Duplicate Penalty (up to -10 pts)
  if (total > 0 && duplicateCount > 0) {
    const dupRatio = duplicateCount / total;
    if (dupRatio > 0.2) score -= 10;
    else if (dupRatio > 0.1) score -= 5;
  }

  // 8. Quality Score component (15 pts)
  if (avgQuality >= 85) score += 15;
  else if (avgQuality >= 70) score += 10;
  else if (avgQuality >= 50) score += 5;

  score = Math.max(0, Math.min(100, score));

  let healthLabel = "Critical";
  if (score >= 85) healthLabel = "Excellent";
  else if (score >= 70) healthLabel = "Good";
  else if (score >= 50) healthLabel = "Needs Attention";

  // Check last synced
  const lastSyncRecord = await GbpMedia.findOne({ userId, locationId: locationDbId })
    .sort({ lastSyncedAt: -1 })
    .lean();

  return {
    score,
    healthLabel,
    totalMedia: total,
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
  const mediaItems = await GbpMedia.find({ userId, locationId: locationDbId }).lean();
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

  // Tutoring / Education context
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
