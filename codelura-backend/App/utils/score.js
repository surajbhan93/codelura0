// utils/score.js - Balanced scoring with proper range
export const ACTION = [
  "led", "managed", "developed", "designed", "implemented", "created",
  "built", "launched", "increased", "reduced", "improved", "optimized",
  "delivered", "achieved", "drove", "spearheaded", "coordinated",
  "executed", "established", "generated", "negotiated", "streamlined",
  "automated", "analyzed", "architected", "scaled", "mentored", "directed",
  "oversaw", "produced", "accelerated", "transformed", "initiated",
  "founded", "restructured", "consolidated", "pioneered", "orchestrated",
  "facilitated", "resolved", "engineered", "deployed", "migrated",
  "integrated", "forecasted", "budgeted", "audited", "secured", "expanded",
  "boosted", "grew", "exceeded", "surpassed", "owned", "shipped", "redesigned"
];

export const STOP = new Set(
  "a an the and or of to in for with on at by from as is are be we our you your they their this that will can role job work team years experience strong ability skills using etc must have has had who which what when into across over per plus more most all any new other than then them it its".split(/\s+/)
);

export function tokens(s) {
  if (!s) return [];
  return s
    .toLowerCase()
    .match(/[a-z][a-z+#.\-]{1,}/g)
    ?.map((w) => w.replace(/[.\-]+$/, ""))
    .filter(Boolean) || [];
}

// Balanced scoring - scores range 40-80 typically, 80+ is excellent
export function analyze(resume, jd) {
  const text = resume.trim();
  if (!text || text.length < 50) {
    return {
      total: 0,
      cats: [],
      kw: null,
      wc: 0,
      error: "Resume text is too short. Please provide at least 50 characters."
    };
  }

  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wc = words.length;
  
  const allTokens = tokens(lower);
  const tokenSet = new Set(allTokens);
  
  const cats = [];
  
  // 1. Contact Info (10 points)
  const hasEmail = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}/i.test(text);
  const hasPhone = /(\+?\d[\d\s().\-]{7,}\d)/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\//i.test(text);
  
  let contactScore = 0;
  if (hasEmail) contactScore += 4;
  if (hasPhone) contactScore += 4;
  if (hasLinkedIn) contactScore += 2;
  
  cats.push({
    key: "Contact Info",
    score: contactScore,
    max: 10,
    tips: [
      !hasEmail && { p: "hi", t: "Add email at the top." },
      !hasPhone && { p: "hi", t: "Add phone number." },
      !hasLinkedIn && { p: "me", t: "Add LinkedIn profile URL." }
    ].filter(Boolean),
  });

  // 2. Standard Sections (15 points)
  const hasExperience = /(work experience|professional experience|employment|experience|career)/i.test(text);
  const hasEducation = /education|university|college|b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?b\.?a\.?|ph\.?d/i.test(text);
  const hasSkills = /(skills|technical skills|core competencies|expertise)/i.test(text);
  const hasSummary = /(summary|profile|objective|about me)/i.test(text);
  
  let sectionsScore = 0;
  if (hasExperience) sectionsScore += 5;
  if (hasEducation) sectionsScore += 4;
  if (hasSkills) sectionsScore += 4;
  if (hasSummary) sectionsScore += 2;
  
  cats.push({
    key: "Sections",
    score: sectionsScore,
    max: 15,
    tips: [
      !hasExperience && { p: "hi", t: "Add 'Experience' section." },
      !hasEducation && { p: "hi", t: "Add 'Education' section." },
      !hasSkills && { p: "me", t: "Add 'Skills' section." }
    ].filter(Boolean),
  });

  // 3. Formatting (10 points)
  const tabCols = (text.match(/\t/g) || []).length + (text.match(/ {3,}\S+ {3,}\S/g) || []).length;
  const weird = (text.match(/[^\x00-\x7F]/g) || []).length;
  const hasFancyBullets = /[•·‣◦▪▫➢➤►❖◆◇]/.test(text);
  const hasTables = /\|.*\|/.test(text);
  
  let formatScore = 10;
  if (tabCols > 6) formatScore -= 4;
  else if (tabCols > 2) formatScore -= 2;
  if (weird > 25) formatScore -= 3;
  else if (weird > 10) formatScore -= 2;
  if (hasFancyBullets) formatScore -= 2;
  if (hasTables) formatScore -= 2;
  formatScore = Math.max(0, formatScore);
  
  cats.push({
    key: "Formatting",
    score: formatScore,
    max: 10,
    tips: [
      tabCols > 2 && { p: "hi", t: "Switch to single-column layout for ATS." },
      weird > 10 && { p: "me", t: "Replace fancy bullets/icons with plain text." },
      hasFancyBullets && { p: "me", t: "Use standard bullet points (- or •)." }
    ].filter(Boolean),
  });

  // 4. Action Verbs (12 points)
  const actionCount = ACTION.filter((v) => tokenSet.has(v)).length;
  // Need 12+ for full score
  const actionScore = Math.min(12, Math.round((actionCount / 12) * 12));
  
  cats.push({
    key: "Action Verbs",
    score: actionScore,
    max: 12,
    tips: [
      actionCount < 8 && { p: "me", t: `Found ${actionCount} action verbs. Aim for 12+ (Led, Built, Increased...).` },
      actionCount < 4 && { p: "hi", t: `Only ${actionCount} action verbs. Start bullets with strong action words.` }
    ].filter(Boolean),
  });

  // 5. Quantified Impact (15 points)
  const allNumbers = (text.match(/\b\d+\b/g) || []).map(Number);
  const percentNumbers = (text.match(/\d+\s?%/g) || []).length;
  const dollarNumbers = (text.match(/\$\s?\d+[\d,.]*/g) || []).length;
  const largeNumbers = allNumbers.filter(n => n >= 10).length;
  
  // Weighted scoring
  let quantScore = 0;
  // Base points for having numbers
  if (allNumbers.length >= 12) quantScore += 5;
  else if (allNumbers.length >= 8) quantScore += 3;
  else if (allNumbers.length >= 4) quantScore += 1;
  
  // Bonus for meaningful metrics
  quantScore += Math.min(10, percentNumbers * 4 + dollarNumbers * 3 + Math.floor(largeNumbers / 4) * 2);
  quantScore = Math.min(15, quantScore);
  
  cats.push({
    key: "Quantified Impact",
    score: quantScore,
    max: 15,
    tips: [
      allNumbers.length < 8 && { p: "me", t: `Found ${allNumbers.length} numbers. Add more metrics (%, $).` },
      percentNumbers === 0 && dollarNumbers === 0 && { p: "hi", t: "Add percentages or dollar amounts to show impact." }
    ].filter(Boolean),
  });

  // 6. Length (8 points)
  let lengthScore = 8;
  let lengthTip = null;
  if (wc < 150) {
    lengthScore = 1;
    lengthTip = { p: "hi", t: `Too short (${wc} words). Resume should be 400-800 words.` };
  } else if (wc < 300) {
    lengthScore = 3;
    lengthTip = { p: "hi", t: `Short (${wc} words). Expand your experience.` };
  } else if (wc < 400) {
    lengthScore = 5;
    lengthTip = { p: "me", t: `Could be longer (${wc} words). Add more details.` };
  } else if (wc > 1000) {
    lengthScore = 5;
    lengthTip = { p: "me", t: `Long (${wc} words). Trim to under 1000 words.` };
  }
  
  cats.push({
    key: "Length",
    score: lengthScore,
    max: 8,
    tips: [lengthTip].filter(Boolean),
  });

  // 7. Dates (8 points)
  const dates = (text.match(
    /((19|20)\d{2})|(\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4})|(\d{1,2}\/\d{4})/gi
  ) || []).length;
  
  let dateScore = 0;
  if (dates >= 4) dateScore = 8;
  else if (dates >= 3) dateScore = 6;
  else if (dates >= 2) dateScore = 4;
  else if (dates >= 1) dateScore = 2;
  
  cats.push({
    key: "Dates",
    score: dateScore,
    max: 8,
    tips: [
      dates < 2 && { p: "me", t: "Add employment dates for each role." },
      dates < 4 && { p: "lo", t: "Ensure each job has start/end dates." }
    ].filter(Boolean),
  });

  // 8. Skills Match (12 points)
  // Common in-demand skills
  const skillKeywords = [
    "python", "sql", "excel", "tableau", "power bi", "looker", "r", "statistics",
    "machine learning", "data analysis", "dashboard", "reporting", "analytics",
    "a/b testing", "experimentation", "data modeling", "etl", "warehouse",
    "cloud", "aws", "azure", "gcp", "docker", "kubernetes", "git", "agile",
    "scrum", "project management", "stakeholder", "communication", "leadership"
  ];
  
  const foundSkills = skillKeywords.filter(skill => lower.includes(skill));
  const skillScore = Math.min(12, Math.round((foundSkills.length / 8) * 12));
  
  cats.push({
    key: "Skills Match",
    score: skillScore,
    max: 12,
    tips: [
      skillScore < 6 && { p: "me", t: `Found ${foundSkills.length} key skills. Add more relevant keywords.` },
      foundSkills.length < 4 && { p: "hi", t: "Add technical skills relevant to your target role." }
    ].filter(Boolean),
  });

  // 9. Achievements Style (10 points)
  // Check for result-focused language
  const resultPhrases = [
    "increased", "decreased", "reduced", "improved", "optimized",
    "grew", "boosted", "accelerated", "saved", "generated", "delivered"
  ];
  const hasResults = resultPhrases.filter(p => lower.includes(p)).length;
  const achievementScore = Math.min(10, Math.round((hasResults / 6) * 10));
  
  cats.push({
    key: "Achievement Language",
    score: achievementScore,
    max: 10,
    tips: [
      achievementScore < 5 && { p: "me", t: "Use result-oriented language: 'Increased', 'Reduced', 'Improved'." }
    ].filter(Boolean),
  });

  const total = cats.reduce((a, c) => a + c.score, 0);

  // Keyword matching for JD
  let kw = null;
  if (jd && jd.trim().length > 40) {
    const jdTokens = tokens(jd).filter((w) => w.length > 2 && !STOP.has(w));
    const freq = {};
    jdTokens.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });
    
    let candidates = [...new Set(jdTokens)].filter(
      (w) => freq[w] >= 2 || w.length >= 5
    );
    candidates = candidates
      .sort((a, b) => freq[b] - freq[a])
      .slice(0, 25);
    
    const hit = candidates.filter((w) => tokenSet.has(w));
    const miss = candidates.filter((w) => !tokenSet.has(w));
    
    kw = {
      pct: candidates.length ? Math.round((hit.length / candidates.length) * 100) : 0,
      hit,
      miss,
    };
  }

  return { total, cats, kw, wc };
}