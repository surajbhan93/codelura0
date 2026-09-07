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
   Extract the exact job title from the source.

2. slug:
   Generate a clean SEO-friendly slug using the job title and company name.
   Example:
   software-development-engineer-sde-1-company-name

3. companyName:
   Extract the company name from the source.

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

  const isTopTier = ["rubrik", "google", "amazon", "microsoft", "uber", "atlassian", "salesforce", "apple", "meta", "facebook", "goldman", "de shaw", "tower research", "nvidia", "adobe", "stripe"].some(c => lowerCompany.includes(c) || lowerText.includes(c));
  const isMidTier = ["zomato", "swiggy", "flipkart", "phonepe", "paytm", "cred", "razorpay", "meesho", "ola", "curefit", "delhivery", "juspay"].some(c => lowerCompany.includes(c) || lowerText.includes(c));

  if (isIntern) {
    if (isTopTier) return "₹80,000 – ₹1,20,000 / month";
    if (isMidTier) return "₹40,000 – ₹70,000 / month";
    return "₹20,000 – ₹35,000 / month";
  } else {
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

/**
 * Sanitize AI returned object
 */
function sanitizeAiJobData(parsed, fallbackUrl = "", sourceText = "") {
  let jobTitle = cleanStr(parsed.jobTitle || "");
  let companyName = cleanStr(parsed.companyName || "");

  // Create clean slug if missing or default
  let slug = (parsed.slug || "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
  if (!slug && jobTitle) {
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
  let companyName = "";
  if (jobUrl) {
    try {
      const hostname = new URL(jobUrl).hostname.replace(/^www\./, "");
      const domainParts = hostname.split(".");
      if (domainParts.length >= 2) {
        const name = domainParts[0];
        companyName = name.charAt(0).toUpperCase() + name.slice(1);
      }
    } catch (e) {}
  }

  const SKILL_KEYWORDS = [
    "React", "React.js", "Node.js", "Node", "TypeScript", "JavaScript", "Python",
    "Java", "C++", "C#", "Go", "Golang", "Ruby", "PHP", "Swift", "Kotlin",
    "SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "AWS", "Azure", "GCP",
    "Docker", "Kubernetes", "Git", "GitHub", "CI/CD", "REST API", "GraphQL",
    "DSA", "Data Structures", "Algorithms", "System Design", "HTML", "CSS", "Tailwind"
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

  let jobTitle = "";
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.length > 5 && line.length < 90 && !line.startsWith("http") && !line.includes("CONTENT EXTRACTED") && !line.includes("JOB SOURCE")) {
      jobTitle = cleanStr(line);
      break;
    }
  }
  if (!jobTitle || jobTitle.length < 3) jobTitle = "Software Development Engineer";

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