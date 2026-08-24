// import slugify from "slugify";
// import PremiumService from "../../models/PremiumService.js";
// import PremiumSubscription from "../../models/PremiumSubscription.js";
// import Coupon from "../../models/Coupon.js";
// import User from "../../models/User.js";

// /* =====================================================
//    ================= ADMIN CONTROLLERS =================
//    ===================================================== */

// /**
//  * Admin → Create Premium Plan (Industry Level)
//  */
// export const createPremiumPlan = async (req, res) => {
//   try {
//   const {
//       title,
//       description,
//       price,
//        discountedPrice,    // 👈 add karo
//       durationInMonths,
//       features,
//       bannerImage,
//       galleryImages,
//       faqs,
//       processSteps,
//       metaTitle,
//       metaDescription,
//       ogImage,
//     } = req.body;
//     const existing = await PremiumService.findOne({ title });
//     if (existing)
//       return res.status(400).json({ message: "Plan already exists" });

//     const plan = await PremiumService.create({
//       title,
//       slug: slugify(title, { lower: true }),
//       description,
//       price,
//        discountedPrice,    // 👈 add karo
//       durationInMonths,
//       features,
//       bannerImage,
//       galleryImages,
//         faqs,
//       processSteps,
//       seo: {
//         metaTitle,
//         metaDescription,
//         ogImage,
//       },
//       createdBy: req.user.id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Premium plan created",
//       plan,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * Admin → Create Coupon
//  */
// export const createCoupon = async (req, res) => {
//   try {
//     const { code, discountType, discountValue, expiryDate, maxUsage } =
//       req.body;

//     const exists = await Coupon.findOne({ code });
//     if (exists)
//       return res.status(400).json({ message: "Coupon already exists" });

//     const coupon = await Coupon.create({
//       code,
//       discountType,
//       discountValue,
//       expiryDate,
//       maxUsage,
//       isActive: true,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Coupon created",
//       coupon,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * User → Apply Coupon (validate + return discount amount)
//  */
// export const applyCoupon = async (req, res) => {
//   try {
//     const { code, serviceId } = req.body;

//     const coupon = await Coupon.findOne({ 
//       code: code.toUpperCase().trim(), 
//       isActive: true 
//     });

//     if (!coupon)
//       return res.status(400).json({ message: "Invalid coupon" });

//     if (coupon.expiryDate && coupon.expiryDate < new Date())
//       return res.status(400).json({ message: "Coupon expired" });

//     if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage)
//       return res.status(400).json({ message: "Coupon usage limit reached" });

//     // Service ka price lo
//     const service = await PremiumService.findById(serviceId);
//     if (!service)
//       return res.status(404).json({ message: "Plan not found" });

//     // Base price — discountedPrice ho toh wahi
//     const basePrice = service.discountedPrice ?? service.price;

//     const discountAmount =
//       coupon.discountType === "percentage"
//         ? Math.round((basePrice * coupon.discountValue) / 100)
//         : coupon.discountValue;

//     const finalAmount = Math.max(0, basePrice - discountAmount);

//     res.json({
//       success: true,
//       discountAmount,
//       finalAmount,
//       coupon: {
//         code: coupon.code,
//         discountType: coupon.discountType,
//         discountValue: coupon.discountValue,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// /**
//  * Admin → Approve Subscription
//  */
// export const approveSubscription = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const subscription = await PremiumSubscription.findById(id).populate(
//       "premiumService"
//     );

//     if (!subscription)
//       return res.status(404).json({ message: "Subscription not found" });

//     if (subscription.status === "approved")
//       return res.status(400).json({ message: "Already approved" });

//     const startDate = new Date();
//     const endDate = new Date();
//     endDate.setMonth(
//       endDate.getMonth() + subscription.premiumService.durationInMonths
//     );

//     subscription.status = "approved";
//     subscription.startDate = startDate;
//     subscription.endDate = endDate;

//     await subscription.save();

//     res.json({
//       success: true,
//       message: "Subscription approved",
//       subscription,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * Admin → Get All Subscriptions
//  */
// export const getAllSubscriptions = async (req, res) => {
//   try {
//     const subs = await PremiumSubscription.find()
//       .populate("user")
//       .populate("premiumService")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, subs });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =====================================================
//    ================= USER CONTROLLERS ==================
//    ===================================================== */

// /**
//  * Public → Get All Premium Plans
//  */
// export const getAllPlans = async (req, res) => {
//   try {
//     const plans = await PremiumService.find({ isActive: true });
//     res.json({ success: true, plans });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * Public → Get Plan By Slug (Detail Page)
//  */
// export const getPlanBySlug = async (req, res) => {
//   try {
//     const plan = await PremiumService.findOne({
//       slug: req.params.slug,
//       isActive: true,
//     });

//     if (!plan)
//       return res.status(404).json({ message: "Plan not found" });

//     res.json({ success: true, plan });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /**
//  * User → Buy Subscription (Industry Level)
//  */
// export const buySubscription = async (req, res) => {
//   try {
//    const {
//   serviceId,
//   name,
//   telegramUsername,
//   mobile,
//   email,
//   note,
//   transactionId,
//   couponCode,
//   referralCode,
// } = req.body;

//     if (!transactionId)
//       return res.status(400).json({ message: "Transaction ID required" });

//     const service = await PremiumService.findById(serviceId);
//     if (!service)
//       return res.status(404).json({ message: "Plan not found" });

//     let finalAmount = service.discountedPrice ?? service.price;
//     let discountAmount = 0;
//     let coupon = null;

//     /* ===== COUPON APPLY ===== */
//     if (couponCode) {
//       coupon = await Coupon.findOne({ code: couponCode, isActive: true });

//       if (!coupon)
//         return res.status(400).json({ message: "Invalid coupon" });

//       if (coupon.expiryDate && coupon.expiryDate < new Date())
//         return res.status(400).json({ message: "Coupon expired" });

//       if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage)
//         return res.status(400).json({ message: "Coupon limit reached" });

//       discountAmount =
//         coupon.discountType === "percentage"
//           ? (service.price * coupon.discountValue) / 100
//           : coupon.discountValue;

//       finalAmount -= discountAmount;
//       coupon.usedCount += 1;
//       await coupon.save();
//     }

//     /* ===== REFERRAL COMMISSION ===== */
//     let referralCommission = 0;

//     if (referralCode) {
//       const refUser = await User.findOne({ referralCode });

//       if (refUser && refUser._id.toString() !== req.user.id) {
//         referralCommission = finalAmount * 0.1; // 10%
//         refUser.walletBalance += referralCommission;
//         await refUser.save();
//       }
//     }

//     const subscription = await PremiumSubscription.create({
//   user: req.user.id,
//   premiumService: serviceId,

//   name,
//   telegramUsername,
//   mobile,
//   email,
//   note,
//   transactionId,

//   coupon: coupon?._id,
//   discountAmount,
//   finalAmount,
//   referralCommission,
//   status: "pending",
// });
//     res.status(201).json({
//       success: true,
//       message: "Subscription request submitted",
//       subscription,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const rejectSubscription = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { adminNote } = req.body;

//     const sub = await PremiumSubscription.findById(id);
//     if (!sub)
//       return res.status(404).json({ message: "Subscription not found" });

//     sub.status = "rejected";
//     sub.adminNote = adminNote;
//     await sub.save();

//     res.json({ success: true, message: "Subscription rejected" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const suspendSubscription = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const sub = await PremiumSubscription.findById(id);
//     if (!sub)
//       return res.status(404).json({ message: "Subscription not found" });

//     sub.status = "suspended";
//     await sub.save();

//     res.json({ success: true, message: "Subscription suspended" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const expireSubscription = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const sub = await PremiumSubscription.findById(id);
//     if (!sub)
//       return res.status(404).json({ message: "Subscription not found" });

//     sub.status = "expired";
//     sub.endDate = new Date();
//     await sub.save();

//     res.json({ success: true, message: "Subscription expired" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const extendSubscription = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { months } = req.body;

//     const sub = await PremiumSubscription.findById(id);
//     if (!sub)
//       return res.status(404).json({ message: "Subscription not found" });

//     if (!sub.endDate)
//       return res.status(400).json({ message: "Subscription not active" });

//     const newEndDate = new Date(sub.endDate);
//     newEndDate.setMonth(newEndDate.getMonth() + Number(months));

//     sub.endDate = newEndDate;
//     sub.status = "approved";

//     await sub.save();

//     res.json({
//       success: true,
//       message: `Extended by ${months} months`,
//       sub,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const changePlan = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { newPlanId } = req.body;

//     const sub = await PremiumSubscription.findById(id);
//     const plan = await PremiumService.findById(newPlanId);

//     if (!sub || !plan)
//       return res.status(404).json({ message: "Not found" });

//     sub.premiumService = newPlanId;

//     const endDate = new Date();
//     endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

//     sub.endDate = endDate;
//     sub.status = "approved";

//     await sub.save();

//     res.json({ success: true, message: "Plan changed", sub });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export const deleteSubscription = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await PremiumSubscription.findByIdAndDelete(id);

//     res.json({ success: true, message: "Subscription deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ✅ NEW CONTROLLER
// export const getMySubscriptions = async (req, res) => {
//   try {
//     const subs = await PremiumSubscription.find({
//       user: req.user.id,
//     })
//       .populate("premiumService")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       subs,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import slugify from "slugify";
import PremiumService from "../../models/PremiumService.js";
import PremiumSubscription from "../../models/PremiumSubscription.js";
import Coupon from "../../models/Coupon.js";
import User from "../../models/User.js";

/* =====================================================
   =================== HELPERS ==========================
   (yahi se duplicate logic hata) ==========================
   ===================================================== */

/**
 * Coupon validate karo + discount calculate karo.
 * Pehle yeh logic applyCoupon() aur buySubscription() dono me
 * copy-paste tha (aur dono me thoda alag-alag tha, jisse bug ban gaya tha).
 * Ab dono isi ek function ko call karenge.
 */
const validateAndCalculateDiscount = async (code, basePrice) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase().trim(),
    isActive: true,
  });

  if (!coupon) {
    const err = new Error("Invalid coupon");
    err.status = 400;
    throw err;
  }

  if (coupon.expiryDate && coupon.expiryDate < new Date()) {
    const err = new Error("Coupon expired");
    err.status = 400;
    throw err;
  }

  if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
    const err = new Error("Coupon usage limit reached");
    err.status = 400;
    throw err;
  }

  const discountAmount =
    coupon.discountType === "percentage"
      ? Math.round((basePrice * coupon.discountValue) / 100)
      : coupon.discountValue;

  const finalAmount = Math.max(0, basePrice - discountAmount);

  return { coupon, discountAmount, finalAmount };
};

/**
 * reject / suspend / expire — teeno controllers me pehle
 * "findById -> field set -> save" wala same pattern repeat ho raha tha.
 * Ab ek hi generic function use hoga.
 */
const updateSubscriptionStatus = async (id, newStatus, extraFields = {}) => {
  const sub = await PremiumSubscription.findById(id);

  if (!sub) {
    const err = new Error("Subscription not found");
    err.status = 404;
    throw err;
  }

  sub.status = newStatus;
  Object.assign(sub, extraFields);
  await sub.save();

  return sub;
};

/** Ek jagah se error response bhejne ke liye (har controller me res.status(500) likhna nahi padega) */
const sendError = (res, err) => {
  res.status(err.status || 500).json({ message: err.message });
};

/**
 * Service ka base price nikalo.
 * Agar service "plans" array use karta hai (Basic/Pro/etc — multi-tier pricing)
 * toh selectedPlan ke hisaab se uska price lo, warna service ka flat price/discountedPrice.
 * (Pehle yeh hamesha flat price/discountedPrice hi use karta tha, plans array ignore ho raha tha)
 */
const getBasePrice = (service, selectedPlanName) => {
  if (service.plans && service.plans.length) {
    const plan =
      service.plans.find((p) => p.name === selectedPlanName) || service.plans[0];
    return plan.discountedPrice ?? plan.price;
  }
  return service.discountedPrice ?? service.price;
};

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
      isFeatured,
      isActive,
      sortOrder,
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      ogImage,
    } = req.body;

    const existing = await PremiumService.findOne({ title });
    if (existing)
      return res.status(400).json({ message: "Plan already exists" });

    const plan = await PremiumService.create({
      title,
      slug: slugify(title, { lower: true }),
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
      isFeatured,
      isActive,
      sortOrder,
      seo: { metaTitle, metaDescription, keywords, canonicalUrl, ogImage },
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, message: "Premium plan created", plan });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Update Premium Plan
 * (create ke saath naturally chahiye hota hai — same fields, partial update)
 */
export const updatePremiumPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { metaTitle, metaDescription, keywords, canonicalUrl, ogImage, ...rest } = req.body;

    const hasSeoField =
      metaTitle !== undefined ||
      metaDescription !== undefined ||
      keywords !== undefined ||
      canonicalUrl !== undefined ||
      ogImage !== undefined;

    const finalUpdate = { ...rest };
    if (hasSeoField) {
      finalUpdate.seo = { metaTitle, metaDescription, keywords, canonicalUrl, ogImage };
    }
    if (rest.title) {
      finalUpdate.slug = slugify(rest.title, { lower: true });
    }

    const plan = await PremiumService.findByIdAndUpdate(id, finalUpdate, {
      new: true,
      runValidators: true,
    });

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    res.json({ success: true, message: "Premium plan updated", plan });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Get All Plans (including inactive — for the admin list page)
 * Public getAllPlans() sirf isActive:true return karta hai, admin ko sab dikhne chahiye
 */
export const getAllPlansAdmin = async (req, res) => {
  try {
    const plans = await PremiumService.find().sort({ createdAt: -1 });
    res.json({ success: true, plans });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Get Single Plan By ID (edit form prefill ke liye)
 */
export const getPlanById = async (req, res) => {
  try {
    const plan = await PremiumService.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ success: true, plan });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Get All Coupons (list page ke liye)
 */
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Create Coupon
 */
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate, maxUsage } = req.body;

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

    res.status(201).json({ success: true, message: "Coupon created", coupon });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * User → Apply Coupon (validate + return discount amount, koi order nahi banta)
 */
export const applyCoupon = async (req, res) => {
  try {
    const { code, serviceId, selectedPlan } = req.body;

    const service = await PremiumService.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Plan not found" });

    const basePrice = getBasePrice(service, selectedPlan);

    const { coupon, discountAmount, finalAmount } =
      await validateAndCalculateDiscount(code, basePrice);

    res.json({
      success: true,
      discountAmount,
      finalAmount,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Approve Subscription
 */
export const approveSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await PremiumSubscription.findById(id).populate("premiumService");
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });

    if (subscription.status === "approved")
      return res.status(400).json({ message: "Already approved" });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + subscription.premiumService.durationInMonths);

    subscription.status = "approved";
    subscription.startDate = startDate;
    subscription.endDate = endDate;

    await subscription.save();

    res.json({ success: true, message: "Subscription approved", subscription });
  } catch (err) {
    sendError(res, err);
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
    sendError(res, err);
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
    sendError(res, err);
  }
};

/**
 * Public → Get Plan By Slug (Detail Page)
 */
export const getPlanBySlug = async (req, res) => {
  try {
    const plan = await PremiumService.findOne({ slug: req.params.slug, isActive: true });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    res.json({ success: true, plan });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * User → Buy Subscription (Industry Level)
 */
export const buySubscription = async (req, res) => {
  try {
    const {
      serviceId,
      selectedPlan,
      name,
      telegramUsername,
      mobile,
      email,
      note,
      formData,
      attachments,
      transactionId,
      paymentMethod,
      paymentScreenshot,
      couponCode,
      referralCode,
    } = req.body;

    if (!transactionId)
      return res.status(400).json({ message: "Transaction ID required" });

    const service = await PremiumService.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Plan not found" });

    const basePrice = getBasePrice(service, selectedPlan);

    let finalAmount = basePrice;
    let discountAmount = 0;
    let coupon = null;

    /* ===== COUPON APPLY (same helper jo applyCoupon bhi use karta hai) ===== */
    if (couponCode) {
      const result = await validateAndCalculateDiscount(couponCode, basePrice);
      coupon = result.coupon;
      discountAmount = result.discountAmount;
      finalAmount = result.finalAmount;

      // atomic increment — do parallel requests aayein toh bhi usedCount sahi rahega
      await Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } });
    }

    /* ===== REFERRAL COMMISSION ===== */
    let referralCommission = 0;

    if (referralCode) {
      const refUser = await User.findOne({ referralCode });

      if (refUser && refUser._id.toString() !== req.user.id) {
        referralCommission = finalAmount * 0.1; // 10%
        await User.updateOne(
          { _id: refUser._id },
          { $inc: { walletBalance: referralCommission } }
        );
      }
    }

    const subscription = await PremiumSubscription.create({
      user: req.user.id,
      premiumService: serviceId,
      selectedPlan,
      name,
      telegramUsername,
      mobile,
      email,
      note,
      formData,
      attachments,
      transactionId,
      paymentMethod,
      paymentScreenshot,
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
    sendError(res, err);
  }
};

/**
 * Admin → Reject Subscription
 */
export const rejectSubscription = async (req, res) => {
  try {
    const sub = await updateSubscriptionStatus(req.params.id, "rejected", {
      adminNote: req.body.adminNote,
    });
    res.json({ success: true, message: "Subscription rejected", sub });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Suspend Subscription
 */
export const suspendSubscription = async (req, res) => {
  try {
    const sub = await updateSubscriptionStatus(req.params.id, "suspended");
    res.json({ success: true, message: "Subscription suspended", sub });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Expire Subscription
 */
export const expireSubscription = async (req, res) => {
  try {
    const sub = await updateSubscriptionStatus(req.params.id, "expired", {
      endDate: new Date(),
    });
    res.json({ success: true, message: "Subscription expired", sub });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Extend Subscription
 */
export const extendSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { months } = req.body;

    const sub = await PremiumSubscription.findById(id);
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    if (!sub.endDate)
      return res.status(400).json({ message: "Subscription not active" });

    const newEndDate = new Date(sub.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + Number(months));

    sub.endDate = newEndDate;
    sub.status = "approved";

    await sub.save();

    res.json({ success: true, message: `Extended by ${months} months`, sub });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Change Plan
 */
export const changePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPlanId } = req.body;

    const sub = await PremiumSubscription.findById(id);
    const plan = await PremiumService.findById(newPlanId);

    if (!sub || !plan) return res.status(404).json({ message: "Not found" });

    sub.premiumService = newPlanId;

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

    sub.endDate = endDate;
    sub.status = "approved";

    await sub.save();

    res.json({ success: true, message: "Plan changed", sub });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Delete Subscription
 */
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    await PremiumSubscription.findByIdAndDelete(id);
    res.json({ success: true, message: "Subscription deleted" });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * User → Get My Subscriptions
 */
export const getMySubscriptions = async (req, res) => {
  try {
    const subs = await PremiumSubscription.find({ user: req.user.id })
      .populate("premiumService")
      .sort({ createdAt: -1 });

    res.json({ success: true, subs });
  } catch (err) {
    sendError(res, err);
  }
};

/**
 * Admin → Get Single Subscription By ID
 */
export const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await PremiumSubscription.findById(id)
      .populate("user")
      .populate("premiumService");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.json({
      success: true,
      subscription,
    });
  } catch (err) {
    sendError(res, err);
  }
};