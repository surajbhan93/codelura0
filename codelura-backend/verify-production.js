#!/usr/bin/env node
/**
 * Production Readiness Verification Script
 * Run: node verify-production.js
 */

import "dotenv/config";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("\n🔍 Codelura Production Readiness Check\n");
console.log("=".repeat(50));

let passed = 0;
let failed = 0;
let warnings = 0;

// Helper functions
const check = (name, condition, message) => {
  if (condition) {
    console.log(`✅ ${name}: ${message}`);
    passed++;
    return true;
  } else {
    console.log(`❌ ${name}: ${message}`);
    failed++;
    return false;
  }
};

const warn = (name, message) => {
  console.log(`⚠️  ${name}: ${message}`);
  warnings++;
};

const info = (message) => {
  console.log(`ℹ️  ${message}`);
};

// 1. Environment Variables
console.log("\n📋 Environment Variables:");
console.log("-".repeat(50));

check(
  "NODE_ENV",
  process.env.NODE_ENV,
  process.env.NODE_ENV === "production" 
    ? `Set to '${process.env.NODE_ENV}' (Production Mode)` 
    : `Set to '${process.env.NODE_ENV || "not set"}' (Development Mode)`
);

check(
  "GBP Client ID",
  process.env.GBP_NEW_CLIENT_ID && process.env.GBP_NEW_CLIENT_ID.length > 0,
  process.env.GBP_NEW_CLIENT_ID ? "✓ Production OAuth credentials configured" : "Missing"
);

check(
  "GBP Client Secret",
  process.env.GBP_NEW_CLIENT_SECRET && process.env.GBP_NEW_CLIENT_SECRET.startsWith("GOCSPX-"),
  process.env.GBP_NEW_CLIENT_SECRET ? "✓ Present" : "Missing"
);

check(
  "GBP Redirect URI (Dev)",
  process.env.GBP_NEW_REDIRECT_URI,
  process.env.GBP_NEW_REDIRECT_URI || "Not set"
);

check(
  "GBP Redirect URI (Prod)",
  process.env.GBP_NEW_REDIRECT_URI_PROD === "https://api.codelura.com/api/google-business-profile/oauth/callback",
  process.env.GBP_NEW_REDIRECT_URI_PROD || "Not set"
);

check(
  "Production URLs",
  process.env.PRODUCTION_CLIENT_URL && process.env.PRODUCTION_API_URL,
  process.env.PRODUCTION_CLIENT_URL && process.env.PRODUCTION_API_URL
    ? `Client: ${process.env.PRODUCTION_CLIENT_URL}, API: ${process.env.PRODUCTION_API_URL}`
    : "Not fully configured"
);

check(
  "Encryption Key",
  process.env.GBP_ENCRYPTION_KEY && process.env.GBP_ENCRYPTION_KEY.length === 64,
  process.env.GBP_ENCRYPTION_KEY 
    ? `✓ 64-char hex key present`
    : "Missing or invalid"
);

check(
  "Groq API Key",
  process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith("gsk_"),
  process.env.GROQ_API_KEY ? "✓ Present" : "Missing (required for AI review replies)"
);

check(
  "MongoDB URI",
  process.env.MONGO_URI && process.env.MONGO_URI.includes("mongodb"),
  process.env.MONGO_URI ? "✓ Configured" : "Missing"
);

// 2. File Structure
console.log("\n📁 Critical Files:");
console.log("-".repeat(50));

const criticalFiles = [
  { path: "App/services/gbp/gbpOAuth.service.js", name: "OAuth Service" },
  { path: "App/services/gbp/gbpReview.service.js", name: "Review Service" },
  { path: "App/services/ai.service.js", name: "AI Service" },
  { path: "App/cron/reviewAutoReply.cron.js", name: "Auto-Reply Cron" },
  { path: "App/models/gbp/GbpReviewAutomationSettings.js", name: "Automation Settings Model" },
  { path: "server.js", name: "Server Entry Point" },
];

criticalFiles.forEach(({ path, name }) => {
  const fullPath = join(__dirname, "App", "..", path);
  check(
    name,
    fs.existsSync(fullPath),
    fs.existsSync(fullPath) ? "✓ Exists" : `Missing at ${path}`
  );
});

// 3. OAuth Service Check
console.log("\n🔐 OAuth Configuration:");
console.log("-".repeat(50));

try {
  const oauthServicePath = join(__dirname, "App", "services", "gbp", "gbpOAuth.service.js");
  const oauthContent = fs.readFileSync(oauthServicePath, "utf8");
  
  check(
    "Production URI Detection",
    oauthContent.includes("NODE_ENV === 'production'") || oauthContent.includes('NODE_ENV === "production"'),
    oauthContent.includes("NODE_ENV") 
      ? "✓ Environment-aware redirect URI configured"
      : "Missing environment detection"
  );
  
  check(
    "GBP_NEW_REDIRECT_URI_PROD",
    oauthContent.includes("GBP_NEW_REDIRECT_URI_PROD"),
    oauthContent.includes("GBP_NEW_REDIRECT_URI_PROD")
      ? "✓ Production redirect URI supported"
      : "Not using production redirect URI"
  );
} catch (error) {
  warn("OAuth Service", `Could not verify: ${error.message}`);
}

// 4. Cron Job Integration
console.log("\n⏰ Cron Job:");
console.log("-".repeat(50));

try {
  const serverPath = join(__dirname, "server.js");
  const serverContent = fs.readFileSync(serverPath, "utf8");
  
  check(
    "Auto-Reply Cron Import",
    serverContent.includes("reviewAutoReply.cron") || serverContent.includes("startReviewAutoReplyCron"),
    serverContent.includes("reviewAutoReply") 
      ? "✓ Imported"
      : "Not imported"
  );
  
  check(
    "Cron Initialization",
    serverContent.includes("startReviewAutoReplyCron()"),
    serverContent.includes("startReviewAutoReplyCron()") 
      ? "✓ Called in server.js"
      : "Not initialized"
  );
} catch (error) {
  warn("Cron Integration", `Could not verify: ${error.message}`);
}

// 5. Dependencies
console.log("\n📦 Dependencies:");
console.log("-".repeat(50));

try {
  const packagePath = join(__dirname, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  check("axios", deps.axios, deps.axios ? `v${deps.axios}` : "Missing");
  check("cheerio", deps.cheerio, deps.cheerio ? `v${deps.cheerio}` : "Missing (required for NAP audit)");
  check("node-cron", deps["node-cron"], deps["node-cron"] ? `v${deps["node-cron"]}` : "Missing (required for auto-reply)");
  check("groq-sdk", deps["groq-sdk"], deps["groq-sdk"] ? `v${deps["groq-sdk"]}` : "Missing (required for AI replies)");
  check("express", deps.express, deps.express ? `v${deps.express}` : "Missing");
  check("mongoose", deps.mongoose, deps.mongoose ? `v${deps.mongoose}` : "Missing");
} catch (error) {
  warn("Dependencies", `Could not verify package.json: ${error.message}`);
}

// Summary
console.log("\n" + "=".repeat(50));
console.log("📊 Summary:");
console.log("=".repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`⚠️  Warnings: ${warnings}`);

if (failed === 0 && warnings === 0) {
  console.log("\n🎉 System is PRODUCTION READY!");
  console.log("\nNext Steps:");
  console.log("1. Set NODE_ENV=production on production server");
  console.log("2. Deploy backend to api.codelura.com");
  console.log("3. Deploy frontend to codelura.com");
  console.log("4. Test OAuth flow: https://codelura.com/google-business-profile/dashboard");
  console.log("5. Enable automation for a test location");
  console.log("6. Monitor logs: pm2 logs codelura-api | grep 'Review Auto-Reply'");
} else if (failed === 0) {
  console.log("\n⚠️  System is mostly ready, but review warnings above");
} else {
  console.log("\n❌ Fix failed checks before deploying to production");
  process.exit(1);
}

console.log("\n" + "=".repeat(50) + "\n");
