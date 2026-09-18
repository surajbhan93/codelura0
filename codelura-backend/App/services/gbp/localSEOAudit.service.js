/**
 * Local SEO Audit Engine
 * Comprehensive audit system using REAL data from Google Business Profile
 * 
 * IMPORTANT: Never uses fake data, demo values, or unsupported metrics
 */

import GbpLocation from "../../models/gbp/GbpLocation.js";
import GbpReview from "../../models/gbp/GbpReview.js";
import GbpPost from "../../models/gbp/GbpPost.js";
import GbpPerformanceMetric from "../../models/gbp/GbpPerformanceMetric.js";
import GbpSearchKeyword from "../../models/gbp/GbpSearchKeyword.js";
import GbpCompetitor from "../../models/gbp/GbpCompetitor.js";
import axios from "axios";
import { load } from "cheerio";

/**
 * Audit Check Template
 */
class AuditCheck {
  constructor({
    id,
    category,
    title,
    severity,
    status,
    description,
    whyItMatters,
    currentValue,
    expectedValue,
    recommendation,
    actionRoute,
    evidence = null
  }) {
    this.id = id;
    this.category = category;
    this.title = title;
    this.severity = severity; // HIGH, MEDIUM, LOW
    this.status = status; // PASS, WARNING, CRITICAL, NOT_AVAILABLE
    this.description = description;
    this.whyItMatters = whyItMatters;
    // Ensure currentValue and expectedValue are always strings
    this.currentValue = typeof currentValue === 'object' ? JSON.stringify(currentValue) : String(currentValue || 'N/A');
    this.expectedValue = typeof expectedValue === 'object' ? JSON.stringify(expectedValue) : String(expectedValue || 'N/A');
    this.recommendation = recommendation;
    this.actionRoute = actionRoute;
    this.evidence = evidence;
  }
}

/**
 * Calculate weighted audit score (0-100)
 */
const calculateAuditScore = (checks) => {
  const weights = {
    'GBP Profile': 20,
    'Reviews': 15,
    'Media': 8,
    'Posts': 8,
    'Website SEO': 12,
    'NAP Consistency': 10,
    'Performance': 12,
    'Visibility': 10,
    'Competitors': 5,
  };

  const categoryScores = {};
  const categoryCounts = {};

  // Group checks by category
  checks.forEach(check => {
    if (check.status === 'NOT_AVAILABLE') return; // Skip unavailable checks

    if (!categoryScores[check.category]) {
      categoryScores[check.category] = 0;
      categoryCounts[check.category] = 0;
    }

    // Score: PASS = 100, WARNING = 50, CRITICAL = 0
    const checkScore = check.status === 'PASS' ? 100 : check.status === 'WARNING' ? 50 : 0;
    categoryScores[check.category] += checkScore;
    categoryCounts[check.category]++;
  });

  // Calculate weighted score
  let totalScore = 0;
  let totalWeight = 0;

  Object.keys(categoryScores).forEach(category => {
    const avgScore = categoryScores[category] / categoryCounts[category];
    const weight = weights[category] || 5;
    totalScore += avgScore * (weight / 100);
    totalWeight += weight / 100;
  });

  return Math.round(totalScore / totalWeight);
};

/**
 * Audit GBP Profile Optimization
 */
export const auditProfile = async (location) => {
  const checks = [];

  // Helper: Get phone number from new or legacy field
  const getPhone = () => {
    return location.phoneNumbers?.primaryPhone || location.primaryPhone || null;
  };

  // Helper: Get address from new or legacy field
  const getAddress = () => {
    return location.storefrontAddress || location.address || null;
  };

  // Business Name
  checks.push(new AuditCheck({
    id: 'profile_business_name',
    category: 'GBP Profile',
    title: 'Business Name',
    severity: 'HIGH',
    status: location.locationName ? 'PASS' : 'CRITICAL',
    description: location.locationName ? 'Business name is set' : 'Business name is missing',
    whyItMatters: 'Business name is the primary identifier for local search and customer recognition',
    currentValue: location.locationName || 'Not set',
    expectedValue: 'Complete business name',
    recommendation: location.locationName ? null : 'Add your business name in profile settings',
    actionRoute: '/google-business-profile/profile',
  }));

  // Primary Category
  checks.push(new AuditCheck({
    id: 'profile_primary_category',
    category: 'GBP Profile',
    title: 'Primary Category',
    severity: 'HIGH',
    status: location.primaryCategory ? 'PASS' : 'CRITICAL',
    description: location.primaryCategory ? 'Primary category is set' : 'Primary category is missing',
    whyItMatters: 'Primary category determines which searches your business appears in',
    currentValue: location.primaryCategory?.displayName || 'Not set',
    expectedValue: 'Relevant primary category',
    recommendation: location.primaryCategory ? null : 'Select the most relevant primary category for your business',
    actionRoute: '/google-business-profile/profile',
  }));

  // Additional Categories
  const additionalCategories = location.additionalCategories || [];
  checks.push(new AuditCheck({
    id: 'profile_additional_categories',
    category: 'GBP Profile',
    title: 'Additional Categories',
    severity: 'MEDIUM',
    status: additionalCategories.length >= 3 ? 'PASS' : additionalCategories.length > 0 ? 'WARNING' : 'WARNING',
    description: `${additionalCategories.length} additional categories added`,
    whyItMatters: 'Additional categories help your business appear in more relevant searches',
    currentValue: `${additionalCategories.length} categories`,
    expectedValue: '3-5 relevant categories',
    recommendation: additionalCategories.length < 3 ? 'Add more relevant categories to increase visibility' : null,
    actionRoute: '/google-business-profile/profile',
  }));

  // Description
  const description = location.profile?.description || '';
  checks.push(new AuditCheck({
    id: 'profile_description',
    category: 'GBP Profile',
    title: 'Business Description',
    severity: 'HIGH',
    status: description.length >= 250 ? 'PASS' : description.length >= 100 ? 'WARNING' : 'CRITICAL',
    description: description ? `Description is ${description.length} characters` : 'No description',
    whyItMatters: 'A detailed description helps customers understand your business and improves search relevance',
    currentValue: `${description.length} characters`,
    expectedValue: '250-750 characters',
    recommendation: description.length < 250 ? 'Write a comprehensive business description (250+ characters)' : null,
    actionRoute: '/google-business-profile/profile',
  }));

  // Phone Number - USE HELPER
  const phone = getPhone();
  checks.push(new AuditCheck({
    id: 'profile_phone',
    category: 'GBP Profile',
    title: 'Phone Number',
    severity: 'HIGH',
    status: phone ? 'PASS' : 'CRITICAL',
    description: phone ? 'Phone number is set' : 'Phone number is missing',
    whyItMatters: 'Phone number enables customers to contact you and contributes to NAP consistency',
    currentValue: phone || 'Not set',
    expectedValue: 'Valid phone number',
    recommendation: phone ? null : 'Add your business phone number',
    actionRoute: '/google-business-profile/profile',
    evidence: { 
      source: 'GBP_API',
      phoneNumbers: location.phoneNumbers,
      legacyPhone: location.primaryPhone,
    },
  }));

  // Website URL
  checks.push(new AuditCheck({
    id: 'profile_website',
    category: 'GBP Profile',
    title: 'Website URL',
    severity: 'HIGH',
    status: location.websiteUri ? 'PASS' : 'WARNING',
    description: location.websiteUri ? 'Website URL is set' : 'Website URL is missing',
    whyItMatters: 'Website provides additional information and drives traffic from Google Search/Maps',
    currentValue: location.websiteUri || 'Not set',
    expectedValue: 'Valid website URL',
    recommendation: location.websiteUri ? null : 'Add your business website URL',
    actionRoute: '/google-business-profile/profile',
  }));

  // Address - USE HELPER
  const address = getAddress();
  const hasAddress = address?.addressLines?.length > 0;
  checks.push(new AuditCheck({
    id: 'profile_address',
    category: 'GBP Profile',
    title: 'Business Address',
    severity: 'HIGH',
    status: hasAddress ? 'PASS' : 'CRITICAL',
    description: hasAddress ? 'Address is complete' : 'Address is missing',
    whyItMatters: 'Address is essential for local search and customer directions',
    currentValue: hasAddress ? `${address.addressLines.join(', ')}, ${address.locality}` : 'Not set',
    expectedValue: 'Complete street address',
    recommendation: hasAddress ? null : 'Add your complete business address',
    actionRoute: '/google-business-profile/profile',
    evidence: {
      source: 'GBP_API',
      storefrontAddress: location.storefrontAddress,
      legacyAddress: location.address,
    },
  }));

  // Business Hours
  const hasHours = location.regularHours?.periods?.length > 0;
  checks.push(new AuditCheck({
    id: 'profile_hours',
    category: 'GBP Profile',
    title: 'Business Hours',
    severity: 'MEDIUM',
    status: hasHours ? 'PASS' : 'WARNING',
    description: hasHours ? 'Business hours are set' : 'Business hours are missing',
    whyItMatters: 'Business hours help customers know when you\'re open and improve local search signals',
    currentValue: hasHours ? 'Set' : 'Not set',
    expectedValue: 'Complete weekly hours',
    recommendation: hasHours ? null : 'Add your business operating hours',
    actionRoute: '/google-business-profile/profile',
  }));

  return checks;
};

/**
 * Audit Reviews & Reputation
 */
export const auditReviews = async (locationId) => {
  const checks = [];
  const reviews = await GbpReview.find({ locationId }).lean();

  if (reviews.length === 0) {
    checks.push(new AuditCheck({
      id: 'reviews_no_data',
      category: 'Reviews',
      title: 'Review Data',
      severity: 'LOW',
      status: 'NOT_AVAILABLE',
      description: 'No review data available',
      whyItMatters: 'Reviews build trust and influence local search rankings',
      currentValue: '0 reviews',
      expectedValue: 'Active reviews',
      recommendation: 'Encourage customers to leave reviews',
      actionRoute: '/google-business-profile/reviews',
      evidence: { source: 'REVIEWS_API', totalReviews: 0 },
    }));
    return checks;
  }

  const totalReviews = reviews.length;
  
  // Calculate average rating - handle different starRating formats
  const validRatings = reviews.filter(r => {
    const rating = r.starRating;
    // Handle enum values (ONE, TWO, THREE, FOUR, FIVE)
    if (typeof rating === 'string') {
      return ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'].includes(rating);
    }
    // Handle numeric values (1-5)
    return typeof rating === 'number' && rating >= 1 && rating <= 5;
  });

  const sumRatings = validRatings.reduce((sum, r) => {
    const rating = r.starRating;
    // Convert enum to number
    if (typeof rating === 'string') {
      const ratingMap = { 'ONE': 1, 'TWO': 2, 'THREE': 3, 'FOUR': 4, 'FIVE': 5 };
      return sum + (ratingMap[rating] || 0);
    }
    return sum + rating;
  }, 0);

  const avgRating = validRatings.length > 0 ? sumRatings / validRatings.length : 0;
  const unanswered = reviews.filter(r => !r.reviewReply).length;
  const responseRate = totalReviews > 0 ? ((totalReviews - unanswered) / totalReviews) * 100 : 0;

  // Total Reviews
  checks.push(new AuditCheck({
    id: 'reviews_count',
    category: 'Reviews',
    title: 'Total Reviews',
    severity: 'MEDIUM',
    status: totalReviews >= 10 ? 'PASS' : totalReviews >= 5 ? 'WARNING' : 'WARNING',
    description: `${totalReviews} total reviews`,
    whyItMatters: 'More reviews build credibility and improve local search visibility',
    currentValue: `${totalReviews} reviews`,
    expectedValue: '10+ reviews',
    recommendation: totalReviews < 10 ? 'Encourage more customers to leave reviews' : null,
    actionRoute: '/google-business-profile/reviews',
    evidence: { source: 'REVIEWS_API', totalReviews, avgRating: avgRating.toFixed(1) },
  }));

  // Average Rating
  if (validRatings.length > 0) {
    checks.push(new AuditCheck({
      id: 'reviews_rating',
      category: 'Reviews',
      title: 'Average Rating',
      severity: 'HIGH',
      status: avgRating >= 4.0 ? 'PASS' : avgRating >= 3.5 ? 'WARNING' : 'CRITICAL',
      description: `Average rating is ${avgRating.toFixed(1)} stars`,
      whyItMatters: 'Higher ratings attract more customers and improve search rankings',
      currentValue: `${avgRating.toFixed(1)} stars`,
      expectedValue: '4.0+ stars',
      recommendation: avgRating < 4.0 ? 'Focus on customer satisfaction and address negative feedback' : null,
      actionRoute: '/google-business-profile/reviews',
      evidence: { source: 'CALCULATED', avgRating: avgRating.toFixed(1), totalReviews, validRatings: validRatings.length },
    }));
  } else {
    checks.push(new AuditCheck({
      id: 'reviews_rating',
      category: 'Reviews',
      title: 'Average Rating',
      severity: 'MEDIUM',
      status: 'NOT_AVAILABLE',
      description: 'Not enough rating data',
      whyItMatters: 'Ratings influence customer trust and local search rankings',
      currentValue: 'No valid ratings',
      expectedValue: '4.0+ stars',
      recommendation: 'Ensure review data is syncing correctly',
      actionRoute: '/google-business-profile/reviews',
      evidence: { source: 'REVIEWS_API', totalReviews, validRatings: 0 },
    }));
  }

  // Response Rate
  checks.push(new AuditCheck({
    id: 'reviews_response_rate',
    category: 'Reviews',
    title: 'Review Response Rate',
    severity: 'HIGH',
    status: responseRate >= 90 ? 'PASS' : responseRate >= 70 ? 'WARNING' : 'CRITICAL',
    description: `${responseRate.toFixed(0)}% of reviews have responses`,
    whyItMatters: 'Responding to reviews shows customer engagement and can improve reputation',
    currentValue: `${responseRate.toFixed(0)}%`,
    expectedValue: '90%+',
    recommendation: responseRate < 90 ? `Respond to ${unanswered} unanswered reviews` : null,
    actionRoute: '/google-business-profile/reviews',
    evidence: { source: 'CALCULATED', responseRate: responseRate.toFixed(0), unanswered },
  }));

  // Recent Review Activity
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentReviews = reviews.filter(r => {
    const reviewDate = new Date(r.createTime || r.updateTime);
    return reviewDate > thirtyDaysAgo;
  });

  checks.push(new AuditCheck({
    id: 'reviews_recent_activity',
    category: 'Reviews',
    title: 'Recent Review Activity',
    severity: 'LOW',
    status: recentReviews.length >= 3 ? 'PASS' : recentReviews.length >= 1 ? 'WARNING' : 'WARNING',
    description: `${recentReviews.length} reviews in the last 30 days`,
    whyItMatters: 'Recent reviews signal an active business and influence potential customers',
    currentValue: `${recentReviews.length} recent reviews`,
    expectedValue: '3+ per month',
    recommendation: recentReviews.length < 3 ? 'Encourage more frequent customer reviews' : null,
    actionRoute: '/google-business-profile/reviews',
    evidence: { source: 'CALCULATED', recentReviews: recentReviews.length },
  }));

  return checks;
};

/**
 * Audit Media & Photos
 */
export const auditMedia = async (location) => {
  const checks = [];

  // Note: Google Business Profile API doesn't provide detailed media counts
  // We can only audit based on what's available in the location object
  
  checks.push(new AuditCheck({
    id: 'media_availability',
    category: 'Media',
    title: 'Photo & Media',
    severity: 'MEDIUM',
    status: 'NOT_AVAILABLE',
    description: 'Media data not available through current API',
    whyItMatters: 'Photos help customers visualize your business and increase engagement',
    currentValue: 'Not available',
    expectedValue: 'Regular photo updates',
    recommendation: 'Add high-quality photos of your business, products, and services',
    actionRoute: '/google-business-profile/media',
  }));

  return checks;
};

/**
 * Audit Google Posts
 */
export const auditPosts = async (locationId) => {
  const checks = [];
  const allPosts = await GbpPost.find({ locationId }).lean();

  if (allPosts.length === 0) {
    checks.push(new AuditCheck({
      id: 'posts_no_activity',
      category: 'Posts',
      title: 'Google Posts Activity',
      severity: 'MEDIUM',
      status: 'WARNING',
      description: 'No Google Posts found',
      whyItMatters: 'Regular posts keep your profile fresh and can highlight offers, updates, and events',
      currentValue: '0 posts',
      expectedValue: '2-3 posts per week',
      recommendation: 'Create Google Posts to engage customers and improve visibility',
      actionRoute: '/google-business-profile/post-scheduler',
    }));
    return checks;
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recentPosts = allPosts.filter(p => new Date(p.createdAt) > sevenDaysAgo);
  const monthlyPosts = allPosts.filter(p => new Date(p.createdAt) > thirtyDaysAgo);

  // Recent Post Activity
  checks.push(new AuditCheck({
    id: 'posts_recent_activity',
    category: 'Posts',
    title: 'Recent Post Activity',
    severity: 'MEDIUM',
    status: recentPosts.length >= 2 ? 'PASS' : recentPosts.length >= 1 ? 'WARNING' : 'WARNING',
    description: `${recentPosts.length} posts in the last 7 days`,
    whyItMatters: 'Regular posting keeps your profile active and engaging',
    currentValue: `${recentPosts.length} posts (7 days)`,
    expectedValue: '2+ posts per week',
    recommendation: recentPosts.length < 2 ? 'Increase posting frequency to 2-3 times per week' : null,
    actionRoute: '/google-business-profile/post-scheduler',
    evidence: { recentPosts: recentPosts.length, monthlyPosts: monthlyPosts.length },
  }));

  // Monthly Consistency
  checks.push(new AuditCheck({
    id: 'posts_consistency',
    category: 'Posts',
    title: 'Posting Consistency',
    severity: 'MEDIUM',
    status: monthlyPosts.length >= 8 ? 'PASS' : monthlyPosts.length >= 4 ? 'WARNING' : 'WARNING',
    description: `${monthlyPosts.length} posts in the last 30 days`,
    whyItMatters: 'Consistent posting maintains customer engagement and profile freshness',
    currentValue: `${monthlyPosts.length} posts (30 days)`,
    expectedValue: '8+ posts per month',
    recommendation: monthlyPosts.length < 8 ? 'Maintain consistent posting schedule' : null,
    actionRoute: '/google-business-profile/post-scheduler',
    evidence: { monthlyPosts: monthlyPosts.length },
  }));

  return checks;
};

/**
 * Audit Website Local SEO (if website exists)
 */
export const auditWebsite = async (websiteUrl) => {
  const checks = [];

  if (!websiteUrl) {
    checks.push(new AuditCheck({
      id: 'website_no_url',
      category: 'Website SEO',
      title: 'Website',
      severity: 'MEDIUM',
      status: 'NOT_AVAILABLE',
      description: 'No website URL configured',
      whyItMatters: 'A website provides detailed business information and improves online presence',
      currentValue: 'No website',
      expectedValue: 'Active business website',
      recommendation: 'Add your business website',
      actionRoute: '/google-business-profile/profile',
    }));
    return checks;
  }

  try {
    // HTTPS Check
    const isHttps = websiteUrl.startsWith('https://');
    checks.push(new AuditCheck({
      id: 'website_https',
      category: 'Website SEO',
      title: 'HTTPS Security',
      severity: 'HIGH',
      status: isHttps ? 'PASS' : 'CRITICAL',
      description: isHttps ? 'Website uses HTTPS' : 'Website not using HTTPS',
      whyItMatters: 'HTTPS is essential for security and is a Google ranking factor',
      currentValue: isHttps ? 'HTTPS' : 'HTTP',
      expectedValue: 'HTTPS',
      recommendation: isHttps ? null : 'Enable HTTPS/SSL certificate for your website',
      actionRoute: null,
      evidence: { url: websiteUrl },
    }));

    // Try to fetch the website (with timeout)
    try {
      const response = await axios.get(websiteUrl, {
        timeout: 10000,
        maxRedirects: 5,
        headers: { 'User-Agent': 'Codelura-SEO-Audit/1.0' },
      });

      // HTTP Status
      checks.push(new AuditCheck({
        id: 'website_status',
        category: 'Website SEO',
        title: 'Website Accessibility',
        severity: 'HIGH',
        status: response.status === 200 ? 'PASS' : 'WARNING',
        description: `Website returns HTTP ${response.status}`,
        whyItMatters: 'Website must be accessible for customers and search engines',
        currentValue: `HTTP ${response.status}`,
        expectedValue: 'HTTP 200',
        recommendation: response.status === 200 ? null : 'Ensure website is accessible',
        actionRoute: null,
      }));

      // Basic on-page checks (simplified - full crawling would need more infrastructure)
      const html = response.data;
      
      // Title tag
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const hasTitle = titleMatch && titleMatch[1].length > 0;
      
      checks.push(new AuditCheck({
        id: 'website_title',
        category: 'Website SEO',
        title: 'Page Title',
        severity: 'HIGH',
        status: hasTitle ? 'PASS' : 'CRITICAL',
        description: hasTitle ? 'Page title exists' : 'Page title missing',
        whyItMatters: 'Title tags are critical for SEO and appear in search results',
        currentValue: hasTitle ? titleMatch[1].substring(0, 60) : 'No title',
        expectedValue: 'Optimized page title (50-60 characters)',
        recommendation: hasTitle ? null : 'Add a descriptive page title',
        actionRoute: null,
      }));

      // Meta description
      const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
      const hasMetaDesc = metaDescMatch && metaDescMatch[1].length > 0;
      
      checks.push(new AuditCheck({
        id: 'website_meta_description',
        category: 'Website SEO',
        title: 'Meta Description',
        severity: 'MEDIUM',
        status: hasMetaDesc ? 'PASS' : 'WARNING',
        description: hasMetaDesc ? 'Meta description exists' : 'Meta description missing',
        whyItMatters: 'Meta descriptions influence click-through rates from search results',
        currentValue: hasMetaDesc ? metaDescMatch[1].substring(0, 60) : 'No description',
        expectedValue: 'Compelling meta description (150-160 characters)',
        recommendation: hasMetaDesc ? null : 'Add a meta description',
        actionRoute: null,
      }));

    } catch (fetchError) {
      checks.push(new AuditCheck({
        id: 'website_fetch_error',
        category: 'Website SEO',
        title: 'Website Accessibility',
        severity: 'HIGH',
        status: 'CRITICAL',
        description: `Unable to access website: ${fetchError.message}`,
        whyItMatters: 'Website must be accessible for customers and search engines',
        currentValue: 'Not accessible',
        expectedValue: 'Accessible website',
        recommendation: 'Check website availability and server configuration',
        actionRoute: null,
      }));
    }

  } catch (error) {
    console.error('[Website Audit] Error:', error.message);
  }

  return checks;
};

/**
 * Audit NAP Consistency
 */
export const auditNAPConsistency = async (location, websiteData = null) => {
  const checks = [];

  if (!location.websiteUri) {
    checks.push(new AuditCheck({
      id: 'nap_no_website',
      category: 'NAP Consistency',
      title: 'NAP Consistency',
      severity: 'LOW',
      status: 'NOT_AVAILABLE',
      description: 'Cannot verify NAP consistency without website',
      whyItMatters: 'Consistent business information across platforms improves local SEO',
      currentValue: 'No website to compare',
      expectedValue: 'Consistent NAP across GBP and website',
      recommendation: 'Add website to enable NAP consistency checking',
      actionRoute: '/google-business-profile/profile',
    }));
    return checks;
  }

  try {
    // Fetch website and extract NAP data
    const response = await axios.get(location.websiteUri, {
      timeout: 10000,
      maxRedirects: 5,
      headers: { 'User-Agent': 'Codelura-SEO-Audit/1.0' },
    });

    const html = response.data;
    const $ = load(html);

    // Extract potential NAP data from website
    const websiteText = $('body').text().toLowerCase();
    
    // GBP Data - use helper to get from correct field
    const gbpAddress = location.storefrontAddress || location.address;
    const gbpPhone = location.phoneNumbers?.primaryPhone || location.primaryPhone;
    
    const gbpName = location.locationName?.toLowerCase() || '';
    const gbpPhoneClean = gbpPhone || '';
    const gbpCity = gbpAddress?.locality?.toLowerCase() || '';
    const gbpState = gbpAddress?.administrativeArea?.toLowerCase() || '';
    const gbpZip = gbpAddress?.postalCode || '';

    // Business Name Check
    const nameFound = gbpName && websiteText.includes(gbpName);
    checks.push(new AuditCheck({
      id: 'nap_business_name',
      category: 'NAP Consistency',
      title: 'Business Name Consistency',
      severity: 'HIGH',
      status: nameFound ? 'PASS' : 'WARNING',
      description: nameFound 
        ? 'Business name found on website' 
        : 'Business name not clearly visible on website',
      whyItMatters: 'Consistent business name helps search engines connect your website to your GBP',
      currentValue: nameFound ? 'Match found' : 'Not found on website',
      expectedValue: 'Business name visible on website',
      recommendation: nameFound ? null : 'Ensure your business name appears prominently on your website',
      actionRoute: null,
      evidence: { gbpName },
    }));

    // Phone Number Check
    if (!gbpPhoneClean) {
      checks.push(new AuditCheck({
        id: 'nap_phone_number',
        category: 'NAP Consistency',
        title: 'Phone Number Consistency',
        severity: 'HIGH',
        status: 'NOT_AVAILABLE',
        description: 'GBP phone number not available for comparison',
        whyItMatters: 'Consistent phone number is critical for NAP consistency and local SEO',
        currentValue: 'GBP phone missing',
        expectedValue: 'Same phone number on GBP and website',
        recommendation: 'Add phone number to Google Business Profile',
        actionRoute: '/google-business-profile/profile',
        evidence: { source: 'GBP_API', gbpPhone: gbpPhoneClean },
      }));
    } else {
      const phoneClean = gbpPhoneClean.replace(/\D/g, '');
      const phoneFound = phoneClean && websiteText.includes(phoneClean);
      checks.push(new AuditCheck({
        id: 'nap_phone_number',
        category: 'NAP Consistency',
        title: 'Phone Number Consistency',
        severity: 'HIGH',
        status: phoneFound ? 'PASS' : 'WARNING',
        description: phoneFound 
          ? 'Phone number matches between GBP and website' 
          : 'Phone number not found on website or mismatch',
        whyItMatters: 'Consistent phone number is critical for NAP consistency and local SEO',
        currentValue: phoneFound ? 'Match found' : 'Not found on website',
        expectedValue: 'Same phone number on GBP and website',
        recommendation: phoneFound ? null : 'Add your GBP phone number to your website contact page',
        actionRoute: null,
        evidence: { source: 'WEBSITE_CRAWLER', gbpPhone: gbpPhoneClean, phoneClean, phoneFound },
      }));
    }

    // Address Check
    const cityFound = gbpCity && websiteText.includes(gbpCity);
    const stateFound = gbpState && websiteText.includes(gbpState);
    const zipFound = gbpZip && websiteText.includes(gbpZip);
    const addressScore = (cityFound ? 1 : 0) + (stateFound ? 1 : 0) + (zipFound ? 1 : 0);
    
    checks.push(new AuditCheck({
      id: 'nap_address',
      category: 'NAP Consistency',
      title: 'Address Consistency',
      severity: 'HIGH',
      status: addressScore >= 2 ? 'PASS' : addressScore === 1 ? 'WARNING' : 'CRITICAL',
      description: addressScore >= 2 
        ? 'Address information found on website' 
        : 'Address information missing or incomplete on website',
      whyItMatters: 'Consistent address across platforms is essential for local search rankings',
      currentValue: `${addressScore}/3 address components found`,
      expectedValue: 'Complete address on website',
      recommendation: addressScore >= 2 ? null : 'Add your complete business address to your website footer or contact page',
      actionRoute: null,
      evidence: { gbpCity, gbpState, gbpZip, found: { city: cityFound, state: stateFound, zip: zipFound } },
    }));

    // Structured Data Check
    const hasLocalBusinessSchema = html.includes('"@type":"LocalBusiness"') || 
                                   html.includes('"@type": "LocalBusiness"');
    const hasOrganizationSchema = html.includes('"@type":"Organization"') || 
                                  html.includes('"@type": "Organization"');
    
    checks.push(new AuditCheck({
      id: 'nap_structured_data',
      category: 'NAP Consistency',
      title: 'LocalBusiness Schema',
      severity: 'MEDIUM',
      status: hasLocalBusinessSchema ? 'PASS' : hasOrganizationSchema ? 'WARNING' : 'WARNING',
      description: hasLocalBusinessSchema 
        ? 'LocalBusiness structured data found' 
        : hasOrganizationSchema 
        ? 'Organization schema found (LocalBusiness preferred)' 
        : 'No structured data found',
      whyItMatters: 'Structured data helps search engines understand your business information',
      currentValue: hasLocalBusinessSchema ? 'LocalBusiness schema' : hasOrganizationSchema ? 'Organization schema' : 'No schema',
      expectedValue: 'LocalBusiness schema with NAP data',
      recommendation: hasLocalBusinessSchema ? null : 'Add LocalBusiness structured data with name, address, and phone',
      actionRoute: null,
    }));

  } catch (error) {
    console.error('[NAP Audit] Error fetching website:', error.message);
    checks.push(new AuditCheck({
      id: 'nap_fetch_error',
      category: 'NAP Consistency',
      title: 'NAP Consistency Check',
      severity: 'MEDIUM',
      status: 'NOT_AVAILABLE',
      description: 'Unable to fetch website for NAP verification',
      whyItMatters: 'NAP consistency is crucial for local SEO',
      currentValue: 'Website not accessible',
      expectedValue: 'Consistent NAP across GBP and website',
      recommendation: 'Ensure your website is accessible and contains your business information',
      actionRoute: null,
    }));
  }

  return checks;
};

/**
 * Audit Performance Insights
 */
export const auditPerformance = async (locationId) => {
  const checks = [];

  try {
    // Get last 30 days performance data
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const metrics = await GbpPerformanceMetric.find({
      locationId,
      date: { $gte: thirtyDaysAgo },
    }).lean();

    if (metrics.length === 0) {
      checks.push(new AuditCheck({
        id: 'performance_no_data',
        category: 'Performance',
        title: 'Performance Data',
        severity: 'LOW',
        status: 'NOT_AVAILABLE',
        description: 'No performance data available',
        whyItMatters: 'Performance metrics help track your GBP visibility and engagement',
        currentValue: 'No data',
        expectedValue: 'Regular performance tracking',
        recommendation: 'Sync performance data from Google Business Profile',
        actionRoute: '/google-business-profile/performance',
      }));
      return checks;
    }

    // Calculate totals
    let totalImpressions = 0;
    let totalActions = 0;
    let totalCalls = 0;
    let totalWebsiteClicks = 0;
    let totalDirections = 0;

    metrics.forEach(metric => {
      totalImpressions += (metric.businessImpressionsDesktopSearch || 0) +
                         (metric.businessImpressionsMobileSearch || 0) +
                         (metric.businessImpressionsDesktopMaps || 0) +
                         (metric.businessImpressionsMobileMaps || 0);
      totalCalls += metric.callClicks || 0;
      totalWebsiteClicks += metric.websiteClicks || 0;
      totalDirections += metric.directionRequests || 0;
    });

    totalActions = totalCalls + totalWebsiteClicks + totalDirections;

    // Impressions Check
    checks.push(new AuditCheck({
      id: 'performance_impressions',
      category: 'Performance',
      title: 'Business Impressions',
      severity: 'MEDIUM',
      status: totalImpressions >= 100 ? 'PASS' : totalImpressions >= 50 ? 'WARNING' : 'WARNING',
      description: `${totalImpressions} impressions in last 30 days`,
      whyItMatters: 'Impressions indicate how often your business appears in search results',
      currentValue: `${totalImpressions} impressions`,
      expectedValue: '100+ impressions/month',
      recommendation: totalImpressions < 100 ? 'Increase visibility through regular posts, photos, and optimization' : null,
      actionRoute: '/google-business-profile/performance',
      evidence: { totalImpressions },
    }));

    // Customer Actions Check
    const actionRate = totalImpressions > 0 ? (totalActions / totalImpressions * 100) : 0;
    checks.push(new AuditCheck({
      id: 'performance_actions',
      category: 'Performance',
      title: 'Customer Actions',
      severity: 'MEDIUM',
      status: actionRate >= 3 ? 'PASS' : actionRate >= 1.5 ? 'WARNING' : 'WARNING',
      description: `${totalActions} customer actions (${actionRate.toFixed(1)}% action rate)`,
      whyItMatters: 'Customer actions show engagement with your business profile',
      currentValue: `${actionRate.toFixed(1)}% action rate`,
      expectedValue: '3%+ action rate',
      recommendation: actionRate < 3 ? 'Improve profile completeness and encourage customer engagement' : null,
      actionRoute: '/google-business-profile/performance',
      evidence: { totalActions, totalCalls, totalWebsiteClicks, totalDirections, actionRate: actionRate.toFixed(1) },
    }));

    // Activity Trend
    const recentWeek = metrics.filter(m => {
      const metricDate = new Date(m.date);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return metricDate >= sevenDaysAgo;
    });

    checks.push(new AuditCheck({
      id: 'performance_activity',
      category: 'Performance',
      title: 'Recent Activity',
      severity: 'LOW',
      status: recentWeek.length >= 5 ? 'PASS' : 'WARNING',
      description: `Performance data available for ${recentWeek.length} of last 7 days`,
      whyItMatters: 'Regular data tracking helps monitor your local SEO performance',
      currentValue: `${recentWeek.length}/7 days tracked`,
      expectedValue: '7/7 days tracked',
      recommendation: recentWeek.length < 5 ? 'Ensure regular data sync from Google Business Profile' : null,
      actionRoute: '/google-business-profile/performance',
    }));

  } catch (error) {
    console.error('[Performance Audit] Error:', error);
    checks.push(new AuditCheck({
      id: 'performance_error',
      category: 'Performance',
      title: 'Performance Insights',
      severity: 'LOW',
      status: 'NOT_AVAILABLE',
      description: 'Unable to load performance data',
      whyItMatters: 'Performance tracking is essential for measuring local SEO success',
      currentValue: 'Error loading data',
      expectedValue: 'Active performance tracking',
      recommendation: 'Check performance data sync settings',
      actionRoute: '/google-business-profile/performance',
    }));
  }

  return checks;
};

/**
 * Audit Local Visibility
 */
export const auditVisibility = async (locationId) => {
  const checks = [];

  try {
    const keywords = await GbpSearchKeyword.find({ locationId }).lean();

    if (keywords.length === 0) {
      checks.push(new AuditCheck({
        id: 'visibility_no_keywords',
        category: 'Visibility',
        title: 'Search Keywords',
        severity: 'LOW',
        status: 'NOT_AVAILABLE',
        description: 'No search keyword data available',
        whyItMatters: 'Search keywords show how customers find your business',
        currentValue: 'No data',
        expectedValue: 'Tracked search keywords',
        recommendation: 'Enable search keyword tracking',
        actionRoute: '/google-business-profile/keywords',
      }));
      return checks;
    }

    // Calculate keyword metrics
    const totalKeywords = keywords.length;
    const avgImpressions = keywords.reduce((sum, k) => sum + (k.impressions || 0), 0) / totalKeywords;
    const highImpression = keywords.filter(k => (k.impressions || 0) >= 100).length;

    checks.push(new AuditCheck({
      id: 'visibility_keyword_count',
      category: 'Visibility',
      title: 'Keyword Tracking',
      severity: 'LOW',
      status: totalKeywords >= 10 ? 'PASS' : totalKeywords >= 5 ? 'WARNING' : 'WARNING',
      description: `Tracking ${totalKeywords} search keywords`,
      whyItMatters: 'More tracked keywords provide better insights into search visibility',
      currentValue: `${totalKeywords} keywords`,
      expectedValue: '10+ keywords tracked',
      recommendation: totalKeywords < 10 ? 'Add more relevant search keywords to track' : null,
      actionRoute: '/google-business-profile/keywords',
      evidence: { totalKeywords },
    }));

    checks.push(new AuditCheck({
      id: 'visibility_keyword_performance',
      category: 'Visibility',
      title: 'Keyword Impressions',
      severity: 'MEDIUM',
      status: highImpression >= 5 ? 'PASS' : highImpression >= 2 ? 'WARNING' : 'WARNING',
      description: `${highImpression} keywords with 100+ impressions`,
      whyItMatters: 'High-impression keywords indicate strong search visibility',
      currentValue: `${highImpression} high-performing keywords`,
      expectedValue: '5+ keywords with 100+ impressions',
      recommendation: highImpression < 5 ? 'Optimize for relevant high-volume keywords' : null,
      actionRoute: '/google-business-profile/keywords',
      evidence: { highImpression, avgImpressions: Math.round(avgImpressions) },
    }));

  } catch (error) {
    console.error('[Visibility Audit] Error:', error);
    checks.push(new AuditCheck({
      id: 'visibility_error',
      category: 'Visibility',
      title: 'Search Visibility',
      severity: 'LOW',
      status: 'NOT_AVAILABLE',
      description: 'Unable to load keyword data',
      whyItMatters: 'Search visibility tracking helps understand customer discovery',
      currentValue: 'Error loading data',
      expectedValue: 'Active keyword tracking',
      recommendation: 'Check keyword tracking settings',
      actionRoute: '/google-business-profile/keywords',
    }));
  }

  return checks;
};

/**
 * Audit Competitor Analysis
 */
export const auditCompetitors = async (locationId) => {
  const checks = [];

  try {
    const competitors = await GbpCompetitor.find({ locationId }).lean();

    if (competitors.length === 0) {
      checks.push(new AuditCheck({
        id: 'competitors_not_tracking',
        category: 'Competitors',
        title: 'Competitor Tracking',
        severity: 'LOW',
        status: 'WARNING',
        description: 'No competitors being tracked',
        whyItMatters: 'Tracking competitors helps identify improvement opportunities',
        currentValue: '0 competitors tracked',
        expectedValue: '3-5 competitors tracked',
        recommendation: 'Add local competitors to track their performance',
        actionRoute: '/google-business-profile/competitors',
      }));
      return checks;
    }

    checks.push(new AuditCheck({
      id: 'competitors_count',
      category: 'Competitors',
      title: 'Competitor Tracking',
      severity: 'LOW',
      status: competitors.length >= 3 ? 'PASS' : 'WARNING',
      description: `Tracking ${competitors.length} competitors`,
      whyItMatters: 'Competitor analysis helps benchmark your performance',
      currentValue: `${competitors.length} competitors`,
      expectedValue: '3-5 direct competitors',
      recommendation: competitors.length < 3 ? 'Add more local competitors to track' : null,
      actionRoute: '/google-business-profile/competitors',
      evidence: { count: competitors.length },
    }));

  } catch (error) {
    console.error('[Competitor Audit] Error:', error);
    checks.push(new AuditCheck({
      id: 'competitors_error',
      category: 'Competitors',
      title: 'Competitor Analysis',
      severity: 'LOW',
      status: 'NOT_AVAILABLE',
      description: 'Unable to load competitor data',
      whyItMatters: 'Competitor tracking provides market insights',
      currentValue: 'Error loading data',
      expectedValue: 'Active competitor tracking',
      recommendation: 'Set up competitor tracking',
      actionRoute: '/google-business-profile/competitors',
    }));
  }

  return checks;
};

/**
 * Run Complete Local SEO Audit
 */
export const runLocalSEOAudit = async (userId, locationId) => {
  console.log(`[Local SEO Audit] Starting audit for location ${locationId}`);

  try {
    // Get location data
    const location = await GbpLocation.findOne({ _id: locationId, userId }).lean();
    if (!location) {
      throw new Error('Location not found');
    }

    // DEBUG: Log location data structure
    console.log(`[Local SEO Audit] Location data:`, {
      locationId,
      locationName: location.locationName,
      phoneNumbers: location.phoneNumbers,
      primaryPhone: location.primaryPhone,
      storefrontAddress: location.storefrontAddress,
      address: location.address,
      websiteUri: location.websiteUri,
    });

    // Run all audit modules
    const [
      profileChecks,
      reviewChecks,
      mediaChecks,
      postChecks,
      websiteChecks,
      napChecks,
      performanceChecks,
      visibilityChecks,
      competitorChecks,
    ] = await Promise.all([
      auditProfile(location),
      auditReviews(locationId),
      auditMedia(location),
      auditPosts(locationId),
      auditWebsite(location.websiteUri),
      auditNAPConsistency(location),
      auditPerformance(locationId),
      auditVisibility(locationId),
      auditCompetitors(locationId),
    ]);

    // Combine all checks
    const allChecks = [
      ...profileChecks,
      ...reviewChecks,
      ...mediaChecks,
      ...postChecks,
      ...websiteChecks,
      ...napChecks,
      ...performanceChecks,
      ...visibilityChecks,
      ...competitorChecks,
    ];

    // Calculate score
    const score = calculateAuditScore(allChecks);

    // Categorize issues
    const critical = allChecks.filter(c => c.status === 'CRITICAL');
    const warnings = allChecks.filter(c => c.status === 'WARNING');
    const passed = allChecks.filter(c => c.status === 'PASS');
    const notAvailable = allChecks.filter(c => c.status === 'NOT_AVAILABLE');

    console.log(`[Local SEO Audit] Complete - Score: ${score}/100`);
    console.log(`[Local SEO Audit] Critical: ${critical.length}, Warnings: ${warnings.length}, Passed: ${passed.length}`);

    return {
      locationId,
      score,
      checks: allChecks,
      summary: {
        total: allChecks.length,
        critical: critical.length,
        warnings: warnings.length,
        passed: passed.length,
        notAvailable: notAvailable.length,
      },
      breakdown: {
        profile: profileChecks,
        reviews: reviewChecks,
        media: mediaChecks,
        posts: postChecks,
        website: websiteChecks,
        nap: napChecks,
        performance: performanceChecks,
        visibility: visibilityChecks,
        competitors: competitorChecks,
      },
      auditedAt: new Date(),
    };

  } catch (error) {
    console.error('[Local SEO Audit] Error:', error);
    throw error;
  }
};

export default {
  runLocalSEOAudit,
  auditProfile,
  auditReviews,
  auditMedia,
  auditPosts,
  auditWebsite,
  auditNAPConsistency,
  auditPerformance,
  auditVisibility,
  auditCompetitors,
};
