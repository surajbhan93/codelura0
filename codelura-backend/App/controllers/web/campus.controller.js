import CampusParticipant from "../../models/CampusParticipant.js";
import CampusTask from "../../models/CampusTask.js";
import CampusTaskSubmission from "../../models/CampusTaskSubmission.js";
import CampusJobPromotion from "../../models/CampusJobPromotion.js";
import CampusBlog from "../../models/CampusBlog.js";
import CampusCourseSale from "../../models/CampusCourseSale.js";
import CampusEarning from "../../models/CampusEarning.js";
import CampusPayout from "../../models/CampusPayout.js";
import CampusProgramSettings from "../../models/CampusProgramSettings.js";
import User from "../../models/User.js";
import Job from "../../models/Job.model.js";
import Course from "../../models/Course.js";
import Blog from "../../models/Blog.js";

// Helper: Get or create default settings
export const getSettings = async () => {
  let settings = await CampusProgramSettings.findOne();
  if (!settings) {
    settings = await CampusProgramSettings.create({});
  }
  return settings;
};

// Helper: Generate Unique Referral Code
const generateReferralCode = async (name) => {
  const cleanName = (name || "STUDENT").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 5) || "CDL";
  let unique = false;
  let code = "";
  while (!unique) {
    const randomNum = Math.floor(100 + Math.random() * 900);
    code = `CAMPUS-${cleanName}-${randomNum}`;
    const existing = await CampusParticipant.findOne({ referralCode: code });
    if (!existing) unique = true;
  }
  return code;
};

/* ────────────────────────────────────────────────────────────
   1. GET CURRENT USER'S CAMPUS PARTICIPANT PROFILE
──────────────────────────────────────────────────────────── */
export const getCampusProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    let participant = await CampusParticipant.findOne({ user: userId }).populate("user", "name email");

    const settings = await getSettings();

    if (!participant) {
      return res.status(200).json({
        success: true,
        isParticipant: false,
        participant: null,
        settings,
      });
    }

    // Dynamic Rank calculation
    const allRanked = await CampusParticipant.find({ status: "active" })
      .sort({ points: -1, totalEarnings: -1 })
      .select("_id");
    const rankIndex = allRanked.findIndex((p) => p._id.toString() === participant._id.toString());
    const rank = rankIndex !== -1 ? rankIndex + 1 : 0;
    if (participant.rank !== rank) {
      participant.rank = rank;
      await participant.save();
    }

    return res.status(200).json({
      success: true,
      isParticipant: true,
      participant,
      settings,
    });
  } catch (error) {
    console.error("Get Campus Profile Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch campus profile" });
  }
};

/* ────────────────────────────────────────────────────────────
   2. JOIN / REGISTER AS CAMPUS PARTICIPANT
──────────────────────────────────────────────────────────── */
export const joinCampusProgram = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { collegeName, branch, year, phone, bio } = req.body;

    if (!collegeName) {
      return res.status(400).json({ success: false, message: "College name is required" });
    }

    let participant = await CampusParticipant.findOne({ user: userId });
    if (participant) {
      return res.status(400).json({
        success: false,
        message: "You are already registered in the Codelura Campus Program",
        participant,
      });
    }

    const user = await User.findById(userId);
    const referralCode = await generateReferralCode(user?.name);
    const campusId = `CDL-CAMP-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    participant = await CampusParticipant.create({
      user: userId,
      collegeName: collegeName.trim(),
      branch: branch?.trim() || "",
      year: year?.trim() || "",
      phone: phone?.trim() || "",
      bio: bio?.trim() || "",
      referralCode,
      campusId,
      status: "active",
      points: 50, // Welcome bonus points
      weeklyPoints: 50,
      monthlyPoints: 50,
    });

    // Log welcome earning/points
    await CampusEarning.create({
      participant: participant._id,
      source: "manual_adjustment",
      amount: 0,
      points: 50,
      status: "approved",
      description: "Welcome Bonus: Enrolled in Codelura Campus Program",
    });

    return res.status(201).json({
      success: true,
      message: "Congratulations! You have joined the Codelura Campus Program 🎉",
      participant,
    });
  } catch (error) {
    console.error("Join Campus Program Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to join campus program" });
  }
};

/* ────────────────────────────────────────────────────────────
   3. UNIFIED CAMPUS DASHBOARD SUMMARY
──────────────────────────────────────────────────────────── */
export const getCampusDashboard = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const participant = await CampusParticipant.findOne({ user: userId });

    if (!participant) {
      return res.status(403).json({ success: false, message: "Not enrolled in Campus Program" });
    }

    const pId = participant._id;

    // Parallel fetch aggregated data
    const [
      taskSubmissions,
      courseSales,
      jobPromos,
      blogs,
      referralsCount,
      recentEarnings,
      settings,
    ] = await Promise.all([
      CampusTaskSubmission.find({ participant: pId }).populate("task"),
      CampusCourseSale.find({ participant: pId }).populate("course", "title price bannerImage").populate("buyer", "name email"),
      CampusJobPromotion.find({ participant: pId }).populate("job", "title company location"),
      CampusBlog.find({ participant: pId }),
      User.countDocuments({ referredBy: userId }),
      CampusEarning.find({ participant: pId }).sort({ createdAt: -1 }).limit(10),
      getSettings(),
    ]);

    // Aggregated real-time calculations from CampusEarning
    const allEarnings = await CampusEarning.find({ participant: pId });
    const approvedCash = allEarnings
      .filter((e) => e.status === "approved")
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    const paidCash = allEarnings
      .filter((e) => e.status === "paid")
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    const pendingCash = allEarnings
      .filter((e) => e.status === "pending")
      .reduce((sum, e) => sum + (e.amount || 0), 0);
    const totalPointsFromEarnings = allEarnings
      .filter((e) => e.status === "approved" || e.status === "paid")
      .reduce((sum, e) => sum + (e.points || 0), 0);

    const approvedEarnings = Math.max(participant.approvedEarnings || 0, approvedCash);
    const paidEarnings = Math.max(participant.paidEarnings || 0, paidCash);
    const pendingEarnings = participant.pendingEarnings || pendingCash;
    const totalEarnings = Math.max(participant.totalEarnings || 0, approvedEarnings + paidEarnings);
    const points = Math.max(participant.points || 0, totalPointsFromEarnings);

    // Sync back to participant doc if updated
    if (
      participant.approvedEarnings !== approvedEarnings ||
      participant.totalEarnings !== totalEarnings ||
      participant.points !== points
    ) {
      participant.approvedEarnings = approvedEarnings;
      participant.totalEarnings = totalEarnings;
      participant.points = points;
      await participant.save();
    }

    const courseEarnings = courseSales.filter((s) => s.status !== "refunded").reduce((acc, s) => acc + (s.commissionAmount || 0), 0);
    const jobEarnings = jobPromos.filter((j) => j.status === "approved" || j.status === "paid").reduce((acc, j) => acc + (j.rewardAmount || 0), 0);
    const blogEarnings = blogs.filter((b) => b.rewardStatus === "approved" || b.rewardStatus === "paid").reduce((acc, b) => acc + (b.rewardAmount || 0), 0);

    const completedTasksCount = taskSubmissions.filter((t) => t.status === "approved").length;
    const verifiedJobPromosCount = jobPromos.filter((j) => j.status === "approved" || j.status === "paid" || j.status === "submitted").length;

    const metricsData = {
      totalEarnings,
      pendingEarnings,
      approvedEarnings,
      paidEarnings,
      courseEarnings,
      jobEarnings,
      blogEarnings,
      points,
      rank: participant.rank || 1,
      completedTasksCount,
      tasksCompleted: completedTasksCount,
      courseSalesCount: courseSales.length,
      jobPromotionsCount: verifiedJobPromosCount,
      jobPromosCount: jobPromos.length,
      publishedBlogsCount: blogs.filter((b) => b.status === "published").length,
      blogsCount: blogs.length,
      totalReferralsCount: referralsCount,
      referralsCount,
    };

    return res.status(200).json({
      success: true,
      participant,
      metrics: metricsData,
      stats: metricsData,
      recentEarnings,
      settings,
    });
  } catch (error) {
    console.error("Campus Dashboard Error:", error);
    return res.status(500).json({ success: false, message: "Failed to load dashboard data" });
  }
};

/* ────────────────────────────────────────────────────────────
   4. CAMPUS TASKS & SUBMISSIONS
──────────────────────────────────────────────────────────── */
export const getCampusTasks = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const participant = await CampusParticipant.findOne({ user: userId });

    if (!participant) {
      return res.status(403).json({ success: false, message: "Not enrolled in Campus Program" });
    }

    const tasks = await CampusTask.find({ status: "active" }).sort({ createdAt: -1 }).lean();
    const submissions = await CampusTaskSubmission.find({ participant: participant._id }).lean();

    const submissionMap = new Map();
    submissions.forEach((s) => submissionMap.set(s.task.toString(), s));

    const enrichedTasks = tasks.map((t) => ({
      ...t,
      mySubmission: submissionMap.get(t._id.toString()) || null,
    }));

    return res.status(200).json({ success: true, tasks: enrichedTasks });
  } catch (error) {
    console.error("Get Campus Tasks Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
};

export const submitTaskProof = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params; // Task ID
    const { proofText, proofLinks, proofImages } = req.body;

    const participant = await CampusParticipant.findOne({ user: userId });
    if (!participant) {
      return res.status(403).json({ success: false, message: "Not enrolled in Campus Program" });
    }

    const task = await CampusTask.findById(id);
    if (!task || task.status !== "active") {
      return res.status(404).json({ success: false, message: "Task not found or closed" });
    }

    let submission = await CampusTaskSubmission.findOne({ task: id, participant: participant._id });

    if (submission && (submission.status === "approved" || submission.status === "under_review")) {
      return res.status(400).json({ success: false, message: `Submission is already ${submission.status}` });
    }

    if (submission) {
      submission.proofText = proofText || submission.proofText;
      submission.proofLinks = proofLinks || submission.proofLinks;
      submission.proofImages = proofImages || submission.proofImages;
      submission.status = "submitted";
      await submission.save();
    } else {
      submission = await CampusTaskSubmission.create({
        task: id,
        participant: participant._id,
        proofText: proofText || "",
        proofLinks: Array.isArray(proofLinks) ? proofLinks : proofLinks ? [proofLinks] : [],
        proofImages: Array.isArray(proofImages) ? proofImages : proofImages ? [proofImages] : [],
        status: "submitted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task submission uploaded! Pending review by Codelura team 🚀",
      submission,
    });
  } catch (error) {
    console.error("Submit Task Proof Error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit task proof" });
  }
};

/* ────────────────────────────────────────────────────────────
   5. JOB PROMOTION MODULE
──────────────────────────────────────────────────────────── */
export const getAvailableJobsForPromotion = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const participant = await CampusParticipant.findOne({ user: userId });

    const jobs = await Job.find({ isPublished: { $ne: false } })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    let myPromotions = [];
    if (participant) {
      myPromotions = await CampusJobPromotion.find({ participant: participant._id }).populate("job").sort({ createdAt: -1 });
    }

    const settings = await getSettings();

    return res.status(200).json({
      success: true,
      jobs,
      myPromotions,
      rewardPerJob: settings.jobPromotionReward,
    });
  } catch (error) {
    console.error("Get Campus Jobs Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

export const submitJobPromotionProof = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { jobId, platform, proofLink, proofImage, notes } = req.body;

    const participant = await CampusParticipant.findOne({ user: userId });
    if (!participant) {
      return res.status(403).json({ success: false, message: "Not enrolled in Campus Program" });
    }

    if (!jobId) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    // Prevent duplicate submissions on the same platform on the same day
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingPromo = await CampusJobPromotion.findOne({
      job: jobId,
      participant: participant._id,
      platform,
      createdAt: { $gte: oneDayAgo },
    });

    if (existingPromo) {
      return res.status(400).json({
        success: false,
        message: `You have already submitted a promotion for this job on ${platform} today. Please promote other jobs!`,
      });
    }

    const settings = await getSettings();

    const promotion = await CampusJobPromotion.create({
      job: jobId,
      participant: participant._id,
      platform: platform || "whatsapp",
      proofLink: proofLink || "",
      proofImage: proofImage || "",
      notes: notes || "",
      rewardAmount: settings.jobPromotionReward || 2,
      status: "submitted",
    });

    // Update pending earnings cache
    participant.pendingEarnings = (participant.pendingEarnings || 0) + (settings.jobPromotionReward || 2);
    await participant.save();

    return res.status(201).json({
      success: true,
      message: `Job promotion submitted! Reward of ₹${settings.jobPromotionReward} will be credited upon verification.`,
      promotion,
    });
  } catch (error) {
    console.error("Submit Job Promotion Error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit job promotion" });
  }
};

/* ────────────────────────────────────────────────────────────
   6. BLOG PROGRAM MODULE
──────────────────────────────────────────────────────────── */
export const getMyCampusBlogs = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const participant = await CampusParticipant.findOne({ user: userId });

    if (!participant) {
      return res.status(403).json({ success: false, message: "Not enrolled in Campus Program" });
    }

    const blogs = await CampusBlog.find({ participant: participant._id }).sort({ createdAt: -1 });
    const settings = await getSettings();

    return res.status(200).json({
      success: true,
      blogs,
      threshold: settings.blogViewsThreshold,
      reward: settings.blogViewsReward,
    });
  } catch (error) {
    console.error("Get Campus Blogs Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
};

export const submitCampusBlog = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { title, content, excerpt, coverImage, category, tags } = req.body;

    const participant = await CampusParticipant.findOne({ user: userId });
    if (!participant) {
      return res.status(403).json({ success: false, message: "Not enrolled in Campus Program" });
    }

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + `-${Date.now().toString().slice(-4)}`;

    const settings = await getSettings();

    const blog = await CampusBlog.create({
      participant: participant._id,
      title: title.trim(),
      slug,
      content,
      excerpt: excerpt?.trim() || content.slice(0, 150).replace(/<[^>]*>?/gm, ""),
      coverImage: coverImage || "",
      category: category || "Tech",
      tags: Array.isArray(tags) ? tags : tags ? tags.split(",").map((t) => t.trim()) : [],
      status: "submitted",
      rewardAmount: settings.blogViewsReward || 20,
    });

    return res.status(201).json({
      success: true,
      message: "Article submitted for review! Upon approval and reaching 500+ genuine views, ₹20 reward will be awarded.",
      blog,
    });
  } catch (error) {
    console.error("Submit Campus Blog Error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit blog" });
  }
};

// Anti-Spam Public Blog View Increment
export const incrementCampusBlogViews = async (req, res) => {
  try {
    const { id } = req.params;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "anonymous";

    const blog = await CampusBlog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Anti-spam debounce: check if IP already viewed in last 12 hours
    if (!blog.uniqueIps) blog.uniqueIps = [];
    const ipHash = ip.toString().slice(0, 45);

    if (!blog.uniqueIps.includes(ipHash)) {
      blog.uniqueIps.push(ipHash);
      blog.views = (blog.views || 0) + 1;

      // Check 500+ views milestone
      const settings = await getSettings();
      const threshold = settings.blogViewsThreshold || 500;

      if (blog.views >= threshold && !blog.reached500Views) {
        blog.reached500Views = true;
        blog.reached500At = new Date();
        blog.rewardStatus = "eligible";

        // Auto credit earning
        const participant = await CampusParticipant.findById(blog.participant);
        if (participant) {
          const reward = blog.rewardAmount || settings.blogViewsReward || 20;
          participant.approvedEarnings = (participant.approvedEarnings || 0) + reward;
          participant.totalEarnings = (participant.totalEarnings || 0) + reward;
          participant.points = (participant.points || 0) + 100;
          await participant.save();

          await CampusEarning.create({
            participant: participant._id,
            source: "blog_reward",
            referenceId: blog._id,
            referenceModel: "CampusBlog",
            amount: reward,
            points: 100,
            status: "approved",
            description: `Milestone Achieved: Blog "${blog.title.slice(0, 30)}..." reached ${threshold}+ genuine views!`,
          });
        }
      }

      await blog.save();
    }

    return res.json({ success: true, views: blog.views, reached500: blog.reached500Views });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error tracking view" });
  }
};

/* ────────────────────────────────────────────────────────────
   7. COURSE SALES & 10% COMMISSIONS
──────────────────────────────────────────────────────────── */
export const getMyCourseSales = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const participant = await CampusParticipant.findOne({ user: userId });

    if (!participant) {
      return res.status(403).json({ success: false, message: "Not enrolled in Campus Program" });
    }

    const sales = await CampusCourseSale.find({ participant: participant._id })
      .populate("course", "title price bannerImage slug")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    const courses = await Course.find({ isPublished: { $ne: false } }).select("title price bannerImage slug");

    return res.status(200).json({
      success: true,
      sales,
      courses,
      referralCode: participant.referralCode,
    });
  } catch (error) {
    console.error("Get Course Sales Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch course sales" });
  }
};

/* ────────────────────────────────────────────────────────────
   8. REFERRALS LIST
──────────────────────────────────────────────────────────── */
export const getMyReferrals = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const participant = await CampusParticipant.findOne({ user: userId });

    if (!participant) {
      return res.status(403).json({ success: false, message: "Not enrolled in Campus Program" });
    }

    const referredUsers = await User.find({ referredBy: userId })
      .select("name email createdAt isEmailVerified purchasedCourses")
      .sort({ createdAt: -1 })
      .lean();

    const totalReferrals = referredUsers.length;
    const verifiedUsers = referredUsers.filter((u) => u.isEmailVerified).length;
    const buyersCount = referredUsers.filter((u) => u.purchasedCourses && u.purchasedCourses.length > 0).length;

    return res.status(200).json({
      success: true,
      referralCode: participant.referralCode,
      stats: {
        totalReferrals,
        verifiedUsers,
        buyersCount,
        conversionRate: totalReferrals > 0 ? ((buyersCount / totalReferrals) * 100).toFixed(1) : 0,
      },
      referrals: referredUsers,
    });
  } catch (error) {
    console.error("Get Referrals Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch referrals" });
  }
};

/* ────────────────────────────────────────────────────────────
   9. LEADERBOARD
──────────────────────────────────────────────────────────── */
export const getCampusLeaderboard = async (req, res) => {
  try {
    const { timeframe = "all" } = req.query;

    let sortField = { points: -1, totalEarnings: -1 };
    if (timeframe === "weekly") sortField = { weeklyPoints: -1, points: -1 };
    if (timeframe === "monthly") sortField = { monthlyPoints: -1, points: -1 };

    const topParticipants = await CampusParticipant.find({ status: "active" })
      .populate("user", "name email")
      .sort(sortField)
      .limit(50)
      .lean();

    const leaderboard = topParticipants.map((p, idx) => ({
      rank: idx + 1,
      id: p._id,
      name: p.user?.name || "Anonymous",
      collegeName: p.collegeName,
      branch: p.branch,
      role: p.role,
      points: timeframe === "weekly" ? p.weeklyPoints : timeframe === "monthly" ? p.monthlyPoints : p.points,
      totalEarnings: p.totalEarnings,
      joinedAt: p.joinedAt,
    }));

    return res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    console.error("Get Leaderboard Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch leaderboard" });
  }
};

/* ────────────────────────────────────────────────────────────
   10. EARNINGS & PAYOUTS
──────────────────────────────────────────────────────────── */
export const getMyEarnings = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const participant = await CampusParticipant.findOne({ user: userId });

    if (!participant) {
      return res.status(403).json({ success: false, message: "Not enrolled in Campus Program" });
    }

    const earnings = await CampusEarning.find({ participant: participant._id }).sort({ createdAt: -1 });
    const payouts = await CampusPayout.find({ participant: participant._id }).sort({ createdAt: -1 });
    const settings = await getSettings();

    return res.status(200).json({
      success: true,
      participant,
      earnings,
      payouts,
      minPayoutAmount: settings.minPayoutAmount || 100,
    });
  } catch (error) {
    console.error("Get Earnings Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch earnings" });
  }
};

export const updatePayoutDetails = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { upiId, bankAccount, ifsc, accountHolderName } = req.body;

    const participant = await CampusParticipant.findOne({ user: userId });
    if (!participant) {
      return res.status(403).json({ success: false, message: "Not enrolled in Campus Program" });
    }

    participant.payoutDetails = {
      upiId: upiId || participant.payoutDetails?.upiId || "",
      bankAccount: bankAccount || participant.payoutDetails?.bankAccount || "",
      ifsc: ifsc || participant.payoutDetails?.ifsc || "",
      accountHolderName: accountHolderName || participant.payoutDetails?.accountHolderName || "",
    };

    await participant.save();

    return res.status(200).json({
      success: true,
      message: "Payout details updated successfully",
      payoutDetails: participant.payoutDetails,
    });
  } catch (error) {
    console.error("Update Payout Details Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update payout details" });
  }
};

export const requestPayout = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { amount, paymentMethod } = req.body;

    const participant = await CampusParticipant.findOne({ user: userId });
    if (!participant) {
      return res.status(403).json({ success: false, message: "Not enrolled in Campus Program" });
    }

    const settings = await getSettings();
    const minAmount = settings.minPayoutAmount || 100;

    const reqAmount = Number(amount);
    if (!reqAmount || reqAmount < minAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum payout request amount is ₹${minAmount}`,
      });
    }

    const availableToWithdraw = (participant.approvedEarnings || 0) - (participant.paidEarnings || 0);

    if (reqAmount > availableToWithdraw) {
      return res.status(400).json({
        success: false,
        message: `Requested amount ₹${reqAmount} exceeds available balance ₹${availableToWithdraw}`,
      });
    }

    const payout = await CampusPayout.create({
      participant: participant._id,
      amount: reqAmount,
      paymentMethod: paymentMethod || "upi",
      paymentDetails: participant.payoutDetails,
      status: "requested",
    });

    return res.status(201).json({
      success: true,
      message: `Payout request for ₹${reqAmount} submitted successfully! Processing within 24-48 hours.`,
      payout,
    });
  } catch (error) {
    console.error("Request Payout Error:", error);
    return res.status(500).json({ success: false, message: "Failed to request payout" });
  }
};
