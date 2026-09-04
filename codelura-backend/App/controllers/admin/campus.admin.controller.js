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
import Blog from "../../models/Blog.js";

/* ────────────────────────────────────────────────────────────
   1. ADMIN OVERVIEW & COLLEGE ANALYTICS
──────────────────────────────────────────────────────────── */
export const getAdminCampusOverview = async (req, res) => {
  try {
    const [
      totalParticipants,
      activeParticipants,
      totalCourseSales,
      totalJobPromos,
      totalBlogs,
      totalPayouts,
      settings,
    ] = await Promise.all([
      CampusParticipant.countDocuments(),
      CampusParticipant.countDocuments({ status: "active" }),
      CampusCourseSale.find(),
      CampusJobPromotion.find(),
      CampusBlog.find(),
      CampusPayout.find(),
      CampusProgramSettings.findOne(),
    ]);

    const totalRevenueGenerated = totalCourseSales.reduce((acc, s) => acc + (s.coursePrice || 0), 0);
    const totalCommissions = totalCourseSales.reduce((acc, s) => acc + (s.commissionAmount || 0), 0);
    const totalJobRewards = totalJobPromos.filter((j) => j.status === "approved" || j.status === "paid").reduce((acc, j) => acc + (j.rewardAmount || 0), 0);
    const totalBlogRewards = totalBlogs.filter((b) => b.rewardStatus === "approved" || b.rewardStatus === "paid").reduce((acc, b) => acc + (b.rewardAmount || 0), 0);
    const totalPaid = totalPayouts.filter((p) => p.status === "paid").reduce((acc, p) => acc + (p.amount || 0), 0);
    const pendingPayouts = totalPayouts.filter((p) => p.status === "requested").reduce((acc, p) => acc + (p.amount || 0), 0);

    const pendingApprovalsCount = {
      taskSubmissions: await CampusTaskSubmission.countDocuments({ status: "submitted" }),
      jobPromotions: await CampusJobPromotion.countDocuments({ status: "submitted" }),
      blogs: await CampusBlog.countDocuments({ status: "submitted" }),
      payoutRequests: await CampusPayout.countDocuments({ status: "requested" }),
    };

    // College Level Breakdown
    const participants = await CampusParticipant.find().lean();
    const collegeMap = new Map();

    participants.forEach((p) => {
      const col = p.collegeName || "Unknown College";
      if (!collegeMap.has(col)) {
        collegeMap.set(col, {
          collegeName: col,
          participantsCount: 0,
          totalPoints: 0,
          totalEarnings: 0,
          salesCount: 0,
          participantIds: [],
        });
      }
      const data = collegeMap.get(col);
      data.participantsCount += 1;
      data.totalPoints += (p.points || 0);
      data.totalEarnings += (p.totalEarnings || 0);
      data.participantIds.push(p._id.toString());
    });

    const collegeAnalytics = Array.from(collegeMap.values()).map((c) => ({
      collegeName: c.collegeName,
      participantsCount: c.participantsCount,
      totalPoints: c.totalPoints,
      totalEarnings: c.totalEarnings,
      salesCount: totalCourseSales.filter((s) => c.participantIds.includes(s.participant?.toString())).length,
      jobPromosCount: totalJobPromos.filter((j) => c.participantIds.includes(j.participant?.toString())).length,
      blogsCount: totalBlogs.filter((b) => c.participantIds.includes(b.participant?.toString())).length,
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalParticipants,
        activeParticipants,
        totalRevenueGenerated,
        totalCommissions,
        totalJobRewards,
        totalBlogRewards,
        totalPaid,
        pendingPayouts,
        pendingApprovalsCount,
      },
      collegeAnalytics,
      settings: settings || {},
    });
  } catch (error) {
    console.error("Admin Campus Overview Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch admin overview" });
  }
};

/* ────────────────────────────────────────────────────────────
   2. PARTICIPANT MANAGEMENT
──────────────────────────────────────────────────────────── */
export const getAllParticipantsAdmin = async (req, res) => {
  try {
    const { status, college, q, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status && status !== "all") query.status = status;
    if (college && college !== "all") query.collegeName = new RegExp(college, "i");

    let participants = await CampusParticipant.find(query)
      .populate("user", "name email isEmailVerified")
      .sort({ points: -1, createdAt: -1 })
      .lean();

    if (q) {
      const term = q.toLowerCase();
      participants = participants.filter(
        (p) =>
          p.user?.name?.toLowerCase().includes(term) ||
          p.user?.email?.toLowerCase().includes(term) ||
          p.collegeName?.toLowerCase().includes(term) ||
          p.referralCode?.toLowerCase().includes(term) ||
          p.campusId?.toLowerCase().includes(term)
      );
    }

    const total = participants.length;
    const paginated = participants.slice((page - 1) * limit, page * limit);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      participants: paginated,
    });
  } catch (error) {
    console.error("Admin Get Participants Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch participants" });
  }
};

export const addParticipantAdmin = async (req, res) => {
  try {
    const { email, collegeName, branch, year, phone, role = "ambassador" } = req.body;

    if (!email || !collegeName) {
      return res.status(400).json({ success: false, message: "User email and college name are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: `No user found with email: ${email}` });
    }

    let existing = await CampusParticipant.findOne({ user: user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: "User is already registered as a Campus Participant" });
    }

    const cleanName = (user.name || "STUDENT").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 5) || "CDL";
    const referralCode = `CAMPUS-${cleanName}-${Math.floor(100 + Math.random() * 900)}`;
    const campusId = `CDL-CAMP-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const participant = await CampusParticipant.create({
      user: user._id,
      collegeName: collegeName.trim(),
      branch: branch || "",
      year: year || "",
      phone: phone || "",
      role,
      referralCode,
      campusId,
      status: "active",
      points: 50,
      weeklyPoints: 50,
      monthlyPoints: 50,
    });

    return res.status(201).json({
      success: true,
      message: "Participant onboarded successfully",
      participant,
    });
  } catch (error) {
    console.error("Admin Add Participant Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to add participant" });
  }
};

export const updateParticipantAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, role, points, collegeName, branch, year, phone } = req.body;

    const participant = await CampusParticipant.findById(id);
    if (!participant) return res.status(404).json({ message: "Participant not found" });

    if (status) participant.status = status;
    if (role) participant.role = role;
    if (collegeName) participant.collegeName = collegeName;
    if (branch) participant.branch = branch;
    if (year) participant.year = year;
    if (phone) participant.phone = phone;

    if (typeof points === "number" && points !== participant.points) {
      const diff = points - participant.points;
      participant.points = points;
      participant.weeklyPoints = Math.max(0, (participant.weeklyPoints || 0) + diff);
      participant.monthlyPoints = Math.max(0, (participant.monthlyPoints || 0) + diff);

      await CampusEarning.create({
        participant: participant._id,
        source: "manual_adjustment",
        amount: 0,
        points: diff,
        status: "approved",
        description: `Manual points adjustment by Admin: ${diff > 0 ? `+${diff}` : diff} pts`,
      });
    }

    await participant.save();

    return res.status(200).json({
      success: true,
      message: "Participant updated successfully",
      participant,
    });
  } catch (error) {
    console.error("Admin Update Participant Error:", error);
    return res.status(500).json({ success: false, message: "Failed to update participant" });
  }
};

/* ────────────────────────────────────────────────────────────
   3. TASK CREATION & SUBMISSIONS REVIEW
──────────────────────────────────────────────────────────── */
export const getAllTasksAdmin = async (req, res) => {
  try {
    const tasks = await CampusTask.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
};

export const createTaskAdmin = async (req, res) => {
  try {
    const { title, description, category, points, rewardAmount, deadline, targetColleges, actionLink, instructions } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const cleanCategory = (category || "social").toLowerCase().trim();

    const task = await CampusTask.create({
      title: title.trim(),
      description: description.trim(),
      category: cleanCategory,
      points: Number(points) || 50,
      rewardAmount: Number(rewardAmount) || 0,
      deadline: deadline ? new Date(deadline) : null,
      targetColleges: Array.isArray(targetColleges) ? targetColleges : targetColleges ? targetColleges.split(",").map((c) => c.trim()) : [],
      actionLink: actionLink || "",
      instructions: instructions || "",
      status: "active",
    });

    return res.status(201).json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    console.error("Admin Create Task Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to create task" });
  }
};

export const getAllTaskSubmissionsAdmin = async (req, res) => {
  try {
    const submissions = await CampusTaskSubmission.find()
      .populate("task")
      .populate({
        path: "participant",
        populate: { path: "user", select: "name email" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, submissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch submissions" });
  }
};

export const reviewTaskSubmissionAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pointsAwarded, rewardAwarded, adminNotes } = req.body;

    const submission = await CampusTaskSubmission.findById(id).populate("task").populate("participant");
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    const prevStatus = submission.status;
    submission.status = status; // approved | rejected | under_review
    submission.adminNotes = adminNotes || submission.adminNotes;
    submission.reviewedAt = new Date();
    submission.reviewedBy = req.user.id || req.user._id;

    if (status === "approved" && prevStatus !== "approved") {
      const pts = Number(pointsAwarded) || submission.task?.points || 50;
      const rwd = Number(rewardAwarded) || submission.task?.rewardAmount || 0;

      submission.pointsAwarded = pts;
      submission.rewardAwarded = rwd;

      const participant = await CampusParticipant.findById(submission.participant._id);
      if (participant) {
        participant.points = (participant.points || 0) + pts;
        participant.weeklyPoints = (participant.weeklyPoints || 0) + pts;
        participant.monthlyPoints = (participant.monthlyPoints || 0) + pts;

        if (rwd > 0) {
          participant.approvedEarnings = (participant.approvedEarnings || 0) + rwd;
          participant.totalEarnings = (participant.totalEarnings || 0) + rwd;
        }
        await participant.save();

        await CampusEarning.create({
          participant: participant._id,
          source: "task_reward",
          referenceId: submission._id,
          referenceModel: "CampusTaskSubmission",
          amount: rwd,
          points: pts,
          status: "approved",
          description: `Task Approved: "${submission.task?.title || "Campus Task"}"`,
        });
      }
    }

    await submission.save();

    return res.status(200).json({
      success: true,
      message: `Submission marked as ${status}`,
      submission,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to review task submission" });
  }
};

/* ────────────────────────────────────────────────────────────
   4. JOB PROMOTIONS VERIFICATION
──────────────────────────────────────────────────────────── */
export const getAllJobPromotionsAdmin = async (req, res) => {
  try {
    const promotions = await CampusJobPromotion.find()
      .populate("job", "title company location type")
      .populate({
        path: "participant",
        populate: { path: "user", select: "name email" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, promotions });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch job promotions" });
  }
};

export const reviewJobPromotionAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body; // approved | rejected

    const promotion = await CampusJobPromotion.findById(id).populate("participant");
    if (!promotion) return res.status(404).json({ message: "Job promotion not found" });

    const prevStatus = promotion.status;
    promotion.status = status;
    promotion.adminNotes = adminNotes || promotion.adminNotes;
    promotion.reviewedAt = new Date();
    promotion.reviewedBy = req.user.id || req.user._id;

    if (status === "approved" && prevStatus !== "approved") {
      const participant = await CampusParticipant.findById(promotion.participant._id);
      if (participant) {
        const reward = promotion.rewardAmount || 2;
        participant.pendingEarnings = Math.max(0, (participant.pendingEarnings || 0) - reward);
        participant.approvedEarnings = (participant.approvedEarnings || 0) + reward;
        participant.totalEarnings = (participant.totalEarnings || 0) + reward;
        participant.points = (participant.points || 0) + 15;
        await participant.save();

        await CampusEarning.create({
          participant: participant._id,
          source: "job_promotion",
          referenceId: promotion._id,
          referenceModel: "CampusJobPromotion",
          amount: reward,
          points: 15,
          status: "approved",
          description: `Job Promotion Verified: ₹${reward} rewarded`,
        });
      }
    } else if (status === "rejected" && prevStatus === "submitted") {
      const participant = await CampusParticipant.findById(promotion.participant._id);
      if (participant) {
        participant.pendingEarnings = Math.max(0, (participant.pendingEarnings || 0) - (promotion.rewardAmount || 2));
        await participant.save();
      }
    }

    await promotion.save();

    return res.status(200).json({
      success: true,
      message: `Job promotion marked as ${status}`,
      promotion,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to review job promotion" });
  }
};

/* ────────────────────────────────────────────────────────────
   5. BLOG REVIEW & PUBLISHING
──────────────────────────────────────────────────────────── */
export const getAllCampusBlogsAdmin = async (req, res) => {
  try {
    const blogs = await CampusBlog.find()
      .populate({
        path: "participant",
        populate: { path: "user", select: "name email" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
};

export const reviewCampusBlogAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, publishToMainBlog = true } = req.body; // published | rejected

    const campusBlog = await CampusBlog.findById(id).populate("participant");
    if (!campusBlog) return res.status(404).json({ message: "Blog not found" });

    campusBlog.status = status;
    campusBlog.adminNotes = adminNotes || campusBlog.adminNotes;

    if (status === "published" && !campusBlog.publishedBlog && publishToMainBlog) {
      // Create main Codelura Blog
      const authorUser = await User.findById(campusBlog.participant?.user);
      const newBlog = await Blog.create({
        title: campusBlog.title,
        slug: campusBlog.slug || `${campusBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`,
        content: campusBlog.content,
        excerpt: campusBlog.excerpt,
        coverImage: campusBlog.coverImage,
        category: campusBlog.category || "Tech",
        tags: campusBlog.tags,
        authorName: authorUser?.name || "Campus Contributor",
        isPublished: true,
        publishedAt: new Date(),
      });
      campusBlog.publishedBlog = newBlog._id;
    }

    await campusBlog.save();

    return res.status(200).json({
      success: true,
      message: `Blog status updated to ${status}`,
      campusBlog,
    });
  } catch (error) {
    console.error("Admin Review Blog Error:", error);
    return res.status(500).json({ success: false, message: "Failed to review blog" });
  }
};

/* ────────────────────────────────────────────────────────────
   6. COURSE SALES & COMMISSIONS
──────────────────────────────────────────────────────────── */
export const getAllCourseSalesAdmin = async (req, res) => {
  try {
    const sales = await CampusCourseSale.find()
      .populate("course", "title price")
      .populate("buyer", "name email")
      .populate({
        path: "participant",
        populate: { path: "user", select: "name email" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, sales });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch course sales" });
  }
};

/* ────────────────────────────────────────────────────────────
   7. PAYOUTS PROCESSING
──────────────────────────────────────────────────────────── */
export const getAllPayoutsAdmin = async (req, res) => {
  try {
    const payouts = await CampusPayout.find()
      .populate({
        path: "participant",
        populate: { path: "user", select: "name email" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, payouts });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch payouts" });
  }
};

export const processPayoutAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionId, receiptUrl, adminNotes } = req.body; // paid | rejected | processing

    const payout = await CampusPayout.findById(id).populate("participant");
    if (!payout) return res.status(404).json({ message: "Payout not found" });

    const prevStatus = payout.status;
    payout.status = status;
    payout.transactionId = transactionId || payout.transactionId;
    payout.receiptUrl = receiptUrl || payout.receiptUrl;
    payout.adminNotes = adminNotes || payout.adminNotes;
    payout.processedAt = new Date();
    payout.processedBy = req.user.id || req.user._id;

    if (status === "paid" && prevStatus !== "paid") {
      const participant = await CampusParticipant.findById(payout.participant._id);
      if (participant) {
        participant.paidEarnings = (participant.paidEarnings || 0) + payout.amount;
        await participant.save();

        await CampusEarning.create({
          participant: participant._id,
          source: "manual_adjustment",
          amount: -payout.amount,
          points: 0,
          status: "paid",
          payoutId: payout._id,
          description: `Payout Processed: ₹${payout.amount} via ${payout.paymentMethod.toUpperCase()} (Txn: ${payout.transactionId || "N/A"})`,
        });
      }
    }

    await payout.save();

    return res.status(200).json({
      success: true,
      message: `Payout marked as ${status}`,
      payout,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to process payout" });
  }
};

/* ────────────────────────────────────────────────────────────
   8. CONFIGURABLE REWARD SETTINGS
──────────────────────────────────────────────────────────── */
export const getCampusSettingsAdmin = async (req, res) => {
  try {
    let settings = await CampusProgramSettings.findOne();
    if (!settings) {
      settings = await CampusProgramSettings.create({});
    }
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
};

export const updateCampusSettingsAdmin = async (req, res) => {
  try {
    const {
      courseCommissionPercent,
      jobPromotionReward,
      blogViewsThreshold,
      blogViewsReward,
      referralSignupPoints,
      minPayoutAmount,
      isActive,
      announcement,
    } = req.body;

    let settings = await CampusProgramSettings.findOne();
    if (!settings) {
      settings = new CampusProgramSettings();
    }

    if (courseCommissionPercent !== undefined) settings.courseCommissionPercent = Number(courseCommissionPercent);
    if (jobPromotionReward !== undefined) settings.jobPromotionReward = Number(jobPromotionReward);
    if (blogViewsThreshold !== undefined) settings.blogViewsThreshold = Number(blogViewsThreshold);
    if (blogViewsReward !== undefined) settings.blogViewsReward = Number(blogViewsReward);
    if (referralSignupPoints !== undefined) settings.referralSignupPoints = Number(referralSignupPoints);
    if (minPayoutAmount !== undefined) settings.minPayoutAmount = Number(minPayoutAmount);
    if (isActive !== undefined) settings.isActive = Boolean(isActive);
    if (announcement !== undefined) settings.announcement = announcement;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Campus Program reward settings updated successfully",
      settings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update settings" });
  }
};
