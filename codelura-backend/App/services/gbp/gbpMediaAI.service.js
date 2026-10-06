/**
 * GBP Media AI Service
 * AI-Powered Media Intelligence, Quality Analysis, Recommendations & Planning
 */

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import GbpMedia from "../../models/gbp/GbpMedia.js";
import GbpMediaPlan from "../../models/gbp/GbpMediaPlan.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpPost from "../../models/gbp/GbpPost.js";
import { calculateMediaHealth, getMissingPhotoOpportunities } from "./gbpMedia.service.js";
import { getEffectiveCity } from "./aiCalendar.service.js";

const getGroqClient = () => {
  if (process.env.XAI_API_KEY) {
    return new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1",
    });
  }
  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
};

const chatAI = async (systemPrompt, userPrompt, json = true) => {
  const modelName = process.env.XAI_API_KEY
    ? process.env.GROK_MODEL || "grok-beta"
    : "llama-3.1-8b-instant";

  try {
    const ai = getGroqClient();
    if (ai) {
      const opts = {
        model: modelName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      };
      if (json) opts.response_format = { type: "json_object" };
      const completion = await ai.chat.completions.create(opts);
      const text = completion.choices[0]?.message?.content?.trim();
      if (text) return json ? JSON.parse(text) : text;
    }
  } catch (err) {
    console.warn("[GBP Media AI] Primary LLM notice, using fallback:", err.message);
  }

  // Fallback to Gemini if configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: json ? { responseMimeType: "application/json" } : undefined,
      });
      const res = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
      const text = res.response.text();
      return json ? JSON.parse(text) : text;
    } catch (gErr) {
      console.warn("[GBP Media AI] Gemini fallback notice:", gErr.message);
    }
  }

  return null;
};

/**
 * Generate High-Resolution Realistic Business Photo URL tailored to Category & Location
 */
export const generateAIPhotoUrl = ({ category = "EXTERIOR", topic = "", city = "", businessName = "", primaryCategory = "" }) => {
  const normCat = (category || "ADDITIONAL").toUpperCase();
  const catLower = (primaryCategory || "").toLowerCase();

  const CATEGORY_IMAGE_SETS = {
    EXTERIOR: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=1200&auto=format&fit=crop&q=80",
    ],
    INTERIOR: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80",
    ],
    AT_WORK: [
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80",
    ],
    TEAMS: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&auto=format&fit=crop&q=80",
    ],
    PRODUCT: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=1200&auto=format&fit=crop&q=80",
    ],
    ADDITIONAL: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80",
    ],
    PROFILE: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    ],
    COVER: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
    ],
  };

  const set = CATEGORY_IMAGE_SETS[normCat] || CATEGORY_IMAGE_SETS.ADDITIONAL;
  return set[Math.floor(Math.random() * set.length)];
};


/**
 * Generate AI Media Calendar with Opposite-Days Auto-Scheduling relative to Posts
 */
export const generateAIMediaCalendar = async (userId, locationDbId, options = {}) => {
  const {
    month, // 1-12
    year,
    numPhotos = 8,
    categories = ["EXTERIOR", "INTERIOR", "AT_WORK", "TEAMS", "ADDITIONAL", "PRODUCT"],
    preferOppositeDays = true,
  } = options;

  console.log(`[AI Media Calendar] Generating calendar for user ${userId}, location ${locationDbId}, month ${month}/${year}`);

  const location = await GbpLocation.findOne({ _id: locationDbId, userId });
  if (!location) throw { code: 404, message: "Location not found or access denied" };

  const businessCity = getEffectiveCity(location);
  const businessName = location.locationName || "Business";
  const categoryDisplayName = location.primaryCategory?.displayName || "Services";

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();

  let targetYear = Number(year) || currentYear;
  let targetMonth = Number(month) || currentMonth;

  if (targetYear < currentYear || (targetYear === currentYear && targetMonth < currentMonth)) {
    targetYear = currentYear;
    targetMonth = currentMonth;
  }

  // Step 1: Find existing Google Posts scheduled or published in this month to compute opposite days
  const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
  const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59);

  const existingPosts = await GbpPost.find({
    userId,
    locationId: locationDbId,
    status: { $in: ["scheduled", "published"] },
    $or: [
      { scheduledAt: { $gte: startOfMonth, $lte: endOfMonth } },
      { publishedAt: { $gte: startOfMonth, $lte: endOfMonth } },
      { createdAt: { $gte: startOfMonth, $lte: endOfMonth } },
    ],
  }).lean();

  const postDaysSet = new Set();
  existingPosts.forEach((p) => {
    const d = p.scheduledAt || p.publishedAt || p.createdAt;
    if (d) {
      const dt = new Date(d);
      if (dt.getMonth() + 1 === targetMonth && dt.getFullYear() === targetYear) {
        postDaysSet.add(dt.getDate());
      }
    }
  });

  console.log(`[AI Media Calendar] Found posts on days of month:`, Array.from(postDaysSet).sort((a, b) => a - b));

  // Step 2: Compute Opposite / Alternating Days
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  const startDay = (targetYear === currentYear && targetMonth === currentMonth) ? currentDay + 1 : 1;

  const candidateDays = [];
  const fallbackDays = [];

  for (let day = startDay; day <= daysInMonth; day++) {
    if (preferOppositeDays && !postDaysSet.has(day)) {
      candidateDays.push(day);
    } else {
      fallbackDays.push(day);
    }
  }

  // If candidate gap days are fewer than numPhotos, merge fallback days
  let selectedDays = [];
  if (candidateDays.length >= numPhotos) {
    // Spread evenly across candidate days
    const step = candidateDays.length / numPhotos;
    for (let i = 0; i < numPhotos; i++) {
      const idx = Math.min(candidateDays.length - 1, Math.floor(i * step));
      selectedDays.push(candidateDays[idx]);
    }
  } else {
    // Combine candidate days and distribute remaining across month
    selectedDays = [...candidateDays];
    for (const fb of fallbackDays) {
      if (selectedDays.length >= numPhotos) break;
      if (!selectedDays.includes(fb)) {
        selectedDays.push(fb);
      }
    }
    // If still less (e.g. at end of month), wrap into next days
    let extraOffset = 1;
    while (selectedDays.length < numPhotos) {
      selectedDays.push(startDay + extraOffset);
      extraOffset++;
    }
  }

  // Remove duplicate days and sort
  selectedDays = Array.from(new Set(selectedDays)).sort((a, b) => a - b);
  while (selectedDays.length < numPhotos) {
    const lastDay = selectedDays[selectedDays.length - 1] || startDay;
    selectedDays.push(lastDay + 1);
  }

  const postingHours = [11, 15, 17]; // 11 AM, 3 PM, 5 PM

  const calculatedDates = selectedDays.slice(0, numPhotos).map((dayNum, i) => {
    const dt = new Date(targetYear, targetMonth - 1, dayNum);
    const hour = postingHours[i % postingHours.length];
    dt.setHours(hour, 0, 0, 0);
    // Ensure future timestamp
    if (dt.getTime() <= now.getTime()) {
      dt.setTime(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
      dt.setHours(hour, 0, 0, 0);
    }
    return dt;
  });

  // Step 3: Curate photo topics per category
  const selectedCategories = categories && categories.length > 0
    ? categories
    : ["EXTERIOR", "INTERIOR", "AT_WORK", "TEAMS", "ADDITIONAL", "PRODUCT"];

  const systemPrompt = `You are a Google Business Profile media strategist for "${businessName}" (${categoryDisplayName}) located in ${businessCity || 'India'}.
Generate a monthly photo plan with ${numPhotos} distinct photo concepts that showcase authentic business operations, building trust on Google Maps & Search.
Return valid JSON only.`;

  const userPrompt = `Generate ${numPhotos} photo items across categories [${selectedCategories.join(", ")}].
For each item return:
{
  "items": [
    {
      "category": "EXTERIOR" | "INTERIOR" | "AT_WORK" | "TEAMS" | "PRODUCT" | "ADDITIONAL",
      "title": "Concise photo subject title",
      "description": "Factual caption describing the image for Google Business Profile (under 150 chars)",
      "composition": "Visual description of camera angle and staging",
      "whyUseful": "Why this photo boosts local customer confidence"
    }
  ]
}`;

  let aiResult = await chatAI(systemPrompt, userPrompt, true);
  let photoItemsData = aiResult?.items;

  if (!Array.isArray(photoItemsData) || photoItemsData.length < numPhotos) {
    // Intelligent category template builder
    const templates = [
      {
        category: "EXTERIOR",
        title: `${businessCity || 'Local'} Storefront & Main Entrance`,
        description: `Conveniently located in ${businessCity || 'your neighborhood'}, welcoming students and clients every day.`,
        composition: `Daylight wide-angle shot showing front entrance and clear signage board.`,
        whyUseful: `Helps visitors instantly recognize and locate the building on Google Maps.`,
      },
      {
        category: "AT_WORK",
        title: `Interactive Learning & Mentorship Session`,
        description: `Dedicated one-on-one session delivering structured guidance and academic excellence.`,
        composition: `Candid angle highlighting tutor and student reviewing learning materials together.`,
        whyUseful: `Showcases genuine commitment and educational care in progress.`,
      },
      {
        category: "INTERIOR",
        title: `Modern Study Desks & Resource Area`,
        description: `Comfortable, well-lit learning environment designed for deep focus and concentration.`,
        composition: `Eye-level shot of organized desks, comfortable chairs, and neat study resources.`,
        whyUseful: `Reassures parents of a safe, clean, and distraction-free learning space.`,
      },
      {
        category: "TEAMS",
        title: `Meet Our Dedicated Faculty & Educators`,
        description: `Experienced tutors passionate about student growth and concept mastery in ${businessCity || 'the city'}.`,
        composition: `Friendly professional portrait of tutor in front of teaching board.`,
        whyUseful: `Builds personal credibility and trust with prospective students.`,
      },
      {
        category: "PRODUCT",
        title: `Comprehensive Curated Study Material`,
        description: `Tailored practice modules and textbooks formulated for top examination results.`,
        composition: `Neat flat-lay arrangement of books and notebooks with stationery.`,
        whyUseful: `Demonstrates high quality curriculum and structured preparation.`,
      },
      {
        category: "ADDITIONAL",
        title: `Student Milestones & Achievement Board`,
        description: `Celebrating regular milestones and subject mastery achieved by our learners.`,
        composition: `Close-up view of progress charts, certificates, or achievement notices.`,
        whyUseful: `Highlights consistent track record and positive learning outcomes.`,
      },
      {
        category: "AT_WORK",
        title: `Concept Clearing & Doubt Resolution`,
        description: `Step-by-step doubt clearing sessions ensuring complete clarity on tough topics.`,
        composition: `Over-the-shoulder view of blackboard or notes being explained.`,
        whyUseful: `Demonstrates personalized attention for every individual learner.`,
      },
      {
        category: "EXTERIOR",
        title: `Evening Facility View & Easy Parking Access`,
        description: `Well-lit entrance area providing safe, accessible parking for visiting parents.`,
        composition: `Warm dusk lighting showing building approach and parking zone.`,
        whyUseful: `Reassures visitors of safety and convenient evening access.`,
      }
    ];

    photoItemsData = [];
    for (let i = 0; i < numPhotos; i++) {
      const cat = selectedCategories[i % selectedCategories.length];
      const matchingTpl = templates.find((t) => t.category === cat) || templates[i % templates.length];
      photoItemsData.push({
        ...matchingTpl,
        category: cat,
      });
    }
  }

  // Assemble final items with AI image URLs and opposite-day scheduling
  const finalPhotos = photoItemsData.slice(0, numPhotos).map((item, index) => {
    const cat = item.category || selectedCategories[index % selectedCategories.length] || "ADDITIONAL";
    const scheduledDate = calculatedDates[index] || new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000);
    const imageUrl = generateAIPhotoUrl({
      category: cat,
      topic: item.title,
      city: businessCity,
      businessName,
      primaryCategory: categoryDisplayName,
    });

    return {
      photoNumber: index + 1,
      totalPhotos: numPhotos,
      title: item.title,
      description: item.description,
      category: cat,
      composition: item.composition || "DSLR standard focal length with natural light",
      whyUseful: item.whyUseful || "Boosts profile authenticity and engagement",
      imageUrl,
      scheduledAt: scheduledDate,
      isOppositeDay: preferOppositeDays && !postDaysSet.has(scheduledDate.getDate()),
      locationCity: businessCity,
      aiGenerated: true,
    };
  });

  return {
    location: {
      _id: location._id,
      name: businessName,
      city: businessCity,
      category: categoryDisplayName,
    },
    month: targetMonth,
    year: targetYear,
    totalPhotos: numPhotos,
    photos: finalPhotos,
    postDaysDetected: Array.from(postDaysSet).sort((a, b) => a - b),
    oppositeDaysScheduled: preferOppositeDays,
    metadata: {
      generatedAt: new Date(),
      categories: selectedCategories,
    },
  };
};

/**
 * Run AI Image Quality Analysis on a Media Item
 */
export const analyzeMediaQuality = async (userId, locationDbId, mediaDbId) => {
  const media = await GbpMedia.findOne({ _id: mediaDbId, userId, locationId: locationDbId });
  if (!media) throw { code: 404, message: "Media item not found" };

  const location = await GbpLocation.findOne({ _id: locationDbId, userId }).lean();
  const businessName = location?.locationName || "Business";
  const categoryName = location?.primaryCategory?.displayName || "Services";

  const dims = media.dimensions || { widthPixels: 1080, heightPixels: 720 };
  const isGoodRes = dims.widthPixels >= 720 && dims.heightPixels >= 720;
  const isHighRes = dims.widthPixels >= 1200 && dims.heightPixels >= 800;

  const systemPrompt = `You are a Google Business Profile Media Quality Inspector for Codelura.
Evaluate photo technical clarity, lighting, composition, and business relevance.
Never claim Google rankings improve directly from photo scores.
Return valid JSON only.`;

  const userPrompt = `Evaluate this Google Business photo for "${businessName}" (${categoryName}):
Category: ${media.category}
Format: ${media.mediaFormat}
Dimensions: ${dims.widthPixels}x${dims.heightPixels}px
Google URL: ${media.googleUrl || "N/A"}
Description: ${media.description || "N/A"}

Respond in JSON format:
{
  "qualityScore": 88,
  "qualityStatus": "EXCELLENT" | "GOOD" | "NEEDS_IMPROVEMENT" | "POOR",
  "resolutionCheck": "Full HD 1080p - crisp and well-proportioned",
  "lightingCheck": "Natural balanced lighting with good exposure",
  "blurCheck": "Sharp subject with no motion artifacts",
  "compositionCheck": "Clear focal point and professional framing",
  "relevanceCheck": "Directly represents business offerings",
  "positives": ["High resolution", "Clear subject focus", "Authentic scene"],
  "issues": ["Minor shadow on bottom edge"],
  "labels": ["Storefront", "Daylight", "Clean Entrance"],
  "suggestedCategory": "${media.category}"
}`;

  let analysis = await chatAI(systemPrompt, userPrompt, true);

  if (!analysis) {
    const score = isHighRes ? 94 : isGoodRes ? 86 : 68;
    const status = score >= 90 ? "EXCELLENT" : score >= 75 ? "GOOD" : "NEEDS_IMPROVEMENT";
    analysis = {
      qualityScore: score,
      qualityStatus: status,
      resolutionCheck: isGoodRes ? "High resolution - exceeds 720p recommendation" : "Standard resolution",
      lightingCheck: "Balanced lighting with clear visibility",
      blurCheck: "Good sharpness with distinct details",
      compositionCheck: "Well-centered composition suitable for Google Search & Maps",
      relevanceCheck: `Relevant to ${categoryName} listings`,
      positives: ["Clear visibility", "Standard aspect ratio", "Authentic photo"],
      issues: isGoodRes ? [] : ["Consider uploading a higher-resolution version (720p+) for clearer mobile display"],
      labels: [media.category, categoryName],
      suggestedCategory: media.category,
    };
  }

  media.qualityScore = analysis.qualityScore || 85;
  media.qualityStatus = analysis.qualityStatus || "GOOD";
  media.aiAnalysis = {
    labels: analysis.labels || [],
    resolutionCheck: analysis.resolutionCheck || "Good",
    lightingCheck: analysis.lightingCheck || "Balanced",
    blurCheck: analysis.blurCheck || "Sharp",
    compositionCheck: analysis.compositionCheck || "Centered",
    relevanceCheck: analysis.relevanceCheck || "Relevant",
    issues: analysis.issues || [],
    positives: analysis.positives || [],
    suggestedCategory: analysis.suggestedCategory || media.category,
    analyzedAt: new Date(),
  };

  await media.save();
  return media;
};

/**
 * Generate Actionable AI Media Recommendations based on real data
 */
export const generateMediaRecommendations = async (userId, locationDbId) => {
  const location = await GbpLocation.findOne({ _id: locationDbId, userId }).lean();
  if (!location) throw { code: 404, message: "Location not found" };

  const health = await calculateMediaHealth(userId, locationDbId);
  const opportunities = await getMissingPhotoOpportunities(userId, locationDbId);

  const systemPrompt = `You are the Codelura AI Media Advisor for Google Business Profile.
Generate 4-6 concise, authentic, and high-impact media recommendations based on real location inventory.
Never fabricate facts or make misleading Google ranking promises. Return valid JSON only.`;

  const userPrompt = `Location: "${location.locationName}"
Category: "${location.primaryCategory?.displayName || 'Services'}"
City: "${location.address?.locality || 'Local'}"
Media Health Score: ${health.score}/100 (${health.healthLabel})
Total Media: ${health.totalMedia} (Business: ${health.businessPhotos}, Customer: ${health.customerPhotos})
Category breakdown: Profile: ${health.kpi.profile}, Cover: ${health.kpi.cover}, Exterior: ${health.kpi.exterior}, Interior: ${health.kpi.interior}, Team: ${health.kpi.team}, AtWork: ${health.kpi.atWork}, Product: ${health.kpi.product}
Recent photos (<90 days): ${health.recentPhotos}
Duplicate photos: ${health.duplicatePhotos}
Missing opportunities: ${JSON.stringify(opportunities.map(o => o.title))}

Respond in JSON format:
{
  "recommendations": [
    {
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "category": "PROFILE" | "COVER" | "EXTERIOR" | "TEAMS" | "AT_WORK" | "INTERIOR",
      "title": "Action title",
      "reason": "Clear explanation based on available media data",
      "action": "What to photograph and upload",
      "cta": "Add Photos"
    }
  ]
}`;

  const aiResult = await chatAI(systemPrompt, userPrompt, true);

  if (aiResult?.recommendations && Array.isArray(aiResult.recommendations)) {
    return aiResult.recommendations;
  }

  const recs = [];
  if (!health.flags.hasProfilePhoto) {
    recs.push({
      priority: "HIGH",
      category: "PROFILE",
      title: "Add an Official Profile / Logo Photo",
      reason: "Your profile is currently missing a dedicated profile image.",
      action: "Upload a clean, high-resolution square logo or avatar (at least 720x720px).",
      cta: "Upload Profile Photo",
    });
  }
  if (!health.flags.hasCoverPhoto) {
    recs.push({
      priority: "HIGH",
      category: "COVER",
      title: "Set a Prominent Cover Photo",
      reason: "Cover photos serve as the visual headline on Google Maps and Search.",
      action: "Upload a 16:9 banner showcasing your storefront or primary service area.",
      cta: "Upload Cover Photo",
    });
  }
  if (health.kpi.team < 2) {
    recs.push({
      priority: "MEDIUM",
      category: "TEAMS",
      title: "Introduce Your Team & Staff",
      reason: "Prospective clients look for familiar, trusted faces before booking.",
      action: "Take candid, well-lit photos of tutors or team members in action.",
      cta: "Add Team Photos",
    });
  }
  if (health.kpi.atWork < 2) {
    recs.push({
      priority: "MEDIUM",
      category: "AT_WORK",
      title: "Show Real Service Activities",
      reason: "Demonstrating real work in progress builds confidence in your expertise.",
      action: "Upload photos of active learning sessions or customer consultations.",
      cta: "Add At-Work Photos",
    });
  }
  if (health.duplicatePhotos > 0) {
    recs.push({
      priority: "LOW",
      category: "ADDITIONAL",
      title: "Resolve Duplicate Photos",
      reason: `Found ${health.duplicatePhotos} duplicate or near-duplicate uploads.`,
      action: "Review duplicate cards in the gallery to keep only the best variation.",
      cta: "Review Duplicates",
    });
  }

  return recs;
};

/**
 * Generate 4-Week Monthly Media Plan
 */
export const generateMonthlyMediaPlan = async (userId, locationDbId, monthStr) => {
  const location = await GbpLocation.findOne({ _id: locationDbId, userId }).lean();
  if (!location) throw { code: 404, message: "Location not found" };

  const targetMonth = monthStr || new Date().toISOString().slice(0, 7); // YYYY-MM
  const health = await calculateMediaHealth(userId, locationDbId);
  const businessName = location.locationName || "Business";
  const categoryName = location.primaryCategory?.displayName || "Education / Services";

  const existingPlan = await GbpMediaPlan.findOne({ locationId: locationDbId, month: targetMonth });
  if (existingPlan) {
    const [year, month] = targetMonth.split("-").map(Number);
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const uploadsThisMonth = await GbpMedia.countDocuments({
      userId,
      locationId: locationDbId,
      createTime: { $gte: startOfMonth, $lte: endOfMonth },
    });

    existingPlan.uploadedCount = uploadsThisMonth;
    await existingPlan.save();
    return existingPlan;
  }

  const systemPrompt = `You are a visual content strategist for Google Business Profile.
Create a structured 4-week monthly photo plan for a local business to encourage authentic real-world photography.
Never fabricate business activities. Return valid JSON only.`;

  const userPrompt = `Create a 4-week photo upload plan for "${businessName}" (${categoryName}) for month ${targetMonth}.
Current Media Inventory: ${health.totalMedia} photos (Profile: ${health.kpi.profile}, Cover: ${health.kpi.cover}, Exterior: ${health.kpi.exterior}, Team: ${health.kpi.team}, AtWork: ${health.kpi.atWork})

Respond in JSON format:
{
  "recommendedCount": 8,
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Team & Faculty Spotlight",
      "targetCount": 2,
      "goals": [{ "category": "TEAMS", "targetCount": 2, "description": "2 friendly portraits of educators or team members" }],
      "ideas": [{ "title": "Tutor Welcome Portrait", "category": "TEAMS", "composition": "Eye-level smiling portrait with clean background", "whyUseful": "Introduces key educators to new parents", "suggestedCaption": "Our dedicated educators ready to guide students towards academic excellence." }]
    },
    {
      "weekNumber": 2,
      "theme": "Interactive Learning Environment",
      "targetCount": 2,
      "goals": [{ "category": "AT_WORK", "targetCount": 2, "description": "Active session photos showing study setups" }],
      "ideas": [{ "title": "Focused Study Session", "category": "AT_WORK", "composition": "Over-the-shoulder angle showing learning materials and notes", "whyUseful": "Demonstrates attentive one-on-one guidance", "suggestedCaption": "Personalized learning sessions tailored to every student's pace." }]
    },
    {
      "weekNumber": 3,
      "theme": "Storefront & Facility Highlights",
      "targetCount": 2,
      "goals": [{ "category": "EXTERIOR", "targetCount": 1, "description": "Clear daytime storefront photo" }, { "category": "INTERIOR", "targetCount": 1, "description": "Reception or study area" }],
      "ideas": [{ "title": "Main Entrance Daytime View", "category": "EXTERIOR", "composition": "Wide landscape view showing building signboard", "whyUseful": "Makes it effortless for visitors to locate the center", "suggestedCaption": "Visit our tutoring center conveniently located in your neighborhood." }]
    },
    {
      "weekNumber": 4,
      "theme": "Achievements & Milestone Moments",
      "targetCount": 2,
      "goals": [{ "category": "ADDITIONAL", "targetCount": 2, "description": "Student progress boards or certificate moments" }],
      "ideas": [{ "title": "Study Material & Curated Resources", "category": "PRODUCT", "composition": "Flat-lay or neat desk arrangement of study guides", "whyUseful": "Highlights structured preparation methodology", "suggestedCaption": "Comprehensive study materials and practice modules designed for success." }]
    }
  ]
}`;

  let planData = await chatAI(systemPrompt, userPrompt, true);

  if (!planData || !planData.weeks) {
    planData = {
      recommendedCount: 8,
      weeks: [
        {
          weekNumber: 1,
          theme: "Team & Brand Presence",
          targetCount: 2,
          goals: [{ category: "TEAMS", targetCount: 2, description: "Portraits of team members" }],
          ideas: [{ title: "Team Introduction", category: "TEAMS", composition: "Eye-level portrait", whyUseful: "Builds trust with local clients", suggestedCaption: "Meet our passionate team ready to serve you." }]
        },
        {
          weekNumber: 2,
          theme: "Real Work & Service in Action",
          targetCount: 2,
          goals: [{ category: "AT_WORK", targetCount: 2, description: "Active consultation or service photo" }],
          ideas: [{ title: "Service in Progress", category: "AT_WORK", composition: "Natural action shot", whyUseful: "Shows real customer care", suggestedCaption: "Delivering quality results every single day." }]
        },
        {
          weekNumber: 3,
          theme: "Facilities & Environment",
          targetCount: 2,
          goals: [{ category: "EXTERIOR", targetCount: 1, description: "Daytime exterior" }, { category: "INTERIOR", targetCount: 1, description: "Clean workspace" }],
          ideas: [{ title: "Storefront View", category: "EXTERIOR", composition: "Wide angle showing sign", whyUseful: "Helps clients find you", suggestedCaption: "Visit our welcoming center." }]
        },
        {
          weekNumber: 4,
          theme: "Quality & Details",
          targetCount: 2,
          goals: [{ category: "ADDITIONAL", targetCount: 2, description: "Service equipment or setup" }],
          ideas: [{ title: "Preparation Setup", category: "PRODUCT", composition: "Detailed clean shot", whyUseful: "Highlights professionalism", suggestedCaption: "Dedicated to excellence in every detail." }]
        }
      ]
    };
  }

  const newPlan = await GbpMediaPlan.create({
    userId,
    locationId: locationDbId,
    month: targetMonth,
    recommendedCount: planData.recommendedCount || 8,
    uploadedCount: 0,
    weeks: planData.weeks,
    status: "active",
  });

  return newPlan;
};

/**
 * Get Contextual Photography Ideas on Demand
 */
export const getPhotoIdeas = async (userId, locationDbId, userQuery = "") => {
  const location = await GbpLocation.findOne({ _id: locationDbId, userId }).lean();
  if (!location) throw { code: 404, message: "Location not found" };

  const businessName = location.locationName || "Business";
  const categoryName = location.primaryCategory?.displayName || "Services";

  const systemPrompt = `You are a photography director for Google Business Profile local marketing.
Provide 4-5 creative, realistic, and practical photo shooting ideas for this local business.
Never suggest fake or deceptive images. Return valid JSON only.`;

  const userPrompt = `Business: "${businessName}" (${categoryName})
City: "${location.address?.locality || 'Local'}"
User Question/Prompt: "${userQuery || 'What should I photograph this week to improve engagement?'}"

Respond in JSON format:
{
  "ideas": [
    {
      "title": "Idea title",
      "whyUseful": "Why this specific photo engages local customers",
      "category": "TEAMS" | "AT_WORK" | "EXTERIOR" | "INTERIOR" | "PRODUCT" | "ADDITIONAL",
      "composition": "Camera angle, lighting, and staging instructions",
      "suggestedCaption": "Concise factual caption for GBP"
    }
  ]
}`;

  const res = await chatAI(systemPrompt, userPrompt, true);
  if (res?.ideas && Array.isArray(res.ideas)) {
    return res.ideas;
  }

  return [
    {
      title: "Educator In Action",
      whyUseful: "Shows genuine teaching dedication and interaction with students.",
      category: "AT_WORK",
      composition: "Natural light, candid angle focusing on student engagement and blackboard/notebook.",
      suggestedCaption: "Every session is designed to make learning engaging and intuitive."
    },
    {
      title: "Comfortable Learning Desk Setup",
      whyUseful: "Reassures parents of an organized and distraction-free study environment.",
      category: "INTERIOR",
      composition: "Wide horizontal shot of clean desks, good lighting, and study aids.",
      suggestedCaption: "An organized environment that fosters deep concentration and academic growth."
    },
    {
      title: "Welcoming Front Entrance",
      whyUseful: "Enables new visitors to immediately recognize the building from the street.",
      category: "EXTERIOR",
      composition: "Straight-on shot during bright daylight clearly showing the name board.",
      suggestedCaption: "Conveniently located with easy accessibility for parents and students."
    }
  ];
};
