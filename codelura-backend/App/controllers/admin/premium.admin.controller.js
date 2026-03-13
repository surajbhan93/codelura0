import PremiumService from "../../models/PremiumService.js";
import slugify from "slugify";

/**
 * ADMIN → Create Premium Plan
 */
export const createPremiumPlan = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      durationInMonths,
      features,
      bannerImage,
      galleryImages,
      metaTitle,
      metaDescription,
      ogImage,
    } = req.body;

    const plan = await PremiumService.create({
      title,
      slug: slugify(title, { lower: true }),
      description,
      price,
      durationInMonths,
      features,
      bannerImage,
      galleryImages,
      seo: {
        metaTitle,
        metaDescription,
        ogImage,
      },
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      plan,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADMIN → Get All Plans
 */
export const getAllPlansAdmin = async (req, res) => {
  const plans = await PremiumService.find().sort({ createdAt: -1 });
  res.json({ plans });
};