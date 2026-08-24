import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = (req, res, next) => {
  let token = null;

  // 1️⃣ Authorization header (PRIMARY from localStorage Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2️⃣ Cookie-based auth (FALLBACK)
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }
  if (!token && req.cookies?.auth_token) {
    token = req.cookies.auth_token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize user object so both req.user._id and req.user.id work everywhere
    const userId = decoded.id || decoded._id;

    req.user = {
      ...decoded,
      _id: userId,
      id: userId,
    };

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
  }
};

export const authOptional = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }
    if (!token && req.cookies?.auth_token) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;

    req.user = {
      ...decoded,
      _id: userId,
      id: userId,
    };

    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

export const protectOptional = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token || req.cookies?.auth_token;
    const queryToken = req.query?.token;
    const headerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const token = headerToken || cookieToken || queryToken;

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      req.user = null;
      return next();
    }

    req.user = user;
    return next();
  } catch (err) {
    req.user = null;
    return next();
  }
};