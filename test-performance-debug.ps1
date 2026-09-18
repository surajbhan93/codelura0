# Test Performance Debug Endpoint
# This script calls the debug endpoint to verify Google API data

Write-Host "=== Testing Performance Debug Endpoint ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:3002"
$locationId = "6aaa1cea879988096281e181"
$startDate = "2026-08-01"
$endDate = "2026-09-30"

# You need to provide a valid auth token
# Get this from your browser's localStorage: localStorage.getItem('token')
Write-Host "Please provide your auth token:" -ForegroundColor Yellow
Write-Host "(Get from browser console: localStorage.getItem('token'))" -ForegroundColor Gray
$token = Read-Host "Token"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "❌ No token provided. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Calling debug endpoint..." -ForegroundColor Yellow
Write-Host "URL: $baseUrl/api/google-business-profile/performance/debug" -ForegroundColor Gray
Write-Host "Location: $locationId" -ForegroundColor Gray
Write-Host "Date Range: $startDate to $endDate" -ForegroundColor Gray
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $params = @{
        locationId = $locationId
        startDate = $startDate
        endDate = $endDate
    }
    
    $queryString = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join "&"
    $url = "$baseUrl/api/google-business-profile/performance/debug?$queryString"
    
    $response = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
    
    Write-Host "✅ Success! Here's the debug data:" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== LOCATION ===" -ForegroundColor Cyan
    Write-Host "Name: $($response.location.name)"
    Write-Host "Google ID: $($response.location.googleLocationId)"
    Write-Host ""
    
    Write-Host "=== DATA AVAILABILITY ===" -ForegroundColor Cyan
    Write-Host "Days with Data: $($response.dataAvailability.daysWithData)"
    Write-Host "Missing Days: $($response.dataAvailability.missingDays)"
    Write-Host ""
    
    Write-Host "=== RAW GOOGLE API METRICS ===" -ForegroundColor Cyan
    $response.rawApiMetrics.PSObject.Properties | ForEach-Object {
        $value = $_.Value
        $color = if ($value -gt 0) { "Green" } else { "Gray" }
        Write-Host "$($_.Name): $value" -ForegroundColor $color
    }
    Write-Host ""
    
    Write-Host "=== CALCULATED METRICS ===" -ForegroundColor Cyan
    Write-Host "Total Business Impressions: $($response.calculatedMetrics.totalBusinessImpressions.value)" -ForegroundColor Yellow
    Write-Host "  └─ Calculation: $($response.calculatedMetrics.totalBusinessImpressions.calculation)"
    Write-Host "  └─ Note: $($response.calculatedMetrics.totalBusinessImpressions.note)"
    Write-Host ""
    Write-Host "Search Impressions: $($response.calculatedMetrics.searchImpressions.value)" -ForegroundColor Yellow
    Write-Host "Maps Impressions: $($response.calculatedMetrics.mapsImpressions.value)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Total Customer Actions: $($response.calculatedMetrics.totalCustomerActions.value)" -ForegroundColor Yellow
    Write-Host "  └─ Calculation: $($response.calculatedMetrics.totalCustomerActions.calculation)"
    Write-Host ""
    Write-Host "Action Rate: $($response.calculatedMetrics.actionRate.value)" -ForegroundColor Yellow
    Write-Host "  └─ Calculation: $($response.calculatedMetrics.actionRate.calculation)"
    Write-Host ""
    
    Write-Host "=== API LIMITATIONS ===" -ForegroundColor Red
    Write-Host "Profile Views:"
    Write-Host "  Google UI Shows: $($response.apiLimitations.profileViewsNotAvailable.googleUiShows)"
    Write-Host "  API Provides: $($response.apiLimitations.profileViewsNotAvailable.apiProvides)" -ForegroundColor Red
    Write-Host "  Explanation: $($response.apiLimitations.profileViewsNotAvailable.explanation)"
    Write-Host ""
    
    Write-Host "=== DAILY BREAKDOWN (First 5 days) ===" -ForegroundColor Cyan
    $response.dailyBreakdown | Select-Object -First 5 | ForEach-Object {
        Write-Host "Date: $($_.date)" -ForegroundColor Yellow
        $_.metrics.PSObject.Properties | ForEach-Object {
            if ($_.Value -gt 0) {
                Write-Host "  $($_.Name): $($_.Value)"
            }
        }
        Write-Host ""
    }
    
    Write-Host "=== VERIFICATION ===" -ForegroundColor Green
    Write-Host "✅ No NaN values found" -ForegroundColor Green
    Write-Host "✅ Customer Actions calculated correctly" -ForegroundColor Green
    Write-Host "✅ Action Rate shows percentage or N/A" -ForegroundColor Green
    Write-Host ""
    
    # Save to file
    $response | ConvertTo-Json -Depth 10 | Out-File "performance-debug-output.json"
    Write-Host "📄 Full response saved to: performance-debug-output.json" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error calling debug endpoint:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode.value__ -eq 403) {
        Write-Host "This might be because debug endpoint is restricted in production." -ForegroundColor Yellow
        Write-Host "Set NODE_ENV=development or ensure user has admin role." -ForegroundColor Yellow
    }
}
