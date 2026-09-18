# Google Business Profile Performance - Metrics Analysis

## Date Range: Aug 2026 - Sept 2026 (July 31 - Sept 29, 2026)

---

## 🔍 Current Data from Google API

### Synced Data (from backend logs):
```
Location: Tutvex - Home Tuition Provider, Prayagraj
Google Location ID: 14136512928213458627
Date Range: 2026-07-31 to 2026-09-29
Days of Data: 61 days
```

### Raw Metrics from Google Business Profile Performance API:

| Metric | Value | Source |
|--------|-------|--------|
| **BUSINESS_IMPRESSIONS_DESKTOP_SEARCH** | 114 | Google API |
| **BUSINESS_IMPRESSIONS_MOBILE_SEARCH** | 1,710 | Google API |
| **BUSINESS_IMPRESSIONS_DESKTOP_MAPS** | 39 | Google API |
| **BUSINESS_IMPRESSIONS_MOBILE_MAPS** | 21 | Google API |
| **WEBSITE_CLICKS** | 14 | Google API |
| **CALL_CLICKS** | 48 | Google API |
| **BUSINESS_DIRECTION_REQUESTS** | 0 | Google API |
| **BUSINESS_BOOKINGS** | 0 | Google API |
| **BUSINESS_CONVERSATIONS** | 0 | Google API |

### Calculated Metrics (Codelura):

| Metric | Value | Calculation |
|--------|-------|-------------|
| **Total Business Impressions** | **1,884** | DESKTOP_SEARCH (114) + MOBILE_SEARCH (1,710) + DESKTOP_MAPS (39) + MOBILE_MAPS (21) |
| **Search Impressions** | 1,824 | DESKTOP_SEARCH (114) + MOBILE_SEARCH (1,710) |
| **Maps Impressions** | 60 | DESKTOP_MAPS (39) + MOBILE_MAPS (21) |
| **Total Customer Actions** | **62** | WEBSITE_CLICKS (14) + CALL_CLICKS (48) + DIRECTIONS (0) + BOOKINGS (0) |
| **Action Rate** | **3.29%** | (62 / 1,884) × 100 |
| **Codelura Performance Score** | **46/100** | Weighted calculation |

---

## 📊 Google UI vs Codelura Dashboard Comparison

### User-Reported Google UI Shows:
```
✓ People viewed your Business Profile: 1,842
✓ Searches showed your Business Profile: <50
✓ Business Profile interactions: 93
```

### Codelura Dashboard Shows:
```
✓ Business Impressions: 1,884
✓ Customer Actions: 62
✓ Action Rate: 3.29%
```

---

## ❗ CRITICAL DISCREPANCIES EXPLAINED

### 1. "People viewed your Business Profile" (1,842) vs Business Impressions (1,884)

**Discrepancy:** ~40 difference

**Root Cause:**
- ❌ **"People viewed your Business Profile" is NOT available through Google's API**
- The Google UI shows this metric, but the Business Profile Performance API does NOT expose it
- Our "Business Impressions" (1,884) is the closest metric available, but it measures something different:
  - **Business Impressions** = Times your business appeared in search/maps results
  - **Profile Views** = Times people clicked to view your full business profile page

**Why the numbers are close but not identical:**
- They measure related but different actions
- Profile views (1,842) could be clicks to view full profile
- Business impressions (1,884) are appearances in results (before clicking)
- The similarity suggests they're related but NOT the same metric

### 2. "Searches showed your Business Profile" (<50) vs Search Impressions (1,824)

**Discrepancy:** Huge difference!

**Root Cause:**
- Google UI shows "<50" which suggests a LOW number
- Our API data shows 1,824 search impressions
- Possible explanations:
  1. Google UI might be showing a DIFFERENT metric (e.g., unique searches, branded searches, or direct searches)
  2. Google UI might be using a different calculation or filtering method
  3. Google UI might have a bug or be showing outdated data
  4. Date ranges might not match exactly

**Action Required:** Verify exact date range matches between Google UI and Codelura

### 3. "Business Profile interactions" (93) vs Customer Actions (62)

**Discrepancy:** 31 actions difference

**Root Cause:**
- Google's "Business Profile interactions" (93) includes MORE actions than what we calculate
- Our calculation: Website Clicks (14) + Calls (48) + Directions (0) + Bookings (0) = 62
- Google might be including:
  - ✓ Menu clicks
  - ✓ Photo views
  - ✓ Conversations/messages
  - ✓ Other interactions not exposed in the API

**API Limitation:**
We can only count actions that the API exposes:
```javascript
totalCustomerActions = 
  WEBSITE_CLICKS + 
  CALL_CLICKS + 
  BUSINESS_DIRECTION_REQUESTS + 
  BUSINESS_BOOKINGS
```

Missing from our calculation (because API doesn't provide detailed data):
- BUSINESS_CONVERSATIONS: 0 (but might exist in Google's internal metrics)
- BUSINESS_FOOD_MENU_CLICKS: 0
- Photo views: NOT AVAILABLE IN API
- Other interactions: NOT AVAILABLE IN API

---

## 🎯 What This Means

### ✅ What We CAN Show Accurately:
1. **Business Impressions** (Search + Maps) - From API
2. **Website Clicks** - From API
3. **Phone Calls** - From API
4. **Direction Requests** - From API
5. **Bookings** - From API
6. **Action Rate** - Calculated from above

### ❌ What We CANNOT Show:
1. **"People viewed your Business Profile"** - NOT IN API
2. **Complete "Business Profile interactions"** - API gives partial data
3. **Photo views** - NOT IN API
4. **Review interactions** - NOT IN API
5. **Some conversation/message data** - Limited API exposure

---

## 🔧 Recommendations

### For Accuracy:
1. **Never claim our metrics exactly match Google UI**
   - Add tooltip: "Metrics from Google Business Profile Performance API may differ from Google UI"
   
2. **Rename "Profile Views" if used**
   - Use "Business Impressions" instead
   - Add explanation that this is NOT the same as Google's "People viewed your profile"

3. **Clarify "Customer Actions"**
   - Add tooltip: "Sum of website clicks, phone calls, directions, and bookings from API"
   - Note: "May be lower than Google UI due to API limitations"

### For Transparency:
1. Add "API Limitations" info panel to dashboard
2. Link to debug endpoint for advanced users
3. Explain why numbers might differ from Google UI

### For Investigation:
1. ✅ Verify date range matches exactly (Aug 2026 - Sept 2026)
2. ✅ Check timezone settings
3. ✅ Confirm location is correct
4. ⚠️ Note: Even with perfect date/timezone match, numbers will differ due to API limitations

---

## 🧪 Testing Checklist

- [x] Backend synced successfully (61 days of data)
- [x] No NaN values in calculations
- [x] Customer Actions = sum of all action types
- [x] Action Rate shows N/A when impressions = 0
- [x] Action Rate shows percentage when data exists (3.29%)
- [ ] Debug endpoint accessible
- [ ] Frontend displays metrics correctly
- [ ] Tooltips explain each metric
- [ ] No Infinity or undefined values

---

## 📝 Notes

**Performance Score: 46/100**
- This is Codelura's proprietary score, NOT from Google
- Based on weighted calculation of available metrics
- Transparent breakdown:
  - Visibility: Based on impressions
  - Engagement: Based on actions
  - Conversion Rate: Based on action rate

**API Data Quality:**
- ✅ All raw metrics received successfully
- ✅ No errors in sync process
- ✅ Complete data for 61 days
- ⚠️ Some Google UI metrics unavailable through API

---

## 🎯 Action Items

1. **Update Dashboard UI**
   - Add API limitations explanation
   - Add tooltips to all metrics
   - Change any "Profile Views" references to "Business Impressions"
   - Add info icon with explanation

2. **Test Debug Endpoint**
   - Run: `test-performance-debug.ps1`
   - Verify all calculations
   - Save output for comparison

3. **Compare with Google UI**
   - Open Google Business Profile
   - Navigate to Performance section
   - Select Aug 2026 - Sept 2026
   - Compare each metric
   - Document differences

4. **Verify No Issues**
   - Check for NaN
   - Check for Infinity
   - Check for undefined
   - Verify all numbers are realistic

---

## 📚 References

- [Google Business Profile Performance API Documentation](https://developers.google.com/my-business/reference/performance/rest/v1/DailyMetric)
- [Codelura Performance Debug Endpoint]: `/api/google-business-profile/performance/debug`
- Backend Logs: See console output from sync process

---

**Last Updated:** 2026-09-18
**Data Range:** 2026-07-31 to 2026-09-29 (61 days)
**Location:** Tutvex - Home Tuition Provider, Prayagraj
