import axios from "axios";
import { getAccessToken } from "../services/googleAuth.service.js";


// Step 1 → Redirect to Google Login
export const googleAuth = (req, res) => {

  const url =
  "https://accounts.google.com/o/oauth2/v2/auth" +
  `?client_id=${process.env.GBP_CLIENT_ID}` +
  `&redirect_uri=${process.env.GBP_REDIRECT_URI}` +
  `&response_type=code` +
  `&scope=https://www.googleapis.com/auth/business.manage` +
  `&access_type=offline` +
  `&prompt=consent`;

res.redirect(url);

};


export const googleCallback = async (req, res) => {

  try {

    const code = req.query.code;

    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GBP_CLIENT_ID,
        client_secret: process.env.GBP_CLIENT_SECRET,
        redirect_uri: process.env.GBP_REDIRECT_URI,
        grant_type: "authorization_code"
      }
    );

    const tokens = tokenRes.data;

    console.log("Refresh Token:", tokens.refresh_token);

    // temporarily store refresh token
    global.GBP_REFRESH_TOKEN = tokens.refresh_token;

    // res.redirect("http://localhost:3001/autogbp");
    res.redirect("http://localhost:3001/autogbp?google=connected");

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};

// Step 3 → Fetch Accounts
export const getAccounts = async (req, res) => {

  try {

    const accessToken = await getAccessToken();

    const response = await axios.get(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    console.log("Access token:", accessToken);
console.log(response.data);
    res.json({
      success: true,
      data: response.data.accounts
    });

  } catch (err) {

    console.log(err.response?.data);

    res.status(500).json({
      success: false,
      message: "Failed to fetch accounts"
    });

  }

};


// Step 4 → Fetch Locations
export const getLocations = async (req, res) => {

  try {

    const { accountId } = req.params;

    const accessToken = await getAccessToken();

    const response = await axios.get(
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json({
      success: true,
      data: response.data.locations
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};