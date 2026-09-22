# Custom UPI/QR Payment System - Deployment Guide

## 🎯 Deployment Overview

This guide walks through deploying the custom payment system to production.

---

## ✅ Pre-Deployment Checklist

### Code Review
- [ ] All 25 files reviewed and tested
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Input validation on all endpoints
- [ ] Security measures verified

### Environment Variables

#### Backend (.env)
```bash
# Required for payment system
MONGODB_URI=mongodb://...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret

# Optional
NODE_ENV=production
PORT=3002
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.codelura.com
```

### Database Setup
- [ ] MongoDB production instance ready
- [ ] Database indexes created:
  ```javascript
  // payments collection
  db.payments.createIndex({ userId: 1, status: 1 })
  db.payments.createIndex({ utr: 1 }, { unique: true })
  
  // projectpayments collection
  db.projectpayments.createIndex({ userId: 1 })
  
  // emis collection
  db.emis.createIndex({ projectPaymentId: 1, status: 1 })
  db.emis.createIndex({ dueDate: 1 })
  ```
- [ ] Test data cleared from staging

### Cloudinary Setup
- [ ] Production Cloudinary account configured
- [ ] Upload presets created
- [ ] Folder structure: `codelura/payments/qr-codes`, `codelura/payments/screenshots`
- [ ] File size limits: 10MB
- [ ] Allowed formats: PNG, JPG, JPEG

---

## 🚀 Deployment Steps

### Step 1: Backend Deployment

#### Option A: Deploy to VPS (DigitalOcean, AWS EC2, etc.)

```bash
# SSH into server
ssh user@your-server-ip

# Clone repository
git clone https://github.com/codelura/codelura-backend.git
cd codelura-backend/App

# Install dependencies
npm install --production

# Set environment variables
nano .env
# Paste production env vars

# Start with PM2
npm install -g pm2
pm2 start bin/www --name codelura-payment-api
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/codelura-api
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.codelura.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/codelura-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.codelura.com
```

#### Option B: Deploy to Vercel/Railway/Render

1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push to main

---

### Step 2: Frontend Deployment

#### Option A: Deploy to Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd codelura-frontend
vercel --prod

# Set environment variables in Vercel dashboard
# NEXT_PUBLIC_API_BASE_URL=https://api.codelura.com
```

#### Option B: Deploy to VPS

```bash
# Build production bundle
npm run build

# Start production server
npm start

# Or use PM2
pm2 start npm --name codelura-frontend -- start
```

---

### Step 3: Initial Configuration

#### A. Create Admin Account

```bash
# Via MongoDB shell or API
db.users.insertOne({
  name: "Admin",
  email: "admin@codelura.com",
  password: "<hashed_password>",
  role: "admin",
  createdAt: new Date()
})
```

#### B. Initialize Payment Settings

Login as admin and:
1. Navigate to `/admin/payments`
2. Click "Payment Settings" tab
3. Upload production QR code
4. Verify UPI number: `9336289192`
5. Click "Save Settings"

#### C. Create Test Project

1. Get client userId from database
2. Use admin dashboard to create project:
   - Project Name: "Test Project"
   - Total Amount: ₹5,000
   - EMI Amount: ₹2,500
   - Number of EMIs: 2
   - Start Date: Today

---

### Step 4: Smoke Testing

Run these quick tests after deployment:

#### Backend Health Check
```bash
curl https://api.codelura.com/health
# Expected: { "status": "ok" }
```

#### API Endpoints
```bash
# Get payment settings (public endpoint)
curl https://api.codelura.com/api/payment-settings

# Expected: { upiNumber, qrCodeUrl }
```

#### Frontend Pages
- [ ] `https://codelura.com/payment-portal` loads
- [ ] `https://codelura.com/admin/payments` requires auth
- [ ] QR code displays correctly
- [ ] UPI number shows: 9336289192

---

### Step 5: End-to-End Test

1. **Create real project** via admin dashboard
2. **Submit test payment** (use real UPI with ₹1)
3. **Verify payment** as admin
4. **Check EMI allocation**
5. **View receipt**
6. **Verify database state**

---

## 🔒 Security Hardening

### Backend Security

```javascript
// app.js - Add security headers
const helmet = require('helmet');
app.use(helmet());

// Rate limiting (already implemented)
// Verify rateLimit.middleware.js is active

// CORS - Update allowed origins
const cors = require('cors');
app.use(cors({
  origin: 'https://codelura.com',
  credentials: true
}));
```

### Environment Variables
- [ ] All secrets moved to environment variables
- [ ] No hardcoded credentials
- [ ] `.env` added to `.gitignore`
- [ ] Production secrets never committed

### File Uploads
- [ ] Cloudinary upload preset configured
- [ ] File size limits enforced (10MB)
- [ ] File type validation (PNG, JPG only)
- [ ] Malicious file scanning enabled

### Database
- [ ] MongoDB authentication enabled
- [ ] Database user with minimal permissions
- [ ] Connection string encrypted
- [ ] Backups configured (daily)

---

## 📊 Monitoring & Logging

### Application Monitoring

#### Setup PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

#### Add Error Tracking (Sentry)
```bash
npm install @sentry/node

# In app.js
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "YOUR_SENTRY_DSN" });
```

### Payment-Specific Monitoring

Create monitoring dashboard to track:
- Payment submission rate
- Verification turnaround time (target: < 24 hours)
- Rejection rate
- Average payment amount
- EMI completion rate
- Failed uploads

### Audit Log Monitoring

Query database regularly:
```javascript
// Get recent payment activities
db.paymentauditlogs.find().sort({ timestamp: -1 }).limit(100)

// Get failed verifications
db.paymentauditlogs.find({ action: "REJECTED" })

// Get high-value payments (> ₹50,000)
db.payments.find({ amount: { $gt: 50000 } })
```

---

## 🔔 Alerting Setup

### Critical Alerts (Immediate)
- Server downtime
- Database connection failure
- Payment verification errors
- Cloudinary upload failures

### Warning Alerts (Daily digest)
- Pending payments > 24 hours
- Overdue EMIs
- High rejection rate (> 10%)
- Unusual payment patterns

### Setup Email Alerts
```javascript
// Add to payment.controller.js
const nodemailer = require('nodemailer');

// After payment verification
if (payment.status === 'PAID') {
  await sendEmail({
    to: payment.userId.email,
    subject: 'Payment Verified - Codelura',
    template: 'payment-verified',
    data: { payment, receipt }
  });
}
```

---

## 🔄 Backup Strategy

### Database Backups
```bash
# Daily automated backup
0 2 * * * mongodump --uri="mongodb://..." --out=/backups/$(date +\%Y\%m\%d)

# Retention: 30 days
find /backups -type d -mtime +30 -exec rm -rf {} \;
```

### Cloudinary Backups
- Images stored in Cloudinary (automatic backup)
- Screenshot retention: 2 years
- QR code retention: Permanent

### Code Backups
- GitHub repository (main source of truth)
- Tag releases: `git tag v1.0.0`

---

## 📈 Performance Optimization

### Backend Optimizations
```javascript
// Add compression
const compression = require('compression');
app.use(compression());

// Cache payment settings
const NodeCache = require('node-cache');
const settingsCache = new NodeCache({ stdTTL: 3600 });

// In paymentSettings.controller.js
const cached = settingsCache.get('paymentSettings');
if (cached) return res.json(cached);
```

### Frontend Optimizations
- [ ] Images optimized (WebP format)
- [ ] Lazy loading implemented
- [ ] Code splitting enabled
- [ ] CDN configured for static assets
- [ ] Browser caching headers set

### Database Optimizations
- [ ] Indexes created (see Pre-Deployment Checklist)
- [ ] Query optimization reviewed
- [ ] Connection pooling configured
- [ ] Slow query logging enabled

---

## 🚨 Rollback Plan

If critical issues arise after deployment:

### Quick Rollback
```bash
# Backend
pm2 stop codelura-payment-api
git checkout previous-stable-tag
npm install
pm2 restart codelura-payment-api

# Frontend (Vercel)
# Use Vercel dashboard to rollback to previous deployment
```

### Database Rollback
```bash
# Restore from backup
mongorestore --uri="mongodb://..." /backups/YYYYMMDD
```

### Communication Plan
- Update status page
- Email clients with active payments
- Post on social media if needed

---

## 📋 Post-Deployment Checklist

### Week 1
- [ ] Monitor error logs daily
- [ ] Check payment submission success rate
- [ ] Verify EMI allocations are correct
- [ ] Review audit logs for anomalies
- [ ] Test on multiple devices/browsers
- [ ] Collect initial user feedback

### Week 2-4
- [ ] Analyze payment patterns
- [ ] Review verification turnaround time
- [ ] Check overdue EMI rate
- [ ] Optimize slow queries
- [ ] Update documentation based on learnings

### Month 2+
- [ ] Review security logs
- [ ] Analyze financial reports
- [ ] Plan feature enhancements
- [ ] Review and update documentation

---

## 🆘 Troubleshooting

### Issue: Payment submission fails
**Symptoms:** Error 500 on submit
**Check:**
- Cloudinary credentials valid
- Database connection active
- Server disk space not full
- Check logs: `pm2 logs codelura-payment-api`

**Fix:**
```bash
# Restart services
pm2 restart codelura-payment-api
sudo systemctl restart mongodb
```

### Issue: EMI allocation incorrect
**Symptoms:** Payment verified but EMI status wrong
**Check:**
- `payment.service.js` auto-allocation logic
- EMI pre-save hook running
- Database transaction completed

**Fix:**
```javascript
// Manually fix in MongoDB
db.emis.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: 'PAID', paidAmount: 2500 } }
)
```

### Issue: QR code not displaying
**Symptoms:** Broken image in payment portal
**Check:**
- Cloudinary URL valid
- Image not deleted
- CORS headers set correctly

**Fix:**
- Re-upload QR code via admin dashboard

### Issue: Receipt not generating
**Symptoms:** No receipt number after verification
**Check:**
- `generateReceiptNumber()` method exists
- Counter collection exists
- Audit logs being created

**Fix:**
```javascript
// Create counter collection if missing
db.counters.insertOne({
  _id: 'receiptNumber',
  sequence: 1
})
```

---

## 📞 Support Contacts

### Technical Issues
- DevOps: devops@codelura.com
- Backend: backend-team@codelura.com
- Frontend: frontend-team@codelura.com

### Business Issues
- Finance: finance@codelura.com
- Support: support@codelura.com

### Emergency
- On-call engineer: [Phone number]
- Emergency email: emergency@codelura.com

---

## 📚 Additional Resources

- **Testing Guide:** `PAYMENT_SYSTEM_TESTING_GUIDE.md`
- **System Summary:** `PAYMENT_SYSTEM_SUMMARY.md`
- **Migration Guide:** `PAYMENT_SYSTEM_MIGRATION.md`
- **API Documentation:** Check controller files
- **Monitoring Dashboard:** [URL when setup]
- **Status Page:** [URL when setup]

---

## ✅ Final Sign-Off

Before marking deployment complete:

**Technical Lead:** _________________ Date: _______
- [ ] Code reviewed and approved
- [ ] All tests passed
- [ ] Security audit completed

**DevOps Engineer:** _________________ Date: _______
- [ ] Infrastructure ready
- [ ] Monitoring configured
- [ ] Backups scheduled

**Product Manager:** _________________ Date: _______
- [ ] Business requirements met
- [ ] User documentation ready
- [ ] Support team trained

**CEO/CTO:** _________________ Date: _______
- [ ] Final approval to go live

---

**Deployment Status:** Ready for Production ✅

**Version:** 1.0.0

**Go-Live Date:** _____________

**Next Review Date:** _____________

---

## 🎉 Success Criteria

The deployment is successful when:
- ✅ System processes first real payment end-to-end
- ✅ Zero critical errors in first 24 hours
- ✅ All monitoring alerts working
- ✅ Client feedback positive
- ✅ Admin team trained and comfortable

**Congratulations on launching the Custom Payment System! 🚀**
