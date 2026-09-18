import { getReviews, syncReviews, replyToReview, deleteReviewReply } from "../../services/gbp/gbpReview.service.js";

export const listReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, rating, replied, sort } = req.query;
    const result = await getReviews(req.user._id, req.params.locationId, { page: Number(page), limit: Number(limit), rating, replied, sort });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const syncLocationReviews = async (req, res) => {
  try {
    const result = await syncReviews(req.user._id, req.params.locationId);
    res.json({ success: true, message: `Synced ${result.synced} reviews.` });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const postReviewReply = async (req, res) => {
  try {
    const { replyText } = req.body;
    if (!replyText?.trim()) return res.status(400).json({ success: false, message: "Reply text is required." });
    const updated = await replyToReview(req.user._id, req.params.locationId, req.params.reviewId, replyText);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

export const removeReviewReply = async (req, res) => {
  try {
    await deleteReviewReply(req.user._id, req.params.locationId, req.params.reviewId);
    res.json({ success: true, message: "Reply removed." });
  } catch (err) {
    res.status(typeof err.status === "number" ? err.status : (typeof err.code === "number" ? err.code : 500)).json({ success: false, message: err.message });
  }
};

// Automation endpoints
import { getAutomationSettings, updateAutomationSettings } from "../../services/gbp/gbpReview.service.js";

export const getReviewAutomationSettings = async (req, res) => {
  try {
    const settings = await getAutomationSettings(req.user._id, req.params.locationId);
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateReviewAutomationSettings = async (req, res) => {
  try {
    const settings = await updateAutomationSettings(
      req.user._id,
      req.params.locationId,
      req.body
    );
    res.json({ success: true, data: settings, message: 'Automation settings updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
