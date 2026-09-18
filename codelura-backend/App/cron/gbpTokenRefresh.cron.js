import cron from "node-cron";
import GbpOAuthToken from "../models/gbp/GbpOAuthToken.js";
import { getValidAccessToken } from "../services/gbp/gbpOAuth.service.js";

export const startGbpTokenRefresh = () => {
  // Run every hour
  cron.schedule("0 * * * *", async () => {
    try {
      // Find tokens expiring in the next 2 hours
      const expiringSoon = await GbpOAuthToken.find({
        isConnected: true,
        tokenExpiry: { $lt: new Date(Date.now() + 2 * 60 * 60 * 1000) },
      });

      for (const token of expiringSoon) {
        try {
          await getValidAccessToken(token.userId);
          console.log(`[GBP Token Refresh] Refreshed token for user ${token.userId}`);
        } catch (err) {
          console.error(`[GBP Token Refresh] Failed for user ${token.userId}:`, err.message);
        }
      }
    } catch (err) {
      console.error("[GBP Token Refresh] Cron error:", err.message);
    }
  });
};
