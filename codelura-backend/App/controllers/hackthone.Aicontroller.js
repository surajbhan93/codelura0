import OpenAI from "openai";
import dotenv from "dotenv";
import ScoringService from "../services/Scoring/ScoringService.js";
import { generateAIFeedback } from "../services/aiOrchestrator.service.js";
dotenv.config();
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const cache = new Map();
const plagiarismCache = new Map();
const plagiarismHistory = [];
console.log(process.env.GROQ_API_KEY);

const ALLOWED_FLAGS = [
  "SHORT_DESCRIPTION",
  "MISSING_GITHUB",
  "GENERIC_IDEA",
  "UNCLEAR_IMPLEMENTATION",
  "WELL_DEFINED_PROJECT"
];

const ALLOWED_PLAGIARISM_FLAGS = [
  "DUPLICATE_DESCRIPTION",
  "DUPLICATE_GITHUB",
  "GENERIC_TEMPLATE",
  "SYSTEM_FALLBACK"
];

// const PROMPT_TEMPLATE = (title, description, stack, github) => `
// You are an expert hackathon reviewer.

// Classify the submission.

// Title: ${title}
// Description: ${description}
// Tech Stack: ${JSON.stringify(stack)}
// GitHub: ${github}

// Allowed flags:
// SHORT_DESCRIPTION
// MISSING_GITHUB
// GENERIC_IDEA
// UNCLEAR_IMPLEMENTATION
// WELL_DEFINED_PROJECT

// Return ONLY valid JSON.

// {
//  "quality_level":"LOW | MEDIUM | HIGH",
//  "ai_judging_required": true | false,
//  "flags": ["ONE OR MORE FROM ALLOWED FLAGS"],
//  "reason": "short explanation"
// }
// `;

const PROMPT_TEMPLATE = (
  title,
  description,
  problemStatement,
  solution,
  stack,
  github,
  demoVideo,
  liveUrl
) => `
You are an expert hackathon reviewer.

Classify the submission.

Title: ${title}

Description: ${description}

Problem Statement: ${problemStatement}

Solution: ${solution}

Tech Stack: ${JSON.stringify(stack)}

GitHub: ${github}

Demo Video: ${demoVideo}

Live URL: ${liveUrl}

Allowed flags:
SHORT_DESCRIPTION
MISSING_GITHUB
GENERIC_IDEA
UNCLEAR_IMPLEMENTATION
WELL_DEFINED_PROJECT

Return ONLY valid JSON.

{
 "quality_level":"LOW | MEDIUM | HIGH",
 "ai_judging_required": true | false,
 "flags": ["ONE OR MORE FROM ALLOWED FLAGS"],
 "reason": "short explanation"
}
`;

// const PLAGIARISM_PROMPT_TEMPLATE = (title, description, stack, github) => `
// You are an expert reviewer detecting plagiarism in hackathon projects.

// Analyze whether the project appears copied or very similar to another project.

// Title: ${title}
// Description: ${description}
// Tech Stack: ${JSON.stringify(stack)}
// GitHub Link: ${github}

// Return ONLY valid JSON.

// {
//  "plagiarism_level":"LOW | MEDIUM | HIGH",
//  "similarity_score": 0.0-1.0,
//  "flags": [],
//  "reason": "short explanation"
// }
// `;
const PLAGIARISM_PROMPT_TEMPLATE = (
  title,
  description,
  problemStatement,
  solution,
  stack,
  github
) => `
You are an expert reviewer detecting plagiarism in hackathon projects.

Title: ${title}

Description: ${description}

Problem Statement: ${problemStatement}

Solution: ${solution}

Tech Stack: ${JSON.stringify(stack)}

GitHub Link: ${github}

Return ONLY valid JSON.

{
 "plagiarism_level":"LOW | MEDIUM | HIGH",
 "similarity_score": 0.0-1.0,
 "flags": [],
 "reason": "short explanation"
}
`;

function wordCount(text) {
  return text.trim().split(/\s+/).length;
}

function validateAIResponse(data) {

 if (!data) return false;
 if (!["LOW","MEDIUM","HIGH"].includes(data.quality_level)) return false;
 if (typeof data.ai_judging_required !== "boolean") return false;
 if (!Array.isArray(data.flags)) return false;

 data.flags = data.flags.filter(flag => ALLOWED_FLAGS.includes(flag));

 if (typeof data.reason !== "string") return false;

 return true;
}

function validatePlagiarismResponse(data) {

  if (!data) return false;

  if (!["LOW", "MEDIUM", "HIGH"].includes(data.plagiarism_level)) return false;

  if (typeof data.similarity_score !== "number") return false;

  if (!Array.isArray(data.flags)) return false;

  data.flags = data.flags.filter(flag =>
    ALLOWED_PLAGIARISM_FLAGS.includes(flag)
  );

  if (typeof data.reason !== "string") return false;

  return true;
}

/* -------------------------------
   Submission Classifier Controller : Part -1
--------------------------------*/

export const classifySubmission = async (req, res) => {

  try {

    const {
  submissionId,
  projectTitle,
  projectDescription,
  problemStatement,
  solution,
  techStack,
  githubRepo,
  demoVideo,
  liveUrl
} = req.body;

    if (!submissionId) {
      return res.status(400).json({ error: "submissionId required" });
    }

    if (cache.has(submissionId)) {
      return res.json(cache.get(submissionId));
    }

    // const prompt = PROMPT_TEMPLATE(projectTitle, projectDescription, techStack, githubLink);
    const prompt = PROMPT_TEMPLATE(
  projectTitle,
  projectDescription,
  problemStatement,
  solution,
  techStack,
  githubRepo,
  demoVideo,
  liveUrl
);

    const completion = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    const raw = completion.choices[0].message.content;
    console.log("AI RESPONSE:", raw);
    const parsed = JSON.parse(raw);

    if (!validateAIResponse(parsed)) {
      throw new Error("Invalid AI response format");
    }

    cache.set(submissionId, parsed);

    return res.json(parsed);

  } catch (err) {

    return res.status(500).json({
      quality_level: "LOW",
      ai_judging_required: false,
      flags: ["UNCLEAR_IMPLEMENTATION"],
      reason: "AI processing failed"
    });

  }

};

/* -------------------------------
   Plagiarism Checker Controller part -2
--------------------------------*/

export const checkPlagiarism = async (req, res) => {

  try {

    // const { submissionId, projectTitle, projectDescription, techStack, githubLink } = req.body;
    const {
  submissionId,
  projectTitle,
  projectDescription,
  problemStatement,
  solution,
  techStack,
  githubRepo
} = req.body;

    if (!submissionId) {
      return res.status(400).json({ error: "submissionId required" });
    }

    if (plagiarismCache.has(submissionId)) {
      return res.json(plagiarismCache.get(submissionId));
    }

    const prompt = PLAGIARISM_PROMPT_TEMPLATE(
  projectTitle,
  projectDescription,
  problemStatement,
  solution,
  techStack,
  githubRepo
);

    const completion = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);

    if (!validatePlagiarismResponse(parsed)) {
      throw new Error("Invalid AI response");
    }

    plagiarismCache.set(submissionId, parsed);

    plagiarismHistory.push({
      submissionId,
      projectTitle,
      projectDescription,
      techStack,
     githubRepo
    });

    return res.json(parsed);

  } catch (err) {
    console.log("PLAGIARISM AI ERROR:", err);
    return res.json({
      plagiarism_level: "LOW",
      similarity_score: 0,
      flags: ["SYSTEM_FALLBACK"],
      reason: "Fallback plagiarism result"
    });

  }

};




// import ScoringService from "../services/ScoringService.js";

/**
 * POST /api/hackathon/judge
 * Evaluates a submission.   part -3
 */
export const judgeSubmission = async (req, res) => {
  try {

    const {
  submissionId,
  hackathonId,
  projectTitle,
  projectDescription,
  problemStatement,
  solution,
  techStack,
  githubRepo,
  demoVideo,
  liveUrl,
   force
} = req.body;

    // Basic Validation
    if (!submissionId || !hackathonId || !projectDescription) {
      return res.status(400).json({ 
        error: "Missing required fields: submissionId, hackathonId, and projectDescription are mandatory." 
      });
    }

    const submission = {
  submissionId,
  hackathonId,
  projectTitle,
  projectDescription,
  problemStatement,
  solution,
  techStack,
  githubRepo,
  demoVideo,
  liveUrl
};

    const result = await ScoringService.processSubmission(
      submission,
      force === true
    );

    // Validation Layer check (ensure scores are 0-10)
    const finalResponse = {
      rule_score: result.ruleScore,
      final_score: result.finalScore,
      evaluation_type: result.evaluationType,
      remarks: result.remarks,
    };

    return res.status(200).json(finalResponse);

  } catch (error) {

    console.error("Hackathon Judge Error:", error);

    return res.status(500).json({ 
      error: "Internal Server Error during evaluation.",
      message: error.message 
    });

  }
};


// Kartik 

// AI Usage Decision Engine - Controls when AI should be called

// Configuration (can be moved to env later)
const CONFIG = {
  MAX_AI_CALLS_PER_DAY: 100,
  MIN_RULE_SCORE_FOR_AI: 7.0,
  RATE_LIMIT_PER_MINUTE: 10,
};

// In-memory cache (in production, use Redis)
const decisionCache = new Map();
const rateLimitTracker = new Map();

// Helper: Check rate limit
const checkRateLimit = () => {
  const currentMinute = Math.floor(Date.now() / 60000);
  const key = `rate_${currentMinute}`;
  
  const count = rateLimitTracker.get(key) || 0;
  
  if (count >= CONFIG.RATE_LIMIT_PER_MINUTE) {
    return false; // Rate limit exceeded
  }
  
  rateLimitTracker.set(key, count + 1);
  
  // Clean old entries
  if (rateLimitTracker.size > 5) {
    const oldKeys = Array.from(rateLimitTracker.keys()).slice(0, -2);
    oldKeys.forEach(k => rateLimitTracker.delete(k));
  }
  
  return true;
};

// Main decision function
export const makeUsageDecision = async (req, res) => {
  try {
    const {
      requestType,
      submissionId,
      ruleScore,
      classificationLevel,
      plagiarismLevel,
      currentAiCallsUsed,
      maxAiCallsAllowed = CONFIG.MAX_AI_CALLS_PER_DAY
    } = req.body;

    // Validation
    if (!requestType || !submissionId) {
      return res.status(400).json({
        allowAiCall: false,
        decision: "BLOCK",
        reason: "Missing required fields: requestType or submissionId"
      });
    }

    // Check cache
    const cacheKey = `${submissionId}_${requestType}`;
    if (decisionCache.has(cacheKey)) {
      console.log(`✅ Cache hit for ${cacheKey}`);
      return res.json(decisionCache.get(cacheKey));
    }

    // Check rate limit
    if (!checkRateLimit()) {
      const response = {
        allowAiCall: false,
        decision: "FALLBACK",
        reason: "Rate limit exceeded - using rule-based fallback",
        fallbackStrategy: "RULE_BASED_ONLY"
      };
      return res.json(response);
    }

    // Decision Logic
    let decision = "BLOCK";
    let reason = "";
    let allowAiCall = false;
    let fallbackStrategy = "RULE_BASED_ONLY";

    // Rule 1: Budget Check (CRITICAL)
    if (currentAiCallsUsed >= maxAiCallsAllowed) {
      decision = "FALLBACK";
      reason = "AI budget exhausted - using rule-based scoring";
      allowAiCall = false;
    }
    
    // Rule 2: Low Quality Block
    else if (classificationLevel === "LOW") {
      decision = "BLOCK";
      reason = "Low quality submission - rule-based result sufficient";
      allowAiCall = false;
    }
    
    // Rule 3: High Plagiarism Block
    else if (plagiarismLevel === "HIGH") {
      decision = "BLOCK";
      reason = "High plagiarism detected - marked for manual review";
      allowAiCall = false;
      fallbackStrategy = "MANUAL_REVIEW";
    }
    
    // Rule 4: High Priority ALLOW
    else if (
      classificationLevel === "HIGH" && 
      ruleScore >= CONFIG.MIN_RULE_SCORE_FOR_AI &&
      currentAiCallsUsed < maxAiCallsAllowed
    ) {
      decision = "ALLOW";
      reason = "High-quality submission and budget available";
      allowAiCall = true;
      fallbackStrategy = null;
    }
    
    // Rule 5: Medium Priority Conditional
    else if (classificationLevel === "MEDIUM" && ruleScore >= 6.5) {
      // Allow only if budget is > 20% remaining
      const budgetRemaining = ((maxAiCallsAllowed - currentAiCallsUsed) / maxAiCallsAllowed) * 100;
      
      if (budgetRemaining > 20) {
        decision = "ALLOW";
        reason = "Medium quality with sufficient budget";
        allowAiCall = true;
        fallbackStrategy = null;
      } else {
        decision = "FALLBACK";
        reason = "Medium quality but low budget - conserving AI calls";
        allowAiCall = false;
      }
    }
    
    // Default: Block
    else {
      decision = "BLOCK";
      reason = "Does not meet criteria for AI usage";
      allowAiCall = false;
    }

    // Prepare response
    const response = {
      allowAiCall,
      decision,
      reason,
      ...(fallbackStrategy && { fallbackStrategy })
    };

    // Cache the decision (5 minutes TTL)
    decisionCache.set(cacheKey, response);
    setTimeout(() => decisionCache.delete(cacheKey), 5 * 60 * 1000);

    // Log metrics (in production, send to analytics)
    console.log(`📊 AI Decision: ${decision} | Type: ${requestType} | Score: ${ruleScore}`);

    return res.status(200).json(response);

  } catch (error) {
    console.error("AI Usage Decision Error:", error);
    
    // Graceful fallback on error
    return res.status(200).json({
      allowAiCall: false,
      decision: "FALLBACK",
      reason: "System error - using rule-based fallback",
      fallbackStrategy: "RULE_BASED_ONLY"
    });
  }
};

// Get current usage stats
export const getUsageStats = async (req, res) => {
  try {
    // In production, fetch from database
    const stats = {
      totalRequests: decisionCache.size,
      cacheSize: decisionCache.size,
      rateLimitRemaining: CONFIG.RATE_LIMIT_PER_MINUTE - (rateLimitTracker.get(`rate_${Math.floor(Date.now() / 60000)}`) || 0),
      config: CONFIG
    };

    return res.json(stats);
  } catch (error) {
    console.error("Stats Error:", error);
    return res.status(500).json({ message: "Error fetching stats" });
  }
};

// import { generateAIFeedback } from "../services/feedbackService.js";

export const getProjectFeedback = async (req, res) => {

    try {

        const {
            projectTitle,
            innovationScore,
            feasibilityScore,
            impactScore,
            classificationLevel,
            plagiarismLevel
        } = req.body;

        const feedback = await generateAIFeedback({
            projectTitle,
            innovationScore,
            feasibilityScore,
            impactScore,
            classificationLevel,
            plagiarismLevel
        });

        return res.json(feedback);

    } catch (error) {

        console.error("Feedback Error:", error);

        return res.status(500).json({
            message: "Error generating feedback"
        });

    }

};