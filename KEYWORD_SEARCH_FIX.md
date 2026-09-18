# Google Business Profile - Search Keywords Fix 🔍
**Powered by Codelura**

## Problem
Google Business Profile ke Search Keywords feature mein "No keyword data available" message aa raha tha.

## Root Cause Analysis
1. API response ka proper formatting nahi ho raha tha
2. Error handling insufficient tha
3. Empty responses ke liye proper caching nahi thi
4. Logging aur debugging information missing thi

## Changes Made

### 1. **Service Layer** (`gbpPerformance.service.js`)
   - ✅ Enhanced error logging with detailed API response tracking
   - ✅ Proper formatting of keyword data structure
   - ✅ Added caching for empty responses (prevents repeated API calls)
   - ✅ Better error messages with status codes and details
   - ✅ Structured keyword object mapping from Google API response

### 2. **Controller Layer** (`gbpPerformance.controller.js`)
   - ✅ Added detailed logging for debugging
   - ✅ Enhanced response format with count and metadata
   - ✅ Better error handling with informative messages
   - ✅ User-friendly message when no data is available
   - ✅ `lastUpdated` timestamp in response

### 3. **Model Schema** (`GbpSearchKeyword.js`)
   - ✅ Improved schema type definitions for better data validation
   - ✅ Proper nested object structure for `insightsValue`

## API Endpoint

```
GET /api/google-business-profile/locations/:locationId/keywords
```

### Query Parameters
- `month` (optional): Format `YYYY-MM`, default: current month
- `refresh` (optional): `true` to force fetch from Google API

### Response Format
```json
{
  "success": true,
  "data": [
    {
      "searchKeyword": "tutor near me",
      "insightsValue": {
        "value": "HIGH",
        "threshold": "100"
      }
    }
  ],
  "count": 1,
  "lastUpdated": "2026-09-16T10:30:00Z",
  "message": "Optional message if data is empty"
}
```

## Testing Steps

### 1. Check Logs
Backend console mein yeh logs dikhne chahiye:
```
Fetching keywords for location: <locationId>, month: 2026-09
Keywords API response: { ... }
Saved X keywords for 2026-09
```

### 2. Test API Directly
```bash
# Get keywords (cached)
GET http://localhost:3002/api/google-business-profile/locations/{locationId}/keywords

# Force refresh from Google
GET http://localhost:3002/api/google-business-profile/locations/{locationId}/keywords?refresh=true

# Specific month
GET http://localhost:3002/api/google-business-profile/locations/{locationId}/keywords?month=2026-08
```

### 3. Check Database
```javascript
// MongoDB query
db.gbpsearchkeywords.find({ locationId: ObjectId("...") })
```

## Common Issues & Solutions

### Issue 1: "No keyword data available"
**Cause**: Google Business Profile location doesn't have enough search impressions yet
**Solution**: 
- Profile ko zyada search impressions chahiye (usually 2-4 weeks)
- Location properly verified hona chahiye
- Recent data ka data milega (past months ka nahi)

### Issue 2: 401 Unauthorized
**Cause**: OAuth token expired ya invalid
**Solution**: User ko reconnect karna hoga Google Business Profile

### Issue 3: 404 Not Found
**Cause**: Location ID invalid ya access nahi hai
**Solution**: 
- Verify location exists aur user ke paas access hai
- Sync locations using `/api/google-business-profile/sync`

### Issue 4: Empty Array []
**Cause**: Valid response hai, but data nahi hai for that month
**Solution**: This is expected for:
- New locations
- Past months with no impressions
- Future months

## Technical Details

### Google API Used
```
GET https://businessprofileperformance.googleapis.com/v1/locations/{locationId}/searchkeywords/impressions/monthly
```

### Required OAuth Scope
```
https://www.googleapis.com/auth/business.manage
```

### Data Structure from Google
```json
{
  "searchKeywordsCounts": [
    {
      "searchKeyword": "keyword phrase",
      "insightsValue": {
        "value": "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN",
        "threshold": "number as string"
      }
    }
  ]
}
```

## Next Steps

1. **Frontend Update** - Frontend ko updated response format handle karna hoga
2. **Rate Limiting** - Consider adding rate limiting for Google API calls
3. **Caching Strategy** - Optimize caching duration based on data freshness
4. **Analytics** - Track keyword trends over multiple months
5. **Export Feature** - Add ability to export keyword data as CSV

## Important Notes

⚠️ **Google Business Profile API Limitations:**
- Keyword data is only available for locations with sufficient search impressions
- Historical data may be limited (typically last 18 months)
- Data updates can have 24-48 hour delay
- Some locations may never qualify for keyword insights

✅ **Best Practices:**
- Cache keyword data for at least 24 hours
- Use `refresh=true` sparingly to avoid rate limits
- Handle empty responses gracefully in UI
- Show helpful messages to users when data is unavailable

## Support

If issues persist:
1. Check backend logs for detailed error messages
2. Verify OAuth connection status
3. Test with multiple locations
4. Check Google Business Profile API status
5. Ensure location has sufficient search volume

---
**Last Updated:** September 16, 2026
**Author:** Kiro AI
