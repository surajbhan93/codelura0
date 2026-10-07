import ReferralComment from "../models/ReferralComment.js";
import User from "../models/User.js";

/**
 * GET /api/referral-comments
 * Fetch all approved referral comments & rating stats for public display
 */
export const getPublicComments = async (req, res) => {
  try {
    const comments = await ReferralComment.find({ isApproved: true })
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();

    // Calculate rating stats
    const totalReviews = comments.length;
    let sumRating = 0;
    const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    for (const c of comments) {
      const r = Math.min(5, Math.max(1, Math.round(c.rating || 5)));
      sumRating += r;
      ratingBreakdown[r] = (ratingBreakdown[r] || 0) + 1;
    }

    const averageRating = totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : "5.0";

    return res.json({
      success: true,
      comments,
      stats: {
        totalReviews,
        averageRating: Number(averageRating),
        ratingBreakdown,
      },
    });
  } catch (error) {
    console.error("GET REFERRAL COMMENTS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch referral comments" });
  }
};

/**
 * POST /api/referral-comments
 * Post a new student comment / review (Requires authentication)
 */
export const createStudentComment = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { rating, comment, userRole, referralId } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required." });
    }

    const user = await User.findById(userId).select("name email avatar profilePicture role");
    const userName = user?.name || req.user?.name || "Verified Student";
    const userAvatar = user?.avatar || user?.profilePicture || req.user?.avatar || "";
    const roleTag = userRole || (user?.role === "admin" ? "Codelura Admin" : "Student Candidate");

    const newComment = await ReferralComment.create({
      userId,
      referralId: referralId || null,
      userName,
      userAvatar,
      userRole: roleTag,
      rating: Number(rating) || 5,
      comment: comment.trim(),
      isApproved: true,
      isAdminAdded: false,
    });

    return res.status(201).json({
      success: true,
      message: "Your review has been posted successfully!",
      comment: newComment,
    });
  } catch (error) {
    console.error("CREATE STUDENT COMMENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to post review." });
  }
};

/**
 * GET /api/referral-comments/admin
 * Admin API to list all comments
 */
export const getAdminComments = async (req, res) => {
  try {
    const comments = await ReferralComment.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("ADMIN GET REFERRAL COMMENTS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch comments for admin" });
  }
};

/**
 * POST /api/referral-comments/admin
 * Admin API to manually add student comments/reviews
 */
export const adminAddComment = async (req, res) => {
  try {
    const { userName, userAvatar, userRole, rating, comment, createdAt, isFeatured } = req.body;

    if (!userName || !userName.trim() || !comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: "Student name and comment are required." });
    }

    const newComment = await ReferralComment.create({
      userName: userName.trim(),
      userAvatar: userAvatar || "",
      userRole: userRole || "Verified Student",
      rating: Number(rating) || 5,
      comment: comment.trim(),
      isApproved: true,
      isFeatured: !!isFeatured,
      isAdminAdded: true,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Admin student review added successfully!",
      comment: newComment,
    });
  } catch (error) {
    console.error("ADMIN ADD COMMENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to add admin review." });
  }
};

/**
 * PATCH /api/referral-comments/admin/:id/approve
 * Toggle comment approval status
 */
export const adminToggleApproved = async (req, res) => {
  try {
    const commentItem = await ReferralComment.findById(req.params.id);
    if (!commentItem) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    commentItem.isApproved = !commentItem.isApproved;
    await commentItem.save();

    return res.json({
      success: true,
      message: `Comment ${commentItem.isApproved ? "approved" : "hidden"} successfully!`,
      comment: commentItem,
    });
  } catch (error) {
    console.error("ADMIN TOGGLE APPROVED ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to toggle approval status." });
  }
};

/**
 * DELETE /api/referral-comments/admin/:id
 * Delete a referral comment
 */
export const adminDeleteComment = async (req, res) => {
  try {
    const commentItem = await ReferralComment.findByIdAndDelete(req.params.id);
    if (!commentItem) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    return res.json({
      success: true,
      message: "Comment deleted successfully!",
    });
  } catch (error) {
    console.error("ADMIN DELETE COMMENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to delete comment." });
  }
};
