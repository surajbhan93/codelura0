import slugify from "slugify";
import PremiumService from "../../models/PremiumService.js";
import PremiumSubscription from "../../models/PremiumSubscription.js";
import Coupon from "../../models/Coupon.js";
import User from "../../models/User.js";

/* =====================================================
   ================= ADMIN CONTROLLERS =================
   ===================================================== */

/**
 * Admin → Create Premium Plan (Industry Level)
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
      faqs,
      processSteps,
      metaTitle,
      metaDescription,
      ogImage,
    } = req.body;
    const existing = await PremiumService.findOne({ title });
    if (existing)
      return res.status(400).json({ message: "Plan already exists" });

    const plan = await PremiumService.create({
      title,
      slug: slugify(title, { lower: true }),
      description,
      price,
      durationInMonths,
      features,
      bannerImage,
      galleryImages,
        faqs,
      processSteps,
      seo: {
        metaTitle,
        metaDescription,
        ogImage,
      },
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Premium plan created",
      plan,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Admin → Create Coupon
 */
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate, maxUsage } =
      req.body;

    const exists = await Coupon.findOne({ code });
    if (exists)
      return res.status(400).json({ message: "Coupon already exists" });

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      expiryDate,
      maxUsage,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created",
      coupon,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Admin → Approve Subscription
 */
export const approveSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await PremiumSubscription.findById(id).populate(
      "premiumService"
    );

    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });

    if (subscription.status === "approved")
      return res.status(400).json({ message: "Already approved" });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(
      endDate.getMonth() + subscription.premiumService.durationInMonths
    );

    subscription.status = "approved";
    subscription.startDate = startDate;
    subscription.endDate = endDate;

    await subscription.save();

    res.json({
      success: true,
      message: "Subscription approved",
      subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Admin → Get All Subscriptions
 */
export const getAllSubscriptions = async (req, res) => {
  try {
    const subs = await PremiumSubscription.find()
      .populate("user")
      .populate("premiumService")
      .sort({ createdAt: -1 });

    res.json({ success: true, subs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   ================= USER CONTROLLERS ==================
   ===================================================== */

/**
 * Public → Get All Premium Plans
 */
export const getAllPlans = async (req, res) => {
  try {
    const plans = await PremiumService.find({ isActive: true });
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Public → Get Plan By Slug (Detail Page)
 */
export const getPlanBySlug = async (req, res) => {
  try {
    const plan = await PremiumService.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!plan)
      return res.status(404).json({ message: "Plan not found" });

    res.json({ success: true, plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * User → Buy Subscription (Industry Level)
 */
export const buySubscription = async (req, res) => {
  try {
   const {
  serviceId,
  name,
  telegramUsername,
  mobile,
  email,
  note,
  transactionId,
  couponCode,
  referralCode,
} = req.body;

    if (!transactionId)
      return res.status(400).json({ message: "Transaction ID required" });

    const service = await PremiumService.findById(serviceId);
    if (!service)
      return res.status(404).json({ message: "Plan not found" });

    let finalAmount = service.price;
    let discountAmount = 0;
    let coupon = null;

    /* ===== COUPON APPLY ===== */
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode, isActive: true });

      if (!coupon)
        return res.status(400).json({ message: "Invalid coupon" });

      if (coupon.expiryDate && coupon.expiryDate < new Date())
        return res.status(400).json({ message: "Coupon expired" });

      if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage)
        return res.status(400).json({ message: "Coupon limit reached" });

      discountAmount =
        coupon.discountType === "percentage"
          ? (service.price * coupon.discountValue) / 100
          : coupon.discountValue;

      finalAmount -= discountAmount;
      coupon.usedCount += 1;
      await coupon.save();
    }

    /* ===== REFERRAL COMMISSION ===== */
    let referralCommission = 0;

    if (referralCode) {
      const refUser = await User.findOne({ referralCode });

      if (refUser && refUser._id.toString() !== req.user.id) {
        referralCommission = finalAmount * 0.1; // 10%
        refUser.walletBalance += referralCommission;
        await refUser.save();
      }
    }

    const subscription = await PremiumSubscription.create({
  user: req.user.id,
  premiumService: serviceId,

  name,
  telegramUsername,
  mobile,
  email,
  note,
  transactionId,

  coupon: coupon?._id,
  discountAmount,
  finalAmount,
  referralCommission,
  status: "pending",
});
    res.status(201).json({
      success: true,
      message: "Subscription request submitted",
      subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;

    const sub = await PremiumSubscription.findById(id);
    if (!sub)
      return res.status(404).json({ message: "Subscription not found" });

    sub.status = "rejected";
    sub.adminNote = adminNote;
    await sub.save();

    res.json({ success: true, message: "Subscription rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const suspendSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const sub = await PremiumSubscription.findById(id);
    if (!sub)
      return res.status(404).json({ message: "Subscription not found" });

    sub.status = "suspended";
    await sub.save();

    res.json({ success: true, message: "Subscription suspended" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const expireSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const sub = await PremiumSubscription.findById(id);
    if (!sub)
      return res.status(404).json({ message: "Subscription not found" });

    sub.status = "expired";
    sub.endDate = new Date();
    await sub.save();

    res.json({ success: true, message: "Subscription expired" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const extendSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { months } = req.body;

    const sub = await PremiumSubscription.findById(id);
    if (!sub)
      return res.status(404).json({ message: "Subscription not found" });

    if (!sub.endDate)
      return res.status(400).json({ message: "Subscription not active" });

    const newEndDate = new Date(sub.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + Number(months));

    sub.endDate = newEndDate;
    sub.status = "approved";

    await sub.save();

    res.json({
      success: true,
      message: `Extended by ${months} months`,
      sub,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPlanId } = req.body;

    const sub = await PremiumSubscription.findById(id);
    const plan = await PremiumService.findById(newPlanId);

    if (!sub || !plan)
      return res.status(404).json({ message: "Not found" });

    sub.premiumService = newPlanId;

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

    sub.endDate = endDate;
    sub.status = "approved";

    await sub.save();

    res.json({ success: true, message: "Plan changed", sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    await PremiumSubscription.findByIdAndDelete(id);

    res.json({ success: true, message: "Subscription deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};