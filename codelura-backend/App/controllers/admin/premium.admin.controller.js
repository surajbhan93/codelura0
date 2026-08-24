import PremiumService from "../../models/PremiumService.js";
import slugify from "slugify";

export const createPremiumPlan = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,

      category,
      serviceType,

      price,
      discountedPrice,
      plans,
      durationInMonths,

      requiredFields,
      features,
      deliverables,

      turnaroundTime,
      revision,
      reviewMode,
      meeting,
      attachments,

      badge,
      level,

      bannerImage,
      galleryImages,

      faqs,
      processSteps,

      relatedServices,

      primaryCTA,
      secondaryCTA,

      allowCoupons,

      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      ogImage,

      isFeatured,
      sortOrder,
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and Description are required.",
      });
    }

    if (price && discountedPrice && discountedPrice >= price) {
      return res.status(400).json({
        success: false,
        message: "Discounted price must be less than original price.",
      });
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    const exists = await PremiumService.findOne({ slug });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Service already exists.",
      });
    }

    const service = await PremiumService.create({
      title,
      slug,

      shortDescription,
      description,

      category,
      serviceType,

      price,
      discountedPrice,
      plans,
      durationInMonths,

      requiredFields,
      features,
      deliverables,

      turnaroundTime,
      revision,
      reviewMode,
      meeting,
      attachments,

      badge,
      level,

      bannerImage,
      galleryImages,

      faqs,
      processSteps,

      relatedServices,

      primaryCTA,
      secondaryCTA,

      allowCoupons,

      seo: {
        metaTitle,
        metaDescription,
        keywords,
        canonicalUrl,
        ogImage,
      },

      isFeatured,
      sortOrder,

      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Premium Service created successfully.",
      service,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate, maxUsage } = req.body;

    console.log("Coupon body:", req.body); // exact data dekho

    const exists = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (exists)
      return res.status(400).json({ message: "Coupon already exists" });

    // Date format fix — "20-04-2026" → "2026-04-20"
    let parsedDate = null;
    if (expiryDate) {
      // Handle both "DD-MM-YYYY" and "YYYY-MM-DD" formats
      if (expiryDate.includes("-") && expiryDate.length === 10) {
        const parts = expiryDate.split("-");
        if (parts[0].length === 2) {
          // DD-MM-YYYY → YYYY-MM-DD
          parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        } else {
          // Already YYYY-MM-DD
          parsedDate = new Date(expiryDate);
        }
      } else {
        parsedDate = new Date(expiryDate);
      }

      // Invalid date check
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid expiry date format" });
      }
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      expiryDate: parsedDate,
      maxUsage: maxUsage ? Number(maxUsage) : null,
      isActive: true,
    });

    res.status(201).json({ success: true, message: "Coupon created", coupon });
  } catch (err) {
    console.error("Coupon error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
/**
 * ADMIN → Get All Plans
 */
export const getAllPlansAdmin = async (req, res) => {
  try {
    const services = await PremiumService.find()
      .populate("createdBy", "name email")
      .sort({ sortOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};