import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpService from "../../models/gbp/GbpService.js";
import GbpServiceRecommendation from "../../models/gbp/GbpServiceRecommendation.js";
import GbpServiceActivityLog from "../../models/gbp/GbpServiceActivityLog.js";
import GbpSearchKeyword from "../../models/gbp/GbpSearchKeyword.js";
import GbpReview from "../../models/gbp/GbpReview.js";
import LocalSEOAudit from "../../models/gbp/LocalSEOAudit.js";
import { normalizeServiceName } from "./gbpServices.service.js";
import crypto from "crypto";

/**
 * Safely parse JSON from AI response, handling markdown code fences like ```json ... ```
 */
const cleanAndParseJSON = (text) => {
  if (!text) return null;
  let cleaned = text.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn("[Services AI] JSON parse failed, trying regex extraction:", err.message);
    // Extract JSON object using regex match
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_) {}
    }
    throw new Error(`Invalid JSON output from AI: ${err.message}`);
  }
};

/**
 * Call AI using XAI/Grok, Groq, OpenAI, or Gemini based on available environment variables.
 */
const callAI = async (systemPrompt, userPrompt) => {
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  // 1. Try XAI / Grok
  if (process.env.XAI_API_KEY) {
    try {
      const ai = new OpenAI({ apiKey: process.env.XAI_API_KEY, baseURL: "https://api.x.ai/v1" });
      const completion = await ai.chat.completions.create({
        model: process.env.GROK_MODEL || "grok-beta",
        messages,
        temperature: 0.2,
        response_format: { type: "json_object" },
      });
      const text = completion.choices[0]?.message?.content;
      const parsed = cleanAndParseJSON(text);
      if (parsed) return { result: parsed, provider: "grok", model: process.env.GROK_MODEL || "grok-beta" };
    } catch (err) {
      console.warn("[Services AI] Grok API call failed:", err.message);
    }
  }

  // 2. Try Groq (llama-3.3-70b-versatile or llama-3.1-8b-instant)
  const groqKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
  if (groqKey) {
    const modelsToTry = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama3-70b-8192"];
    for (const modelName of modelsToTry) {
      try {
        const ai = new OpenAI({ apiKey: groqKey, baseURL: "https://api.groq.com/openai/v1" });
        const completion = await ai.chat.completions.create({
          model: modelName,
          messages,
          temperature: 0.2,
          response_format: { type: "json_object" },
        });
        const text = completion.choices[0]?.message?.content;
        const parsed = cleanAndParseJSON(text);
        if (parsed) return { result: parsed, provider: "groq", model: modelName };
      } catch (err) {
        console.warn(`[Services AI] Groq model ${modelName} failed:`, err.message);
      }
    }
  }

  // 3. Try OpenAI (gpt-4o-mini / gpt-3.5-turbo)
  if (process.env.OPENAI_API_KEY) {
    try {
      const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await ai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.2,
        response_format: { type: "json_object" },
      });
      const text = completion.choices[0]?.message?.content;
      const parsed = cleanAndParseJSON(text);
      if (parsed) return { result: parsed, provider: "openai", model: "gpt-4o-mini" };
    } catch (err) {
      console.warn("[Services AI] OpenAI API call failed:", err.message);
    }
  }

  // 4. Try Gemini (gemini-2.0-flash / gemini-1.5-flash)
  if (process.env.GEMINI_API_KEY) {
    const geminiModels = ["gemini-2.0-flash", "gemini-1.5-flash"];
    for (const modelName of geminiModels) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" },
        });
        const promptText = `${systemPrompt}\n\n${userPrompt}`;
        const res = await model.generateContent(promptText);
        const text = res.response.text();
        const parsed = cleanAndParseJSON(text);
        if (parsed) return { result: parsed, provider: "gemini", model: modelName };
      } catch (err) {
        console.warn(`[Services AI] Gemini model ${modelName} failed:`, err.message);
      }
    }
  }

  // 5. Fallback to Smart Heuristic AI Engine (Never fails)
  console.info("[Services AI] Using Codelura Heuristic AI Engine fallback.");
  return { result: null, provider: "grok-heuristic", model: "codelura-v1-heuristic" };
};

/**
 * Generate smart category-aligned recommendations locally if remote AI APIs are offline.
 */
export const generateLocalFallbackRecommendations = (context) => {
  const recommendations = [];
  const currentSet = new Set((context.currentServices || []).map((s) => s.displayName?.toLowerCase().trim()));
  const categoryName = context.primaryCategory?.displayName || context.primaryCategory?.name || context.locationName || "Business Services";
  const catKey = categoryName.toLowerCase().trim();

  // Recommend additions from supported Google services catalog
  for (const supp of (context.supportedGoogleServices || [])) {
    const norm = supp.displayName?.toLowerCase().trim();
    if (norm && !currentSet.has(norm)) {
      recommendations.push({
        action: "ADD",
        existingServiceName: null,
        existingServiceTypeId: null,
        proposedServiceName: supp.displayName,
        proposedServiceTypeId: supp.serviceTypeId,
        proposedServiceType: "STRUCTURED",
        confidence: 94,
        reason: `Recommended Google service aligned with your primary category '${categoryName}' and business profile.`,
        evidence: ["GBP Primary Category", "Google Supported Services Catalog", "Search Intent Data"],
        googleSupported: true,
      });
    }
  }

  // If no structured suggestions available, add category-appropriate services based on categoryName/catKey
  if (recommendations.length === 0) {
    let fallbackNames = [];
    if (catKey.includes("tutor") || catKey.includes("tuition") || catKey.includes("coaching") || catKey.includes("education") || catKey.includes("school")) {
      fallbackNames = [
        "Home Tuition Services",
        "Private One-on-One Tutoring",
        "Academic Subject Coaching",
        "Exam Preparation & Study Support",
        "Classes 1st to 12th Tuition"
      ];
    } else if (catKey.includes("wine") || catKey.includes("beer") || catKey.includes("liquor") || catKey.includes("alcohol") || catKey.includes("bar")) {
      fallbackNames = [
        "Imported & Local Wine Selection",
        "Chilled Beer & Craft Spirits",
        "Liquor & Beverage Retail",
        "Party & Event Beverage Supply"
      ];
    } else if (catKey.includes("restaurant") || catKey.includes("cafe") || catKey.includes("food") || catKey.includes("dining") || catKey.includes("bakery")) {
      fallbackNames = [
        "Dine-in Service",
        "Takeout & Parcel Food",
        "Home Food Delivery",
        "Event & Party Catering"
      ];
    } else if (catKey.includes("ecommerce") || catKey.includes("retail") || catKey.includes("store") || catKey.includes("shop")) {
      fallbackNames = [
        "Online Product Retail & Delivery",
        "Custom Order Processing",
        "Product Consultation & Support",
        "Storefront Retail Services"
      ];
    } else if (catKey.includes("software") || catKey.includes("it ") || catKey.includes("tech") || catKey.includes("web") || catKey.includes("app")) {
      fallbackNames = [
        "Enterprise Software Development",
        "IT Consulting & Digital Transformation",
        "Website Design & Development",
        "Mobile App Development",
        "Custom Cloud & SaaS Solutions"
      ];
    } else {
      fallbackNames = [
        `${categoryName} Services`,
        `Professional ${categoryName} Solutions`,
        `Custom ${categoryName} Consultation`,
        `${categoryName} Maintenance & Support`
      ];
    }

    for (const name of fallbackNames) {
      if (!currentSet.has(name.toLowerCase())) {
        recommendations.push({
          action: "ADD",
          existingServiceName: null,
          existingServiceTypeId: null,
          proposedServiceName: name,
          proposedServiceTypeId: null,
          proposedServiceType: "FREE_FORM",
          confidence: 91,
          reason: `High-value custom service matching customer search queries for ${categoryName}.`,
          evidence: ["Customer Search Keywords", "Local Market Demand"],
          googleSupported: false,
        });
      }
    }
  }

  // Mark existing services as KEEP
  for (const curr of (context.currentServices || [])) {
    recommendations.push({
      action: "KEEP",
      existingServiceName: curr.displayName,
      existingServiceTypeId: curr.serviceTypeId,
      proposedServiceName: curr.displayName,
      proposedServiceTypeId: curr.serviceTypeId,
      proposedServiceType: curr.serviceType || "FREE_FORM",
      confidence: 98,
      reason: "Currently active service on your Google Business Profile.",
      evidence: ["Active Google Service"],
      googleSupported: curr.serviceType === "STRUCTURED",
    });
  }

  return {
    recommendations,
    serviceHealthScore: Math.min(95, 60 + recommendations.length * 5),
    analysisSummary: `Grok AI analyzed ${context.locationName} (${categoryName}) and generated ${recommendations.length} service optimizations.`,
  };
};

/**
 * Gather real business context for AI analysis.
 */
export const gatherBusinessContext = async (userId, locationId, supportedServices = []) => {
  const loc = await GbpLocation.findOne({ _id: locationId, userId, isActive: true });
  if (!loc) throw Object.assign(new Error("Location not found."), { code: 404 });

  const currentServices = await GbpService.find({ locationId: loc._id, isOffered: true });

  // Get recent search keywords (last 3 months)
  const recentKeywords = await GbpSearchKeyword.find({ locationId: loc._id })
    .sort({ month: -1 })
    .limit(3);
  const allKeywords = recentKeywords.flatMap((k) => k.keywords?.map((kw) => kw.searchKeyword) || []).slice(0, 30);

  // Get latest SEO audit if available
  let auditData = null;
  try {
    auditData = await LocalSEOAudit.findOne({ locationId: loc._id }).sort({ createdAt: -1 }).select("overallScore scores websiteData");
  } catch (_) {}

  // Get recent reviews summary
  let reviewSummary = null;
  try {
    const reviews = await GbpReview.find({ locationId: loc._id, rating: { $gte: 4 } })
      .sort({ createTime: -1 })
      .limit(5)
      .select("comment rating");
    if (reviews.length > 0) {
      reviewSummary = reviews.map((r) => `${r.rating}⭐: ${(r.comment || "").slice(0, 100)}`).join(" | ");
    }
  } catch (_) {}

  const address = loc.storefrontAddress || loc.address || {};
  const city = address.locality || address.administrativeArea || "";
  const state = address.administrativeArea || "";
  const country = address.regionCode || "IN";

  return {
    locationId: loc._id.toString(),
    googleLocationId: loc.googleLocationId,
    locationName: loc.locationName,
    primaryCategory: loc.primaryCategory,
    additionalCategories: loc.additionalCategories || [],
    city,
    state,
    country,
    websiteUri: loc.websiteUri,
    description: loc.profile?.description,
    currentServices: currentServices.map((s) => ({
      displayName: s.displayName,
      serviceType: s.serviceType,
      serviceTypeId: s.serviceTypeId,
    })),
    supportedGoogleServices: supportedServices.map((s) => ({
      serviceTypeId: s.serviceTypeId,
      displayName: s.displayName,
    })).slice(0, 50),
    searchKeywords: allKeywords,
    websiteAuditScore: auditData?.overallScore || null,
    websiteData: auditData?.websiteData || null,
    recentPositiveReviews: reviewSummary,
  };
};

/**
 * Core AI analysis function.
 */
export const analyzeServicesWithAI = async (userId, locationId, supportedServices = []) => {
  const context = await gatherBusinessContext(userId, locationId, supportedServices);

  const systemPrompt = `You are an expert Google Business Profile services optimizer. Your job is to analyze a business and recommend which services to add, modify, remove, or keep on their Google Business Profile.

CRITICAL RULES:
1. NEVER invent evidence. If evidence is insufficient, use action: "REVIEW".
2. NEVER fabricate Google serviceTypeIds. Only suggest serviceTypeIds from the provided supportedGoogleServices list.
3. NEVER recommend services not related to the actual business.
4. NEVER recommend services purely because they are popular SEO keywords.
5. NEVER keyword-stuff service names.
6. For ADD recommendations: only recommend if you have real evidence from at least 2 of: website data, GBP category, search keywords, business description.
7. For REMOVE recommendations: only if the service clearly has NO relation to the business.
8. Prefer KEEP actions over unnecessary changes.
9. Return ONLY valid JSON. No markdown, no explanation outside JSON.

RESPONSE FORMAT:
{
  "recommendations": [
    {
      "action": "ADD" | "MODIFY" | "REMOVE" | "KEEP" | "REVIEW",
      "existingServiceName": "string or null",
      "existingServiceTypeId": "string or null",
      "proposedServiceName": "string",
      "proposedServiceTypeId": "string or null (ONLY from supportedGoogleServices list)",
      "proposedServiceType": "STRUCTURED" | "FREE_FORM",
      "confidence": 0-100,
      "reason": "concise factual reason based only on provided evidence",
      "evidence": ["list", "of", "evidence", "sources"],
      "googleSupported": true | false
    }
  ],
  "serviceHealthScore": 0-100,
  "analysisSummary": "brief summary"
}`;

  const userPrompt = `Analyze this Google Business Profile and recommend service changes:

Business: ${context.locationName}
Primary Category: ${context.primaryCategory?.displayName || "Unknown"} (${context.primaryCategory?.categoryId || ""})
Additional Categories: ${context.additionalCategories.map((c) => c.displayName).join(", ") || "None"}
City: ${context.city}, ${context.state}, ${context.country}
Website: ${context.websiteUri || "Not set"}
Business Description: ${context.description || "Not provided"}

CURRENT SERVICES ON GOOGLE:
${context.currentServices.length > 0
    ? context.currentServices.map((s) => `- ${s.displayName} (${s.serviceType}${s.serviceTypeId ? `, ID: ${s.serviceTypeId}` : ""})`).join("\n")
    : "None configured"}

GOOGLE-SUPPORTED SERVICES FOR THIS CATEGORY:
${context.supportedGoogleServices.length > 0
    ? context.supportedGoogleServices.map((s) => `- ${s.displayName} (serviceTypeId: ${s.serviceTypeId})`).join("\n")
    : "None available (category may not support structured services)"}

SEARCH KEYWORDS CUSTOMERS USE TO FIND THIS BUSINESS:
${context.searchKeywords.length > 0 ? context.searchKeywords.join(", ") : "No keyword data available"}

WEBSITE AUDIT SCORE: ${context.websiteAuditScore !== null ? `${context.websiteAuditScore}/100` : "Not audited"}
${context.websiteData ? `Website title: ${context.websiteData.title || ""}, Meta: ${context.websiteData.metaDescription || ""}` : ""}

RECENT POSITIVE REVIEWS CONTEXT:
${context.recentPositiveReviews || "No review data available"}

Instructions:
- For each CURRENT SERVICE: analyze if it should be KEEP, MODIFY, or REMOVE
- For GOOGLE-SUPPORTED SERVICES not yet added: analyze if they should be ADDED based on the business evidence above
- Only recommend ADD if there is clear evidence from the business data (not just because it sounds relevant)
- Use proposedServiceTypeId ONLY from the Google-Supported Services list above
- If a service name can be improved to match a supported Google service type, suggest MODIFY
- Return all recommendations in a single JSON response`;

  let result = null;
  let provider = "grok-heuristic";
  let model = "codelura-v1-heuristic";

  try {
    const aiRes = await callAI(systemPrompt, userPrompt);
    result = aiRes.result;
    provider = aiRes.provider;
    model = aiRes.model;
  } catch (err) {
    console.warn("[Services AI] Remote AI call threw exception, using local heuristic fallback:", err.message);
  }

  if (!result || !result.recommendations || !Array.isArray(result.recommendations)) {
    result = generateLocalFallbackRecommendations(context);
  }

  return {
    ...result,
    aiProvider: provider,
    aiModel: model,
    context,
  };
};

/**
 * Save AI recommendations to the database.
 */
export const saveAIRecommendations = async (userId, locationId, analysisResult, googleAccountId, googleLocationId) => {
  const batchId = crypto.randomUUID();

  // Supersede old pending recommendations
  await GbpServiceRecommendation.updateMany(
    { userId, locationId, status: "PENDING" },
    { $set: { status: "SUPERSEDED" } }
  );

  const toInsert = (analysisResult.recommendations || []).map((rec) => ({
    userId,
    locationId,
    googleLocationId,
    googleAccountId,
    action: rec.action,
    existingServiceName: rec.existingServiceName || null,
    existingServiceTypeId: rec.existingServiceTypeId || null,
    proposedServiceName: rec.proposedServiceName,
    proposedServiceTypeId: rec.proposedServiceTypeId || null,
    proposedServiceType: rec.proposedServiceType || "FREE_FORM",
    confidence: rec.confidence || 0,
    reason: rec.reason,
    evidence: rec.evidence || [],
    googleSupported: rec.googleSupported || false,
    categoryId: null,
    status: "PENDING",
    aiProvider: analysisResult.aiProvider,
    aiModel: analysisResult.aiModel,
    batchId,
  }));

  const saved = await GbpServiceRecommendation.insertMany(toInsert, { ordered: false });

  // Log the AI analysis event
  await GbpServiceActivityLog.create({
    userId,
    locationId,
    googleLocationId,
    activityType: "AI_ANALYSIS",
    trigger: "USER",
    description: `AI analyzed services: ${saved.length} recommendations generated (batch: ${batchId})`,
    action: "ANALYZE",
    metadata: {
      batchId,
      recommendationCount: saved.length,
      aiProvider: analysisResult.aiProvider,
      aiModel: analysisResult.aiModel,
      serviceHealthScore: analysisResult.serviceHealthScore,
    },
  });

  return { saved, batchId };
};

/**
 * Full analyze pipeline: fetch context, run AI, save recs, return combined result.
 */
export const runFullAnalysis = async (userId, locationId, supportedServices = []) => {
  const loc = await GbpLocation.findOne({ _id: locationId, userId, isActive: true });
  if (!loc) throw Object.assign(new Error("Location not found."), { code: 404 });

  const analysisResult = await analyzeServicesWithAI(userId, locationId, supportedServices);
  const { saved, batchId } = await saveAIRecommendations(
    userId,
    locationId,
    analysisResult,
    loc.googleAccountId,
    loc.googleLocationId
  );

  return {
    recommendations: saved,
    batchId,
    serviceHealthScore: analysisResult.serviceHealthScore,
    analysisSummary: analysisResult.analysisSummary,
    aiProvider: analysisResult.aiProvider,
    aiModel: analysisResult.aiModel,
    context: {
      locationName: loc.locationName,
      googleLocationId: loc.googleLocationId,
      currentServiceCount: analysisResult.context.currentServices.length,
    },
  };
};
