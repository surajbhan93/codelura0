import axios from "axios";
import { getValidAccessToken } from "./gbpOAuth.service.js";
import GbpGoogleAccount from "../../models/gbp/GbpGoogleAccount.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpSyncLog from "../../models/gbp/GbpSyncLog.js";
import { syncReviews } from "./gbpReview.service.js";
import { syncPosts } from "./gbpPost.service.js";
import { runProfileAudit } from "./gbpAudit.service.js";

const GBP_ACCOUNT_URL = "https://mybusinessaccountmanagement.googleapis.com/v1";
const GBP_INFO_URL = "https://mybusinessbusinessinformation.googleapis.com/v1";

export const syncAccountsAndLocations = async (userId) => {
  const log = await GbpSyncLog.create({ userId, syncType: "locations", status: "running" });

  try {
    const accessToken = await getValidAccessToken(userId);
    console.log("[GBP Sync] Fetching accounts from Google API...");

    // 1. Fetch accounts
    const accountsRes = await axios.get(`${GBP_ACCOUNT_URL}/accounts`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const accounts = accountsRes.data.accounts || [];
    console.log(`[GBP Sync] Found ${accounts.length} Google account(s)`);

    for (const account of accounts) {
      const accountId = account.name.split("/").pop();
      await GbpGoogleAccount.findOneAndUpdate(
        { userId, googleAccountId: accountId },
        { userId, googleAccountId: accountId, accountName: account.accountName, type: account.type, role: account.role, verificationState: account.verificationState, vettedState: account.vettedState, lastSyncedAt: new Date() },
        { upsert: true, new: true }
      );

      // 2. Fetch locations for each account
      try {
        console.log(`[GBP Sync] Fetching locations for account ${account.name}...`);
        let locations = [];
        try {
          const locRes = await axios.get(
            `${GBP_INFO_URL}/${account.name}/locations`,
            {
              params: { readMask: "name,title,phoneNumbers,categories,storefrontAddress,websiteUri,regularHours,specialHours,serviceArea,profile,openInfo,metadata,labels" },
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          locations = locRes.data.locations || [];
        } catch (firstErr) {
          console.warn("[GBP Sync] Location fetch with readMask failed, retrying without readMask:", firstErr.response?.data?.error?.message || firstErr.message);
          const locResFallback = await axios.get(
            `${GBP_INFO_URL}/${account.name}/locations`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          locations = locResFallback.data.locations || [];
        }

        console.log(`[GBP Sync] Found ${locations.length} location(s) for account ${account.name}`);

        for (const loc of locations) {
          const locId = loc.name.split("/").pop();
          const savedLoc = await GbpLocation.findOneAndUpdate(
            { userId, googleLocationId: locId },
            {
              userId,
              googleAccountId: accountId,
              googleLocationId: locId,
              locationName: loc.title || loc.name,
              // Save to BOTH new and legacy fields for backward compatibility
              phoneNumbers: loc.phoneNumbers,
              primaryPhone: loc.phoneNumbers?.primaryPhone || loc.primaryPhone,
              websiteUri: loc.websiteUri,
              primaryCategory: loc.categories?.primaryCategory,
              additionalCategories: loc.categories?.additionalCategories || [],
              storefrontAddress: loc.storefrontAddress,
              address: loc.storefrontAddress || loc.address,
              regularHours: loc.regularHours,
              specialHours: loc.specialHours,
              profile: loc.profile,
              serviceArea: loc.serviceArea,
              labels: loc.labels,
              latlng: loc.latlng,
              openInfo: loc.openInfo,
              metadata: loc.metadata,
              moreHours: loc.moreHours,
              serviceItems: loc.serviceItems,
              rawData: loc,
              lastSyncedAt: new Date(),
              syncStatus: "idle",
            },
            { upsert: true, new: true }
          );

          // 3. Auto-sync reviews, posts & calculate profile health audit for this location
          try {
            await syncReviews(userId, savedLoc._id.toString());
          } catch (revErr) {
            console.warn(`[GBP Sync] Reviews fetch notice for ${savedLoc.locationName}:`, revErr.response?.data?.error?.message || revErr.message);
          }

          try {
            await syncPosts(userId, savedLoc._id.toString());
          } catch (postErr) {
            console.warn(`[GBP Sync] Posts fetch notice for ${savedLoc.locationName}:`, postErr.message);
          }

          try {
            await runProfileAudit(userId, savedLoc._id.toString());
          } catch (auditErr) {
            console.warn(`[GBP Sync] Audit calculation notice for ${savedLoc.locationName}:`, auditErr.message);
          }
        }
      } catch (locErr) {
        console.error(`[GBP Sync Error] Failed to fetch locations for ${account.name}:`, locErr.response?.data?.error?.message || locErr.message);
        log.errors.push({ resource: account.name, message: locErr.response?.data?.error?.message || locErr.message });
      }
    }

    await GbpSyncLog.findByIdAndUpdate(log._id, { status: "success", completedAt: new Date() });
    return { success: true };
  } catch (err) {
    console.error("[GBP Sync Error] Account sync failed:", err.response?.data?.error?.message || err.message);
    await GbpSyncLog.findByIdAndUpdate(log._id, { status: "failed", completedAt: new Date(), errors: [{ resource: "sync", message: err.message }] });
    throw err;
  }
};

export const getUserLocations = async (userId) => {
  return GbpLocation.find({ userId, isActive: true }).sort({ isPrimary: -1, locationName: 1 });
};

export const getLocationById = async (userId, locationId) => {
  const loc = await GbpLocation.findOne({ _id: locationId, userId });
  if (!loc) throw { code: 404, message: "Location not found or access denied." };
  return loc;
};

export const getLocationFromGoogleAPI = async (userId, googleLocationId, googleAccountId) => {
  const accessToken = await getValidAccessToken(userId);
  const res = await axios.get(
    `${GBP_INFO_URL}/accounts/${googleAccountId}/locations/${googleLocationId}`,
    {
      params: { readMask: "name,title,phoneNumbers,categories,storefrontAddress,websiteUri,regularHours,specialHours,serviceArea,profile,openInfo,metadata,moreHours,serviceItems,latlng,labels" },
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return res.data;
};

export const setPrimaryLocation = async (userId, locationId) => {
  await GbpLocation.updateMany({ userId }, { isPrimary: false });
  await GbpLocation.findOneAndUpdate({ _id: locationId, userId }, { isPrimary: true });
};
