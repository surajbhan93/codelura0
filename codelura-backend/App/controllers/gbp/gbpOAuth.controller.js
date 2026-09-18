import { buildAuthUrl, exchangeCode, revokeConnection, getConnectionStatus } from "../../services/gbp/gbpOAuth.service.js";
import { syncAccountsAndLocations } from "../../services/gbp/gbpLocation.service.js";

export const connectGoogle = (req, res) => {
  try {
    const userId = req.user._id;
    const url = buildAuthUrl(userId);
    res.json({ success: true, url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const oauthCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:3003";

    if (error) return res.redirect(`${frontendUrl}/google-business-profile/oauth?error=${encodeURIComponent(error)}`);
    if (!code || !state) return res.redirect(`${frontendUrl}/google-business-profile/oauth?error=missing_params`);

    // Decode state to get userId
    const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
    const userId = decoded.userId;
    if (!userId) return res.redirect(`${frontendUrl}/google-business-profile/oauth?error=invalid_state`);

    await exchangeCode(code, userId);

    // Auto-sync locations after connect
    try { await syncAccountsAndLocations(userId); } catch (_) {}

    res.redirect(`${frontendUrl}/google-business-profile/locations?connected=true`);
  } catch (err) {
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:3003";
    res.redirect(`${frontendUrl}/google-business-profile/oauth?error=${encodeURIComponent(err.message)}`);
  }
};

export const disconnectGoogle = async (req, res) => {
  try {
    await revokeConnection(req.user._id);
    res.json({ success: true, message: "Google Business Profile disconnected." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStatus = async (req, res) => {
  try {
    const status = await getConnectionStatus(req.user._id);
    res.json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
