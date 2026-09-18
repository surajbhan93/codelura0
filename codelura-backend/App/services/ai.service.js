// import { GoogleGenerativeAI } from "@google/generative-ai";
import natural from "natural";
import Blog from "../models/Blog.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();
// Summery
// const apiKey = process.env.GEMINI_API_KEY;
// Groq setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
// const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
// const aiModel = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;

/**
 * Fallback logic: TF-IDF based sentence ranking
 */
const fallbackSummary = (content) => {
  const tokenizer = new natural.SentenceTokenizer();
  const sentences = tokenizer.tokenize(content);

  if (sentences.length <= 3) return sentences.join(" ");

  const tfidf = new natural.TfIdf();
  
  // Add each sentence as a document to TF-IDF
  sentences.forEach((sentence) => tfidf.addDocument(sentence));

  const rankedSentences = sentences.map((sentence, index) => {
    let score = 0;
    const words = sentence.toLowerCase().match(/\w+/g) || [];
    
    words.forEach((word) => {
      tfidf.tfidfs(word, (docIndex, tfidfScore) => {
        if (docIndex === index) {
          score += tfidfScore;
        }
      });
    });

    return { sentence, score, index };
  });

  // Sort by score descending and take top 3
  const topSentences = rankedSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Re-sort by original index to preserve order
  return topSentences
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence)
    .join(" ");
};

export const generateSummary = async (content, blogId = null, forceRefresh = false) => {
  // 1. Caching Check
  if (blogId && mongoose.Types.ObjectId.isValid(blogId) && !forceRefresh) {
    const blog = await Blog.findById(blogId);
    if (blog && blog.summary) {
      return blog.summary;
    }
  }

  // 2. AI Generation
  const prompt = `You are an AI assistant.

Task:
Summarize the following blog content in 3–5 concise lines.

Guidelines:
- Use simple and clear language
- Capture the main idea and key points
- Avoid repetition and filler phrases
- Do not add new information
- Do not mention "this blog" or "the article"

Blog Content:
${content}

⚠️ Do not modify the prompt without approval.`;

  let summary = "";

 try {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama3-70b-8192",
    temperature: 0.3,
  });

  summary = chatCompletion.choices[0]?.message?.content
    ?.trim()
    .replace(/[*#>`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

      } catch (error) {
        console.error("Groq API Error:", error.message);
        summary = fallbackSummary(content);
      }

  // 4. Cache the result if blogId is provided and valid
  if (blogId && mongoose.Types.ObjectId.isValid(blogId)) {
    await Blog.findByIdAndUpdate(blogId, { summary });
  }

  return summary;
};

/* =========================================================
   AI AUTO-FILL JOB POSTING SERVICE (GROK INTEGRATION)
========================================================= */

const GROK_JOB_PROMPT = `You are an expert job-posting data extraction and SEO assistant.

Analyze the provided job posting and convert it into clean, structured data for a job listing website.

Return ONLY valid JSON.

Required JSON structure:

{
"jobTitle": "",
"slug": "",
"companyName": "",
"location": "",
"shortDescription": "",
"bannerImageUrl": "",
"jobType": "",
"salary": "",
"careerUrl": "",
"fullDescription": "",
"skillTags": [],
"postedDate": "",
"applicationDeadline": "",
"seoMetaTitle": "",
"seoMetaDescription": "",
"seoKeywords": "",
"canonicalUrl": "",
"socialOgImageUrl": "",
"socialSharingPost": ""
}

Rules:

1. jobTitle:
   Extract ONLY the clean job title from the source.
   DO NOT include emojis (🚀, 🏢, 💼, etc.), site prefixes like "Careers is Hiring |", "Company:", "Role:", or suffixes like "— Full-Time".

2. slug:
   Generate a clean SEO-friendly slug using the job title and company name.
   Example:
   software-development-engineer-sde-1-company-name

3. companyName:
   Extract the true employer / hiring company name from the source.
   CRITICAL RULE: Generic terms like "Careers", "Career", "Jobs", "Job", "Workday", "Greenhouse", "Lever", "Company", "Featured Employer" MUST NEVER be returned as the companyName.
   Look for the actual company name after words like "at", "Technology at", "Careers at", "Hiring at", "Company:".
   For example, in "Technology at Franklin Templeton", the companyName is "Franklin Templeton".

4. location:
   Extract the job location exactly from the source.
   If remote/hybrid is mentioned, preserve that information.

5. shortDescription:
   Create a concise professional summary.
   Maximum 200 characters.
   Do not add unsupported information.

6. bannerImageUrl:
   If a suitable publicly available banner/company image URL is explicitly available in the source, return it.
   Otherwise return an empty string.
   DO NOT invent an image URL.

7. jobType:
   Choose ONLY one of:
   Internship
   Full-Time
   Part-Time
   Contract
   Off Campus
   Walk-In
   Codelura

If the source clearly indicates the type, use it.
Otherwise return an empty string.

8. salary:
   Extract salary/stipend/CTC exactly from the source.
   Do not guess or estimate.
   If unavailable, return an empty string.

9. careerUrl:
   Use the original official application/career URL if available.

10. fullDescription:
    Create a clean, professional job description while preserving the information from the source.

Structure it where applicable with:

* About the Company
* Job Overview
* Responsibilities
* Requirements
* Preferred Qualifications
* Skills
* Benefits / Perks
* Application Process

Do not invent missing sections or information.

11. skillTags:
    Extract relevant technical and professional skills.
    Return an array of strings.

Example:
["Java", "Python", "SQL", "DSA", "React", "Git"]

12. postedDate:
    Extract the posted date if explicitly available.
    Otherwise return an empty string.

13. applicationDeadline:
    Extract the deadline if explicitly available.
    Never guess a deadline.
    If unavailable, return an empty string.

14. seoMetaTitle:
    Create an SEO-friendly title.
    Maximum 60 characters.
    Include job title/company/location where useful.

15. seoMetaDescription:
    Create an SEO-friendly description.
    Maximum 160 characters.
    Make it relevant to the job listing.

16. seoKeywords:
    Generate comma-separated SEO keywords based ONLY on the job information.
    Include relevant combinations of:

* Job title
* Company
* Location
* Skills
* Job type

17. canonicalUrl:
    If an official canonical URL exists in the source, use it.
    Otherwise return an empty string so the application can generate it automatically.

18. socialOgImageUrl:
    Use the source's social/OG image if explicitly available.
    Otherwise return an empty string.

19. socialSharingPost:
    Generate a formatted short social media post for LinkedIn/Telegram/WhatsApp with emojis using this template:
    🚀 [Company Name] is Hiring | [Job Title]
    🏢 Company: [Company Name]
    💼 Role: [Job Title] — [Job Type]
    📍 Location: [Location]
    🎓 Batch: Students / Recent Graduates
    💰 Expected Salary: [Salary / Stipend]
    🤖 Skills: [Skill Tags separated by comma]

    🔥 [1-sentence exciting hook summary]

    📩 Apply: drop your mail in the comment section or DM
    🔗 Application: Apply through the form provided above.

    #Hiring #[Company] #[SkillTags] #Freshers #TechJobs #JobOpening

IMPORTANT:

* Never fabricate salary.
* Never fabricate application deadline.
* Never fabricate company information.
* Never fabricate URLs.
* Never fabricate job requirements.
* Never fabricate benefits.
* Never fabricate experience requirements.
* If information is missing, return an empty string or empty array.
* Return valid JSON only.`;

/**
 * Server-side helper to fetch webpage content safely
 */
async function fetchJobWebpageText(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(12000), // 12 seconds timeout
    });

    if (!res.ok) {
      throw new Error(`HTTP status ${res.status}`);
    }

    const html = await res.text();
    const cleanedHtml = html
      .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, "")
      .replace(/<svg\b[^<]*>([\s\S]*?)<\/svg>/gi, "")
      .replace(/<nav\b[^<]*>([\s\S]*?)<\/nav>/gi, "")
      .replace(/<footer\b[^<]*>([\s\S]*?)<\/footer>/gi, "");

    let text = cleanedHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (text.length > 15000) {
      text = text.substring(0, 15000);
    }

    return text;
  } catch (err) {
    console.error("Webpage fetch error:", err.message);
    throw new Error(`Unable to fetch job URL: ${err.message}`);
  }
}

/**
 * Convert plain markdown text/bullets to clean HTML for ReactQuill
 */
function formatToHtml(text) {
  if (!text) return "";
  if (text.includes("<p>") || text.includes("<h3>") || text.includes("<ul>") || text.includes("<div>")) {
    return text;
  }

  const lines = text.split("\n");
  let html = "";
  let inList = false;

  for (let line of lines) {
    line = line.trim();
    if (!line) {
      if (inList) { html += "</ul>"; inList = false; }
      continue;
    }

    if (line.startsWith("### ") || line.startsWith("## ") || line.startsWith("# ")) {
      if (inList) { html += "</ul>"; inList = false; }
      const headingText = line.replace(/^#+\s*/, "");
      html += `<h3><strong>${headingText}</strong></h3>`;
    } else if (line.startsWith("* ") || line.startsWith("- ") || line.startsWith("• ")) {
      if (!inList) { html += "<ul>"; inList = true; }
      const itemText = line.replace(/^[*•-]\s*/, "");
      html += `<li>${itemText}</li>`;
    } else {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p>${line}</p>`;
    }
  }

  if (inList) html += "</ul>";
  return html;
}

/**
 * Map Grok job type to frontend allowed values
 */
function mapJobType(typeStr) {
  if (!typeStr) return "";
  const lower = typeStr.toLowerCase().trim();
  if (lower.includes("intern")) return "internship";
  if (lower.includes("full")) return "full-time";
  if (lower.includes("part")) return "part-time";
  if (lower.includes("contract")) return "contract";
  if (lower.includes("off") || lower.includes("campus")) return "off-campus";
  if (lower.includes("walk")) return "walk-in";
  if (lower.includes("codelura")) return "codelura";
  return "";
}

export function cleanStr(str) {
  if (!str) return "";
  return str
    .replace(/^JOB SOURCE URL:[^\n]*/gi, "")
    .replace(/JOB SOURCE URL:[^\n]*/gi, "")
    .replace(/^CONTENT EXTRACTED FROM WEBPAGE:?\s*/gi, "")
    .replace(/CONTENT EXTRACTED FROM WEBPAGE:?\s*/gi, "")
    .replace(/^JOB DESCRIPTION PROVIDED:?\s*/gi, "")
    .replace(/JOB DESCRIPTION PROVIDED:?\s*/gi, "")
    .replace(/Software Engineer\s*-\s*Winter Intern\s*Skip to Main Content\s*Contact Sales/gi, "")
    .replace(/Skip to Main Content|Contact Sales|Office Departments Job Summary/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Estimate or extract stipend/salary based on text or company tier
 */
export function estimateStipendOrSalary(companyName, jobType, text = "") {
  const match = text.match(/(\₹\s*\d+[\d,.]*\s*(?:-|to)?\s*\d*[\d,.]*\s*(?:per month|\/month|lpa|ctc)?)/i) ||
                text.match(/(\$\s*\d+[\d,.]*\s*(?:-|to)?\s*\d*[\d,.]*\s*(?:per month|\/month|lpa|ctc)?)/i) ||
                text.match(/(\d+\s*(?:-|to)?\s*\d*\s*LPA)/i) ||
                text.match(/(\d+\s*k\s*(?:\/month|per month))/i);

  if (match && match[1] && match[1].length > 2) {
    return match[1].trim();
  }

  const lowerCompany = (companyName || "").toLowerCase();
  const lowerText = text.toLowerCase();
  const isIntern = (jobType === "internship" || lowerText.includes("intern"));

  const isSenior = lowerText.includes("6-15 years") || lowerText.includes("6–15 years") || lowerText.includes("5+ years") || lowerText.includes("6+ years") || lowerText.includes("senior") || lowerText.includes("lead") || lowerText.includes("staff");
  const isGenAI = lowerText.includes("gen ai") || lowerText.includes("generative ai") || lowerText.includes("llm") || lowerText.includes("rag") || lowerText.includes("agentic");

  const isTopTier = ["rubrik", "google", "amazon", "microsoft", "uber", "atlassian", "salesforce", "apple", "meta", "facebook", "goldman", "de shaw", "tower research", "nvidia", "adobe", "stripe"].some(c => lowerCompany.includes(c) || lowerText.includes(c));
  const isMidTier = ["zomato", "swiggy", "flipkart", "phonepe", "paytm", "cred", "razorpay", "meesho", "ola", "curefit", "delhivery", "juspay", "evnek"].some(c => lowerCompany.includes(c) || lowerText.includes(c));

  if (isIntern) {
    if (isTopTier) return "₹80,000 – ₹1,20,000 / month";
    if (isMidTier) return "₹40,000 – ₹70,000 / month";
    return "₹20,000 – ₹35,000 / month";
  } else {
    if (isSenior || isGenAI) {
      if (isTopTier) return "₹25 – ₹45 LPA";
      return "₹16 – ₹32 LPA";
    }
    if (isTopTier) return "₹18 – ₹35 LPA";
    if (isMidTier) return "₹10 – ₹18 LPA";
    return "₹6 – ₹10 LPA";
  }
}

/**
 * Clean HTML section structuring for full description
 */
export function structureFullDescription(text) {
  if (!text) return "";
  let cleaned = cleanStr(text);

  // If text already has HTML tag structure and no webpage artifact text, ensure headings are <h3><strong>
  if (cleaned.includes("<p>") || cleaned.includes("<h3>") || cleaned.includes("<ul>")) {
    return cleaned;
  }

  let respMatch = cleaned.match(/(?:Responsibilities|What You Will Do)[:\s]+([\s\S]*?)(?:About You|Requirements|Qualifications|Eligibility|Minimum eligibility|Join Us|About Rubrik|$)/i);
  let reqMatch = cleaned.match(/(?:About You|Requirements|Qualifications|Minimum eligibility criteria)[:\s]+([\s\S]*?)(?:Join Us|Inclusion|About Rubrik|$)/i);
  let aboutMatch = cleaned.match(/(?:ABOUT THE JOB|Job Summary|Overview)[:\s]+([\s\S]*?)(?:Responsibilities|About You|Requirements|$)/i);

  let html = "";

  if (aboutMatch && aboutMatch[1].trim()) {
    html += "<h3><strong>📌 About the Role</strong></h3>\n<p>" + aboutMatch[1].trim() + "</p>\n\n";
  } else {
    const summaryPiece = cleaned.substring(0, 320).replace(/^[^A-Z]+/, "");
    html += "<h3><strong>📌 About the Role</strong></h3>\n<p>" + summaryPiece + "</p>\n\n";
  }

  if (respMatch && respMatch[1].trim()) {
    const respItems = respMatch[1].trim().split(/(?<=\.)\s+/).filter(s => s.length > 10);
    html += "<h3><strong>🎯 Responsibilities</strong></h3>\n<ul>\n";
    respItems.forEach(item => {
      html += "  <li>" + item.trim() + "</li>\n";
    });
    html += "</ul>\n\n";
  }

  if (reqMatch && reqMatch[1].trim()) {
    const reqItems = reqMatch[1].trim().split(/(?:-|•|(?<=\.))\s+/).filter(s => s.length > 8);
    html += "<h3><strong>🎓 Requirements & Eligibility</strong></h3>\n<ul>\n";
    reqItems.forEach(item => {
      html += "  <li>" + item.trim() + "</li>\n";
    });
    html += "</ul>\n\n";
  }

  return html || formatToHtml(cleaned);
}

export function getJobCategoryPath(jobType) {
  const lower = (jobType || "").toLowerCase().trim();
  if (lower.includes("intern")) return "internships";
  if (lower.includes("full")) return "full-time";
  if (lower.includes("off") || lower.includes("campus")) return "off-campus-drives";
  if (lower.includes("walk")) return "walk-in-drives";
  if (lower.includes("codelura")) return "codelura-hiring";
  return "latest";
}

const GENERIC_COMPANY_NAMES = [
  "careers", "career", "jobs", "job", "company", "featured employer",
  "top company", "codelura", "hiring", "workday", "myworkdayjobs",
  "greenhouse", "lever", "workable", "smartrecruiters", "bamboohr"
];

const KNOWN_TECH_COMPANIES = [
  "Franklin Templeton", "Google", "Amazon", "Microsoft", "Meta", "Facebook",
  "Apple", "Netflix", "Uber", "Rubrik", "Adobe", "Flipkart", "Swiggy",
  "Zomato", "Goldman Sachs", "JPMorgan", "Morgan Stanley", "Salesforce",
  "Oracle", "Cisco", "IBM", "Intel", "AMD", "Nvidia", "TCS", "Infosys",
  "Wipro", "Accenture", "Cognizant", "Capgemini", "Deloitte", "Paytm",
  "PhonePe", "Razorpay", "Cred", "Meesho", "Juspay", "Groww", "Atlassian",
  "De Shaw", "Tower Research", "Stripe", "PayPal", "LinkedIn", "Twitter"
];

export function extractCleanCompanyName(companyName, sourceText = "", jobUrl = "") {
  let cleaned = (companyName || "")
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[^a-zA-Z0-9\s&.-]/g, "")
    .replace(/^(?:Company|Employer|Organization):\s*/i, "")
    .trim();

  const lower = cleaned.toLowerCase();

  // If valid non-generic company name, return it!
  if (cleaned.length >= 2 && !GENERIC_COMPANY_NAMES.includes(lower)) {
    return cleaned;
  }

  // 1. Check known tech companies in source text
  for (const knownComp of KNOWN_TECH_COMPANIES) {
    if (sourceText.toLowerCase().includes(knownComp.toLowerCase())) {
      return knownComp;
    }
  }

  // 2. Search for "at [Company]" or "Technology at [Company]" in source text
  const match = sourceText.match(/(?:technology at|hiring at|careers at|jobs at|position at|company:\s*|employer:\s*|join)\s+([A-Z][A-Za-z0-9\s&.-]{2,35})/i) ||
                sourceText.match(/\bat\s+([A-Z][A-Za-z0-9\s&.-]{2,30})\b/i);

  if (match && match[1]) {
    let candidate = match[1].trim()
      .replace(/\s+(?:Job|Jobs|Careers|Hyderabad|India|Remote|Full-Time|Internship).*$/i, "")
      .trim();
    if (candidate.length >= 2 && !GENERIC_COMPANY_NAMES.includes(candidate.toLowerCase())) {
      return candidate;
    }
  }

  // 3. Fallback to URL domain if jobUrl exists
  if (jobUrl) {
    try {
      const hostname = new URL(jobUrl).hostname.replace(/^www\./, "");
      const domainParts = hostname.split(".");
      if (domainParts.length >= 2) {
        const name = domainParts[0];
        if (!GENERIC_COMPANY_NAMES.includes(name.toLowerCase())) {
          return name.charAt(0).toUpperCase() + name.slice(1);
        }
      }
    } catch (e) {}
  }

  return cleaned && !GENERIC_COMPANY_NAMES.includes(lower) ? cleaned : "Top Tech Company";
}

export function extractCleanJobTitle(jobTitle, sourceText = "") {
  let cleaned = (jobTitle || "")
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/gu, "")
    .replace(/^(?:🚀|🏢|💼|📍|🎓|💰|🤖|🔥|📩|🔗|👉|📲|💬|📋|📂|\s)*/g, "")
    .replace(/^(?:.*(?:is Hiring\s*\|?|Company:|Role:|Job Title:|Position:|Title:))\s*/gi, "")
    .replace(/\s*(?:—|-|\|)\s*(?:💼\s*)?(?:Full-Time|Full Time|Internship|Part-Time|Contract|Off-Campus|Walk-In).*$/gi, "")
    .replace(/\s*\|\s*.*$/gi, "")
    .trim();

  // If clean valid title, return it!
  if (cleaned.length >= 3 && !cleaned.toLowerCase().includes("hiring")) {
    return cleaned;
  }

  // Search sourceText for standard job titles
  const match = sourceText.match(/\b(Software (?:Development )?Engineer(?: -? [I|II|III|1|2|3])?|Associate Software Engineer|Frontend (?:Developer|Engineer)|Backend (?:Developer|Engineer)|Full Stack (?:Developer|Engineer)|Data Scientist|DevOps Engineer|QA Engineer|Product Manager|AI \/ ML Engineer|Cloud Engineer|System Engineer|Mobile App Developer|iOS Developer|Android Developer)\b/i);

  if (match && match[1]) {
    return match[1].trim();
  }

  return cleaned || "Software Development Engineer";
}

/**
 * Sanitize AI returned object
 */
function sanitizeAiJobData(parsed, fallbackUrl = "", sourceText = "") {
  let jobTitle = extractCleanJobTitle(parsed.jobTitle || "", sourceText);
  let companyName = extractCleanCompanyName(parsed.companyName || "", sourceText, fallbackUrl);

  // Create clean slug if missing or default
  let slug = (parsed.slug || "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  if (!slug || slug.includes("careers") || slug.length < 5) {
    const combined = `${jobTitle} ${companyName}`.trim();
    slug = combined.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  }

  let shortDesc = cleanStr(parsed.shortDescription || "");
  if (shortDesc.length > 200) {
    shortDesc = shortDesc.substring(0, 197) + "...";
  }

  let metaTitle = cleanStr(parsed.seoMetaTitle || "");
  if (metaTitle.length > 60) {
    metaTitle = metaTitle.substring(0, 57) + "...";
  }

  let metaDesc = cleanStr(parsed.seoMetaDescription || "");
  if (metaDesc.length > 160) {
    metaDesc = metaDesc.substring(0, 157) + "...";
  }

  let skillTags = [];
  if (Array.isArray(parsed.skillTags)) {
    skillTags = parsed.skillTags.map(t => cleanStr(String(t))).filter(Boolean);
  } else if (typeof parsed.skillTags === "string") {
    skillTags = parsed.skillTags.split(",").map(t => cleanStr(t)).filter(Boolean);
  }

  let keywordsStr = "";
  if (Array.isArray(parsed.seoKeywords)) {
    keywordsStr = parsed.seoKeywords.map(k => cleanStr(String(k))).filter(Boolean).join(", ");
  } else if (typeof parsed.seoKeywords === "string") {
    keywordsStr = cleanStr(parsed.seoKeywords);
  }

  const jobType = mapJobType(parsed.jobType);

  let salary = cleanStr(parsed.salary || "");
  if (!salary) {
    salary = estimateStipendOrSalary(companyName, jobType, sourceText);
  }

  let fullDesc = cleanStr(parsed.fullDescription || "");
  fullDesc = structureFullDescription(fullDesc);

  let socialSharingPost = cleanStr(parsed.socialSharingPost || "");
  if (!socialSharingPost) {
    const compTag = companyName ? `#${companyName.replace(/[^a-zA-Z0-9]/g, "")}` : "#TechJobs";
    const skillList = skillTags.join(", ");
    socialSharingPost = `🚀 ${companyName || "Top Company"} is Hiring | ${jobTitle || "Software Engineer"}

🏢 Company: ${companyName || "Featured Employer"}
💼 Role: ${jobTitle} — ${jobType || "Full-Time"}
📍 Location: ${cleanStr(parsed.location || "India")}
🎓 Batch: Students / Recent Graduates
💰 Expected Salary: ${salary}
🤖 Skills: ${skillList}

🔥 ${shortDesc}

👉 Apply Now & Kickstart Your Tech Journey:
Follow me and drop your email in the comments section — or join our community to apply directly! 🚀

📩 Apply: drop your mail in the comment section or DM
🔗 Application: Apply through the form provided above.

📲 WhatsApp Channel (More Career & Direct Link Jobs): https://acesse.one/ms74xyi
💬 Join our Community (Most recent jobs posted): https://tinyurl.com/Mentorsetu
💼 1750+ HR contacts with full LinkedIn & company details: https://tinyurl.com/3dxxsu63
📋 1800+ HR contacts with full company details: https://l1nq.com/mentorsetu
📂 500+ HR contacts with full company details: https://l1nq.com/1agpgwd

#Hiring ${compTag} #Freshers #TechJobs #JobOpening #AIJobs`;
  }

  let canonicalUrl = (parsed.canonicalUrl || "").trim();
  if (!canonicalUrl && slug) {
    const category = getJobCategoryPath(jobType);
    canonicalUrl = `https://codelura.com/career/jobs/${category}/${slug}`;
  }

  return {
    jobTitle,
    slug,
    companyName,
    location: cleanStr(parsed.location || ""),
    shortDescription: shortDesc,
    bannerImageUrl: (parsed.bannerImageUrl || "").trim(),
    jobType,
    salary,
    careerUrl: (parsed.careerUrl || fallbackUrl || "").trim(),
    fullDescription: fullDesc,
    skillTags,
    postedDate: (parsed.postedDate || "").trim(),
    applicationDeadline: (parsed.applicationDeadline || "").trim(),
    seoMetaTitle: metaTitle,
    seoMetaDescription: metaDesc,
    seoKeywords: keywordsStr,
    canonicalUrl,
    socialOgImageUrl: (parsed.socialOgImageUrl || "").trim(),
    socialSharingPost,
  };
}

/**
 * Intelligent local fallback job extractor when Groq API key is invalid/401/rate-limited
 */
function fallbackLocalJobExtractor(text, jobUrl = "") {
  let companyName = extractCleanCompanyName("", text, jobUrl);

  const SKILL_KEYWORDS = [
    "Gen AI", "Generative AI", "LLMs", "RAG", "Agentic AI", "AI Agents",
    "Prompt Engineering", "Embeddings", "Semantic Search", "Vector Databases",
    "LangChain", "LangGraph", "LlamaIndex", "Pinecone", "FAISS", "Chroma",
    "Weaviate", "Milvus", "OpenAI", "Claude", "Gemini", "Python", "FastAPI",
    "PyTorch", "TensorFlow", "React", "React.js", "Node.js", "Node", "TypeScript",
    "JavaScript", "Java", "C++", "C#", "Go", "Golang", "Ruby", "PHP", "Swift",
    "Kotlin", "SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "AWS", "AWS Bedrock",
    "Azure", "Azure OpenAI", "GCP", "Google Vertex AI", "Docker", "Kubernetes",
    "Git", "GitHub", "CI/CD", "REST API", "GraphQL", "DSA", "Data Structures",
    "Algorithms", "System Design", "HTML", "CSS", "Tailwind"
  ];

  const foundSkills = [];
  const lowerText = text.toLowerCase();
  for (const skill of SKILL_KEYWORDS) {
    if (lowerText.includes(skill.toLowerCase()) && !foundSkills.includes(skill)) {
      foundSkills.push(skill);
    }
  }

  let location = "Remote";
  if (lowerText.includes("hybrid")) location = "Hybrid";
  else if (lowerText.includes("bangalore") || lowerText.includes("bengaluru")) location = "Bangalore, India";
  else if (lowerText.includes("mumbai")) location = "Mumbai, India";
  else if (lowerText.includes("delhi") || lowerText.includes("noida") || lowerText.includes("gurugram")) location = "Delhi NCR, India";
  else if (lowerText.includes("hyderabad")) location = "Hyderabad, India";
  else if (lowerText.includes("pune")) location = "Pune, India";
  else if (lowerText.includes("remote")) location = "Remote";

  let jobType = "Full-Time";
  if (lowerText.includes("intern")) jobType = "Internship";
  else if (lowerText.includes("part-time") || lowerText.includes("part time")) jobType = "Part-Time";
  else if (lowerText.includes("contract")) jobType = "Contract";

  let rawTitle = "";
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.length > 5 && line.length < 120 && !line.startsWith("http") && !line.includes("CONTENT EXTRACTED") && !line.includes("JOB SOURCE")) {
      rawTitle = line;
      break;
    }
  }
  let jobTitle = extractCleanJobTitle(rawTitle, text);

  const cleanDesc = cleanStr(text);
  const shortDescription = cleanDesc.substring(0, 180).trim() + "...";
  const salary = estimateStipendOrSalary(companyName, jobType, text);

  const compTag = companyName ? `#${companyName.replace(/[^a-zA-Z0-9]/g, "")}` : "#TechJobs";
  const socialSharingPost = `🚀 ${companyName || "Top Company"} is Hiring | ${jobTitle}

🏢 Company: ${companyName || "Featured Employer"}
💼 Role: ${jobTitle} — ${jobType}
📍 Location: ${location}
🎓 Batch: Students / Recent Graduates
💰 Expected Salary: ${salary}
🤖 Skills: ${foundSkills.slice(0, 6).join(", ")}

🔥 ${shortDescription}

📩 Apply: drop your mail in the comment section or DM
🔗 Application: Apply through the form provided above.

#Hiring ${compTag} #Freshers #TechJobs #JobOpening #AIJobs`;

  return {
    jobTitle,
    companyName: companyName || "Featured Employer",
    location,
    jobType,
    salary,
    shortDescription,
    fullDescription: structureFullDescription(cleanDesc),
    skillTags: foundSkills.slice(0, 8),
    careerUrl: jobUrl || "",
    postedDate: new Date().toISOString().split("T")[0],
    applicationDeadline: "",
    seoMetaTitle: `${jobTitle} at ${companyName || "Company"} | Codelura`,
    seoMetaDescription: shortDescription.substring(0, 155),
    seoKeywords: foundSkills.join(", "),
    socialSharingPost,
  };
}

export const generateJobAutoFill = async ({ jobUrl, jobDescription }) => {
  let sourceText = "";

  if (jobUrl && jobUrl.trim()) {
    const urlText = await fetchJobWebpageText(jobUrl.trim());
    sourceText += `JOB SOURCE URL: ${jobUrl}\n\nCONTENT EXTRACTED FROM WEBPAGE:\n${urlText}`;
  }

  if (jobDescription && jobDescription.trim()) {
    sourceText += `\n\nJOB DESCRIPTION PROVIDED:\n${jobDescription.trim()}`;
  }

  if (!sourceText.trim()) {
    throw new Error("Please provide either a Job URL or a Job Description.");
  }

  const prompt = `${GROK_JOB_PROMPT}\n\nJob Posting Content to Analyze:\n"""\n${sourceText}\n"""`;

  const apiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
  let parsed = null;

  if (apiKey) {
    const groqClient = new Groq({ apiKey });

    try {
      const chatCompletion = await groqClient.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      const rawContent = chatCompletion.choices[0]?.message?.content?.trim() || "";
      parsed = JSON.parse(rawContent);
    } catch (err) {
      console.warn("Grok LLM call failed or key invalid, falling back to local extractor:", err.message);
      try {
        const chatCompletionFallback = await groqClient.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "llama3-70b-8192",
          temperature: 0.2,
        });

        const rawContent = chatCompletionFallback.choices[0]?.message?.content?.trim() || "";
        parsed = JSON.parse(rawContent);
      } catch (fallbackErr) {
        console.warn("Groq API fallback failed, using local intelligent job extractor.");
      }
    }
  }

  if (!parsed || !parsed.jobTitle) {
    parsed = fallbackLocalJobExtractor(sourceText, jobUrl ? jobUrl.trim() : "");
  }

  return sanitizeAiJobData(parsed, jobUrl ? jobUrl.trim() : "", sourceText);
};



/**
 * Generate AI Review Reply with SEO optimization
 */
export const generateAIReviewReply = async (context) => {
  const {
    businessName,
    category,
    city,
    description,
    reviewText,
    rating,
    reviewerName,
    tone = 'professional',
    seoEnabled = true,
    keywords = [],
  } = context;

  // Build context-aware prompt
  const toneMap = {
    professional: 'professional and courteous',
    friendly: 'warm and friendly',
    casual: 'casual and conversational',
  };

  const ratingContext = {
    5: 'extremely positive 5-star',
    4: 'positive 4-star',
    3: 'neutral 3-star',
    2: 'negative 2-star',
    1: 'very negative 1-star',
  };

  // SEO keywords (subtle, only if enabled and relevant)
  let seoGuidance = '';
  if (seoEnabled && keywords.length > 0) {
    seoGuidance = `If contextually appropriate, you may naturally mention relevant terms like: ${keywords.slice(0, 2).join(', ')}. IMPORTANT: Only use if it fits naturally - do NOT force keywords.`;
  }

  const prompt = `You are a helpful AI assistant generating Google Business Profile review replies for ${businessName}${city ? ` in ${city}` : ''}.

Business Context:
- Name: ${businessName}
- Category: ${category || 'Service provider'}
- Location: ${city || 'Not specified'}
${description ? `- Description: ${description}` : ''}

Review Details:
- Rating: ${rating} stars (${ratingContext[rating] || 'review'})
- Review Text: "${reviewText || '(No text - rating only)'}"
- Reviewer: ${reviewerName || 'Customer'}

Instructions:
1. Write a ${toneMap[tone] || 'professional'} reply in 2-3 short sentences
2. Make it sound natural and human-written
3. Keep it brief and genuine
4. ${rating >= 4 ? 'Thank the customer warmly' : rating === 3 ? 'Acknowledge their feedback professionally' : 'Respond carefully - acknowledge concern, avoid arguing, invite direct contact if appropriate'}
5. ${reviewText ? 'Reference their specific feedback if meaningful' : 'Keep it short since they only left a rating'}
6. Do NOT use excessive emojis (maximum 1-2 appropriate ones like 🙏 or ⭐)
7. Do NOT make fake promises or guarantees
8. Do NOT reveal private customer information
9. Do NOT keyword stuff
10. ${seoGuidance}
11. Make each reply unique - avoid repetitive phrases
12. End with gratitude or invitation as appropriate

${rating <= 2 ? 'IMPORTANT FOR NEGATIVE REVIEWS: Be empathetic, professional, do not admit fault broadly, invite them to contact you privately to resolve.' : ''}

Generate ONLY the reply text (no quotes, no labels, no explanations):`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.7, // Higher temp for more variation
      max_tokens: 200,
    });

    let reply = chatCompletion.choices[0]?.message?.content || '';

    // Clean up the reply
    reply = reply.trim();
    reply = reply.replace(/^["']|["']$/g, ''); // Remove quotes if AI added them
    reply = reply.replace(/^Reply:\s*/i, ''); // Remove "Reply:" prefix if added

    // Validation
    if (!reply || reply.length < 10) {
      throw new Error('Generated reply too short');
    }

    if (reply.length > 500) {
      reply = reply.substring(0, 500); // Truncate if too long
    }

    return reply;

  } catch (error) {
    console.error('[AI Review Reply] Error:', error);
    
    // Fallback: Generate simple template-based reply
    return generateFallbackReply(context);
  }
};

/**
 * Fallback template-based reply generation
 */
function generateFallbackReply({ businessName, rating, reviewText, reviewerName, city }) {
  const name = reviewerName || 'there';
  
  if (rating === 5) {
    if (reviewText && reviewText.length > 5) {
      return `Thank you so much for your wonderful 5-star review, ${name}! We're thrilled you had a great experience with ${businessName}${city ? ` in ${city}` : ''}. We look forward to serving you again! 🙏`;
    }
    return `Thank you for your 5-star rating, ${name}! We truly appreciate your support. 🙏`;
  }
  
  if (rating === 4) {
    return `Thank you for your positive feedback, ${name}! We're glad you had a good experience with ${businessName}. We appreciate your support! 🙏`;
  }
  
  if (rating === 3) {
    return `Thank you for your feedback, ${name}. We appreciate you taking the time to share your experience. If you have any specific concerns, please feel free to contact us directly.`;
  }
  
  if (rating === 2 || rating === 1) {
    return `Thank you for your feedback, ${name}. We're sorry to hear your experience didn't meet expectations. We'd like to make this right - please contact us directly so we can address your concerns.`;
  }
  
  return `Thank you for your review, ${name}! We appreciate your feedback. 🙏`;
}
