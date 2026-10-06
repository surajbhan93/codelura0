/**
 * AI Calendar Generation Service
 * Creates keyword-driven monthly content calendars for GBP
 */

import {
  analyzeKeywords,
  prioritizeKeywords,
  generateTopicsFromKeyword,
  isSimilarTopic,
} from './keywordIntelligence.service.js';
import { generateGooglePost, generateAIImageUrl } from './gbpGrokAI.service.js';
import GbpSearchKeyword from '../../models/gbp/GbpSearchKeyword.js';
import GbpLocation from '../../models/gbp/GbpLocation.js';

/**
 * Content mix templates (configurable percentages)
 */
const DEFAULT_CONTENT_MIX = {
  LOCAL_SERVICE: 0.30,  // 30%
  EDUCATIONAL: 0.20,    // 20%
  SERVICE_SPECIFIC: 0.15, // 15%
  FAQ: 0.15,           // 15%
  BRAND_TRUST: 0.10,   // 10%
  SEASONAL: 0.10,      // 10%
};

/**
 * Map search intent to content type
 */
const mapIntentToContentType = (searchIntent) => {
  const mapping = {
    'LOCAL_SERVICE': 'LOCAL_SERVICE',
    'NEAR_ME': 'LOCAL_SERVICE',
    'SERVICE': 'SERVICE_SPECIFIC',
    'QUESTION': 'FAQ',
    'INFORMATIONAL': 'EDUCATIONAL',
    'BRAND': 'BRAND_TRUST',
    'OTHER': 'EDUCATIONAL',
  };
  
  return mapping[searchIntent] || 'EDUCATIONAL';
};

/**
 * Calculate posting schedule for the month (Guarantees future dates)
 */
const generatePostingSchedule = (year, month, numPosts, timezone = 'Asia/Kolkata') => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();

  const schedule = [];
  // Peak GBP engagement hours (10:00 AM, 02:00 PM, 06:00 PM)
  const postingHours = [10, 14, 18];

  let startYear = Number(year) || currentYear;
  let startMonth = Number(month) || currentMonth;
  let startDay = 1;

  // If user selected past year/month, automatically advance to current month/year
  if (startYear < currentYear || (startYear === currentYear && startMonth < currentMonth)) {
    startYear = currentYear;
    startMonth = currentMonth;
    startDay = currentDay + 1;
  } else if (startYear === currentYear && startMonth === currentMonth) {
    // Current month: schedule starting from tomorrow!
    startDay = currentDay + 1;
  } else {
    // Future month: start from 1st of that month
    startDay = 1;
  }

  // Calculate day interval to spread posts evenly
  const interval = Math.max(1, Math.floor(30 / Math.max(numPosts, 1)));
  const cursorDate = new Date(startYear, startMonth - 1, startDay);

  for (let i = 0; i < numPosts; i++) {
    const postDate = new Date(cursorDate);
    // Add offset for each post
    postDate.setDate(cursorDate.getDate() + (i * interval));
    const hour = postingHours[i % postingHours.length];
    postDate.setHours(hour, 0, 0, 0);

    // Ensure it is strictly in the future
    if (postDate.getTime() <= now.getTime()) {
      postDate.setTime(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
      postDate.setHours(hour, 0, 0, 0);
    }

    schedule.push(postDate);
  }

  // Sort chronologically
  schedule.sort((a, b) => a.getTime() - b.getTime());

  return schedule;
};

export const getEffectiveCity = (location) => {
  if (location?.address?.locality && location.address.locality.trim()) {
    return location.address.locality.trim();
  }
  const textToScan = `${location?.locationName || ''} ${location?.address?.addressLines?.join(' ') || ''} ${location?.address?.administrativeArea || ''}`;
  const match = textToScan.match(/\b(lucknow|prayagraj|allahabad|kanpur|varanasi|noida|greater noida|delhi|new delhi|mumbai|bangalore|bengaluru|pune|hyderabad|jaipur|kolkata|chennai|ahmedabad|chandigarh|patna|bhopal|indore|agra|meerut|ghaziabad|gurgaon|gurugram|faridabad)\b/i);
  if (match) {
    const raw = match[1].toLowerCase();
    if (raw === 'allahabad') return 'Prayagraj';
    if (raw === 'bengaluru') return 'Bangalore';
    if (raw === 'gurugram') return 'Gurgaon';
    if (raw === 'greater noida') return 'Greater Noida';
    if (raw === 'new delhi') return 'New Delhi';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  const parts = (location?.locationName || '').split(/[,\-–|]/);
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1].trim();
    if (lastPart.length >= 3 && lastPart.length <= 25 && !lastPart.toLowerCase().includes('provider') && !lastPart.toLowerCase().includes('service')) {
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    }
  }
  return '';
};

/**
 * Generate keyword-driven AI calendar
 */
export const generateKeywordDrivenCalendar = async (userId, locationId, options = {}) => {
  const {
    month, // 1-12
    year,
    numPosts = 12,
    contentMix = DEFAULT_CONTENT_MIX,
    autoSchedule = false,
    contentLanguage = 'english',
    primaryGoal = 'LOCAL_VISIBILITY',
    seoOptimization = true,
    localRelevance = true,
  } = options;
  
  console.log('[AI Calendar] Generating calendar for user', userId, 'location', locationId, 'month/year:', month + '/' + year);
  
  // Fetch location
  const location = await GbpLocation.findOne({ _id: locationId, userId });
  if (!location) throw { code: 404, message: 'Location not found' };
  
  const businessCity = getEffectiveCity(location);
  const businessName = location.locationName || '';
  
  console.log('[AI Calendar] Location:', businessName, 'City:', businessCity);
  
  // Fetch REAL Google Search Keywords for this location
  const keywordDocs = await GbpSearchKeyword.find({
    userId,
    locationId,
  })
    .sort({ updatedAt: -1 })
    .limit(1)
    .lean();
  
  let keywords = [];
  let isFallback = false;
  if (keywordDocs.length > 0 && keywordDocs[0].keywords && keywordDocs[0].keywords.length > 0) {
    keywords = keywordDocs[0].keywords;
    console.log('[AI Calendar] Found', keywords.length, 'real Google search keywords');
  } else {
    // Generate intelligent default keywords based on business category and location
    const categoryName = location.primaryCategory?.displayName || 'Services';
    const city = businessCity || '';
    isFallback = true;
    keywords = [
      { searchKeyword: `${categoryName}${city ? ' in ' + city : ''}`.trim(), insightsValue: { threshold: '50', value: 'HIGH' } },
      { searchKeyword: `best ${categoryName}${city ? ' in ' + city : ''}`.trim(), insightsValue: { threshold: '40', value: 'HIGH' } },
      { searchKeyword: `${categoryName} near me`, insightsValue: { threshold: '60', value: 'HIGH' } },
      { searchKeyword: `${businessName}${city ? ' ' + city : ''}`.trim(), insightsValue: { threshold: '30', value: 'MEDIUM' } },
      { searchKeyword: `top rated ${categoryName}${city ? ' in ' + city : ''}`.trim(), insightsValue: { threshold: '25', value: 'MEDIUM' } },
      { searchKeyword: `affordable ${categoryName} services${city ? ' in ' + city : ''}`.trim(), insightsValue: { threshold: '20', value: 'MEDIUM' } },
      { searchKeyword: `expert ${categoryName}${city ? ' in ' + city : ''}`.trim(), insightsValue: { threshold: '15', value: 'MEDIUM' } },
      { searchKeyword: `${categoryName} guidance${city ? ' in ' + city : ''}`.trim(), insightsValue: { threshold: '15', value: 'MEDIUM' } },
    ];
    console.log('[AI Calendar] Using default intelligent keywords for', categoryName, city);
  }
  
  // Analyze keywords with intelligence
  const analyzedKeywords = analyzeKeywords(
    keywords.map(k => ({
      keyword: k.searchKeyword,
      impressions: parseInt(k.insightsValue?.threshold || '0'),
      clicks: 0,
      isNew: false,
      trend: k.insightsValue?.value || 'MEDIUM',
    })),
    location
  );
  
  console.log('[AI Calendar] Analyzed keywords:');
  analyzedKeywords.slice(0, 5).forEach(k => {
    console.log('  -', k.keyword, '| Intent:', k.searchIntent, '| Opportunity:', k.opportunityLevel, '(' + k.opportunityScore + ')');
  });
  
  // Prioritize keywords
  const prioritized = prioritizeKeywords(analyzedKeywords, {
    limit: numPosts * 2, // Get more than needed for variety
    excludeBrand: false,
    preferLocal: localRelevance,
    minOpportunityScore: 25,
  });
  
  console.log('[AI Calendar] Prioritized', prioritized.length, 'high-opportunity keywords');
  
  // Calculate content distribution based on mix
  const contentDistribution = {};
  Object.entries(contentMix).forEach(([type, percentage]) => {
    contentDistribution[type] = Math.round(numPosts * percentage);
  });
  
  // Adjust if total doesn't match numPosts
  const total = Object.values(contentDistribution).reduce((a, b) => a + b, 0);
  if (total < numPosts) {
    contentDistribution.LOCAL_SERVICE += (numPosts - total);
  }
  
  console.log('[AI Calendar] Content distribution:', contentDistribution);
  
  // Generate calendar items
  const calendarItems = [];
  const usedTopics = [];
  const keywordUsageCount = {};
  
  // Track keywords by content type
  const keywordsByContentType = {};
  prioritized.forEach(kw => {
    const contentType = mapIntentToContentType(kw.searchIntent);
    if (!keywordsByContentType[contentType]) {
      keywordsByContentType[contentType] = [];
    }
    keywordsByContentType[contentType].push(kw);
  });
  
  // Generate posts for each content type
  for (const [contentType, count] of Object.entries(contentDistribution)) {
    if (count === 0) continue;
    
    const availableKeywords = keywordsByContentType[contentType] || prioritized;
    
    for (let i = 0; i < count && availableKeywords.length > 0; i++) {
      // Select keyword (round-robin with usage tracking)
      let selectedKeyword = null;
      
      for (const kw of availableKeywords) {
        const usageCount = keywordUsageCount[kw.keyword] || 0;
        
        // Avoid overusing same keyword (max 2 times per calendar)
        if (usageCount < 2) {
          selectedKeyword = kw;
          break;
        }
      }
      
      if (!selectedKeyword) {
        selectedKeyword = availableKeywords[0]; // Fallback
      }
      
      // Generate topics
      const topics = generateTopicsFromKeyword(
        selectedKeyword.keyword,
        selectedKeyword.searchIntent,
        selectedKeyword.location || businessCity
      );
      
      // Find non-duplicate topic
      let selectedTopic = null;
      for (const topic of topics) {
        if (!isSimilarTopic(topic, usedTopics, 0.7)) {
          selectedTopic = topic;
          break;
        }
      }
      
      if (!selectedTopic) {
        selectedTopic = topics[0]; // Use first if all similar
      }
      
      usedTopics.push(selectedTopic);
      keywordUsageCount[selectedKeyword.keyword] = (keywordUsageCount[selectedKeyword.keyword] || 0) + 1;
      
      calendarItems.push({
        topic: selectedTopic,
        primaryKeyword: selectedKeyword.keyword,
        searchIntent: selectedKeyword.searchIntent,
        opportunityScore: selectedKeyword.opportunityScore,
        contentType,
        location: selectedKeyword.location || businessCity,
        language: contentLanguage,
      });
    }
  }
  
  console.log('[AI Calendar] Generated', calendarItems.length, 'calendar items');
  
  // Generate AI content and attractive images for each item
  const categoryDisplayName = location.primaryCategory?.displayName || 'Services';
  
  const generatedPosts = await Promise.all(
    calendarItems.map(async (item, index) => {
      try {
        console.log('[AI Calendar] Generating content & image', index + 1, '/', calendarItems.length, ':', item.topic);
        
        const aiContent = await generateGooglePost({
          businessName,
          category: categoryDisplayName,
          city: item.location || businessCity,
          topic: `${item.topic} (Target Keyword: ${item.primaryKeyword})`,
          tone: 'professional',
          cta: 'Contact Us',
        });
        
        const postText = (aiContent?.post || aiContent || '').trim();
        const imageUrl = aiContent?.imageUrl || generateAIImageUrl({
          topic: item.topic,
          category: categoryDisplayName,
          city: item.location || businessCity,
          businessName,
        });

        return {
          ...item,
          summary: postText.length >= 10 ? postText : `${item.topic} - Quality ${categoryDisplayName} in ${item.location || businessCity}. Contact us today to learn more!`,
          imageUrl,
          aiGenerated: true,
        };
      } catch (err) {
        console.error('[AI Calendar] AI generation notice for topic:', item.topic, '- Error:', err.message);
        
        const fallbackImage = generateAIImageUrl({
          topic: item.topic,
          category: categoryDisplayName,
          city: item.location || businessCity,
          businessName,
        });

        return {
          ...item,
          summary: `🌟 ${item.topic}\n\nLooking for trusted ${categoryDisplayName.toLowerCase()} in ${item.location || businessCity}? ${businessName} provides dedicated, top-rated support with proven excellence.\n\n✅ Experienced professionals\n✅ Personalized attention\n✅ Affordable pricing\n\n👉 Contact us today for details!\n#${(item.location || businessCity).replace(/\s+/g, '')} #${businessName.replace(/\s+/g, '')}`,
          imageUrl: fallbackImage,
          aiGenerated: true,
        };
      }
    })
  );
  
  // Generate posting schedule with future dates
  const postingSchedule = generatePostingSchedule(year, month, numPosts);
  
  // Attach schedule dates to posts
  const finalPosts = generatedPosts.map((post, index) => ({
    ...post,
    suggestedDate: postingSchedule[index] || null,
    postNumber: index + 1,
    totalPosts: numPosts,
  }));
  
  // Keyword coverage stats
  const uniqueKeywordsUsed = new Set(finalPosts.map(p => p.primaryKeyword)).size;
  const totalKeywordsAvailable = prioritized.length;
  
  console.log('[AI Calendar] Calendar generated successfully with images');
  console.log('[AI Calendar] Keyword coverage:', uniqueKeywordsUsed, '/', totalKeywordsAvailable, 'used');
  
  return {
    location: {
      _id: location._id,
      name: businessName,
      city: businessCity,
    },
    month,
    year,
    totalPosts: numPosts,
    posts: finalPosts,
    keywordCoverage: {
      totalAvailable: totalKeywordsAvailable,
      totalUsed: uniqueKeywordsUsed,
      unused: totalKeywordsAvailable - uniqueKeywordsUsed,
      usageByKeyword: keywordUsageCount,
    },
    contentMix: contentDistribution,
    metadata: {
      primaryGoal,
      contentLanguage,
      autoSchedule,
      seoOptimization,
      localRelevance,
      generatedAt: new Date(),
    },
  };
};
