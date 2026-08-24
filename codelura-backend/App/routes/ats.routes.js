// import express from "express";
// import { atsChecker } from "../controllers/ats.controller.js";

// const router = express.Router();

// router.post("/analyze", atsChecker);

// export default router;


// routes/ats.routes.js
import express from "express";
import { atsChecker } from "../controllers/ats.controller.js";

const router = express.Router();

// Rate limiting middleware (optional)
const rateLimit = {
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: "Too many requests. Please wait a moment and try again.",
};

// Simple in-memory rate limiting
const requestCounts = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowStart = now - rateLimit.windowMs;

  // Clean old entries
  for (const [key, data] of requestCounts) {
    if (data.timestamp < windowStart) {
      requestCounts.delete(key);
    }
  }

  const userData = requestCounts.get(ip);
  if (userData) {
    if (userData.count >= rateLimit.max) {
      return res.status(429).json({
        success: false,
        message: rateLimit.message,
      });
    }
    userData.count++;
    userData.timestamp = now;
  } else {
    requestCounts.set(ip, { count: 1, timestamp: now });
  }

  next();
}

// Routes
router.post("/analyze", rateLimiter, atsChecker);

export default router;