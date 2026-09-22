/**
 * LinkedIn API Client
 * Frontend wrapper for LinkedIn job promotion features
 */

import api from "./api";

const LINKEDIN_BASE = "/linkedin";

// ═══════════════════════════════════════════════════════════════════
// OAUTH & CONNECTION
// ═══════════════════════════════════════════════════════════════════

/**
 * Initiate LinkedIn OAuth flow
 * Returns authorization URL to redirect user to
 */
export const linkedinInitiateOAuth = () => 
  api.get(`${LINKEDIN_BASE}/oauth/connect`);

/**
 * Get LinkedIn connection status
 * Returns: connected, userName, profileUrl, organizationPages, etc.
 */
export const linkedinGetStatus = () => 
  api.get(`${LINKEDIN_BASE}/status`);

/**
 * Disconnect LinkedIn account
 */
export const linkedinDisconnect = () => 
  api.delete(`${LINKEDIN_BASE}/disconnect`);

// ═══════════════════════════════════════════════════════════════════
// ORGANIZATION PAGES
// ═══════════════════════════════════════════════════════════════════

/**
 * Get organization pages user has access to
 */
export const linkedinGetPages = () => 
  api.get(`${LINKEDIN_BASE}/pages`);

// ═══════════════════════════════════════════════════════════════════
// JOB POST GENERATION & PUBLISHING
// ═══════════════════════════════════════════════════════════════════

/**
 * Generate LinkedIn job post using AI
 * @param jobData - Job details (title, company, location, type, salary, description, tags, careerPageUrl)
 */
export const linkedinGenerateJobPost = (jobData: {
  title: string;
  company: string;
  location?: string;
  type?: string;
  salary?: string;
  description?: string;
  tags?: string;
  careerPageUrl?: string;
}) => api.post(`${LINKEDIN_BASE}/generate-job-post`, jobData);

/**
 * Save/update LinkedIn promotion (without publishing)
 * @param promotionData - Promotion details
 */
export const linkedinSavePromotion = (promotionData: {
  jobId: string;
  linkedInPageId?: string;
  linkedInPageName?: string;
  postContent: string;
  mediaUrl?: string;
  hashtags?: string[];
  publishMode: "now" | "scheduled";
  scheduledAt?: string;
  aiAutoReply?: {
    enabled: boolean;
    mode: "automatic" | "approval_required";
  };
}) => api.post(`${LINKEDIN_BASE}/promotions`, promotionData);

/**
 * Get promotion status for a job
 * @param jobId - Job ID
 */
export const linkedinGetPromotionStatus = (jobId: string) => 
  api.get(`${LINKEDIN_BASE}/promotions/job/${jobId}`);

/**
 * Publish LinkedIn post immediately
 * @param promotionId - Promotion ID
 */
export const linkedinPublishPost = (promotionId: string) => 
  api.post(`${LINKEDIN_BASE}/promotions/${promotionId}/publish`);

// ═══════════════════════════════════════════════════════════════════
// COMMENTS & AUTO-REPLY
// ═══════════════════════════════════════════════════════════════════

/**
 * Generate AI reply for a comment
 * @param commentData - Comment text and job details
 */
export const linkedinGenerateCommentReply = (commentData: {
  commentText: string;
  jobTitle: string;
  companyName: string;
}) => api.post(`${LINKEDIN_BASE}/comments/generate-reply`, commentData);

/**
 * Get comments for a LinkedIn post
 * @param promotionId - Promotion ID
 */
export const linkedinGetPostComments = (promotionId: string) => 
  api.get(`${LINKEDIN_BASE}/promotions/${promotionId}/comments`);

/**
 * Reply to a comment
 * @param promotionId - Promotion ID
 * @param replyText - Reply text
 */
export const linkedinReplyToComment = (promotionId: string, replyText: string) => 
  api.post(`${LINKEDIN_BASE}/promotions/${promotionId}/comments`, { replyText });

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Check if user is connected to LinkedIn
 */
export const isLinkedInConnected = async (): Promise<boolean> => {
  try {
    const response = await linkedinGetStatus();
    return response.data.connected === true;
  } catch (error) {
    return false;
  }
};

/**
 * Open LinkedIn OAuth popup
 */
export const openLinkedInOAuthPopup = async (): Promise<void> => {
  try {
    const response = await linkedinInitiateOAuth();
    const authUrl = response.data.authUrl;
    
    if (authUrl) {
      // Open in new window
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      window.open(
        authUrl,
        "LinkedIn OAuth",
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
      );
    }
  } catch (error) {
    console.error("Failed to initiate LinkedIn OAuth:", error);
    throw error;
  }
};

/**
 * Get all LinkedIn promotions (Admin Dashboard)
 */
export const linkedinGetAllPromotions = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.order) queryParams.append("order", params.order);

  const response = await fetch(`/api/linkedin/promotions?${queryParams}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch promotions");
  }

  return response.json();
};

/**
 * Get single promotion by ID
 */
export const linkedinGetPromotionById = async (promotionId: string) => {
  const response = await fetch(`/api/linkedin/promotions/${promotionId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch promotion");
  }

  return response.json();
};

/**
 * Cancel scheduled promotion
 */
export const linkedinCancelPromotion = async (promotionId: string) => {
  const response = await fetch(`/api/linkedin/promotions/${promotionId}/cancel`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to cancel promotion");
  }

  return response.json();
};

/**
 * Update auto-reply settings
 */
export const linkedinUpdateAutoReply = async (
  promotionId: string,
  settings: {
    enabled?: boolean;
    mode?: "automatic" | "approval_required";
  }
) => {
  const response = await fetch(`/api/linkedin/promotions/${promotionId}/auto-reply`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update auto-reply settings");
  }

  return response.json();
};
