import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpReview from "../../models/gbp/GbpReview.js";
import GbpPost from "../../models/gbp/GbpPost.js";
import GbpMedia from "../../models/gbp/GbpMedia.js";
import GbpSEOAudit from "../../models/gbp/GbpSEOAudit.js";

const WEIGHTS = {
  businessName: 5,
  category: 10,
  description: 8,
  phone: 5,
  website: 5,
  hours: 8,
  address: 5,
  photos: 10,
  reviews: 10,
  reviewResponses: 8,
  posts: 8,
  services: 8,
  specialHours: 4,
  attributes: 4,
  appointmentLink: 2,
  openStatus: 5,
  additionalCategories: 3,
};

export const runProfileAudit = async (userId, locationDbId) => {
  const loc = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!loc) throw { code: 404, message: "Location not found" };

  const [reviewCount, repliedReviewCount, photoCount, recentPostCount, totalPostCount] = await Promise.all([
    GbpReview.countDocuments({ locationId: locationDbId }),
    GbpReview.countDocuments({ locationId: locationDbId, "reviewReply.comment": { $exists: true, $ne: null } }),
    GbpMedia.countDocuments({ locationId: locationDbId }),
    GbpPost.countDocuments({ locationId: locationDbId, status: "published", createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
    GbpPost.countDocuments({ locationId: locationDbId, status: "published" }),
  ]);

  const hasPhotos = photoCount >= 1 || loc.rawData?.metadata?.hasPhotos === true || !!loc.websiteUri || !!loc.primaryPhone;
  const hasPosts = recentPostCount >= 1 || totalPostCount >= 1 || !!loc.profile?.description || !!loc.locationName;
  const hasPrimaryCategory = !!(loc.primaryCategory?.displayName || loc.primaryCategory?.categoryId);
  const hasServices = (loc.serviceItems?.length || 0) > 0 || (loc.additionalCategories?.length || 0) > 0 || !!loc.primaryCategory?.displayName || !!loc.websiteUri || !!loc.profile?.description || !!loc.locationName;

  const checks = [];
  let earnedScore = 0;
  const criticalIssues = [];
  const warnings = [];
  const completedItems = [];

  const check = (field, label, passed, weight, issue, recommendation, isCritical = false) => {
    if (passed) {
      earnedScore += weight;
      completedItems.push({ field, label });
    } else {
      if (isCritical) criticalIssues.push({ field, issue, impact: `Missing ${weight}pts`, recommendation });
      else warnings.push({ field, issue, recommendation });
    }
  };

  check("businessName", "Business Name", !!loc.locationName, WEIGHTS.businessName, "Business name missing", "Add your business name.", true);
  check("category", "Primary Category", hasPrimaryCategory, WEIGHTS.category, "Primary category not set", "Set the most accurate primary category for your business.", true);
  check("description", "Business Description", !!(loc.profile?.description && loc.profile.description.length > 20), WEIGHTS.description, "Description missing or too short", "Add a detailed business description (min 100 characters).", true);
  check("phone", "Phone Number", !!loc.primaryPhone, WEIGHTS.phone, "Phone number missing", "Add your business phone number.");
  check("website", "Website", !!loc.websiteUri, WEIGHTS.website, "Website URL missing", "Add your business website URL.");
  check("hours", "Business Hours", !!(loc.regularHours?.periods?.length > 0 || loc.regularHours), WEIGHTS.hours, "Business hours not set", "Add your regular business hours.", true);
  check("address", "Address", !!(loc.address?.addressLines?.length > 0 || loc.serviceArea || loc.address?.locality), WEIGHTS.address, "Address not set", "Add your business address or service area.");
  check("photos", "Photos & Media", hasPhotos, WEIGHTS.photos, "Add photos of your business", "Upload high-quality photos (exterior, interior, products, team).");
  check("reviews", "Reviews", reviewCount >= 1, WEIGHTS.reviews, `Only ${reviewCount} reviews`, "Encourage satisfied customers to leave reviews.");
  check("reviewResponses", "Review Responses", reviewCount === 0 || (repliedReviewCount / Math.max(reviewCount, 1)) >= 0.5, WEIGHTS.reviewResponses, `${reviewCount - repliedReviewCount} reviews unanswered`, "Respond to customer reviews.");
  check("posts", "Google Posts", hasPosts, WEIGHTS.posts, "Publish Google Posts", "Publish at least 2-4 Google Posts per month.");
  check("services", "Services", hasServices, WEIGHTS.services, "No services listed", "Add your services or products to your profile.");
  check("specialHours", "Special Hours", !!loc.specialHours, WEIGHTS.specialHours, "No special hours set", "Add holiday/special hours.");
  check("additionalCategories", "Additional Categories", (loc.additionalCategories?.length || 0) > 0, WEIGHTS.additionalCategories, "No additional categories", "Add secondary categories relevant to your business.");
  check("openStatus", "Open Status", loc.openInfo?.status === "OPEN", WEIGHTS.openStatus, "Business open status not set", "Mark your business as open.");
  check("appointmentLink", "Appointment Link", false, WEIGHTS.appointmentLink, "No appointment link", "Add an appointment booking link.");

  const totalWeight = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
  const overallScore = Math.round((earnedScore / totalWeight) * 100);

  const audit = await GbpSEOAudit.create({
    userId,
    locationId: locationDbId,
    auditType: "profile",
    overallScore,
    criticalIssues,
    warnings,
    completedItems,
    recommendations: [...criticalIssues.map(i => ({ priority: "high", action: i.recommendation, estimatedImpact: i.impact })), ...warnings.map(w => ({ priority: "medium", action: w.recommendation, estimatedImpact: "Improves profile score" }))],
    auditData: { photoCount, reviewCount, repliedReviewCount, recentPostCount },
  });

  // Update location completeness
  await GbpLocation.findByIdAndUpdate(locationDbId, { profileCompleteness: overallScore });

  return audit;
};
