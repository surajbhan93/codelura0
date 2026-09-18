import crypto from "crypto";
import axios from "axios";
import GbpOAuthToken from "../../models/gbp/GbpOAuthToken.js";
import GbpNotification from "../../models/gbp/GbpNotification.js";

const ALGORITHM = "aes-256-cbc";
const KEY_HEX = process.env.GBP_ENCRYPTION_KEY || "0000000000000000000000000000000000000000000000000000000000000001";
const KEY = Buffer.from(KEY_HEX, "hex");

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return { encrypted: encrypted.toString("hex"), iv: iv.toString("hex") };
};

const decrypt = (encryptedHex, ivHex) => {
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, "hex")), decipher.final()]);
  return decrypted.toString("utf8");
};

export const buildAuthUrl = (userId) => {
  // Use production redirect URI if in production environment
  const isProd = process.env.NODE_ENV === 'production';
  const redirectUri = isProd 
    ? (process.env.GBP_NEW_REDIRECT_URI_PROD || "https://api.codelura.com/api/google-business-profile/oauth/callback")
    : (process.env.GBP_NEW_REDIRECT_URI || "http://localhost:3002/api/google-business-profile/oauth/callback");
  
  const state = Buffer.from(JSON.stringify({ userId: userId.toString(), nonce: crypto.randomBytes(8).toString("hex") })).toString("base64url");
  const params = new URLSearchParams({
    client_id: process.env.GBP_NEW_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/business.manage https://www.googleapis.com/auth/userinfo.email openid",
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

export const exchangeCode = async (code, userId) => {
  // Use production redirect URI if in production environment
  const isProd = process.env.NODE_ENV === 'production';
  const redirectUri = isProd 
    ? (process.env.GBP_NEW_REDIRECT_URI_PROD || "https://api.codelura.com/api/google-business-profile/oauth/callback")
    : (process.env.GBP_NEW_REDIRECT_URI || "http://localhost:3002/api/google-business-profile/oauth/callback");
  
  const tokenRes = await axios.post("https://oauth2.googleapis.com/token", new URLSearchParams({
    code,
    client_id: process.env.GBP_NEW_CLIENT_ID,
    client_secret: process.env.GBP_NEW_CLIENT_SECRET,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });

  const { access_token, refresh_token, expires_in, scope } = tokenRes.data;

  const encAccess = encrypt(access_token);
  let encRefresh = { encrypted: null, iv: null };
  if (refresh_token) encRefresh = encrypt(refresh_token);

  // Get user info
  let googleEmail = null;
  try {
    const info = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${access_token}` } });
    googleEmail = info.data.email;
  } catch (_) {}

  const tokenDoc = await GbpOAuthToken.findOneAndUpdate(
    { userId },
    {
      userId,
      googleEmail,
      encryptedAccessToken: encAccess.encrypted,
      accessTokenIV: encAccess.iv,
      encryptedRefreshToken: refresh_token ? encRefresh.encrypted : undefined,
      refreshTokenIV: refresh_token ? encRefresh.iv : undefined,
      tokenExpiry: new Date(Date.now() + expires_in * 1000),
      scopes: scope?.split(" ") || [],
      isConnected: true,
      connectedAt: new Date(),
      revokedAt: null,
      lastRefreshedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return tokenDoc;
};

export const getValidAccessToken = async (userId) => {
  const tokenDoc = await GbpOAuthToken.findOne({ userId, isConnected: true });
  if (!tokenDoc) throw { code: 401, message: "Google account not connected. Please connect your Google Business Profile." };

  const now = new Date();
  const bufferMs = 5 * 60 * 1000; // 5 minutes buffer

  // If access token is still valid
  if (tokenDoc.tokenExpiry && tokenDoc.tokenExpiry > new Date(now.getTime() + bufferMs)) {
    return decrypt(tokenDoc.encryptedAccessToken, tokenDoc.accessTokenIV);
  }

  // Refresh
  if (!tokenDoc.encryptedRefreshToken) throw { code: 401, message: "Session expired. Please reconnect your Google Business Profile." };

  const refreshToken = decrypt(tokenDoc.encryptedRefreshToken, tokenDoc.refreshTokenIV);

  try {
    const res = await axios.post("https://oauth2.googleapis.com/token", new URLSearchParams({
      client_id: process.env.GBP_NEW_CLIENT_ID,
      client_secret: process.env.GBP_NEW_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });

    const { access_token, expires_in } = res.data;
    const enc = encrypt(access_token);

    await GbpOAuthToken.findOneAndUpdate({ userId }, {
      encryptedAccessToken: enc.encrypted,
      accessTokenIV: enc.iv,
      tokenExpiry: new Date(Date.now() + expires_in * 1000),
      lastRefreshedAt: new Date(),
    });

    return access_token;
  } catch (err) {
    const errData = err.response?.data;
    if (errData?.error === "invalid_grant") {
      await GbpOAuthToken.findOneAndUpdate({ userId }, { isConnected: false, revokedAt: new Date() });
      throw { code: 401, message: "Google authorization expired. Please reconnect your Google Business Profile." };
    }
    throw err;
  }
};

export const revokeConnection = async (userId) => {
  const tokenDoc = await GbpOAuthToken.findOne({ userId });
  if (!tokenDoc) return;

  try {
    const accessToken = decrypt(tokenDoc.encryptedAccessToken, tokenDoc.accessTokenIV);
    await axios.post(`https://oauth2.googleapis.com/revoke?token=${accessToken}`);
  } catch (_) {}

  await GbpOAuthToken.findOneAndUpdate({ userId }, {
    isConnected: false,
    revokedAt: new Date(),
    encryptedAccessToken: null,
    encryptedRefreshToken: null,
    accessTokenIV: null,
    refreshTokenIV: null,
  });
};

export const getConnectionStatus = async (userId) => {
  const tokenDoc = await GbpOAuthToken.findOne({ userId });
  if (!tokenDoc || !tokenDoc.isConnected) return { connected: false };
  return {
    connected: true,
    googleEmail: tokenDoc.googleEmail,
    connectedAt: tokenDoc.connectedAt,
    lastRefreshedAt: tokenDoc.lastRefreshedAt,
    tokenExpiry: tokenDoc.tokenExpiry,
  };
};
