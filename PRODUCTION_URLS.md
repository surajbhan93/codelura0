# 🌐 Codelura Production URLs & Endpoints

## Frontend (codelura.com)

### Google Business Profile Module
- **Dashboard**: https://codelura.com/google-business-profile/dashboard
- **OAuth Connect**: https://codelura.com/google-business-profile/dashboard (click "Connect Google Business Profile")
- **Locations**: https://codelura.com/google-business-profile/locations
- **Reviews**: https://codelura.com/google-business-profile/reviews
- **Posts**: https://codelura.com/google-business-profile/posts
- **Performance**: https://codelura.com/google-business-profile/performance
- **Keywords**: https://codelura.com/google-business-profile/keywords
- **Local SEO Audit**: https://codelura.com/google-business-profile/audit

---

## Backend API (api.codelura.com)

### Base URL
```
https://api.codelura.com/api
```

### OAuth Endpoints
```bash
# Get OAuth connection URL
GET /api/google-business-profile/oauth/connect

# OAuth callback (handled by Google)
GET /api/google-business-profile/oauth/callback?code=...&state=...

# Get OAuth status
GET /api/google-business-profile/oauth/status

# Disconnect OAuth
DELETE /api/google-business-profile/oauth/disconnect
```

### Location Endpoints
```bash
# Get all locations
GET /api/google-business-profile/locations

# Sync locations from Google
POST /api/google-business-profile/locations/sync

# Get single location
GET /api/google-business-profile/locations/:locationId

# Set primary location
POST /api/google-business-profile/locations/:locationId/primary
```

### Review Endpoints
```bash
# Get reviews for a location
GET /api/google-business-profile/locations/:locationId/reviews
Query params: ?page=1&limit=20&sort=-rating

# Sync reviews from Google
POST /api/google-business-profile/locations/:locationId/reviews/sync

# Reply to review
PUT /api/google-business-profile/locations/:locationId/reviews/:reviewId/reply
Body: { "replyText": "Thank you for your review!" }

# Delete review reply
DELETE /api/google-business-profile/locations/:locationId/reviews/:reviewId/reply

# Get automation settings
GET /api/google-business-profile/locations/:locationId/reviews/automation/settings

# Update automation settings
PUT /api/google-business-profile/locations/:locationId/reviews/automation/settings
Body: {
  "automaticRepliesEnabled": true,
  "autoPublishEnabled": true,
  "replyTone": "professional",
  "includeBusinessName": true,
  "seoOptimized": true,
  "maxKeywords": 2,
  "ratingFilter": "all",
  "negativeReviewAutoReply": true
}
```

### Post Endpoints
```bash
# Get posts
GET /api/google-business-profile/locations/:locationId/posts

# Create post
POST /api/google-business-profile/locations/:locationId/posts
Body: {
  "summary": "Post title",
  "callToAction": { "actionType": "LEARN_MORE", "url": "https://..." },
  "media": [{ "mediaFormat": "PHOTO", "sourceUrl": "https://..." }],
  "topicType": "STANDARD"
}

# Update post
PATCH /api/google-business-profile/locations/:locationId/posts/:postId

# Delete post
DELETE /api/google-business-profile/locations/:locationId/posts/:postId

# Publish post
POST /api/google-business-profile/locations/:locationId/posts/:postId/publish
```

### Audit Endpoints
```bash
# Run Local SEO audit
POST /api/google-business-profile/locations/:locationId/audit

# Get latest audit
GET /api/google-business-profile/locations/:locationId/audit

# Get audit history
GET /api/google-business-profile/locations/:locationId/audit/history?limit=10

# Compare audits
GET /api/google-business-profile/locations/:locationId/audit/compare/:auditId1/:auditId2

# Get action plan
GET /api/google-business-profile/locations/:locationId/audit/action-plan

# Get fix queue
GET /api/google-business-profile/locations/:locationId/audit/fix-queue
```

### Performance Endpoints
```bash
# Get performance metrics
GET /api/google-business-profile/locations/:locationId/performance
Query params: ?startDate=2024-01-01&endDate=2024-01-31

# Get keyword insights
GET /api/google-business-profile/locations/:locationId/keywords
```

---

## Google OAuth Configuration

### OAuth Credentials
- **Client ID**: `your-google-client-id.apps.googleusercontent.com`
- **Project**: `your-gbp-project`

### Authorized Redirect URIs
```
http://localhost:3002/api/google-business-profile/oauth/callback
https://api.codelura.com/api/google-business-profile/oauth/callback
```

### Authorized JavaScript Origins
```
http://localhost:3003
https://codelura.com
```

### OAuth Scopes
```
https://www.googleapis.com/auth/business.manage
https://www.googleapis.com/auth/userinfo.email
openid
```

---

## Testing Production

### 1. Test OAuth Flow
```bash
# Visit dashboard
open https://codelura.com/google-business-profile/dashboard

# Click "Connect Google Business Profile"
# Should redirect to Google OAuth with production callback URL
# After auth, should return to dashboard with success message
```

### 2. Test API Directly
```bash
# Get OAuth connect URL
curl https://api.codelura.com/api/google-business-profile/oauth/connect \
  -H "Cookie: token=YOUR_TOKEN"

# Get locations
curl https://api.codelura.com/api/google-business-profile/locations \
  -H "Cookie: token=YOUR_TOKEN"

# Sync reviews
curl -X POST https://api.codelura.com/api/google-business-profile/locations/LOCATION_ID/reviews/sync \
  -H "Cookie: token=YOUR_TOKEN"
```

### 3. Enable Auto-Reply
```bash
# Update automation settings
curl -X PUT https://api.codelura.com/api/google-business-profile/locations/LOCATION_ID/reviews/automation/settings \
  -H "Cookie: token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "automaticRepliesEnabled": true,
    "autoPublishEnabled": true,
    "replyTone": "professional",
    "includeBusinessName": true,
    "seoOptimized": true,
    "maxKeywords": 2,
    "ratingFilter": "all",
    "negativeReviewAutoReply": true
  }'
```

### 4. Monitor Cron Job
```bash
# Using PM2
pm2 logs codelura-api | grep "Review Auto-Reply"

# Should see every 5 minutes:
# [Review Auto-Reply] Starting review auto-reply processing...
# [Review Auto-Reply] Found X locations with automation enabled
# [Review Auto-Reply] Processing location: LOCATION_NAME
# [Review Auto-Reply] Review auto-reply processing completed
```

---

## Environment Variables Required in Production

### Backend (.env)
```bash
NODE_ENV=production
PORT=3002

# MongoDB
MONGO_URI=mongodb+srv://...

# Google OAuth
GBP_NEW_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GBP_NEW_CLIENT_SECRET=GOCSPX-your-client-secret
GBP_NEW_REDIRECT_URI_PROD=https://api.codelura.com/api/google-business-profile/oauth/callback
GBP_ENCRYPTION_KEY=your-64-char-hex-encryption-key

# AI (Groq)
GROQ_API_KEY=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

# Production URLs
PRODUCTION_CLIENT_URL=https://codelura.com
PRODUCTION_API_URL=https://api.codelura.com
CLIENT_URL=http://localhost:3003

# JWT & Auth
JWT_SECRET=supersecretjwtkey
ADMIN_SECRET=CODELURA_ADMIN_2025
```

### Frontend (.env)
```bash
NODE_ENV=production

# NextAuth
NEXTAUTH_URL=https://codelura.com
NEXTAUTH_SECRET=SUra9336289192@1234

# API (relative path for same-domain)
NEXT_PUBLIC_API_URL=/api
API_URL=http://localhost:3002/api

# Google OAuth (NextAuth)
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-oauth-secret
```

---

## Monitoring & Debugging

### Check Backend Logs
```bash
pm2 logs codelura-api

# Filter for errors
pm2 logs codelura-api --err

# Filter for cron
pm2 logs codelura-api | grep "Review Auto-Reply"

# Filter for OAuth
pm2 logs codelura-api | grep "OAuth"
```

### Check Application Status
```bash
pm2 status
pm2 monit
pm2 describe codelura-api
```

### Database Queries
```javascript
// Check OAuth tokens
db.gbpoauthtokens.find({}).sort({ createdAt: -1 })

// Check locations
db.gbplocations.find({})

// Check reviews with auto-reply
db.gbpreviews.find({ isAutoReplied: true }).sort({ repliedAt: -1 })

// Check automation settings
db.gbpreviewautomationsettings.find({ automaticRepliesEnabled: true })
```

---

## Support & Troubleshooting

### Common Issues

#### 1. redirect_uri_mismatch
**Solution**: Verify Google Console has:
```
https://api.codelura.com/api/google-business-profile/oauth/callback
```

#### 2. Cron not running
**Solution**: Check server.js has:
```javascript
import { startReviewAutoReplyCron } from "./App/cron/reviewAutoReply.cron.js";
startReviewAutoReplyCron();
```

#### 3. Reviews not auto-replying
**Solution**: Verify automation settings:
```javascript
db.gbpreviewautomationsettings.findOne({ locationId: "LOCATION_ID" })
// Must have: automaticRepliesEnabled: true, autoPublishEnabled: true
```

#### 4. Frontend can't reach API
**Solution**: Check Nginx proxy configuration for `/api` path

---

## Quick Deploy Commands

### Backend
```bash
cd /path/to/codelura-backend
NODE_ENV=production npm install
NODE_ENV=production pm2 restart codelura-api --update-env
```

### Frontend
```bash
cd /path/to/codelura-frontend
npm run build
pm2 restart codelura-web
```

### Both (with scripts)
```bash
# Linux/Mac
bash deploy-production.sh

# Windows
powershell -ExecutionPolicy Bypass -File deploy-production.ps1
```

---

**System Ready for Production! 🚀**
