/**
 * Keyword Intelligence Service
 * Analyzes Google Search Keywords and provides content opportunity scoring
 */

/**
 * Classify search intent from keyword
 */
export const classifySearchIntent = (keyword, businessName = '') => {
  const kw = keyword.toLowerCase().trim();
  const business = businessName.toLowerCase();
  
  // Brand intent
  if (business && kw.includes(business)) {
    return 'BRAND';
  }
  
  // Near me intent
  if (kw.includes('near me') || kw.includes('nearby')) {
    return 'NEAR_ME';
  }
  
  // Question intent
  if (kw.match(/^(how|what|why|when|where|which|who)/)) {
    return 'QUESTION';
  }
  
  // Local service (city/area names)
  const cityPattern = /(in |near )(lucknow|prayagraj|allahabad|noida|kanpur|varanasi|agra|meerut|delhi|mumbai|bangalore|pune|hyderabad)/i;
  if (cityPattern.test(kw)) {
    return 'LOCAL_SERVICE';
  }
  
  // Service intent (tuition, coaching, classes, etc.)
  const servicePattern = /(tuition|coaching|classes|teacher|tutor|training|course|lesson)/i;
  if (servicePattern.test(kw)) {
    return 'SERVICE';
  }
  
  // Informational
  const infoPattern = /(how to|tips|guide|benefits|why|best way)/i;
  if (infoPattern.test(kw)) {
    return 'INFORMATIONAL';
  }
  
  return 'OTHER';
};

/**
 * Extract location from keyword
 */
export const extractLocation = (keyword) => {
  const kw = keyword.toLowerCase();
  const cities = {
    'lucknow': 'Lucknow',
    'prayagraj': 'Prayagraj',
    'allahabad': 'Prayagraj',
    'noida': 'Noida',
    'kanpur': 'Kanpur',
    'varanasi': 'Varanasi',
    'agra': 'Agra',
    'meerut': 'Meerut',
    'delhi': 'Delhi',
    'ghaziabad': 'Ghaziabad',
  };
  
  for (const [key, value] of Object.entries(cities)) {
    if (kw.includes(key)) return value;
  }
  
  return null;
};

/**
 * Detect language
 */
export const detectLanguage = (keyword) => {
  // Hindi unicode range
  const hindiPattern = /[\u0900-\u097F]/;
  if (hindiPattern.test(keyword)) return 'HINDI';
  
  // Check for transliterated Hindi/Hinglish
  const translitPattern = /(mein|ka|ke|ki|se|hai|hain|kya)/i;
  if (translitPattern.test(keyword)) return 'HINGLISH';
  
  return 'ENGLISH';
};

/**
 * Calculate Codelura Content Opportunity Score
 * NOT a Google ranking score - internal prioritization only
 */
export const calculateOpportunityScore = (keyword, metadata = {}) => {
  let score = 50; // Base score
  
  const kw = keyword.toLowerCase();
  const {
    searchIntent,
    location,
    businessCity,
    impressions = 0,
    clicks = 0,
    isNew = false,
    trend = 'STABLE',
    businessCategories = [],
  } = metadata;
  
  // Intent scoring
  const intentScores = {
    'LOCAL_SERVICE': 20,
    'NEAR_ME': 18,
    'SERVICE': 15,
    'QUESTION': 12,
    'INFORMATIONAL': 10,
    'BRAND': 8,
    'OTHER': 5,
  };
  score += intentScores[searchIntent] || 0;
  
  // Local relevance
  if (location && businessCity && location === businessCity) {
    score += 15; // Strong local match
  } else if (location) {
    score += 5; // Some location mentioned
  }
  
  // Service relevance
  const serviceKeywords = ['tuition', 'tutor', 'teacher', 'coaching', 'classes', 'home tuition'];
  const matches = serviceKeywords.filter(s => kw.includes(s)).length;
  score += matches * 5;
  
  // Search activity (use real data if available)
  if (impressions > 0) {
    if (impressions >= 100) score += 10;
    else if (impressions >= 50) score += 7;
    else if (impressions >= 20) score += 5;
    else if (impressions >= 10) score += 3;
  }
  
  // Engagement
  if (clicks > 0 && impressions > 0) {
    const ctr = (clicks / impressions) * 100;
    if (ctr >= 5) score += 8;
    else if (ctr >= 2) score += 5;
    else if (ctr >= 1) score += 3;
  }
  
  // Trend bonus
  if (trend === 'RISING') score += 10;
  else if (trend === 'DECLINING') score -= 5;
  
  // New keyword bonus
  if (isNew) score += 5;
  
  // Cap score
  return Math.min(Math.max(score, 0), 100);
};

/**
 * Classify opportunity level
 */
export const getOpportunityLevel = (score) => {
  if (score >= 75) return 'HIGH';
  if (score >= 50) return 'MEDIUM';
  if (score >= 25) return 'LOW';
  return 'MINIMAL';
};

/**
 * Analyze a batch of keywords
 */
export const analyzeKeywords = (keywords, location) => {
  const businessName = location?.locationName || '';
  const businessCity = location?.address?.locality || '';
  
  return keywords.map(kw => {
    const keyword = typeof kw === 'string' ? kw : (kw.query || kw.keyword || '');
    const impressions = kw.impressions || kw.count || 0;
    const clicks = kw.clicks || 0;
    
    const searchIntent = classifySearchIntent(keyword, businessName);
    const extractedLocation = extractLocation(keyword);
    const language = detectLanguage(keyword);
    
    const score = calculateOpportunityScore(keyword, {
      searchIntent,
      location: extractedLocation,
      businessCity,
      impressions,
      clicks,
      isNew: kw.isNew || false,
      trend: kw.trend || 'STABLE',
    });
    
    return {
      keyword,
      language,
      location: extractedLocation,
      searchIntent,
      opportunityScore: score,
      opportunityLevel: getOpportunityLevel(score),
      impressions,
      clicks,
      metadata: {
        hasLocalIntent: !!extractedLocation,
        hasBrandIntent: searchIntent === 'BRAND',
        hasServiceIntent: ['SERVICE', 'LOCAL_SERVICE'].includes(searchIntent),
        isQuestion: searchIntent === 'QUESTION',
      }
    };
  });
};

/**
 * Prioritize keywords for content calendar
 */
export const prioritizeKeywords = (analyzedKeywords, options = {}) => {
  const {
    limit = 10,
    excludeBrand = false,
    preferLocal = true,
    minOpportunityScore = 25,
  } = options;
  
  let filtered = analyzedKeywords.filter(kw => 
    kw.opportunityScore >= minOpportunityScore
  );
  
  if (excludeBrand) {
    filtered = filtered.filter(kw => kw.searchIntent !== 'BRAND');
  }
  
  // Sort by opportunity score
  filtered.sort((a, b) => {
    let scoreA = a.opportunityScore;
    let scoreB = b.opportunityScore;
    
    // Boost local keywords if preferred
    if (preferLocal) {
      if (a.metadata.hasLocalIntent) scoreA += 5;
      if (b.metadata.hasLocalIntent) scoreB += 5;
    }
    
    return scoreB - scoreA;
  });
  
  return filtered.slice(0, limit);
};

/**
 * Generate content topics from keywords (avoid keyword stuffing)
 */
export const generateTopicsFromKeyword = (keyword, searchIntent, location) => {
  const kw = keyword.toLowerCase();
  const topics = [];
  
  // Extract core service
  let service = 'tuition';
  if (kw.includes('home tuition') || kw.includes('home tutor')) service = 'home tuition';
  else if (kw.includes('online')) service = 'online tuition';
  else if (kw.includes('coaching')) service = 'coaching';
  
  const loc = location || '';
  
  switch (searchIntent) {
    case 'LOCAL_SERVICE':
      topics.push(
        'How to Find Quality ' + (service.charAt(0).toUpperCase() + service.slice(1)) + (loc ? ' in ' + loc : ''),
        'Benefits of Personalized ' + (service.charAt(0).toUpperCase() + service.slice(1)) + ' for Students' + (loc ? ' in ' + loc : ''),
        'Choosing the Right Tutor' + (loc ? ' in ' + loc : '') + ' - What Parents Should Know'
      );
      break;
      
    case 'NEAR_ME':
      topics.push(
        'How to Find a Qualified Home Tutor Near Your Location',
        'What to Check Before Choosing a Local Tutor',
        'Benefits of Learning with a Nearby Tutor'
      );
      break;
      
    case 'SERVICE':
      topics.push(
        'How Regular ' + (service.charAt(0).toUpperCase() + service.slice(1)) + ' Supports Academic Growth',
        'Choosing Tuition Support Based on Student Needs',
        'One-on-One vs Group Tuition - Which Works Better?'
      );
      break;
      
    case 'QUESTION':
      topics.push(
        'Frequently Asked Questions About Home Tuition',
        'How Home Tuition Can Help Struggling Students',
        'What Makes a Great Tutor? Key Qualities to Look For'
      );
      break;
      
    case 'INFORMATIONAL':
      topics.push(
        'Tips for Making the Most of Home Tuition Sessions',
        "How Parents Can Support Their Child's Learning Journey",
        'Understanding Different Teaching Approaches in Home Tuition'
      );
      break;
      
    case 'BRAND':
      topics.push(
        'About Our' + (loc ? ' ' + loc : '') + ' Tutoring Services',
        'How We Match Students with the Right Tutors',
        'Why Families Trust Us for Home Tuition'
      );
      break;
      
    default:
      topics.push(
        'Personalized Tuition Options' + (loc ? ' in ' + loc : ''),
        'Finding the Right Educational Support for Your Child'
      );
  }
  
  return topics;
};

/**
 * Check if topic is too similar to existing topics (avoid duplication)
 */
export const isSimilarTopic = (newTopic, existingTopics, threshold = 0.7) => {
  const normalize = (str) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const newNorm = normalize(newTopic);
  
  for (const existing of existingTopics) {
    const existNorm = normalize(existing);
    
    // Simple word overlap similarity
    const newWords = new Set(newNorm.split(/\s+/));
    const existWords = new Set(existNorm.split(/\s+/));
    
    const intersection = new Set([...newWords].filter(w => existWords.has(w)));
    const union = new Set([...newWords, ...existWords]);
    
    const similarity = intersection.size / union.size;
    
    if (similarity >= threshold) return true;
  }
  
  return false;
};
