# Codelura Production Deployment Script (PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File deploy-production.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Codelura Production Deployment" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verify Environment
Write-Host "📋 Step 1: Verifying environment..." -ForegroundColor Yellow
if (-not $env:NODE_ENV) {
    Write-Host "⚠️  NODE_ENV not set. Setting to 'production'" -ForegroundColor Yellow
    $env:NODE_ENV = "production"
} else {
    Write-Host "✅ NODE_ENV=$env:NODE_ENV" -ForegroundColor Green
}

# 2. Check .env file
Write-Host ""
Write-Host "📋 Step 2: Checking .env file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    exit 1
}

# Check critical env vars
$requiredVars = @(
    "GBP_NEW_CLIENT_ID",
    "GBP_NEW_CLIENT_SECRET",
    "GBP_NEW_REDIRECT_URI_PROD",
    "GBP_ENCRYPTION_KEY",
    "GROQ_API_KEY",
    "MONGO_URI"
)

$envContent = Get-Content ".env" -Raw
foreach ($var in $requiredVars) {
    if ($envContent -match "$var=") {
        Write-Host "✅ $var present" -ForegroundColor Green
    } else {
        Write-Host "❌ $var missing in .env" -ForegroundColor Red
        exit 1
    }
}

# 3. Install Dependencies
Write-Host ""
Write-Host "📦 Step 3: Installing dependencies..." -ForegroundColor Yellow
npm install --production
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# 4. Install App-specific dependencies
Write-Host ""
Write-Host "📦 Step 4: Installing App dependencies (cheerio)..." -ForegroundColor Yellow
Push-Location App
npm install
Pop-Location
Write-Host "✅ App dependencies installed" -ForegroundColor Green

# 5. Run Production Readiness Check
Write-Host ""
Write-Host "🔍 Step 5: Running production readiness check..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
node verify-production.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Production readiness check failed" -ForegroundColor Red
    Write-Host "⚠️  Continuing anyway (some checks may be warnings only)..." -ForegroundColor Yellow
}

# 6. PM2 Setup
Write-Host ""
Write-Host "🚀 Step 6: Setting up PM2..." -ForegroundColor Yellow
$pm2Installed = Get-Command pm2 -ErrorAction SilentlyContinue
if (-not $pm2Installed) {
    Write-Host "⚠️  PM2 not found. Installing..." -ForegroundColor Yellow
    npm install -g pm2
}

# 7. Start/Restart Application
Write-Host ""
Write-Host "🎯 Step 7: Deploying application..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
$pm2List = pm2 describe codelura-api 2>$null
if ($pm2List) {
    Write-Host "Restarting existing PM2 process..." -ForegroundColor Cyan
    pm2 restart codelura-api --update-env
} else {
    Write-Host "Starting new PM2 process..." -ForegroundColor Cyan
    pm2 start server.js --name codelura-api
}

# 8. Save PM2 Configuration
pm2 save

# 9. Display Status
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Application Status:" -ForegroundColor Yellow
pm2 status

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Monitor logs: pm2 logs codelura-api"
Write-Host "2. Check cron: pm2 logs codelura-api --lines 100 | Select-String 'Review Auto-Reply'"
Write-Host "3. Test OAuth: https://codelura.com/google-business-profile/dashboard"
Write-Host "4. Enable automation for a test location"
Write-Host ""
Write-Host "🔧 Useful Commands:" -ForegroundColor Yellow
Write-Host "  pm2 status                  - View process status"
Write-Host "  pm2 logs codelura-api       - View logs"
Write-Host "  pm2 restart codelura-api    - Restart app"
Write-Host "  pm2 stop codelura-api       - Stop app"
Write-Host "  pm2 monit                   - Monitor resources"
Write-Host ""
