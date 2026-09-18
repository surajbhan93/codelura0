# 🚀 Codelura Production Deployment Guide

## Google Business Profile Module - Production Ready

### ✅ What's Already Configured

#### Backend (.env)
```bash
# Production URLs
CLIENT_URL=http://localhost:3003
PRODUCTION_CLIENT_URL=https://codelura.com
PRODUCTION_API_URL=https://api.codelura.com

# Google OAuth (Production-Ready)
GBP_NEW_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GBP_NEW_CLIENT_SECRET=GOCSPX-your-client-secret

# Redirect URIs
GBP_NEW_REDIRECT_URI=http://localhost:3002/api/google-business-profile/oauth/callback
GBP_NEW_REDIRECT_URI_PROD=https://api.codelura.com/api/google-business-profile/oauth/callback

# Encryption (generate with: openssl rand -hex 32)
GBP_ENCRYPTION_KEY=your-64-char-hex-encryption-key
```

#### Frontend (.env)
```bash
# Production
NEXTAUTH_URL=https://codelura.com
NEXT_PUBLIC_API_URL=/api  # Uses relative path in production
API_URL=http://localhost:3002/api  # Server-side only

# OAuth - use your Google OAuth credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

#### Google Cloud Console
✅ OAuth Credentials Configured:
- **Client ID**: `your-google-client-id.apps.googleusercontent.com`
- **Authorized Redirect URIs**:
  - `http://localhost:3002/api/google-business-profile/oauth/callback` (development)
  - `https://api.codelura.com/api/google-business-profile/oauth/callback` (production)
- **Authorized JavaScript Origins**:
  - `http://localhost:3003` (development)
  - `https://codelura.com` (production)

---

## 🎯 Deployment Steps

### Step 1: Backend Deployment (api.codelura.com)

#### 1.1 Environment Variables
Set on production server:
```bash
NODE_ENV=production
PORT=3002
MONGO_URI=mongodb+srv://codelura_db_user:Codelura%4012345@codelura.dr0gcls.mongodb.net/CodeluraDB?retryWrites=true&w=majority&appName=Codelura

# Copy all from .env file, especially:
GBP_NEW_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GBP_NEW_CLIENT_SECRET=GOCSPX-your-client-secret
GBP_NEW_REDIRECT_URI_PROD=https://api.codelura.com/api/google-business-profile/oauth/callback
GBP_ENCRYPTION_KEY=your-64-char-hex-encryption-key
GROQ_API_KEY=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
```

#### 1.2 Deploy Commands
```bash
cd codelura-backend/App
npm install --production
NODE_ENV=production npm start
# or use PM2:
pm2 start server.js --name codelura-api --env production
```

#### 1.3 Verify Backend
```bash
# Check OAuth URL generation
curl https://api.codelura.com/api/google-business-profile/oauth/connect

# Should return URL with redirect_uri=https://api.codelura.com/...
```

---

### Step 2: Frontend Deployment (codelura.com)

#### 2.1 Build Production
```bash
cd codelura-frontend
npm run build
```

#### 2.2 Environment Variables (Production)
```bash
NEXTAUTH_URL=https://codelura.com
NEXT_PUBLIC_API_URL=/api  # Important: relative path for same-domain
NODE_ENV=production
```

#### 2.3 Deploy
```bash
npm start
# or with PM2:
pm2 start npm --name codelura-web -- start
```

---

### Step 3: Nginx Configuration

#### Backend (api.codelura.com)
```nginx
server {
    listen 443 ssl http2;
    server_name api.codelura.com;

    ssl_certificate /path/to/ssl/fullchain.pem;
    ssl_certificate_key /path/to/ssl/privkey.pem;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Frontend (codelura.com)
```nginx
server {
    listen 443 ssl http2;
    server_name codelura.com www.codelura.com;

    ssl_certificate /path/to/ssl/fullchain.pem;
    ssl_certificate_key /path/to/ssl/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass https://api.codelura.com;
        proxy_http_version 1.1;
        proxy_set_header Host api.codelura.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🧪 Testing Production Setup

### 1. Test OAuth Flow
```bash
# Visit production site
https://codelura.com/google-business-profile/dashboard

# Click "Connect Google Business Profile"
# Should redirect to Google OAuth with:
# redirect_uri=https://api.codelura.com/api/google-business-profile/oauth/callback

# After authorization, should redirect back to:
# https://codelura.com/google-business-profile/dashboard?oauth=success
```

### 2. Test Location Sync
```bash
curl -X POST https://api.codelura.com/api/google-business-profile/locations/sync \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Cookie: token=YOUR_TOKEN"
```

### 3. Test Review Auto-Reply
```bash
# Enable automation for a location
curl -X PUT https://api.codelura.com/api/google-business-profile/locations/LOCATION_ID/reviews/automation/settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
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

# Wait 5 minutes, check cron logs:
pm2 logs codelura-api | grep "Review Auto-Reply"
```

---

## 🔧 How It Works in Production

### Environment Detection
Backend automatically detects environment:
```javascript
// gbpOAuth.service.js
const isProd = process.env.NODE_ENV === 'production';
const redirectUri = isProd 
  ? process.env.GBP_NEW_REDIRECT_URI_PROD  // https://api.codelura.com/...
  : process.env.GBP_NEW_REDIRECT_URI;       // http://localhost:3002/...
```

### OAuth Flow
1. User clicks "Connect" on `https://codelura.com`
2. Backend generates auth URL with production redirect URI
3. User authorizes on Google
4. Google redirects to `https://api.codelura.com/api/google-business-profile/oauth/callback`
5. Backend saves tokens, redirects to `https://codelura.com/google-business-profile/dashboard?oauth=success`

### Cron Job (Auto-Reply)
- Runs every 5 minutes on production server
- Processes all locations with `automaticRepliesEnabled=true`
- Generates AI replies via Groq
- Publishes to Google if `autoPublishEnabled=true`

---

## 🚨 Production Checklist

### Before Deployment
- [ ] Set `NODE_ENV=production` on backend server
- [ ] Verify all `.env` variables copied to production
- [ ] Test OAuth callback URL in Google Console
- [ ] SSL certificates valid for both domains
- [ ] MongoDB accessible from production server
- [ ] Groq API key valid and has credits

### After Deployment
- [ ] Test OAuth connection flow
- [ ] Verify location sync works
- [ ] Check cron job logs (should see "[Review Auto-Reply] Starting..." every 5min)
- [ ] Enable automation for test location
- [ ] Create test review, verify auto-reply within 5min
- [ ] Monitor error logs for 24 hours

### Security
- [ ] Never commit `.env` files
- [ ] Rotate secrets if accidentally exposed
- [ ] Use `GBP_ENCRYPTION_KEY` for token encryption
- [ ] Enable rate limiting in production
- [ ] Monitor API usage on Google Console

---

## 📊 Monitoring

### Backend Logs
```bash
# PM2 logs
pm2 logs codelura-api --lines 100

# Filter cron job
pm2 logs codelura-api | grep "Review Auto-Reply"

# Filter errors
pm2 logs codelura-api --err
```

### Database Checks
```javascript
// Check automation settings
db.gbpreviewautomationsettings.find({ automaticRepliesEnabled: true })

// Check auto-replied reviews
db.gbpreviews.find({ isAutoReplied: true }).sort({ repliedAt: -1 }).limit(10)

// Check OAuth tokens
db.gbpoauthtokens.find({}).sort({ createdAt: -1 })
```

---

## 🎉 Features Ready in Production

### ✅ Local SEO Audit
- 9-category audit system
- Real-time scoring
- Action plan generation
- Historical comparison

### ✅ Review Auto-Reply
- AI-powered reply generation (Groq)
- Automatic publishing to Google
- Configurable tone & SEO settings
- Rating filters (all/4+/5-star only)
- Negative review handling

### ✅ Location Management
- Multi-location support
- Primary location selection
- Automatic sync with Google
- Token refresh automation

### ✅ OAuth Security
- Encrypted token storage (AES-256-CBC)
- Automatic token refresh
- Secure callback handling
- Environment-aware redirect URIs

---

## 🆘 Troubleshooting

### OAuth Error: redirect_uri_mismatch
**Fix**: Check Google Console authorized URIs include:
```
https://api.codelura.com/api/google-business-profile/oauth/callback
```

### Cron Not Running
**Fix**: Verify server.js calls `startReviewAutoReplyCron()`:
```bash
grep "startReviewAutoReplyCron" server.js
pm2 logs codelura-api | grep "Review Auto-Reply Cron started"
```

### Reviews Not Auto-Replying
**Fix**: Check automation settings:
```javascript
db.gbpreviewautomationsettings.findOne({ locationId: "YOUR_LOCATION_ID" })
// Should have: automaticRepliesEnabled: true, autoPublishEnabled: true
```

### Frontend Can't Connect to API
**Fix**: Check Nginx proxy:
```nginx
# codelura.com should proxy /api to api.codelura.com
location /api {
    proxy_pass https://api.codelura.com;
}
```

---

## 📝 Support

For issues:
1. Check logs: `pm2 logs codelura-api`
2. Verify environment variables
3. Test OAuth flow manually
4. Check MongoDB connection
5. Review Google API quotas

**System is production-ready! 🚀**
