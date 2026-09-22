/**
 * LinkedIn Controller
 * Handles LinkedIn OAuth, job post generation, publishing, and auto-reply
 */

import linkedInService from "../services/linkedin.service.js";
import LinkedInPromotion from "../models/LinkedInPromotion.js";
import LinkedInAuth from "../models/LinkedInAuth.js";
import Job from "../models/Job.model.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Generate OAuth authorization URL
 */
export const initiateOAuth = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const state = Buffer.from(JSON.stringify({ userId, timestamp: Date.now() })).toString("base64");
    
    const authUrl = linkedInService.getAuthorizationUrl(state);
    
    res.json({
      success: true,
      authUrl,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Initiate OAuth error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to initiate LinkedIn OAuth",
    });
  }
};

/**
 * Handle OAuth callback
 */
export const handleOAuthCallback = async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;

    if (error) {
      return res.redirect(`${process.env.CLIENT_URL}/admin/jobs?linkedin_error=${encodeURIComponent(error_description || error)}`);
    }

    if (!code || !state) {
      return res.redirect(`${process.env.CLIENT_URL}/admin/jobs?linkedin_error=Invalid callback parameters`);
    }

    // Decode state
    const stateData = JSON.parse(Buffer.from(state, "base64").toString());
    const userId = stateData.userId;

    // Exchange code for token
    const tokenData = await linkedInService.getAccessToken(code);

    // Get user profile
    const profileData = await linkedInService.getUserProfile(tokenData.accessToken);

    // Get organization pages
    const organizationPages = await linkedInService.getOrganizationPages(tokenData.accessToken);

    // Save auth
    await linkedInService.saveAuth(userId, tokenData, profileData, organizationPages);

    // Redirect back to admin with success
    res.redirect(`${process.env.CLIENT_URL}/admin/jobs/create?linkedin_connected=true`);
  } catch (error) {
    console.error("[LinkedIn Controller] OAuth callback error:", error);
    res.redirect(`${process.env.CLIENT_URL}/admin/jobs?linkedin_error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Get LinkedIn connection status
 */
export const getConnectionStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const auth = await LinkedInAuth.findOne({ userId, isActive: true });

    if (!auth) {
      return res.json({
        success: true,
        connected: false,
      });
    }

    const isExpired = auth.isTokenExpired();

    res.json({
      success: true,
      connected: !isExpired,
      userName: auth.linkedInUserName,
      profileUrl: auth.linkedInProfileUrl,
      profilePicture: auth.linkedInProfilePicture,
      organizationPages: auth.organizationPages || [],
      expiresAt: auth.expiresAt,
      needsReconnect: isExpired,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Get status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get LinkedIn status",
    });
  }
};

/**
 * Disconnect LinkedIn
 */
export const disconnectLinkedIn = async (req, res) => {
  try {
    const userId = req.user._id;

    await linkedInService.disconnect(userId);

    res.json({
      success: true,
      message: "LinkedIn disconnected successfully",
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Disconnect error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to disconnect LinkedIn",
    });
  }
};

/**
 * Get organization pages
 */
export const getOrganizationPages = async (req, res) => {
  try {
    const userId = req.user._id;

    const auth = await linkedInService.getAuth(userId);

    const pages = auth.organizationPages || [];

    res.json({
      success: true,
      pages,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Get pages error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get organization pages",
    });
  }
};

/**
 * Generate LinkedIn job post using AI
 */
export const generateJobPost = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      type,
      salary,
      description,
      tags,
      careerPageUrl,
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({
        success: false,
        message: "Job title and company name are required",
      });
    }

    // Build prompt for AI
    const prompt = `Generate a professional LinkedIn job post for the following job:

Job Title: ${title}
Company: ${company}
Location: ${location || "Not specified"}
Job Type: ${type || "Not specified"}
Salary: ${salary || "Competitive"}
Description: ${description || "Not provided"}
Skills: ${tags || "Not specified"}
Apply URL: ${careerPageUrl || ""}

Requirements:
1. Professional and engaging tone suitable for LinkedIn
2. Start with an attention-grabbing hook
3. Include key job details (role, location, experience if mentioned)
4. Highlight 3-5 key responsibilities or requirements
5. Include a clear call-to-action
6. Add 5-8 relevant hashtags at the end
7. Keep total length under 3000 characters
8. Use emojis sparingly (2-3 maximum)
9. Do NOT invent information not provided
10. Format with line breaks for readability

Generate ONLY the post content, no additional commentary.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert LinkedIn content writer specializing in job postings. Generate professional, engaging job posts that attract top talent.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedPost = completion.choices[0]?.message?.content || "";

    // Extract hashtags
    const hashtagRegex = /#\w+/g;
    const hashtags = generatedPost.match(hashtagRegex) || [];

    res.json({
      success: true,
      post: generatedPost,
      hashtags: hashtags.map(h => h.substring(1)), // Remove # prefix
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Generate post error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate LinkedIn post",
    });
  }
};

/**
 * Create or update LinkedIn promotion
 */
export const savePromotion = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      jobId,
      linkedInPageId,
      linkedInPageName,
      postContent,
      mediaUrl,
      hashtags,
      publishMode,
      scheduledAt,
      aiAutoReply,
    } = req.body;

    if (!jobId || !postContent) {
      return res.status(400).json({
        success: false,
        message: "Job ID and post content are required",
      });
    }

    // Verify job exists and belongs to user
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Create or update promotion
    const promotionData = {
      jobId,
      userId,
      linkedInPageId,
      linkedInPageName,
      postContent,
      mediaUrl: mediaUrl || null,
      hashtags: hashtags || [],
      publishMode: publishMode || "now",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: publishMode === "scheduled" ? "scheduled" : "draft",
      aiAutoReply: aiAutoReply || { enabled: false, mode: "approval_required" },
    };

    const promotion = await LinkedInPromotion.findOneAndUpdate(
      { jobId, userId },
      promotionData,
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      promotion,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Save promotion error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to save LinkedIn promotion",
    });
  }
};

/**
 * Publish LinkedIn post immediately
 */
export const publishPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { promotionId } = req.params;

    // Get promotion
    const promotion = await LinkedInPromotion.findOne({
      _id: promotionId,
      userId,
    });

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    }

    // Get LinkedIn auth
    const auth = await linkedInService.getAuth(userId);

    // Determine author URN (user or organization)
    let authorUrn;
    if (promotion.linkedInPageId) {
      authorUrn = linkedInService.buildAuthorUrn(promotion.linkedInPageId, true);
    } else {
      authorUrn = linkedInService.buildAuthorUrn(auth.linkedInUserId, false);
    }

    // Upload image if mediaUrl provided
    let mediaAsset = null;
    if (promotion.mediaUrl) {
      try {
        mediaAsset = await linkedInService.uploadImage(
          auth.accessToken,
          authorUrn,
          promotion.mediaUrl
        );
      } catch (err) {
        console.error("[LinkedIn] Image upload failed:", err);
        // Continue without image
      }
    }

    // Update promotion status
    promotion.status = "publishing";
    await promotion.save();

    // Create post
    const result = await linkedInService.createPost(
      auth.accessToken,
      authorUrn,
      promotion.postContent,
      mediaAsset
    );

    // Mark as published
    await promotion.markAsPublished(result.postId, result.postUrl);

    res.json({
      success: true,
      message: "LinkedIn post published successfully",
      postId: result.postId,
      postUrl: result.postUrl,
      promotion,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Publish post error:", error);

    // Mark as failed
    if (req.params.promotionId) {
      try {
        const promotion = await LinkedInPromotion.findById(req.params.promotionId);
        if (promotion) {
          await promotion.markAsFailed(error.message);
        }
      } catch (err) {
        console.error("[LinkedIn] Failed to mark as failed:", err);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to publish LinkedIn post",
    });
  }
};

/**
 * Get promotion status
 */
export const getPromotionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    const promotion = await LinkedInPromotion.findOne({
      jobId,
      userId,
    }).populate("jobId", "title company");

    if (!promotion) {
      return res.json({
        success: true,
        promotion: null,
      });
    }

    res.json({
      success: true,
      promotion,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Get promotion status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get promotion status",
    });
  }
};

/**
 * Generate AI reply for a comment
 */
export const generateCommentReply = async (req, res) => {
  try {
    const { commentText, jobTitle, companyName } = req.body;

    if (!commentText) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const prompt = `A user commented on our LinkedIn job post for "${jobTitle}" at ${companyName}:

Comment: "${commentText}"

Generate a professional, helpful reply that:
1. Thanks them for their interest
2. Addresses their question/comment if applicable
3. Encourages them to apply
4. Keeps it brief (2-3 sentences)
5. Maintains professional tone

Generate ONLY the reply text, no additional commentary.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional HR representative responding to LinkedIn comments on job posts. Be helpful, professional, and encouraging.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.choices[0]?.message?.content || "";

    res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Generate reply error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate reply",
    });
  }
};

/**
 * Get comments for a LinkedIn post
 */
export const getPostComments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { promotionId } = req.params;

    const promotion = await LinkedInPromotion.findOne({
      _id: promotionId,
      userId,
    });

    if (!promotion || !promotion.linkedInPostId) {
      return res.status(404).json({
        success: false,
        message: "Promotion or post ID not found",
      });
    }

    const auth = await linkedInService.getAuth(userId);

    const comments = await linkedInService.getPostComments(
      auth.accessToken,
      promotion.linkedInPostId
    );

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Get comments error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get comments",
    });
  }
};

/**
 * Reply to a LinkedIn comment
 */
export const replyToComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { promotionId } = req.params;
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({
        success: false,
        message: "Reply text is required",
      });
    }

    const promotion = await LinkedInPromotion.findOne({
      _id: promotionId,
      userId,
    });

    if (!promotion || !promotion.linkedInPostId) {
      return res.status(404).json({
        success: false,
        message: "Promotion or post ID not found",
      });
    }

    const auth = await linkedInService.getAuth(userId);

    const result = await linkedInService.replyToComment(
      auth.accessToken,
      promotion.linkedInPostId,
      replyText
    );

    res.json({
      success: true,
      message: "Reply posted successfully",
      commentId: result.commentId,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Reply to comment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reply to comment",
    });
  }
};

/**
 * Get all LinkedIn promotions (Admin Dashboard)
 */
export const getAllPromotions = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, sortBy = "createdAt", order = "desc" } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === "asc" ? 1 : -1;

    const promotions = await LinkedInPromotion.find(filter)
      .populate("jobId", "title company location type")
      .populate("userId", "name email")
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await LinkedInPromotion.countDocuments(filter);

    res.json({
      success: true,
      promotions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Get all promotions error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch promotions",
    });
  }
};

/**
 * Get single promotion by ID
 */
export const getPromotionById = async (req, res) => {
  try {
    const { promotionId } = req.params;

    const promotion = await LinkedInPromotion.findById(promotionId)
      .populate("jobId")
      .populate("userId", "name email");

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    }

    res.json({
      success: true,
      promotion,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Get promotion by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch promotion",
    });
  }
};

/**
 * Cancel scheduled promotion
 */
export const cancelPromotion = async (req, res) => {
  try {
    const { promotionId } = req.params;

    const promotion = await LinkedInPromotion.findById(promotionId);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    }

    if (promotion.status !== "scheduled" && promotion.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel promotion with status: ${promotion.status}`,
      });
    }

    promotion.status = "cancelled";
    await promotion.save();

    res.json({
      success: true,
      message: "Promotion cancelled successfully",
      promotion,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Cancel promotion error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel promotion",
    });
  }
};

/**
 * Update auto-reply settings for a promotion
 */
export const updateAutoReplySettings = async (req, res) => {
  try {
    const { promotionId } = req.params;
    const { enabled, mode } = req.body;

    if (mode && !["automatic", "approval_required"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mode. Must be 'automatic' or 'approval_required'",
      });
    }

    const promotion = await LinkedInPromotion.findById(promotionId);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: "Promotion not found",
      });
    }

    if (enabled !== undefined) {
      promotion.aiAutoReply.enabled = enabled;
    }
    if (mode) {
      promotion.aiAutoReply.mode = mode;
    }

    await promotion.save();

    res.json({
      success: true,
      message: "Auto-reply settings updated successfully",
      aiAutoReply: promotion.aiAutoReply,
    });
  } catch (error) {
    console.error("[LinkedIn Controller] Update auto-reply settings error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update auto-reply settings",
    });
  }
};
