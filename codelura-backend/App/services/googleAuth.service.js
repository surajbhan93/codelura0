import axios from "axios";

export const getAccessToken = async () => {

  const refreshToken =
    global.GBP_REFRESH_TOKEN || process.env.GBP_REFRESH_TOKEN;

  const res = await axios.post(
    "https://oauth2.googleapis.com/token",
    new URLSearchParams({
      client_id: process.env.GBP_CLIENT_ID,
      client_secret: process.env.GBP_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  return res.data.access_token;

};