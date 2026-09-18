#!/bin/bash

###############################################################################
# Codelura Production Deployment Script
# Usage: bash deploy-production.sh
###############################################################################

set -e  # Exit on error

echo "🚀 Codelura Production Deployment"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verify Environment
echo "📋 Step 1: Verifying environment..."
if [ -z "$NODE_ENV" ]; then
    echo -e "${YELLOW}⚠️  NODE_ENV not set. Setting to 'production'${NC}"
    export NODE_ENV=production
else
    echo -e "${GREEN}✅ NODE_ENV=${NODE_ENV}${NC}"
fi

# 2. Check .env file
echo ""
echo "📋 Step 2: Checking .env file..."
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

# Check critical env vars
required_vars=(
    "GBP_NEW_CLIENT_ID"
    "GBP_NEW_CLIENT_SECRET"
    "GBP_NEW_REDIRECT_URI_PROD"
    "GBP_ENCRYPTION_KEY"
    "GROQ_API_KEY"
    "MONGO_URI"
)

for var in "${required_vars[@]}"; do
    if grep -q "^${var}=" .env; then
        echo -e "${GREEN}✅ ${var} present${NC}"
    else
        echo -e "${RED}❌ ${var} missing in .env${NC}"
        exit 1
    fi
done

# 3. Install Dependencies
echo ""
echo "📦 Step 3: Installing dependencies..."
npm install --production
echo -e "${GREEN}✅ Dependencies installed${NC}"

# 4. Install App-specific dependencies
echo ""
echo "📦 Step 4: Installing App dependencies (cheerio)..."
cd App
npm install
cd ..
echo -e "${GREEN}✅ App dependencies installed${NC}"

# 5. Test MongoDB Connection
echo ""
echo "🗄️  Step 5: Testing MongoDB connection..."
node -e "
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('${GREEN}✅ MongoDB connected${NC}');
    process.exit(0);
  })
  .catch(err => {
    console.error('${RED}❌ MongoDB connection failed:', err.message + '${NC}');
    process.exit(1);
  });
"

# 6. Run Production Readiness Check
echo ""
echo "🔍 Step 6: Running production readiness check..."
NODE_ENV=production node verify-production.js

# 7. PM2 Setup
echo ""
echo "🚀 Step 7: Setting up PM2..."
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 not found. Installing...${NC}"
    npm install -g pm2
fi

# 8. Start/Restart Application
echo ""
echo "🎯 Step 8: Deploying application..."
if pm2 describe codelura-api > /dev/null 2>&1; then
    echo "Restarting existing PM2 process..."
    NODE_ENV=production pm2 restart codelura-api --update-env
else
    echo "Starting new PM2 process..."
    NODE_ENV=production pm2 start server.js --name codelura-api
fi

# 9. Save PM2 Configuration
pm2 save

# 10. Setup PM2 Startup
echo ""
echo "⚙️  Step 9: Setting up PM2 startup..."
pm2 startup

echo ""
echo "=================================="
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "=================================="
echo ""
echo "📊 Application Status:"
pm2 status

echo ""
echo "📋 Next Steps:"
echo "1. Monitor logs: pm2 logs codelura-api"
echo "2. Check cron: pm2 logs codelura-api | grep 'Review Auto-Reply'"
echo "3. Test OAuth: https://codelura.com/google-business-profile/dashboard"
echo "4. Enable automation for a test location"
echo ""
echo "🔧 Useful Commands:"
echo "  pm2 status                  - View process status"
echo "  pm2 logs codelura-api       - View logs"
echo "  pm2 restart codelura-api    - Restart app"
echo "  pm2 stop codelura-api       - Stop app"
echo "  pm2 monit                   - Monitor resources"
echo ""
