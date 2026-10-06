import axios from "axios";
import { getValidAccessToken } from "./gbpOAuth.service.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpService from "../../models/gbp/GbpService.js";
import GbpServiceRecommendation from "../../models/gbp/GbpServiceRecommendation.js";
import GbpServiceActivityLog from "../../models/gbp/GbpServiceActivityLog.js";
import GbpSearchKeyword from "../../models/gbp/GbpSearchKeyword.js";
import GbpSyncLog from "../../models/gbp/GbpSyncLog.js";

const GBP_INFO_URL = "https://mybusinessbusinessinformation.googleapis.com/v1";
const CATEGORY_URL = "https://mybusinessbusinessinformation.googleapis.com/v1";

/**
 * Normalize a service name for deduplication comparison.
 */
export const normalizeServiceName = (name = "") =>
  name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();

/**
 * Build a standardized Google API error from an axios error response.
 * Never swallows errors into empty arrays.
 */
const buildGoogleApiError = (err, context = "Google API") => {
  const status = err?.response?.status;
  const googleMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message;
  const messages = {
    401: "OAuth token expired or missing. Please reconnect your Google Business Profile.",
    403: "Your Google account lacks permission to manage this location's services.",
    404: "This location was not found on Google. Please re-sync your locations.",
    400: `Google rejected the request: ${googleMsg}`,
    429: "Google API rate limit exceeded. Please wait a moment and try again.",
  };
  const message = messages[status] || `${context} failed: ${googleMsg || err?.message}`;
  const error = new Error(message);
  error.code = status || 500;
  error.googleError = true;
  error.raw = err?.response?.data;
  return error;
};

/**
 * Resolve and validate a location record from our DB.
 * Returns the full location document. Throws if not found or not owned by user.
 */
export const resolveLocation = async (userId, locationId) => {
  const loc = await GbpLocation.findOne({ _id: locationId, userId, isActive: true });
  if (!loc) {
    const err = new Error("Location not found or access denied.");
    err.code = 404;
    throw err;
  }
  return loc;
};

/**
 * STEP 1: Fetch the current service list from Google for a location.
 * Uses readMask=serviceItems to get the complete list.
 * Also fetches metadata to check canModifyServiceList.
 */
export const fetchServicesFromGoogle = async (userId, locationId) => {
  const loc = await resolveLocation(userId, locationId);
  const accessToken = await getValidAccessToken(userId);

  const googleResource = `locations/${loc.googleLocationId}`;

  let locationData;
  try {
    const res = await axios.get(`${GBP_INFO_URL}/${googleResource}`, {
      params: { readMask: "name,serviceItems,categories,metadata" },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    locationData = res.data;
  } catch (err) {
    throw buildGoogleApiError(err, "Fetch services from Google");
  }

  const serviceItems = locationData.serviceItems || [];
  const canModify = locationData.metadata?.canModifyServiceList !== false; // true by default if field not present

  // Upsert services into our database
  const upsertOps = serviceItems.map((item) => {
    const isStructured = !!item.structuredServiceItem;
    const serviceTypeId = isStructured ? item.structuredServiceItem?.serviceTypeId : null;
    const displayName = isStructured
      ? (item.structuredServiceItem?.displayName || serviceTypeId)
      : (item.freeFormServiceItem?.label?.displayName || "");
    const normalizedName = normalizeServiceName(displayName);
    const categoryName = resolveServiceCategoryName(item, locationData, loc);
    const description = item.freeFormServiceItem?.label?.description ||
                        item.freeFormServiceItem?.description ||
                        item.structuredServiceItem?.description ||
                        item.description || null;
    const price = extractPriceString(item);

    const filter = isStructured && serviceTypeId
      ? { locationId: loc._id, serviceTypeId }
      : { locationId: loc._id, normalizedName, serviceType: "FREE_FORM" };

    return {
      updateOne: {
        filter,
        update: {
          $set: {
            userId,
            locationId: loc._id,
            googleLocationId: loc.googleLocationId,
            googleAccountId: loc.googleAccountId,
            serviceType: isStructured ? "STRUCTURED" : "FREE_FORM",
            serviceTypeId: serviceTypeId || null,
            categoryId: isStructured ? item.structuredServiceItem?.serviceTypeId?.split(":")[1] : (item.freeFormServiceItem?.category || null),
            categoryName,
            displayName,
            description,
            price,
            normalizedName,
            isOffered: true,
            source: "GOOGLE_SYNC",
            googleSynced: true,
            lastSyncedAt: new Date(),
          },
        },
        upsert: true,
      },
    };
  });

  if (upsertOps.length > 0) {
    await GbpService.bulkWrite(upsertOps, { ordered: false });
  }

  // Mark any services we have in DB that are NOT in Google response as not offered
  const googleServiceTypeIds = serviceItems
    .filter((s) => s.structuredServiceItem?.serviceTypeId)
    .map((s) => s.structuredServiceItem.serviceTypeId);
  const googleFreeFormNames = serviceItems
    .filter((s) => s.freeFormServiceItem)
    .map((s) => normalizeServiceName(s.freeFormServiceItem?.label?.displayName || ""));

  if (googleServiceTypeIds.length > 0 || googleFreeFormNames.length > 0) {
    await GbpService.updateMany(
      {
        locationId: loc._id,
        isOffered: true,
        $or: [
          { serviceType: "STRUCTURED", serviceTypeId: { $nin: googleServiceTypeIds } },
          { serviceType: "FREE_FORM", normalizedName: { $nin: googleFreeFormNames } },
        ],
      },
      { $set: { isOffered: false, googleSynced: true, lastSyncedAt: new Date() } }
    );
  }

  // Update the location record's serviceItems cache
  await GbpLocation.findByIdAndUpdate(loc._id, {
    serviceItems,
    lastSyncedAt: new Date(),
    syncStatus: "idle",
  });

  const dbServices = await GbpService.find({ locationId: loc._id, isOffered: true });

  return {
    googleServices: serviceItems,
    dbServices,
    canModifyServiceList: canModify,
    locationName: loc.locationName,
    googleLocationId: loc.googleLocationId,
  };
};

/**
 * Extract category ID string (e.g. "gcid:software_company") from string or category object.
 */
export const extractCategoryId = (catObj) => {
  if (!catObj) return null;
  if (typeof catObj === "string") {
    return catObj.replace(/^categories\//, "");
  }
  if (catObj.categoryId) {
    return catObj.categoryId.replace(/^categories\//, "");
  }
  if (catObj.name) {
    return catObj.name.replace(/^categories\//, "");
  }
  return null;
};

/**
 * Extract full Google category resource name (e.g. "categories/gcid:software_company").
 */
export const extractFullCategoryName = (catObj) => {
  if (!catObj) return null;
  if (typeof catObj === "string") {
    return catObj.startsWith("categories/") ? catObj : `categories/${catObj}`;
  }
  if (catObj.name) {
    return catObj.name.startsWith("categories/") ? catObj.name : `categories/${catObj.name}`;
  }
  if (catObj.categoryId) {
    return catObj.categoryId.startsWith("categories/") ? catObj.categoryId : `categories/${catObj.categoryId}`;
  }
  return null;
};

/**
 * Extract formatted price string from a Google service item.
 */
export const extractPriceString = (item) => {
  const p = item.price || item.freeFormServiceItem?.price || item.structuredServiceItem?.price;
  if (!p) return null;
  if (p.free === true) return "Free";
  if (p.currencyCode || p.units || p.amount) {
    const symbol = p.currencyCode === "INR" ? "₹" : p.currencyCode === "USD" ? "$" : (p.currencyCode ? `${p.currencyCode} ` : "");
    const value = p.units !== undefined ? p.units : p.amount !== undefined ? p.amount : "";
    if (value) return `${symbol}${Number(value).toLocaleString()}`;
    return "Price Available";
  }
  if (typeof p === "string") return p;
  return null;
};

/**
 * Resolve the human-readable category display name for a service item from Google.
 * Matches freeFormServiceItem.category or structuredServiceItem.serviceTypeId against location categories.
 */
export const resolveServiceCategoryName = (item, locationData, locDoc) => {
  const itemCategory = item.freeFormServiceItem?.category || item.structuredServiceItem?.serviceTypeId || "";

  const primaryCat = locDoc?.primaryCategory || locationData?.categories?.primaryCategory;
  const additionalCats = locDoc?.additionalCategories || locationData?.categories?.additionalCategories || [];
  const allCats = [primaryCat, ...additionalCats].filter(Boolean);

  if (!itemCategory) {
    return primaryCat?.displayName || primaryCat?.name || "Primary Category";
  }

  const itemCatClean = itemCategory.replace(/^categories\//, "").toLowerCase().trim();

  // 1. First pass: exact categoryId or clean string matches
  for (const cat of allCats) {
    const catIdClean = (cat.categoryId || cat.name || "").replace(/^categories\//, "").toLowerCase().trim();
    if (catIdClean && (itemCatClean === catIdClean || itemCatClean.endsWith(`:${catIdClean}`))) {
      return cat.displayName || cat.name;
    }
  }

  // 2. Specific mapping for standard Google gcid categories
  if (itemCatClean.includes("tutoring_service")) {
    const tutorCat = allCats.find(c => (c.displayName || c.name || "").toLowerCase() === "tutor" || (c.displayName || c.name || "").toLowerCase().includes("tutoring service"));
    if (tutorCat) return tutorCat.displayName || tutorCat.name;
  }
  if (itemCatClean.includes("private_tutor")) {
    const privCat = allCats.find(c => (c.displayName || c.name || "").toLowerCase().includes("private tutor"));
    if (privCat) return privCat.displayName || privCat.name;
  }
  if (itemCatClean.includes("education_center") || itemCatClean.includes("education_centre")) {
    const eduCat = allCats.find(c => (c.displayName || c.name || "").toLowerCase().includes("education"));
    if (eduCat) return eduCat.displayName || eduCat.name;
  }

  // 3. Fallback name matching
  for (const cat of allCats) {
    const catNameClean = (cat.displayName || cat.name || "").toLowerCase().trim();
    const catNameSnake = catNameClean.replace(/[^a-z0-9]/g, "_");

    if (catNameSnake && (itemCatClean.includes(catNameSnake) || itemCatClean.endsWith(catNameSnake))) {
      return cat.displayName || cat.name;
    }
  }

  if (itemCategory.includes("gcid:")) {
    const rawName = itemCategory.split("gcid:")[1].split("/")[0].replace(/_/g, " ");
    return rawName.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return primaryCat?.displayName || primaryCat?.name || "Primary Category";
};

export const getExactCategoryResourceName = (catInput, locDoc = null) => {
  if (!catInput && !locDoc) return "categories/gcid:business_service";

  const allCats = [
    locDoc?.primaryCategory,
    ...(locDoc?.additionalCategories || []),
    locDoc?.rawData?.categories?.primaryCategory,
    ...(locDoc?.rawData?.categories?.additionalCategories || [])
  ].filter(Boolean);

  let searchStr = (
    typeof catInput === "string"
      ? catInput
      : catInput?.displayName || catInput?.name || catInput?.categoryId || ""
  ).toLowerCase().replace(/\(primary category\)/gi, "").replace(/\(additional category\)/gi, "").trim();

  // 1. Check location's stored categories for exact display name, name, or categoryId match
  for (const cat of allCats) {
    const dName = (cat.displayName || "").toLowerCase().trim();
    const cName = (cat.name || "").toLowerCase().trim();
    const cId = (cat.categoryId || "").toLowerCase().trim();

    if (searchStr && (searchStr === dName || searchStr === cName || searchStr === cId || searchStr.includes(dName) || dName.includes(searchStr))) {
      const realName = cat.name || cat.categoryId;
      if (realName) {
        return realName.startsWith("categories/") ? realName : `categories/${realName}`;
      }
    }
  }

  // 2. Keyword fallback for standard Google categories
  if (searchStr.includes("tutor") || searchStr.includes("tutoring")) {
    const tutorCat = allCats.find((c) => {
      const n = (c.displayName || c.name || "").toLowerCase();
      return n === "tutor" || n.includes("tutoring");
    });
    if (tutorCat?.name || tutorCat?.categoryId) {
      const real = tutorCat.name || tutorCat.categoryId;
      return real.startsWith("categories/") ? real : `categories/${real}`;
    }
  }

  if (searchStr.includes("education")) {
    const eduCat = allCats.find((c) => (c.displayName || c.name || "").toLowerCase().includes("education"));
    if (eduCat?.name || eduCat?.categoryId) {
      const real = eduCat.name || eduCat.categoryId;
      return real.startsWith("categories/") ? real : `categories/${real}`;
    }
  }

  // 3. Fallback to extractFullCategoryName
  return extractFullCategoryName(catInput) || extractFullCategoryName(locDoc?.primaryCategory) || "categories/gcid:business_service";
};

const CURATED_CATEGORY_SERVICES = {
  "software company": [
    { serviceTypeId: "gcid:enterprise_software_development", displayName: "Enterprise software development" },
    { serviceTypeId: "gcid:it_consulting", displayName: "IT consulting" },
    { serviceTypeId: "gcid:web_design_service", displayName: "Website Designer" },
    { serviceTypeId: "gcid:mobile_app_development", displayName: "Mobile App Developer" },
    { serviceTypeId: "gcid:digital_solution", displayName: "digital solution" },
    { serviceTypeId: "gcid:business_website_development", displayName: "Business Website Development" },
    { serviceTypeId: "gcid:portfolio_website_development", displayName: "Portfolio Website Development" },
    { serviceTypeId: "gcid:school_website_development", displayName: "School Website Development" },
    { serviceTypeId: "gcid:coaching_website_development", displayName: "Coaching Website Development" },
    { serviceTypeId: "gcid:hospital_website_development", displayName: "Hospital Website Development" },
    { serviceTypeId: "gcid:real_estate_website_development", displayName: "Real Estate Website Development" },
    { serviceTypeId: "gcid:ecommerce_website_development", displayName: "E-Commerce Website Development" },
    { serviceTypeId: "gcid:custom_web_app_development", displayName: "Custom Web Application Development" },
    { serviceTypeId: "gcid:android_app_development", displayName: "Android App Development" },
    { serviceTypeId: "gcid:ios_app_development", displayName: "iOS App Development" },
    { serviceTypeId: "gcid:react_native_app_development", displayName: "React Native App Development" },
    { serviceTypeId: "gcid:cross_platform_app_development", displayName: "Cross Platform App Development" },
    { serviceTypeId: "gcid:ai_chatbot_development", displayName: "AI Chatbot Development" },
    { serviceTypeId: "gcid:openai_integration", displayName: "OpenAI Integration" },
    { serviceTypeId: "gcid:business_automation", displayName: "Business Automation" },
    { serviceTypeId: "gcid:ai_customer_support_systems", displayName: "AI Customer Support Systems" },
    { serviceTypeId: "gcid:ai_powered_saas_development", displayName: "AI Powered SaaS Development" },
    { serviceTypeId: "gcid:shopify_store_development", displayName: "Shopify Store Development" },
    { serviceTypeId: "gcid:woocommerce_development", displayName: "WooCommerce Development" },
    { serviceTypeId: "gcid:multi_vendor_marketplace_development", displayName: "Multi Vendor Marketplace Development" },
    { serviceTypeId: "gcid:payment_gateway_integration", displayName: "Payment Gateway Integration" },
    { serviceTypeId: "gcid:seo_services", displayName: "SEO Services" },
    { serviceTypeId: "gcid:local_seo", displayName: "Local SEO" },
    { serviceTypeId: "gcid:google_business_profile_optimization", displayName: "Google Business Profile Optimization" },
    { serviceTypeId: "gcid:social_media_marketing", displayName: "Social Media Marketing" },
    { serviceTypeId: "gcid:erp_development", displayName: "ERP Development" },
    { serviceTypeId: "gcid:crm_development", displayName: "CRM Development" },
    { serviceTypeId: "gcid:inventory_management_software", displayName: "Inventory Management Software" },
    { serviceTypeId: "gcid:billing_software", displayName: "Billing Software" },
    { serviceTypeId: "gcid:saas_product_development", displayName: "SaaS Product Development" },
    { serviceTypeId: "gcid:vps_setup", displayName: "VPS Setup" },
    { serviceTypeId: "gcid:server_deployment", displayName: "Server Deployment" },
    { serviceTypeId: "gcid:docker_deployment", displayName: "Docker Deployment" },
    { serviceTypeId: "gcid:cicd_pipeline_setup", displayName: "CI/CD Pipeline Setup" }
  ],
  "web designer": [
    { serviceTypeId: "gcid:web_development", displayName: "Web development" },
    { serviceTypeId: "gcid:wordpress_website_development", displayName: "WordPress Website Development" },
    { serviceTypeId: "gcid:shopify_store_development_wd", displayName: "Shopify Store Development" },
    { serviceTypeId: "gcid:ecommerce_website_design", displayName: "E-commerce Website Design" },
    { serviceTypeId: "gcid:landing_page_design", displayName: "Landing Page Design" },
    { serviceTypeId: "gcid:website_redesign", displayName: "Website Redesign" },
    { serviceTypeId: "gcid:website_maintenance", displayName: "Website Maintenance" },
    { serviceTypeId: "gcid:website_speed_optimization", displayName: "Website Speed Optimization" }
  ],
  "website designer": [
    { serviceTypeId: "gcid:web_development", displayName: "Web development" },
    { serviceTypeId: "gcid:wordpress_website_development", displayName: "WordPress Website Development" },
    { serviceTypeId: "gcid:shopify_store_development_wd", displayName: "Shopify Store Development" },
    { serviceTypeId: "gcid:ecommerce_website_design", displayName: "E-commerce Website Design" },
    { serviceTypeId: "gcid:landing_page_design", displayName: "Landing Page Design" },
    { serviceTypeId: "gcid:website_redesign", displayName: "Website Redesign" },
    { serviceTypeId: "gcid:website_maintenance", displayName: "Website Maintenance" },
    { serviceTypeId: "gcid:website_speed_optimization", displayName: "Website Speed Optimization" }
  ],
  "e-commerce service": [
    { serviceTypeId: "gcid:wordpress_development_ec", displayName: "WordPress Development" },
    { serviceTypeId: "gcid:shopify_development_ec", displayName: "Shopify Development" },
    { serviceTypeId: "gcid:ecommerce_website_development_ec", displayName: "E-commerce Website Development" },
    { serviceTypeId: "gcid:website_maintenance_ec", displayName: "Website Maintenance" },
    { serviceTypeId: "gcid:landing_page_design_ec", displayName: "Landing Page Design" },
    { serviceTypeId: "gcid:woocommerce_development_ec", displayName: "WooCommerce Development" },
    { serviceTypeId: "gcid:website_speed_optimization_ec", displayName: "Website Speed Optimization" }
  ],
  "internet marketing service": [
    { serviceTypeId: "gcid:lead_generation", displayName: "Lead generation" },
    { serviceTypeId: "gcid:seo_ims", displayName: "Search Engine Optimization (SEO)" },
    { serviceTypeId: "gcid:gbp_optimization_ims", displayName: "Google Business Profile (GBP) Optimization" },
    { serviceTypeId: "gcid:google_ads_management", displayName: "Google Ads Management" },
    { serviceTypeId: "gcid:facebook_instagram_ads", displayName: "Facebook & Instagram Ads" },
    { serviceTypeId: "gcid:local_seo_ims", displayName: "Local SEO" },
    { serviceTypeId: "gcid:content_marketing", displayName: "Content Marketing" },
    { serviceTypeId: "gcid:online_reputation_management", displayName: "Online Reputation Management" },
    { serviceTypeId: "gcid:conversion_rate_optimization", displayName: "Conversion Rate Optimization (CRO)" }
  ],
  "private tutor": [
    { serviceTypeId: "gcid:home_tuition", displayName: "Home Tuition Services" },
    { serviceTypeId: "gcid:private_tutoring", displayName: "Private One-on-One Tutoring" },
    { serviceTypeId: "gcid:maths_physics_chemistry_tutoring", displayName: "Maths, Physics & Chemistry Coaching" },
    { serviceTypeId: "gcid:exam_preparation_tuition", displayName: "Board & Competitive Exam Prep" },
    { serviceTypeId: "gcid:primary_secondary_tutoring", displayName: "Classes 1st to 12th Tuition" }
  ],
  "tutor": [
    { serviceTypeId: "gcid:home_tuition", displayName: "Home Tuition for CBSE, ICSE & State Board" },
    { serviceTypeId: "gcid:private_tutoring", displayName: "Private One-on-One Tutoring" },
    { serviceTypeId: "gcid:maths_physics_chemistry_tutoring", displayName: "Maths, Physics & Chemistry Coaching" },
    { serviceTypeId: "gcid:exam_preparation_tuition", displayName: "Board & Competitive Exam Prep" },
    { serviceTypeId: "gcid:primary_secondary_tutoring", displayName: "Classes 1st to 12th Tuition" }
  ],
  "tuition": [
    { serviceTypeId: "gcid:home_tuition", displayName: "Home Tuition Services" },
    { serviceTypeId: "gcid:private_tutoring", displayName: "Personal Home Tutors" },
    { serviceTypeId: "gcid:academic_coaching", displayName: "Academic Subject Coaching" },
    { serviceTypeId: "gcid:online_tutoring", displayName: "Online & Offline Home Classes" }
  ],
  "education centre": [
    { serviceTypeId: "gcid:academic_coaching", displayName: "Academic Subject Classes" },
    { serviceTypeId: "gcid:competitive_exam_prep", displayName: "Competitive Exam Preparation" },
    { serviceTypeId: "gcid:home_tuition", displayName: "Home Tuition & Coaching" }
  ],
  "wine shop": [
    { serviceTypeId: "gcid:wine_selection", displayName: "Imported & Local Wine Selection" },
    { serviceTypeId: "gcid:beer_retail", displayName: "Chilled Beer & Craft Spirits" },
    { serviceTypeId: "gcid:beverage_retail", displayName: "Beverage & Liquor Retail" }
  ],
  "wine": [
    { serviceTypeId: "gcid:wine_selection", displayName: "Imported & Local Wine Selection" },
    { serviceTypeId: "gcid:beer_retail", displayName: "Chilled Beer & Craft Spirits" },
    { serviceTypeId: "gcid:beverage_retail", displayName: "Beverage & Liquor Retail" }
  ],
  "beer": [
    { serviceTypeId: "gcid:beer_retail", displayName: "Beer & Craft Spirits Retail" },
    { serviceTypeId: "gcid:beverage_retail", displayName: "Chilled Beverages & Liquor Retail" }
  ],
  "restaurant": [
    { serviceTypeId: "gcid:dine_in", displayName: "Dine-in Service" },
    { serviceTypeId: "gcid:takeout", displayName: "Takeout & Parcel" },
    { serviceTypeId: "gcid:food_delivery", displayName: "Home Food Delivery" },
    { serviceTypeId: "gcid:catering_service", displayName: "Event & Party Catering" }
  ]
};

/**
 * STEP 2: Fetch Google-supported services (service catalog) for this location's categories.
 * Uses the ServiceType API to get valid structured service types for the location's category.
 */
export const fetchSupportedServicesFromGoogle = async (userId, locationId) => {
  const loc = await resolveLocation(userId, locationId);
  const accessToken = await getValidAccessToken(userId);

  let primaryCategoryId = extractCategoryId(loc.primaryCategory) || extractCategoryId(loc.rawData?.categories?.primaryCategory);

  // If missing in DB record, fetch location details from Google API
  if (!primaryCategoryId) {
    try {
      const googleLocData = await getLocationFromGoogleAPI(userId, loc.googleLocationId, loc.googleAccountId);
      if (googleLocData.categories?.primaryCategory) {
        primaryCategoryId = extractCategoryId(googleLocData.categories.primaryCategory);
        await GbpLocation.findByIdAndUpdate(loc._id, {
          primaryCategory: googleLocData.categories.primaryCategory,
          additionalCategories: googleLocData.categories.additionalCategories || [],
        });
        loc.primaryCategory = googleLocData.categories.primaryCategory;
      }
    } catch (_) {}
  }

  const primaryCategoryName = loc.primaryCategory?.displayName || loc.rawData?.categories?.primaryCategory?.displayName || "Business Category";
  const additionalCategories = loc.additionalCategories || loc.rawData?.categories?.additionalCategories || [];

  // Build array of all location categories
  const categoriesList = [
    { categoryId: primaryCategoryId || "gcid:business_category", name: primaryCategoryName, isPrimary: true },
    ...additionalCategories.map((c) => ({
      categoryId: extractCategoryId(c) || "gcid:additional",
      name: c.displayName || c.name || "Additional Category",
      isPrimary: false,
    })),
  ];

  const supportedServicesGrouped = [];
  const flatServices = [];

  for (const catObj of categoriesList) {
    let catServices = [];

    if (catObj.categoryId && catObj.categoryId !== "gcid:additional") {
      try {
        const res = await axios.get(`${CATEGORY_URL}/categories/${catObj.categoryId}`, {
          params: { readMask: "name,displayName,serviceTypes", languageCode: "en" },
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        catServices = res.data.serviceTypes || [];
      } catch (err) {
        console.warn(`[GBP Services] Category endpoint notice for ${catObj.categoryId}:`, err?.response?.data?.error?.message || err?.message);
      }
    }

    // Fallback to curated catalog or dynamic category generator if Google endpoint returned 0 serviceTypes
    if (catServices.length === 0) {
      const catKey = catObj.name.toLowerCase().trim();
      const matchedKey = Object.keys(CURATED_CATEGORY_SERVICES).find((k) => catKey.includes(k) || k.includes(catKey));
      if (matchedKey) {
        catServices = CURATED_CATEGORY_SERVICES[matchedKey];
      } else {
        // Dynamically generate category-appropriate services for any industry!
        catServices = [
          { serviceTypeId: `gcid:${catObj.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_services`, displayName: `${catObj.name} Services` },
          { serviceTypeId: `gcid:${catObj.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_consultation`, displayName: `${catObj.name} Consultation & Support` },
          { serviceTypeId: `gcid:${catObj.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_custom`, displayName: `Custom ${catObj.name} Solutions` }
        ];
      }
    }

    if (catServices.length > 0) {
      supportedServicesGrouped.push({
        categoryName: catObj.name,
        categoryId: catObj.categoryId,
        isPrimary: catObj.isPrimary,
        services: catServices,
      });

      for (const st of catServices) {
        if (!flatServices.find((s) => s.serviceTypeId === st.serviceTypeId)) {
          flatServices.push({ ...st, categoryName: catObj.name, isPrimary: catObj.isPrimary });
        }
      }
    }
  }

  return {
    supportedServices: flatServices,
    supportedServicesGrouped,
    categoryId: primaryCategoryId || "gcid:business_category",
    categoryName: primaryCategoryName,
    additionalCategories,
  };
};

/**
 * STEP 3: Build the complete serviceItems array for a PATCH request to Google.
 * Takes the current Google state + approved changes and merges them.
 *
 * NEVER blindly replaces. Always starts from current Google state.
 */
export const buildMergedServiceItemsArray = (currentGoogleItems, additions, modifications, removals, defaultCategory = null, locDoc = null) => {
  let merged = [...(currentGoogleItems || [])];
  const defaultCatName = getExactCategoryResourceName(defaultCategory, locDoc);

  // Apply removals first
  for (const removal of (removals || [])) {
    if (removal.serviceTypeId) {
      merged = merged.filter(
        (s) => s.structuredServiceItem?.serviceTypeId !== removal.serviceTypeId
      );
    } else if (removal.displayName || removal.normalizedName) {
      const normRem = normalizeServiceName(removal.displayName || removal.normalizedName || "");
      merged = merged.filter(
        (s) => normalizeServiceName(s.freeFormServiceItem?.label?.displayName || "") !== normRem
      );
    }
  }

  // Apply modifications
  for (const mod of (modifications || [])) {
    if (mod.fromServiceTypeId && mod.toServiceTypeId) {
      merged = merged.map((s) => {
        if (s.structuredServiceItem?.serviceTypeId === mod.fromServiceTypeId) {
          return {
            structuredServiceItem: {
              serviceTypeId: mod.toServiceTypeId,
            },
          };
        }
        return s;
      });
    } else if (mod.fromNormalizedName || mod.fromDisplayName) {
      const normFrom = normalizeServiceName(mod.fromDisplayName || mod.fromNormalizedName || "");
      merged = merged.map((s) => {
        if (normalizeServiceName(s.freeFormServiceItem?.label?.displayName || "") === normFrom) {
          const cat = getExactCategoryResourceName(mod.categoryName || mod.category || mod.categoryId, locDoc) || s.freeFormServiceItem?.category || defaultCatName;
          const labelObj = { displayName: mod.toDisplayName || mod.displayName, languageCode: "en" };
          if (mod.description) labelObj.description = mod.description;
          return {
            freeFormServiceItem: {
              category: cat,
              label: labelObj,
            },
          };
        }
        return s;
      });
    }
  }

  // Apply additions
  for (const addition of (additions || [])) {
    const dispName = addition.displayName || addition.proposedServiceName;
    if (!dispName) continue;
    const normNew = normalizeServiceName(dispName);

    const exists = merged.some((s) => {
      if (s.structuredServiceItem?.serviceTypeId && addition.serviceTypeId && s.structuredServiceItem.serviceTypeId === addition.serviceTypeId) {
        return true;
      }
      return normalizeServiceName(s.freeFormServiceItem?.label?.displayName || "") === normNew;
    });

    if (!exists) {
      const cat = getExactCategoryResourceName(addition.categoryName || addition.category || addition.categoryId, locDoc) || defaultCatName;

      // Only pass structuredServiceItem if serviceTypeId is an official Google canonical ID
      const isOfficialStructured = addition.serviceTypeId && addition.serviceTypeId.startsWith("gcid:") && !addition.serviceTypeId.includes("_services") && !addition.serviceTypeId.includes("_custom") && !addition.serviceTypeId.includes("_consultation");

      if (isOfficialStructured) {
        merged.push({ structuredServiceItem: { serviceTypeId: addition.serviceTypeId } });
      } else {
        const labelObj = { displayName: dispName, languageCode: "en" };
        if (addition.description) labelObj.description = addition.description;
        merged.push({
          freeFormServiceItem: {
            category: cat,
            label: labelObj,
          },
        });
      }
    }
  }

  return sanitizeServiceItemsForGoogle(merged, defaultCategory, locDoc);
};

/**
 * Sanitizes serviceItems array to adhere strictly to Google Business Information API v1 payload schema.
 * Strips all read-only or unsupported fields before sending PATCH.
 */
export const sanitizeServiceItemsForGoogle = (serviceItems, defaultCategory = null, locDoc = null) => {
  const defaultCatName = getExactCategoryResourceName(defaultCategory, locDoc);

  return (serviceItems || [])
    .map((item) => {
      // 1. Structured Service Item
      if (item.structuredServiceItem?.serviceTypeId) {
        return {
          structuredServiceItem: {
            serviceTypeId: item.structuredServiceItem.serviceTypeId,
          },
        };
      }
      // 2. Free-Form Service Item
      if (item.freeFormServiceItem) {
        const cat = getExactCategoryResourceName(item.freeFormServiceItem.category, locDoc) || defaultCatName;
        const displayName = item.freeFormServiceItem.label?.displayName || item.freeFormServiceItem.displayName;
        if (!displayName) return null;
        const labelObj = {
          displayName,
          languageCode: item.freeFormServiceItem.label?.languageCode || "en",
        };
        if (item.freeFormServiceItem.label?.description || item.freeFormServiceItem.description) {
          labelObj.description = item.freeFormServiceItem.label?.description || item.freeFormServiceItem.description;
        }
        return {
          freeFormServiceItem: {
            category: cat,
            label: labelObj,
          },
        };
      }
      return null;
    })
    .filter(Boolean);
};

/**
 * STEP 4: Atomic service update flow.
 * 1. Re-fetch current Google state (prevent stale overwrites)
 * 2. Build complete merged array
 * 3. PATCH to Google
 * 4. Re-fetch Google response
 * 5. Sync DB
 * 6. Log activity
 */
export const applyServiceChangesToGoogle = async (userId, locationId, changes, trigger = "USER", recommendationId = null) => {
  const loc = await resolveLocation(userId, locationId);
  const accessToken = await getValidAccessToken(userId);

  const googleResource = `locations/${loc.googleLocationId}`;

  // 1. Re-fetch current Google state
  let currentGoogleData;
  try {
    const res = await axios.get(`${GBP_INFO_URL}/${googleResource}`, {
      params: { readMask: "name,serviceItems,categories,metadata" },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    currentGoogleData = res.data;

    // Update categories if present in fresh data
    if (currentGoogleData.categories?.primaryCategory) {
      loc.primaryCategory = currentGoogleData.categories.primaryCategory;
      await GbpLocation.findByIdAndUpdate(loc._id, {
        primaryCategory: currentGoogleData.categories.primaryCategory,
        additionalCategories: currentGoogleData.categories.additionalCategories || [],
      });
    }
  } catch (err) {
    throw buildGoogleApiError(err, "Re-fetch current Google state");
  }

  const currentServiceItems = currentGoogleData.serviceItems || [];
  const canModify = currentGoogleData.metadata?.canModifyServiceList !== false;

  if (!canModify) {
    const err = new Error("Google does not allow modifying the service list for this business category.");
    err.code = 403;
    throw err;
  }

  // 2. Build merged array with guaranteed category fallback
  let defaultCategory = loc.primaryCategory || currentGoogleData.categories?.primaryCategory;
  if (!defaultCategory && currentServiceItems.length > 0) {
    const sampleItem = currentServiceItems.find((s) => s.freeFormServiceItem?.category);
    if (sampleItem) defaultCategory = sampleItem.freeFormServiceItem.category;
  }

  const mergedItems = buildMergedServiceItemsArray(
    currentServiceItems,
    changes.additions || [],
    changes.modifications || [],
    changes.removals || [],
    defaultCategory,
    loc
  );

  // 3. PATCH to Google with automatic 400 error retry fallback
  let patchResponse;
  try {
    const patchRes = await axios.patch(
      `${GBP_INFO_URL}/${googleResource}`,
      { serviceItems: mergedItems },
      {
        params: { updateMask: "serviceItems" },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    patchResponse = patchRes.data;
  } catch (err) {
    const is400 = err?.response?.status === 400;
    const hasStructured = mergedItems.some((s) => s.structuredServiceItem);

    if (is400 && hasStructured) {
      console.warn("[GBP Services] 400 error on structured items, retrying with freeFormServiceItems...");
      const defaultCat = getExactCategoryResourceName(loc.primaryCategory, loc);
      const fallbackItems = mergedItems.map((s) => {
        if (s.structuredServiceItem) {
          const rawId = s.structuredServiceItem.serviceTypeId || "";
          const dispName = rawId.split("/")[0].replace(/^gcid:/, "").replace(/_/g, " ");
          return {
            freeFormServiceItem: {
              category: defaultCat,
              label: { displayName: dispName.replace(/\b\w/g, (c) => c.toUpperCase()), languageCode: "en" },
            },
          };
        }
        return s;
      });

      try {
        const retryRes = await axios.patch(
          `${GBP_INFO_URL}/${googleResource}`,
          { serviceItems: fallbackItems },
          {
            params: { updateMask: "serviceItems" },
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        patchResponse = retryRes.data;
      } catch (retryErr) {
        await GbpServiceActivityLog.create({
          userId,
          locationId: loc._id,
          googleLocationId: loc.googleLocationId,
          locationName: loc.locationName,
          activityType: "SERVICE_SYNC",
          trigger,
          description: `Google PATCH failed: ${retryErr?.response?.data?.error?.message || retryErr?.message}`,
          action: "ADD",
          googleSuccess: false,
          googleMessage: retryErr?.response?.data?.error?.message || retryErr?.message,
          recommendationId,
          metadata: { changes },
        });
        throw buildGoogleApiError(retryErr, "Apply service changes to Google");
      }
    } else {
      await GbpServiceActivityLog.create({
        userId,
        locationId: loc._id,
        googleLocationId: loc.googleLocationId,
        locationName: loc.locationName,
        activityType: "SERVICE_SYNC",
        trigger,
        description: `Google PATCH failed: ${err?.response?.data?.error?.message || err?.message}`,
        action: "ADD",
        googleSuccess: false,
        googleMessage: err?.response?.data?.error?.message || err?.message,
        recommendationId,
        metadata: { changes },
      });
      throw buildGoogleApiError(err, "Apply service changes to Google");
    }
  }

  // 4. Re-fetch to verify Google accepted changes
  let verifiedData;
  try {
    const verifyRes = await axios.get(`${GBP_INFO_URL}/${googleResource}`, {
      params: { readMask: "name,serviceItems" },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    verifiedData = verifyRes.data;
  } catch (err) {
    console.warn("[GBP Services] Could not verify after PATCH:", err.message);
    verifiedData = patchResponse; // Fall back to patch response
  }

  const verifiedItems = verifiedData.serviceItems || [];

  // 5. Sync DB with verified Google state
  // First, mark all existing DB services as not synced
  await GbpService.updateMany({ locationId: loc._id }, { $set: { googleSynced: false } });

  const upsertOps = verifiedItems.map((item) => {
    const isStructured = !!item.structuredServiceItem;
    const serviceTypeId = isStructured ? item.structuredServiceItem?.serviceTypeId : null;
    const displayName = isStructured
      ? (item.structuredServiceItem?.displayName || serviceTypeId)
      : (item.freeFormServiceItem?.label?.displayName || "");
    const normalizedName = normalizeServiceName(displayName);

    const filter = isStructured && serviceTypeId
      ? { locationId: loc._id, serviceTypeId }
      : { locationId: loc._id, normalizedName, serviceType: "FREE_FORM" };

    return {
      updateOne: {
        filter,
        update: {
          $set: {
            userId,
            locationId: loc._id,
            googleLocationId: loc.googleLocationId,
            googleAccountId: loc.googleAccountId,
            serviceType: isStructured ? "STRUCTURED" : "FREE_FORM",
            serviceTypeId: serviceTypeId || null,
            displayName,
            normalizedName,
            isOffered: true,
            googleSynced: true,
            lastSyncedAt: new Date(),
          },
        },
        upsert: true,
      },
    };
  });

  if (upsertOps.length > 0) {
    await GbpService.bulkWrite(upsertOps, { ordered: false });
  }

  // Mark DB services not in verified list as not offered
  const verifiedTypeIds = verifiedItems
    .filter((s) => s.structuredServiceItem?.serviceTypeId)
    .map((s) => s.structuredServiceItem.serviceTypeId);
  await GbpService.updateMany(
    {
      locationId: loc._id,
      serviceType: "STRUCTURED",
      serviceTypeId: { $nin: verifiedTypeIds },
    },
    { $set: { isOffered: false, googleSynced: true, lastSyncedAt: new Date() } }
  );

  // Update location serviceItems cache
  await GbpLocation.findByIdAndUpdate(loc._id, {
    serviceItems: verifiedItems,
    lastSyncedAt: new Date(),
  });

  // 6. Log activity
  const changesSummary = [
    ...(changes.additions || []).map((a) => `ADD: ${a.displayName || a.serviceTypeId}`),
    ...(changes.modifications || []).map((m) => `MODIFY: ${m.fromDisplayName} → ${m.toDisplayName}`),
    ...(changes.removals || []).map((r) => `REMOVE: ${r.displayName}`),
  ].join("; ");

  await GbpServiceActivityLog.create({
    userId,
    locationId: loc._id,
    googleLocationId: loc.googleLocationId,
    locationName: loc.locationName,
    activityType: trigger === "AI_AUTO" ? "AI_AUTO_OPTIMIZATION" : "SERVICE_SYNC",
    trigger,
    description: `Service changes applied: ${changesSummary}`,
    action: "ADD",
    googleSuccess: true,
    googleMessage: "Changes applied successfully",
    recommendationId,
    metadata: { changes, verifiedCount: verifiedItems.length },
  });

  const dbServices = await GbpService.find({ locationId: loc._id, isOffered: true });

  return {
    success: true,
    verifiedGoogleServices: verifiedItems,
    dbServices,
    changesSummary,
  };
};

/**
 * Get all services from our DB for a location (with optional Google re-sync).
 */
export const getLocationServices = async (userId, locationId, forceSync = false) => {
  const loc = await resolveLocation(userId, locationId);

  if (forceSync) {
    return fetchServicesFromGoogle(userId, locationId);
  }

  const dbServices = await GbpService.find({ locationId: loc._id, isOffered: true }).sort({ displayName: 1 });
  return {
    dbServices,
    locationName: loc.locationName,
    googleLocationId: loc.googleLocationId,
    lastSyncedAt: loc.lastSyncedAt,
  };
};

/**
 * Get pending recommendations for a location.
 */
export const getPendingRecommendations = async (userId, locationId) => {
  await resolveLocation(userId, locationId);
  return GbpServiceRecommendation.find({
    userId,
    locationId,
    status: "PENDING",
  }).sort({ confidence: -1, createdAt: -1 });
};

/**
 * Get recommendation history for a location.
 */
export const getRecommendationHistory = async (userId, locationId, limit = 50) => {
  await resolveLocation(userId, locationId);
  return GbpServiceRecommendation.find({ userId, locationId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Get activity logs for a location.
 */
export const getActivityLogs = async (userId, locationId, limit = 100) => {
  await resolveLocation(userId, locationId);
  return GbpServiceActivityLog.find({ userId, locationId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Approve a single recommendation and apply to Google.
 */
export const approveRecommendation = async (userId, locationId, recommendationId) => {
  const rec = await GbpServiceRecommendation.findOne({ _id: recommendationId, userId, locationId, status: "PENDING" });
  if (!rec) {
    const err = new Error("Recommendation not found or already processed.");
    err.code = 404;
    throw err;
  }

  // Mark as approved
  rec.status = "APPROVED";
  rec.reviewedAt = new Date();
  await rec.save();

  // Build changes object
  const changes = { additions: [], modifications: [], removals: [] };

  if (rec.action === "ADD") {
    changes.additions.push({
      serviceTypeId: rec.proposedServiceTypeId || null,
      displayName: rec.proposedServiceName,
      categoryId: rec.categoryId || null,
    });
  } else if (rec.action === "MODIFY") {
    changes.modifications.push({
      fromServiceTypeId: rec.existingServiceTypeId || null,
      toServiceTypeId: rec.proposedServiceTypeId || null,
      fromDisplayName: rec.existingServiceName,
      toDisplayName: rec.proposedServiceName,
      fromNormalizedName: normalizeServiceName(rec.existingServiceName || ""),
      toNormalizedName: normalizeServiceName(rec.proposedServiceName),
      toDisplayName: rec.proposedServiceName,
    });
  } else if (rec.action === "REMOVE") {
    changes.removals.push({
      serviceTypeId: rec.existingServiceTypeId || null,
      displayName: rec.existingServiceName,
      normalizedName: normalizeServiceName(rec.existingServiceName || ""),
    });
  }

  try {
    const result = await applyServiceChangesToGoogle(userId, locationId, changes, "USER", rec._id);

    rec.status = "APPLIED";
    rec.appliedAt = new Date();
    rec.googleResult = { success: true, message: "Applied successfully" };
    await rec.save();

    // Log the recommendation approval
    await GbpServiceActivityLog.create({
      userId,
      locationId,
      locationName: result.dbServices?.[0]?.locationId?.locationName,
      activityType: "RECOMMENDATION_APPROVED",
      trigger: "USER",
      description: `Approved ${rec.action} recommendation: ${rec.proposedServiceName}`,
      serviceName: rec.proposedServiceName,
      serviceTypeId: rec.proposedServiceTypeId,
      action: rec.action,
      aiConfidence: rec.confidence,
      googleSuccess: true,
      recommendationId: rec._id,
    });

    return result;
  } catch (err) {
    rec.status = "FAILED";
    rec.googleResult = { success: false, message: err.message };
    await rec.save();
    throw err;
  }
};

/**
 * Reject a recommendation.
 */
export const rejectRecommendation = async (userId, locationId, recommendationId) => {
  const rec = await GbpServiceRecommendation.findOne({ _id: recommendationId, userId, locationId, status: "PENDING" });
  if (!rec) {
    const err = new Error("Recommendation not found or already processed.");
    err.code = 404;
    throw err;
  }

  rec.status = "REJECTED";
  rec.reviewedAt = new Date();
  await rec.save();

  await GbpServiceActivityLog.create({
    userId,
    locationId,
    activityType: "RECOMMENDATION_REJECTED",
    trigger: "USER",
    description: `Rejected ${rec.action} recommendation: ${rec.proposedServiceName}`,
    serviceName: rec.proposedServiceName,
    action: rec.action,
    aiConfidence: rec.confidence,
    recommendationId: rec._id,
  });

  return rec;
};

/**
 * Approve and apply multiple recommendations at once.
 * Uses atomic flow: fetch → merge → patch → verify.
 */
export const applyBulkApprovals = async (userId, locationId, recommendationIds) => {
  const recs = await GbpServiceRecommendation.find({
    _id: { $in: recommendationIds },
    userId,
    locationId,
    status: { $in: ["PENDING", "APPROVED"] },
  });

  if (!recs.length) {
    const err = new Error("No valid pending recommendations found.");
    err.code = 404;
    throw err;
  }

  // Mark all as approved
  await GbpServiceRecommendation.updateMany(
    { _id: { $in: recs.map((r) => r._id) } },
    { $set: { status: "APPROVED", reviewedAt: new Date() } }
  );

  // Build consolidated changes
  const changes = { additions: [], modifications: [], removals: [] };
  for (const rec of recs) {
    if (rec.action === "ADD") {
      changes.additions.push({
        serviceTypeId: rec.proposedServiceTypeId || null,
        displayName: rec.proposedServiceName,
        categoryId: rec.categoryId || null,
      });
    } else if (rec.action === "MODIFY") {
      changes.modifications.push({
        fromServiceTypeId: rec.existingServiceTypeId || null,
        toServiceTypeId: rec.proposedServiceTypeId || null,
        fromDisplayName: rec.existingServiceName,
        toDisplayName: rec.proposedServiceName,
        fromNormalizedName: normalizeServiceName(rec.existingServiceName || ""),
        toDisplayName: rec.proposedServiceName,
      });
    } else if (rec.action === "REMOVE") {
      changes.removals.push({
        serviceTypeId: rec.existingServiceTypeId || null,
        displayName: rec.existingServiceName,
        normalizedName: normalizeServiceName(rec.existingServiceName || ""),
      });
    }
  }

  try {
    const result = await applyServiceChangesToGoogle(userId, locationId, changes, "USER");

    // Mark all as applied
    await GbpServiceRecommendation.updateMany(
      { _id: { $in: recs.map((r) => r._id) } },
      { $set: { status: "APPLIED", appliedAt: new Date(), "googleResult.success": true } }
    );

    await GbpServiceActivityLog.create({
      userId,
      locationId,
      activityType: "BULK_APPLY",
      trigger: "USER",
      description: `Bulk applied ${recs.length} recommendations`,
      googleSuccess: true,
      metadata: { recommendationIds, changes },
    });

    return result;
  } catch (err) {
    await GbpServiceRecommendation.updateMany(
      { _id: { $in: recs.map((r) => r._id) } },
      { $set: { status: "FAILED", "googleResult.success": false, "googleResult.message": err.message } }
    );
    throw err;
  }
};

/**
 * Manually add a service (bypasses AI - goes directly to Google).
 */
export const manualAddService = async (userId, locationId, serviceData) => {
  const changes = {
    additions: [{
      serviceTypeId: serviceData.serviceTypeId || null,
      displayName: serviceData.displayName,
      categoryId: serviceData.categoryId || null,
    }],
    modifications: [],
    removals: [],
  };

  const result = await applyServiceChangesToGoogle(userId, locationId, changes, "USER");

  await GbpServiceActivityLog.create({
    userId,
    locationId,
    activityType: "SERVICE_ADD",
    trigger: "USER",
    description: `Manually added service: ${serviceData.displayName}`,
    serviceName: serviceData.displayName,
    serviceTypeId: serviceData.serviceTypeId,
    action: "ADD",
    googleSuccess: true,
  });

  return result;
};

/**
 * Manually remove a service.
 */
export const manualRemoveService = async (userId, locationId, serviceData) => {
  const changes = {
    additions: [],
    modifications: [],
    removals: [{
      serviceTypeId: serviceData.serviceTypeId || null,
      displayName: serviceData.displayName,
      normalizedName: normalizeServiceName(serviceData.displayName || ""),
    }],
  };

  const result = await applyServiceChangesToGoogle(userId, locationId, changes, "USER");

  await GbpServiceActivityLog.create({
    userId,
    locationId,
    activityType: "SERVICE_REMOVE",
    trigger: "USER",
    description: `Manually removed service: ${serviceData.displayName}`,
    serviceName: serviceData.displayName,
    serviceTypeId: serviceData.serviceTypeId,
    action: "REMOVE",
    googleSuccess: true,
  });

  return result;
};

/**
 * Calculate AI service health score for a location.
 * Based on number of services, Google support status, coverage vs supported catalog.
 */
export const calculateServiceHealth = async (userId, locationId) => {
  const loc = await resolveLocation(userId, locationId);
  const dbServices = await GbpService.find({ locationId: loc._id, isOffered: true });
  const pendingRecs = await GbpServiceRecommendation.find({ locationId: loc._id, status: "PENDING" });

  const serviceCount = dbServices.length;
  let score = 0;

  // Base score from service count
  if (serviceCount === 0) score = 0;
  else if (serviceCount < 3) score = 30;
  else if (serviceCount < 6) score = 55;
  else if (serviceCount < 10) score = 75;
  else score = 90;

  // Bonus for structured (Google-recognized) services
  const structuredCount = dbServices.filter((s) => s.serviceType === "STRUCTURED").length;
  if (structuredCount > 0) score = Math.min(100, score + 5);

  // Penalty for pending recommendations (means services need attention)
  if (pendingRecs.length > 0) score = Math.max(0, score - Math.min(10, pendingRecs.length * 2));

  return {
    score: Math.round(score),
    serviceCount,
    structuredCount,
    freeFormCount: serviceCount - structuredCount,
    pendingRecommendations: pendingRecs.length,
  };
};
