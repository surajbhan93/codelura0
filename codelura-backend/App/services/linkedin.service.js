/**
 * LinkedIn OAuth and API Service
 * Handles LinkedIn authentication, token management, and API interactions
 */

import axios from "axios";
import LinkedInAuth from "../models/LinkedInAuth.js";

class LinkedInService {
  constructor() {
    this.clientId = process.env.LINKEDIN_CLIENT_ID;
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    this.redirectUri = process.env.NODE_ENV === "production"
      ? process.env.LINKEDIN_REDIRECT_URI_PROD
      : process.env.LINKEDIN_REDIRECT_URI;
    
    this.apiBaseUrl = "https://api.linkedin.com/v2";
    this.authBaseUrl = "https://www.linkedin.com/oauth/v2";
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state) {
    const scopes = [
      "r_liteprofile",
      "r_emailaddress",
      "w_member_social",
      "r_organization_social",
      "w_organization_social",
      "rw_organization_admin",
    ];

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: state,
      scope: scopes.join(" "),
    });

    return `${this.authBaseUrl}/authorization?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code) {
    try {
      const response = await axios.post(
        `${this.authBaseUrl}/accessToken`,
        null,
        {
          params: {
            grant_type: "authorization_code",
            code: code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token, expires_in, refresh_token } = response.data;

      return {
        accessToken: access_token,
        refreshToken: refresh_token || null,
        expiresIn: expires_in, // seconds
        expiresAt: new Date(Date.now() + expires_in * 1000),
      };
    } catch (error) {
      console.error("[LinkedIn] Token exchange error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error_description || "Failed to get access token");
    }
  }

  /**
   * Refresh access token (LinkedIn may not support refresh tokens - handle accordingly)
   */
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(
        `${this.authBaseUrl}/accessToken`,
        null,
        {
          params: {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: this.clientId,
            client_secret: this.clientSecret,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token, expires_in } = response.data;

      return {
        accessToken: access_token,
        expiresIn: expires_in,
        expiresAt: new Date(Date.now() + expires_in * 1000),
      };
    } catch (error) {
      console.error("[LinkedIn] Token refresh error:", error.response?.data || error.message);
      throw new Error("Failed to refresh access token");
    }
  }

  /**
   * Get LinkedIn user profile
   */
  async getUserProfile(accessToken) {
    try {
      const [profileResponse, emailResponse] = await Promise.all([
        axios.get(`${this.apiBaseUrl}/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get(`${this.apiBaseUrl}/emailAddress?q=members&projection=(elements*(handle~))`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      const profile = profileResponse.data;
      const email = emailResponse.data.elements?.[0]?.["handle~"]?.emailAddress;

      return {
        id: profile.id,
        firstName: profile.localizedFirstName,
        lastName: profile.localizedLastName,
        name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
        email: email || null,
        profileUrl: `https://www.linkedin.com/in/${profile.vanityName || profile.id}`,
        profilePicture: profile.profilePicture?.["displayImage~"]?.elements?.[0]?.identifiers?.[0]?.identifier || null,
      };
    } catch (error) {
      console.error("[LinkedIn] Get profile error:", error.response?.data || error.message);
      throw new Error("Failed to get LinkedIn profile");
    }
  }

  /**
   * Get organization pages the user has access to
   */
  async getOrganizationPages(accessToken) {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/organizationAcls?q=roleAssignee&projection=(elements*(organization~(id,localizedName,vanityName,logoV2(original~:playableStreams))))`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const organizations = response.data.elements || [];

      return organizations.map((org) => {
        const orgData = org["organization~"];
        return {
          id: orgData.id,
          name: orgData.localizedName,
          vanityName: orgData.vanityName || null,
          logoUrl: orgData.logoV2?.["original~"]?.elements?.[0]?.identifiers?.[0]?.identifier || null,
        };
      });
    } catch (error) {
      console.error("[LinkedIn] Get organizations error:", error.response?.data || error.message);
      // Return empty array if user has no organization access
      return [];
    }
  }

  /**
   * Create a LinkedIn post (UGC Post API)
   */
  async createPost(accessToken, authorUrn, postContent, mediaUrl = null) {
    try {
      const postData = {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: postContent,
            },
            shareMediaCategory: mediaUrl ? "IMAGE" : "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };

      // Add media if provided
      if (mediaUrl) {
        postData.specificContent["com.linkedin.ugc.ShareContent"].media = [
          {
            status: "READY",
            media: mediaUrl,
          },
        ];
      }

      const response = await axios.post(
        `${this.apiBaseUrl}/ugcPosts`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      const postId = response.data.id;
      const postUrl = `https://www.linkedin.com/feed/update/${postId}`;

      return {
        postId,
        postUrl,
        success: true,
      };
    } catch (error) {
      console.error("[LinkedIn] Create post error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to create LinkedIn post");
    }
  }

  /**
   * Upload image to LinkedIn (required before posting with images)
   */
  async uploadImage(accessToken, authorUrn, imageUrl) {
    try {
      // Step 1: Register upload
      const registerResponse = await axios.post(
        `${this.apiBaseUrl}/assets?action=registerUpload`,
        {
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: authorUrn,
            serviceRelationships: [
              {
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const asset = registerResponse.data.value.asset;
      const uploadUrl = registerResponse.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;

      // Step 2: Download image
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(imageResponse.data);

      // Step 3: Upload to LinkedIn
      await axios.put(uploadUrl, imageBuffer, {
        headers: {
          "Content-Type": imageResponse.headers["content-type"] || "image/jpeg",
        },
      });

      return asset;
    } catch (error) {
      console.error("[LinkedIn] Upload image error:", error.response?.data || error.message);
      throw new Error("Failed to upload image to LinkedIn");
    }
  }

  /**
   * Get comments on a post
   */
  async getPostComments(accessToken, postUrn) {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/socialActions/${postUrn}/comments`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      return response.data.elements || [];
    } catch (error) {
      console.error("[LinkedIn] Get comments error:", error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Reply to a comment
   */
  async replyToComment(accessToken, postUrn, commentText) {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/socialActions/${postUrn}/comments`,
        {
          actor: postUrn.split(":")[2], // Extract actor from URN
          message: {
            text: commentText,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      return {
        commentId: response.data.id,
        success: true,
      };
    } catch (error) {
      console.error("[LinkedIn] Reply to comment error:", error.response?.data || error.message);
      throw new Error("Failed to reply to comment");
    }
  }

  /**
   * Get post statistics
   */
  async getPostStatistics(accessToken, postUrn) {
    try {
      const response = await axios.get(
        `${this.apiBaseUrl}/socialActions/${postUrn}/(likes,comments)`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      return {
        likes: response.data.likes?.paging?.total || 0,
        comments: response.data.comments?.paging?.total || 0,
      };
    } catch (error) {
      console.error("[LinkedIn] Get statistics error:", error.response?.data || error.message);
      return { likes: 0, comments: 0 };
    }
  }

  /**
   * Save or update LinkedIn auth for a user
   */
  async saveAuth(userId, tokenData, profileData, organizationPages) {
    try {
      const authData = {
        userId,
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresAt: tokenData.expiresAt,
        linkedInUserId: profileData.id,
        linkedInUserName: profileData.name,
        linkedInUserEmail: profileData.email,
        linkedInProfileUrl: profileData.profileUrl,
        linkedInProfilePicture: profileData.profilePicture,
        organizationPages,
        isActive: true,
        lastSyncedAt: new Date(),
      };

      const auth = await LinkedInAuth.findOneAndUpdate(
        { userId },
        authData,
        { upsert: true, new: true }
      );

      return auth;
    } catch (error) {
      console.error("[LinkedIn] Save auth error:", error.message);
      throw new Error("Failed to save LinkedIn authentication");
    }
  }

  /**
   * Get active auth for a user
   */
  async getAuth(userId) {
    try {
      const auth = await LinkedInAuth.findActiveAuth(userId);
      
      if (!auth) {
        throw new Error("LinkedIn not connected");
      }

      // Check if token needs refresh
      if (auth.isTokenExpired()) {
        throw new Error("LinkedIn token expired. Please reconnect.");
      }

      return auth;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Disconnect LinkedIn for a user
   */
  async disconnect(userId) {
    try {
      await LinkedInAuth.findOneAndUpdate(
        { userId },
        { isActive: false },
        { new: true }
      );

      return { success: true };
    } catch (error) {
      console.error("[LinkedIn] Disconnect error:", error.message);
      throw new Error("Failed to disconnect LinkedIn");
    }
  }

  /**
   * Build author URN for posting
   */
  buildAuthorUrn(linkedInUserId, isOrganization = false) {
    if (isOrganization) {
      return `urn:li:organization:${linkedInUserId}`;
    }
    return `urn:li:person:${linkedInUserId}`;
  }
}

export default new LinkedInService();
