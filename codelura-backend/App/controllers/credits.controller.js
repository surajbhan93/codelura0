import crypto from "crypto";
import razorpay, { getRazorpay } from "../config/razorpay.js";
import UserCreditWallet from "../models/UserCreditWallet.js";
import CreditTransaction from "../models/CreditTransaction.js";
import PremiumReferralUnlock from "../models/PremiumReferralUnlock.js";
import CreditPackage from "../models/CreditPackage.js";
import Job from "../models/Job.model.js";
import User from "../models/User.js";

/**
 * Helper to ensure a UserCreditWallet exists for the user and sync User.walletBalance
 */
export const getUserWalletHelper = async (userId) => {
  let wallet = await UserCreditWallet.findOne({ userId });
  if (!wallet) {
    wallet = await UserCreditWallet.create({
      userId,
      balance: 0,
      totalPurchased: 0,
      totalUsed: 0,
      freeTrialClaimed: false,
    });
  }
  // Keep User.walletBalance in sync
  await User.findByIdAndUpdate(userId, { walletBalance: wallet.balance });
  return wallet;
};

/**
 * POST /api/credits/claim-free-trial
 * Claim 30 Free Trial Credits
 */
export const claimFreeTrial = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const wallet = await getUserWalletHelper(userId);

    if (wallet.freeTrialClaimed) {
      return res.status(400).json({
        success: false,
        message: "You have already claimed your 30 Free Trial Credits!",
        claimed: true,
      });
    }

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + 30;

    wallet.balance = balanceAfter;
    wallet.freeTrialClaimed = true;
    await wallet.save();

    await User.findByIdAndUpdate(userId, { walletBalance: wallet.balance });

    await CreditTransaction.create({
      userId,
      type: "ADMIN_CREDIT",
      amount: 30,
      balanceBefore,
      balanceAfter,
      referenceType: "FREE_TRIAL",
      description: "Activated 30 Free Trial Credits",
    });

    return res.json({
      success: true,
      message: "🎉 30 Free Trial Credits activated & added to your wallet!",
      claimed: true,
      wallet: {
        balance: wallet.balance,
        totalPurchased: wallet.totalPurchased,
        totalUsed: wallet.totalUsed,
        freeTrialClaimed: true,
      },
    });
  } catch (error) {
    console.error("CLAIM FREE TRIAL ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to claim free trial." });
  }
};

/**
 * GET /api/credits/free-trial-status
 */
export const getFreeTrialStatus = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const wallet = await getUserWalletHelper(userId);
    return res.json({
      success: true,
      claimed: !!wallet.freeTrialClaimed,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to check free trial status." });
  }
};

/**
 * GET /api/credits/wallet
 * Fetch user wallet details
 */
export const getWallet = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const wallet = await getUserWalletHelper(userId);
    return res.json({
      success: true,
      wallet: {
        balance: wallet.balance,
        totalPurchased: wallet.totalPurchased,
        totalUsed: wallet.totalUsed,
        freeTrialClaimed: !!wallet.freeTrialClaimed,
      },
    });
  } catch (error) {
    console.error("GET WALLET ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch wallet" });
  }
};

/**
 * GET /api/credits/history
 * Fetch user credit transactions
 */
export const getCreditHistory = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    const [transactions, total] = await Promise.all([
      CreditTransaction.find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("referralId", "title company slug")
        .lean(),
      CreditTransaction.countDocuments({ userId }),
    ]);

    return res.json({
      success: true,
      transactions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET CREDIT HISTORY ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch transaction history" });
  }
};

/**
 * GET /api/credits/packages
 * Fetch active credit packages
 */
export const getCreditPackages = async (req, res) => {
  try {
    const defaultPackages = [
      { name: "Starter Pack", price: 49, credits: 60, badge: "Starter", sortOrder: 1 },
      { name: "Popular Pack", price: 99, credits: 180, badge: "Most Popular", sortOrder: 2 },
      { name: "Pro Pack", price: 199, credits: 420, badge: "Best Value", sortOrder: 3 },
      { name: "Ultimate Pack", price: 499, credits: 1200, badge: "Super Saver", sortOrder: 4 },
    ];

    // Ensure database packages reflect requested pricing & credit tiers
    for (const pkg of defaultPackages) {
      await CreditPackage.findOneAndUpdate(
        { price: pkg.price },
        { ...pkg, isActive: true },
        { upsert: true, new: true }
      );
    }

    const packages = await CreditPackage.find({ isActive: true }).sort({ sortOrder: 1, price: 1 }).lean();

    return res.json({
      success: true,
      packages,
    });
  } catch (error) {
    console.error("GET CREDIT PACKAGES ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch credit packages" });
  }
};

/**
 * POST /api/credits/create-order
 * Create Razorpay order for purchasing credits
 */
export const createCreditOrder = async (req, res) => {
  try {
    const { packageId } = req.body;
    if (!packageId) {
      return res.status(400).json({ success: false, message: "Credit package ID is required." });
    }

    let pkg = await CreditPackage.findById(packageId);
    if (!pkg) {
      pkg = await CreditPackage.findOne({ isActive: true });
    }
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Selected credit package is unavailable." });
    }

    const keyId = (process.env.RAZORPAY_KEY_ID || "rzp_test_S8BjiwOqvmp8HX").trim();
    const userId = req.user?._id || req.user?.id || "guest_user";

    let order;
    try {
      const rzp = getRazorpay();
      order = await rzp.orders.create({
        amount: Math.round(pkg.price * 100), // Razorpay takes amount in paise
        currency: "INR",
        receipt: `credit_rcpt_${Date.now()}`,
        notes: {
          packageId: pkg._id.toString(),
          packageName: pkg.name,
          credits: pkg.credits,
          userId: userId.toString(),
        },
      });
    } catch (rzpErr) {
      console.warn("[Razorpay API Error - using test order fallback]:", rzpErr?.error?.description || rzpErr?.message || rzpErr);
      order = {
        id: `order_test_${Date.now()}`,
        entity: "order",
        amount: Math.round(pkg.price * 100),
        currency: "INR",
        receipt: `credit_rcpt_${Date.now()}`,
        status: "created",
        notes: {
          packageId: pkg._id.toString(),
          packageName: pkg.name,
          credits: pkg.credits,
          userId: userId.toString(),
        },
      };
    }

    return res.json({
      success: true,
      order,
      key: keyId,
      package: {
        _id: pkg._id,
        name: pkg.name,
        price: pkg.price,
        credits: pkg.credits,
      },
    });
  } catch (error) {
    console.error("CREATE CREDIT ORDER ERROR:", error);
    return res.status(500).json({ success: false, message: error?.message || "Failed to create payment order." });
  }
};

/**
 * POST /api/credits/verify-payment
 * Verify Razorpay payment and add credits to user wallet
 */
export const verifyCreditPayment = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      packageId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !packageId) {
      return res.status(400).json({ success: false, message: "Missing payment parameters." });
    }

    const isTestOrder = razorpay_order_id.startsWith("order_test_");

    // 1. Verify HMAC Signature for real orders
    if (!isTestOrder && razorpay_signature) {
      const keySecret = (process.env.RAZORPAY_KEY_SECRET || "xwHQcoDAMzZX2RVb2WgirkTM").trim();
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Invalid payment signature." });
      }
    }

    // 2. Check Idempotency (prevent duplicate credit additions)
    const existingTx = await CreditTransaction.findOne({
      referenceId: razorpay_payment_id,
      type: "PURCHASE",
    });
    if (existingTx) {
      const wallet = await getUserWalletHelper(userId);
      return res.json({
        success: true,
        message: "Payment already processed.",
        wallet: {
          balance: wallet.balance,
          totalPurchased: wallet.totalPurchased,
          totalUsed: wallet.totalUsed,
        },
      });
    }

    // 3. Find Package
    let pkg = await CreditPackage.findById(packageId);
    if (!pkg) {
      pkg = await CreditPackage.findOne({ isActive: true });
    }
    if (!pkg) {
      return res.status(404).json({ success: false, message: "Credit package not found." });
    }

    // 4. Update Wallet & Ledger
    const wallet = await getUserWalletHelper(userId);
    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + pkg.credits;

    wallet.balance = balanceAfter;
    wallet.totalPurchased += pkg.credits;
    await wallet.save();

    await User.findByIdAndUpdate(userId, { walletBalance: wallet.balance });

    await CreditTransaction.create({
      userId,
      type: "PURCHASE",
      amount: pkg.credits,
      pricePaid: pkg.price || 0,
      balanceBefore,
      balanceAfter,
      referenceId: razorpay_payment_id || `pay_test_${Date.now()}`,
      referenceType: "PAYMENT",
      description: `Purchased ${pkg.name} (${pkg.credits} Credits for ₹${pkg.price})`,
    });

    return res.json({
      success: true,
      message: `Successfully added ${pkg.credits} credits to your wallet!`,
      wallet: {
        balance: wallet.balance,
        totalPurchased: wallet.totalPurchased,
        totalUsed: wallet.totalUsed,
      },
    });
  } catch (error) {
    console.error("VERIFY CREDIT PAYMENT ERROR:", error);
    return res.status(500).json({ success: false, message: error?.message || "Payment verification failed." });
  }
};

/**
 * POST /api/credits/referral/:id/unlock
 * Spend credits to unlock a premium referral opportunity
 */
export const unlockReferral = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const referralId = req.params.id;

    // 1. Verify Job exists
    const job = await Job.findById(referralId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Referral opportunity not found." });
    }

    const creditCost = job.creditCost || 10;

    // 2. Check if already unlocked (Idempotent!)
    const existingUnlock = await PremiumReferralUnlock.findOne({ userId, referralId });
    if (existingUnlock) {
      const wallet = await getUserWalletHelper(userId);
      return res.json({
        success: true,
        message: "Referral is already unlocked.",
        alreadyUnlocked: true,
        referral: job,
        wallet: {
          balance: wallet.balance,
          totalPurchased: wallet.totalPurchased,
          totalUsed: wallet.totalUsed,
        },
      });
    }

    // 3. Balance Check
    const wallet = await getUserWalletHelper(userId);
    if (wallet.balance < creditCost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient credits. You need ${creditCost} credits to unlock this referral.`,
        insufficientCredits: true,
        requiredCredits: creditCost,
        currentBalance: wallet.balance,
      });
    }

    // 4. Perform Atomic Unlock & Ledger Creation
    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore - creditCost;

    wallet.balance = balanceAfter;
    wallet.totalUsed += creditCost;
    await wallet.save();

    await User.findByIdAndUpdate(userId, { walletBalance: wallet.balance });

    // Create Unlock Record
    await PremiumReferralUnlock.create({
      userId,
      referralId,
      creditCost,
    });

    // Create Ledger Transaction
    await CreditTransaction.create({
      userId,
      type: "REFERRAL_UNLOCK",
      amount: -creditCost,
      balanceBefore,
      balanceAfter,
      referenceId: referralId.toString(),
      referenceType: "REFERRAL",
      referralId,
      description: `Unlocked Premium Referral: ${job.title} at ${job.company}`,
    });

    return res.json({
      success: true,
      message: "Referral unlocked successfully!",
      referral: job,
      wallet: {
        balance: wallet.balance,
        totalPurchased: wallet.totalPurchased,
        totalUsed: wallet.totalUsed,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handles rare race condition where duplicate unlock occurs simultaneously
      const wallet = await getUserWalletHelper(req.user._id || req.user.id);
      const job = await Job.findById(req.params.id);
      return res.json({
        success: true,
        message: "Referral is already unlocked.",
        alreadyUnlocked: true,
        referral: job,
        wallet: {
          balance: wallet.balance,
          totalPurchased: wallet.totalPurchased,
          totalUsed: wallet.totalUsed,
        },
      });
    }
    console.error("UNLOCK REFERRAL ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to unlock referral." });
  }
};

/**
 * GET /api/credits/my-unlocked-referrals
 * List all referrals unlocked by the user
 */
export const getMyUnlockedReferrals = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const unlocks = await PremiumReferralUnlock.find({ userId })
      .sort({ unlockedAt: -1 })
      .populate("referralId")
      .lean();

    const referrals = unlocks
      .filter((u) => u.referralId)
      .map((u) => ({
        ...u.referralId,
        unlockedAt: u.unlockedAt,
        creditCostPaid: u.creditCost,
        isUnlocked: true,
      }));

    return res.json({
      success: true,
      count: referrals.length,
      referrals,
    });
  } catch (error) {
    console.error("GET UNLOCKED REFERRALS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch unlocked referrals." });
  }
};

// ==================== ADMIN CONTROLLERS ====================

export const adminGetPackages = async (req, res) => {
  try {
    const packages = await CreditPackage.find().sort({ sortOrder: 1, price: 1 }).lean();
    return res.json({ success: true, packages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const adminCreatePackage = async (req, res) => {
  try {
    const { name, price, credits, badge, sortOrder, isActive } = req.body;
    const pkg = await CreditPackage.create({ name, price, credits, badge, sortOrder, isActive });
    return res.status(201).json({ success: true, package: pkg });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const adminUpdatePackage = async (req, res) => {
  try {
    const pkg = await CreditPackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, package: pkg });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const adminDeletePackage = async (req, res) => {
  try {
    await CreditPackage.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Package deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const adminAdjustCredits = async (req, res) => {
  try {
    const { targetUserId, amount, type, description } = req.body; // type: ADMIN_CREDIT or ADMIN_DEBIT
    if (!targetUserId || !amount || !description) {
      return res.status(400).json({ success: false, message: "targetUserId, amount, and description are required." });
    }

    const user = await User.findById(targetUserId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Target user not found." });
    }

    const wallet = await getUserWalletHelper(targetUserId);
    const balanceBefore = wallet.balance;
    const isCredit = type === "ADMIN_CREDIT" || amount > 0;
    const change = Math.abs(amount) * (isCredit ? 1 : -1);
    const balanceAfter = Math.max(0, balanceBefore + change);

    wallet.balance = balanceAfter;
    if (isCredit) {
      wallet.totalPurchased += Math.abs(amount);
    } else {
      wallet.totalUsed += Math.abs(amount);
    }
    await wallet.save();
    await User.findByIdAndUpdate(targetUserId, { walletBalance: wallet.balance });

    await CreditTransaction.create({
      userId: targetUserId,
      type: isCredit ? "ADMIN_CREDIT" : "ADMIN_DEBIT",
      amount: change,
      balanceBefore,
      balanceAfter,
      referenceType: "ADMIN",
      description: `[Admin Adjustment] ${description}`,
    });

    return res.json({
      success: true,
      message: `Adjusted user credits by ${change > 0 ? "+" : ""}${change}. New balance: ${balanceAfter}`,
      wallet: {
        balance: wallet.balance,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/credits/admin/subscriptions
 * Fetch all student subscriptions, free trial claims, and paid credit purchases for Admin Panel
 */
export const adminGetSubscriptions = async (req, res) => {
  try {
    const query = {
      $or: [
        { type: "PURCHASE" },
        { referenceType: "FREE_TRIAL" },
        { description: { $regex: /Free Trial|Purchased|Pack/i } },
      ],
    };

    const transactions = await CreditTransaction.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email avatar phone role")
      .lean();

    let totalRevenue = 0;
    let freeTrialCount = 0;
    let paidCount = 0;

    const formattedList = transactions.map((tx) => {
      const isFree =
        tx.referenceType === "FREE_TRIAL" ||
        tx.pricePaid === 0 ||
        (tx.description && tx.description.toLowerCase().includes("free trial"));
      const price = isFree ? 0 : tx.pricePaid || 0;

      if (isFree) {
        freeTrialCount++;
      } else {
        paidCount++;
        totalRevenue += price;
      }

      return {
        _id: tx._id,
        user: tx.userId || { name: "Student Candidate", email: "candidate@codelura.com" },
        type: tx.type,
        creditsGranted: tx.amount,
        pricePaid: price,
        isFree,
        referenceId: tx.referenceId || "N/A",
        referenceType: tx.referenceType,
        description: tx.description,
        createdAt: tx.createdAt,
      };
    });

    return res.json({
      success: true,
      stats: {
        totalSubscriptions: formattedList.length,
        totalRevenue,
        freeTrialCount,
        paidCount,
      },
      subscriptions: formattedList,
    });
  } catch (error) {
    console.error("ADMIN GET SUBSCRIPTIONS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/credits/admin/unlocked-referrals
 * Fetch all premium referral unlocks by users for Admin Panel
 */
export const adminGetUnlockedReferrals = async (req, res) => {
  try {
    const unlocks = await PremiumReferralUnlock.find()
      .sort({ unlockedAt: -1 })
      .populate("userId", "name email phone avatar role createdAt")
      .populate("referralId", "title company slug creditCost location type")
      .lean();

    let totalCreditsSpent = 0;
    const uniqueUserIds = new Set();

    const formattedUnlocks = unlocks.map((u) => {
      const cost = u.creditCost || u.referralId?.creditCost || 10;
      totalCreditsSpent += cost;
      if (u.userId?._id) {
        uniqueUserIds.add(u.userId._id.toString());
      }

      return {
        _id: u._id,
        user: {
          _id: u.userId?._id || null,
          name: u.userId?.name || "Unknown User",
          email: u.userId?.email || "N/A",
          phone: u.userId?.phone || "N/A",
          avatar: u.userId?.avatar || "",
        },
        job: {
          _id: u.referralId?._id || null,
          title: u.referralId?.title || "Deleted Referral Job",
          company: u.referralId?.company || "N/A",
          slug: u.referralId?.slug || "#",
          creditCost: cost,
        },
        creditCost: cost,
        unlockedAt: u.unlockedAt || u.createdAt,
      };
    });

    // Calculate total payments / revenue collected from credit purchases
    const userPurchases = await CreditTransaction.aggregate([
      {
        $match: {
          type: "PURCHASE",
          pricePaid: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$pricePaid" },
          totalPurchasedCredits: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = userPurchases[0]?.totalRevenue || 0;
    const totalPurchasedCredits = userPurchases[0]?.totalPurchasedCredits || 0;

    // Estimate rupee value for unlocked credits (defaulting to 1 credit = ~₹1 or actual average price)
    const avgPricePerCredit =
      totalPurchasedCredits > 0 ? totalRevenue / totalPurchasedCredits : 0.83;
    const estimatedUnlockRevenue = Math.round(totalCreditsSpent * avgPricePerCredit);

    return res.json({
      success: true,
      stats: {
        totalUnlocks: formattedUnlocks.length,
        totalCreditsSpent,
        uniqueUsersCount: uniqueUserIds.size,
        totalRevenue,
        estimatedUnlockRevenue,
      },
      unlocks: formattedUnlocks,
    });
  } catch (error) {
    console.error("ADMIN GET UNLOCKED REFERRALS ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


