/**
 * LinkedIn Scheduler Cron Job
 * - Publishes scheduled LinkedIn job posts
 * - Monitors LinkedIn comments for AI auto-reply
 */

import cron from "node-cron";
import mongoose from "mongoose";
import LinkedInPromotion from "../models/LinkedInPromotion.js";
import LinkedInAuth from "../models/LinkedInAuth.js";
import linkedInService from "../services/linkedin.service.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let isRunning = false;
let lastHeartbeat = new Date();
let totalPublished = 0;
let totalReplies = 0;

/**
 * Process scheduled LinkedIn posts
 */
const publishScheduledPosts = async () => {
  try {
    // Find promotions that are scheduled and due now
    const now = new Date();
    const promotions = await LinkedInPromotion.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
      retryCount: { $lt: 3 }, // Max 3 retries
    })
      .sort({ scheduledAt: 1 })
      .limit(10) // Process max 10 at a time
      .populate("userId");

    if (promotions.length === 0) {
      return 0;
    }

    console.log(`[LinkedIn Scheduler] Found ${promotions.length} post(s) ready to publish`);

    let published = 0;

    for (const promotion of promotions) {
      try {
        // Update status to publishing
        promotion.status = "publishing";
        await promotion.save();

        // Get LinkedIn auth for user
        const auth = await LinkedInAuth.findOne({
          userId: promotion.userId,
          isActive: true,
          expiresAt: { $gt: new Date() },
        });

        if (!auth) {
          throw new Error("LinkedIn not connected or token expired");
        }

        // Determine author URN
        let authorUrn;
        if (promotion.linkedInPageId) {
          authorUrn = linkedInService.buildAuthorUrn(promotion.linkedInPageId, true);
        } else {
          authorUrn = linkedInService.buildAuthorUrn(auth.linkedInUserId, false);
        }

        // Upload media if provided
        let mediaAsset = null;
        if (promotion.mediaUrl) {
          try {
            mediaAsset = await linkedInService.uploadImage(
              auth.accessToken,
              authorUrn,
              promotion.mediaUrl
            );
          } catch (err) {
            console.error(`[LinkedIn Scheduler] Media upload failed for promotion ${promotion._id}:`, err.message);
            // Continue without media
          }
        }

        // Create LinkedIn post
        const result = await linkedInService.createPost(
          auth.accessToken,
          authorUrn,
          promotion.postContent,
          mediaAsset
        );

        // Mark as published
        await promotion.markAsPublished(result.postId, result.postUrl);
        
        published++;
        console.log(`[LinkedIn Scheduler] ✓ Published promotion ${promotion._id} (${result.postUrl})`);
      } catch (error) {
        console.error(`[LinkedIn Scheduler] Failed to publish promotion ${promotion._id}:`, error.message);
        
        // Mark as failed
        await promotion.markAsFailed(error.message);
      }
    }

    return published;
  } catch (error) {
    console.error("[LinkedIn Scheduler] Publish task error:", error.message);
    return 0;
  }
};

/**
 * Monitor LinkedIn comments for AI auto-reply
 */
const monitorComments = async () => {
  try {
    // Find published promotions with AI auto-reply enabled
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    const promotions = await LinkedInPromotion.find({
      status: "published",
      "aiAutoReply.enabled": true,
      linkedInPostId: { $ne: null },
      $or: [
        { "aiAutoReply.lastCheckedAt": null },
        { "aiAutoReply.lastCheckedAt": { $lt: thirtyMinutesAgo } },
      ],
    })
      .limit(5) // Process max 5 at a time
      .populate("jobId")
      .populate("userId");

    if (promotions.length === 0) {
      return 0;
    }

    console.log(`[LinkedIn Scheduler] Checking comments for ${promotions.length} post(s)`);

    let repliesGenerated = 0;

    for (const promotion of promotions) {
      try {
        // Get LinkedIn auth
        const auth = await LinkedInAuth.findOne({
          userId: promotion.userId,
          isActive: true,
          expiresAt: { $gt: new Date() },
        });

        if (!auth) {
          console.warn(`[LinkedIn Scheduler] LinkedIn auth expired for promotion ${promotion._id}`);
          continue;
        }

        // Get comments
        const comments = await linkedInService.getPostComments(
          auth.accessToken,
          promotion.linkedInPostId
        );

        if (comments.length === 0) {
          // Update last checked time
          promotion.aiAutoReply.lastCheckedAt = new Date();
          await promotion.save();
          continue;
        }

        console.log(`[LinkedIn Scheduler] Found ${comments.length} comment(s) on promotion ${promotion._id}`);

        // Filter comments that need replies
        // TODO: Track replied comments in database to avoid duplicates
        // For now, we'll generate replies but wait for approval

        for (const comment of comments.slice(0, 3)) {
          // Max 3 comments per post per check
          try {
            // Generate AI reply
            const prompt = `A user commented on our LinkedIn job post for "${promotion.jobId?.title || "a position"}" at ${promotion.jobId?.company || "our company"}:

Comment: "${comment.message?.text || comment.text}"

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
                  content:
                    "You are a professional HR representative responding to LinkedIn comments on job posts. Be helpful, professional, and encouraging.",
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

            const replyText = completion.choices[0]?.message?.content || "";

            if (!replyText) {
              continue;
            }

            // If auto mode, post reply immediately
            if (promotion.aiAutoReply.mode === "automatic") {
              await linkedInService.replyToComment(
                auth.accessToken,
                promotion.linkedInPostId,
                replyText
              );
              
              repliesGenerated++;
              console.log(`[LinkedIn Scheduler] ✓ Auto-replied to comment on promotion ${promotion._id}`);
            } else {
              // TODO: Store reply in database for admin approval
              console.log(`[LinkedIn Scheduler] Generated reply for approval on promotion ${promotion._id}`);
              repliesGenerated++;
            }
          } catch (error) {
            console.error(`[LinkedIn Scheduler] Failed to process comment:`, error.message);
          }
        }

        // Update last checked time
        promotion.aiAutoReply.lastCheckedAt = new Date();
        await promotion.save();
      } catch (error) {
        console.error(`[LinkedIn Scheduler] Comment monitoring error for promotion ${promotion._id}:`, error.message);
      }
    }

    return repliesGenerated;
  } catch (error) {
    console.error("[LinkedIn Scheduler] Comment monitoring task error:", error.message);
    return 0;
  }
};

/**
 * Server restart recovery - process overdue posts
 */
const recoverOverduePosts = async () => {
  try {
    console.log("[LinkedIn Scheduler] Checking for overdue posts after server restart...");

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const overduePosts = await LinkedInPromotion.countDocuments({
      status: "scheduled",
      scheduledAt: { $lte: now, $gte: oneHourAgo },
      retryCount: { $lt: 3 },
    });

    if (overduePosts > 0) {
      console.log(`[LinkedIn Scheduler] Found ${overduePosts} overdue post(s). Processing now...`);
      await publishScheduledPosts();
    } else {
      console.log("[LinkedIn Scheduler] No overdue posts found.");
    }

    // Reset any stuck "publishing" status
    const stuckPosts = await LinkedInPromotion.updateMany(
      {
        status: "publishing",
        updatedAt: { $lt: oneHourAgo },
      },
      {
        $set: {
          status: "failed",
          errorMessage: "Publishing stuck - worker may have crashed",
        },
        $inc: { retryCount: 1 },
      }
    );

    if (stuckPosts.modifiedCount > 0) {
      console.log(`[LinkedIn Scheduler] Reset ${stuckPosts.modifiedCount} stuck post(s)`);
    }
  } catch (err) {
    console.error("[LinkedIn Scheduler] Recovery error:", err.message);
  }
};

/**
 * Main scheduler task - publishes scheduled posts
 */
const publisherTask = async () => {
  if (isRunning) {
    console.log("[LinkedIn Scheduler] Previous task still running, skipping...");
    return;
  }

  if (mongoose.connection.readyState !== 1) {
    console.warn("[LinkedIn Scheduler] Database not connected, skipping...");
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    const count = await publishScheduledPosts();
    const duration = Date.now() - startTime;

    if (count > 0) {
      totalPublished += count;
      console.log(
        `[LinkedIn Scheduler] ✓ Published ${count} post(s) in ${duration}ms (total: ${totalPublished})`
      );
    }

    lastHeartbeat = new Date();
  } catch (err) {
    console.error("[LinkedIn Scheduler] Publisher task error:", err.message);
  } finally {
    isRunning = false;
  }
};

/**
 * Comment monitoring task
 */
const commentMonitorTask = async () => {
  if (mongoose.connection.readyState !== 1) return;

  try {
    const count = await monitorComments();

    if (count > 0) {
      totalReplies += count;
      console.log(`[LinkedIn Scheduler] Generated ${count} AI repl(y/ies) (total: ${totalReplies})`);
    }
  } catch (err) {
    console.error("[LinkedIn Scheduler] Comment monitor task error:", err.message);
  }
};

/**
 * Health check and stats logging
 */
const healthCheck = async () => {
  try {
    if (mongoose.connection.readyState !== 1) return;

    const now = new Date();
    const stats = {
      heartbeat: lastHeartbeat,
      totalPublished,
      totalReplies,
      scheduled: await LinkedInPromotion.countDocuments({ status: "scheduled" }),
      publishing: await LinkedInPromotion.countDocuments({ status: "publishing" }),
      published: await LinkedInPromotion.countDocuments({ status: "published" }),
      failed: await LinkedInPromotion.countDocuments({ status: "failed", retryCount: { $gte: 3 } }),
      overdue: await LinkedInPromotion.countDocuments({
        status: "scheduled",
        scheduledAt: { $lt: now },
      }),
    };

    console.log(`[LinkedIn Scheduler] Health: ${JSON.stringify(stats)}`);

    if (stats.overdue > 5) {
      console.warn(`[LinkedIn Scheduler] ⚠️  ${stats.overdue} posts are overdue!`);
    }
  } catch (err) {
    console.error("[LinkedIn Scheduler] Health check error:", err.message);
  }
};

/**
 * Start the LinkedIn scheduler
 */
export const startLinkedInScheduler = () => {
  console.log("[LinkedIn Scheduler] Starting LinkedIn job promotion scheduler...");

  // Wait for database connection, then recover
  setTimeout(async () => {
    if (mongoose.connection.readyState === 1) {
      await recoverOverduePosts();
    }
  }, 5000); // Wait 5 seconds for DB to be ready

  // Publish scheduled posts every 2 minutes
  cron.schedule("*/2 * * * *", publisherTask);
  console.log("[LinkedIn Scheduler] ✓ Publisher started (runs every 2 minutes)");

  // Monitor comments every 30 minutes
  cron.schedule("*/30 * * * *", commentMonitorTask);
  console.log("[LinkedIn Scheduler] ✓ Comment monitor started (runs every 30 minutes)");

  // Health check every 10 minutes
  cron.schedule("*/10 * * * *", healthCheck);
  console.log("[LinkedIn Scheduler] ✓ Health check enabled (every 10 minutes)");
};

/**
 * Get scheduler status (for admin dashboard)
 */
export const getLinkedInSchedulerStatus = async () => {
  const now = new Date();

  return {
    status: isRunning ? "running" : "idle",
    lastHeartbeat,
    totalPublished,
    totalReplies,
    uptime: process.uptime(),
    pending: await LinkedInPromotion.countDocuments({
      status: "scheduled",
      scheduledAt: { $lte: now },
    }),
    publishing: await LinkedInPromotion.countDocuments({ status: "publishing" }),
    published: await LinkedInPromotion.countDocuments({ status: "published" }),
    failed: await LinkedInPromotion.countDocuments({ status: "failed", retryCount: { $gte: 3 } }),
    scheduled: await LinkedInPromotion.countDocuments({ status: "scheduled" }),
  };
};
