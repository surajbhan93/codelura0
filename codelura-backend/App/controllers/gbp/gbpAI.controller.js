import { generateReviewReply, generateGooglePost, generateBusinessDescription, generateSEORecommendations, generate30DayPlan, generateFAQ, analyzeProfile } from "../../services/gbp/gbpGrokAI.service.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpSEOAudit from "../../models/gbp/GbpSEOAudit.js";
import GbpSEOActionPlan from "../../models/gbp/GbpSEOActionPlan.js";

const parseJSON = (str) => {
  try { return JSON.parse(str); } catch { return { raw: str }; }
};

export const aiReviewReply = async (req, res) => {
  try {
    const { businessName, reviewerName, rating, reviewText, businessTone } = req.body;
    if (!reviewText && !rating) return res.status(400).json({ success: false, message: "Review details required." });
    const reply = await generateReviewReply({ businessName, reviewerName, rating, reviewText, businessTone });
    res.json({ success: true, data: { reply } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiPost = async (req, res) => {
  try {
    const result = await generateGooglePost(req.body);
    if (result && typeof result === "object" && result.post) {
      res.json({ success: true, data: { post: result.post, imageUrl: result.imageUrl } });
    } else {
      res.json({ success: true, data: { post: result, imageUrl: null } });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiDescription = async (req, res) => {
  try {
    const desc = await generateBusinessDescription(req.body);
    res.json({ success: true, data: { description: desc } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiSEORecommendations = async (req, res) => {
  try {
    const { locationId } = req.params;
    const locationData = await GbpLocation.findOne({ _id: locationId, userId: req.user._id });
    const auditData = await GbpSEOAudit.findOne({ locationId }).sort({ createdAt: -1 });
    const raw = await generateSEORecommendations({ locationData, auditData, performanceData: req.body.performanceData, keywordData: req.body.keywordData });
    const parsed = parseJSON(raw);
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const ai30DayPlan = async (req, res) => {
  try {
    const { locationId } = req.params;
    const locationData = await GbpLocation.findOne({ _id: locationId, userId: req.user._id });
    const auditData = await GbpSEOAudit.findOne({ locationId }).sort({ createdAt: -1 });
    const raw = await generate30DayPlan({ locationData, auditData });
    const parsed = parseJSON(raw);

    // Save plan
    const plan = await GbpSEOActionPlan.findOneAndUpdate(
      { userId: req.user._id, locationId },
      { userId: req.user._id, locationId, days: parsed.days || [], generatedAt: new Date(), aiModel: process.env.GROK_MODEL || "groq" },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiFAQ = async (req, res) => {
  try {
    const raw = await generateFAQ(req.body);
    const parsed = parseJSON(raw);
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiAnalyzeProfile = async (req, res) => {
  try {
    const { locationId } = req.params;
    const locationData = await GbpLocation.findOne({ _id: locationId, userId: req.user._id });
    const raw = await analyzeProfile(locationData);
    const parsed = parseJSON(raw);
    res.json({ success: true, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSEOActionPlan = async (req, res) => {
  try {
    const plan = await GbpSEOActionPlan.findOne({ userId: req.user._id, locationId: req.params.locationId }).sort({ createdAt: -1 });
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePlanDay = async (req, res) => {
  try {
    const { locationId, planId, dayNumber } = req.params;
    const { isCompleted } = req.body;
    const plan = await GbpSEOActionPlan.findOneAndUpdate(
      { _id: planId, userId: req.user._id, locationId },
      { $set: { "days.$[elem].isCompleted": isCompleted, "days.$[elem].completedAt": isCompleted ? new Date() : null } },
      { arrayFilters: [{ "elem.day": Number(dayNumber) }], new: true }
    );
    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
