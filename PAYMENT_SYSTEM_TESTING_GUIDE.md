# Custom UPI/QR Payment System - Testing Guide

## 🎯 Testing Overview

This guide covers end-to-end testing of the custom UPI/QR payment system with EMI tracking, admin verification, and flexible payment amounts.

---

## 📋 Pre-Testing Setup Checklist

### Backend Setup
- [ ] MongoDB connected and running
- [ ] Server running on `http://localhost:3002`
- [ ] Cloudinary credentials configured in `.env`
- [ ] Admin user account created with role `admin`
- [ ] Test client user account created

### Frontend Setup
- [ ] Frontend running on `http://localhost:3000` (or configured port)
- [ ] `NEXT_PUBLIC_API_BASE_URL` set correctly in `.env.local`
- [ ] Browser localStorage cleared for fresh test

### Initial Data Setup
- [ ] Payment settings initialized (default UPI: 9336289192)
- [ ] Test project payment created for client user
- [ ] EMI schedule generated for project

---

## 🧪 Test Scenarios

### Test Case 1: Admin - Upload Payment QR Code

**Objective:** Admin can upload and manage QR code

**Steps:**
1. Login as admin user
2. Navigate to `/admin/payments`
3. Click "Payment Settings" tab
4. Upload a test QR code image (PNG/JPG)
5. Verify QR code displays correctly
6. Try updating UPI number to different 10-digit number
7. Verify settings saved successfully

**Expected Results:**
- ✅ QR code uploads to Cloudinary
- ✅ QR URL saved in database
- ✅ QR displays in settings preview
- ✅ UPI number validates (10 digits only)
- ✅ Toast notification on success

**Test Data:**
- UPI: `9336289192`
- QR: Any valid payment QR image

---

### Test Case 2: Admin - Create Project Payment with EMI

**Objective:** Admin creates a new project with EMI schedule

**API Endpoint:** `POST /api/payments/admin/create-project`

**Test Request:**
```json
{
  "userId": "<client_user_id>",
  "projectName": "Business Website Development",
  "projectDescription": "Complete e-commerce website with admin panel",
  "totalProjectAmount": 25000,
  "emiAmount": 2500,
  "numberOfEmis": 10,
  "emiStartDate": "2026-10-05",
  "emiFrequency": "monthly",
  "notes": "Test project for payment system"
}
```

**Expected Results:**
- ✅ Project created successfully
- ✅ 10 EMI records generated automatically
- ✅ EMI due dates calculated correctly (monthly)
- ✅ All EMI statuses set to `PENDING`
- ✅ Project status is `active`

**Verification:**
- Check MongoDB: `ProjectPayment` collection
- Check MongoDB: `EMI` collection (should have 10 records)

---

### Test Case 3: Client - View Payment Portal

**Objective:** Client can view project and payment options

**Steps:**
1. Login as client user
2. Navigate to `/payment-portal`
3. Verify project information displays
4. Check EMI timeline visibility
5. Verify next EMI due date shows

**Expected Results:**
- ✅ Project name and description visible
- ✅ Total/Paid/Remaining amounts correct
- ✅ Progress bar shows 0% (no payments yet)
- ✅ EMI number line shows all pending (○)
- ✅ Next EMI card displays correct amount and date
- ✅ "Make Payment Now" button visible

**Visual Checks:**
- Progress bar UI
- EMI status icons (○ for pending)
- Amount formatting (₹25,000)

---

### Test Case 4: Client - Submit Payment (UPI Method)

**Objective:** Client submits payment using UPI number

**Steps:**
1. From payment portal, click "Make Payment Now"
2. Enter amount: `₹2,500` (one EMI)
3. Click "Continue to Payment Method"
4. Select "UPI" option
5. Verify UPI number displays: `9336289192`
6. Click "Copy UPI Number" (verify toast)
7. Click "Continue to Submit Payment"
8. Enter UTR: `TEST123456789012`
9. Select payment date (today)
10. Upload screenshot (any test image)
11. Add notes: "Test payment for EMI #1"
12. Click "Submit Payment"

**Expected Results:**
- ✅ Payment submission successful
- ✅ Status: `VERIFICATION_PENDING`
- ✅ Toast: "Payment submitted successfully"
- ✅ Redirected to payment history
- ✅ Payment appears with "Pending Verification" badge
- ✅ Audit log created with action `CREATED`

**API Call:** `POST /api/payments/submit`

**Database Changes:**
- New record in `Payment` collection
- `status`: `VERIFICATION_PENDING`
- Screenshot URL stored from Cloudinary

---

### Test Case 5: Client - Submit Payment (QR Code Method)

**Objective:** Client submits payment using QR code

**Steps:**
1. Click "Make Payment Now"
2. Enter amount: `₹5,000` (two EMIs)
3. Select "QR Code" option
4. Verify QR code image displays
5. Verify UPI number shows below QR
6. Complete submission form with UTR
7. Upload screenshot
8. Submit payment

**Expected Results:**
- ✅ QR code displays correctly
- ✅ Payment submission successful
- ✅ Status: `VERIFICATION_PENDING`
- ✅ Amount: ₹5,000 stored correctly

---

### Test Case 6: Client - View EMI Calendar

**Objective:** Client can view EMI schedule in calendar format

**Steps:**
1. Navigate to `/payment-portal/calendar`
2. Verify month selector works
3. Check EMI cards display
4. Verify due date badges
5. Check status indicators

**Expected Results:**
- ✅ EMIs grouped by month
- ✅ Current month selected by default
- ✅ EMI cards show: Number, Amount, Due Date, Status
- ✅ "Days remaining" calculated correctly
- ✅ Summary stats show: Total, Paid, Pending, Overdue

**Visual Checks:**
- Status icons (○ pending, ✓ paid, ⚠ overdue)
- Progress bars for partial payments
- Month navigation dropdown

---

### Test Case 7: Admin - View Pending Payments

**Objective:** Admin can see and review pending payments

**Steps:**
1. Login as admin
2. Navigate to `/admin/payments`
3. Verify "Pending Verification" tab shows count
4. Check payment cards display client info
5. Verify screenshot thumbnail visible
6. Click "Review Payment" button

**Expected Results:**
- ✅ Pending count badge shows (2 payments from previous tests)
- ✅ Payment cards show:
  - Client name and email
  - Project name
  - Payment amount
  - UTR number
  - Payment method
  - Screenshot
  - Submission date
- ✅ Review form appears with verification/rejection options

---

### Test Case 8: Admin - Verify Payment (EMI Auto-Allocation)

**Objective:** Admin verifies payment and EMIs auto-allocate

**Test Payment Details:**
- Amount: ₹2,500 (First test payment)
- Should allocate to: EMI #1

**Steps:**
1. From pending payments, click "Review Payment"
2. Verify screenshot is legitimate (visual check)
3. Add verification notes: "Payment verified via bank statement"
4. Click "✓ Verify Payment"
5. Wait for success message
6. Check updated status

**Expected Results:**
- ✅ Payment status → `PAID`
- ✅ Receipt number generated (format: `CL-YYYYMM-XXXX`)
- ✅ EMI #1 status → `PAID`
- ✅ EMI #1 `paidAmount` → ₹2,500
- ✅ Project `totalPaidAmount` → ₹2,500
- ✅ Project `remainingAmount` → ₹22,500
- ✅ Audit log created with action `VERIFIED`
- ✅ Audit log created with action `RECEIPT_GENERATED`
- ✅ Toast: "Payment verified successfully!"

**API Call:** `POST /api/payments/admin/verify/:paymentId`

**Database Changes:**
- `Payment.status` = `PAID`
- `Payment.receiptNumber` set
- `Payment.relatedEmis` = `[emi1_id]`
- `EMI.status` = `PAID`
- `EMI.paidAmount` = 2500
- `EMI.relatedPayments` updated
- `ProjectPayment.totalPaidAmount` = 2500
- `ProjectPayment.remainingAmount` = 22500
- 2 new records in `PaymentAuditLog`

---

### Test Case 9: Admin - Verify Second Payment (Multi-EMI Allocation)

**Objective:** Payment allocates to multiple EMIs

**Test Payment Details:**
- Amount: ₹5,000 (Second test payment)
- Should allocate to: EMI #2 (₹2,500) + EMI #3 (₹2,500)

**Steps:**
1. Verify second pending payment
2. Add notes: "Payment verified - covers 2 EMIs"
3. Click "✓ Verify Payment"

**Expected Results:**
- ✅ EMI #2 status → `PAID` (₹2,500)
- ✅ EMI #3 status → `PAID` (₹2,500)
- ✅ Project `totalPaidAmount` → ₹7,500
- ✅ Project `remainingAmount` → ₹17,500
- ✅ Payment `relatedEmis` = `[emi2_id, emi3_id]`

**Verification:**
- Check EMI number line updates (3 EMIs show ✓)
- Check calendar shows EMIs as PAID
- Check project progress bar shows 30%

---

### Test Case 10: Admin - Reject Payment

**Objective:** Admin can reject invalid payment

**Test Payment Details:**
- Create another test payment with fake UTR

**Steps:**
1. Submit new payment as client (any amount)
2. Login as admin
3. Review payment
4. Add rejection reason: "Invalid UTR - no transaction found in bank records"
5. Click "✕ Reject Payment"

**Expected Results:**
- ✅ Payment status → `REJECTED`
- ✅ Rejection reason stored
- ✅ No EMI allocation happens
- ✅ Project totals unchanged
- ✅ Audit log created with action `REJECTED`
- ✅ Client can see rejection in payment history

---

### Test Case 11: Client - View Payment Receipt

**Objective:** Client can view and download receipt

**Steps:**
1. Login as client
2. Navigate to `/payment-portal`
3. Scroll to "Payment History"
4. Click "View Receipt" on verified payment
5. Verify receipt displays correctly
6. Click "Print Receipt"
7. Click "Download PDF"

**Expected Results:**
- ✅ Receipt page loads at `/payment-receipt/[paymentId]`
- ✅ Receipt number displayed prominently
- ✅ Client information correct
- ✅ Project details correct
- ✅ Payment amount highlighted
- ✅ UTR number shown
- ✅ Related EMIs listed (e.g., "EMI #1")
- ✅ Payment summary calculated correctly:
  - Previous Balance: ₹25,000
  - Amount Paid: ₹2,500
  - Remaining Balance: ₹22,500
- ✅ Print dialog opens
- ✅ Print view styled correctly (no buttons visible)

**Visual Checks:**
- Professional receipt design
- Codelura branding
- ✓ PAID badge visible
- Footer with company info

---

### Test Case 12: Partial EMI Payment

**Objective:** Test partial payment allocation to EMI

**Test Payment Details:**
- Amount: ₹1,000
- Should allocate to: EMI #4 (partial)

**Steps:**
1. Submit payment for ₹1,000
2. Admin verifies payment
3. Check EMI #4 status

**Expected Results:**
- ✅ EMI #4 status → `PARTIALLY_PAID`
- ✅ EMI #4 `paidAmount` → ₹1,000
- ✅ EMI #4 `remainingAmount` → ₹1,500
- ✅ EMI number line shows ◐ for partial
- ✅ Progress bar visible in EMI card
- ✅ Calendar shows partial payment

---

### Test Case 13: Custom Amount Edge Cases

**Objective:** Test various payment amounts

| Test Case | Amount | Expected Behavior |
|-----------|--------|-------------------|
| Below minimum | ₹0 | ❌ Validation error |
| Exact EMI | ₹2,500 | ✅ Allocate to next pending EMI |
| Above remaining | ₹30,000 | ❌ Validation error |
| Odd amount | ₹3,750 | ✅ Partial allocation (1 full + partial) |
| Full remaining | ₹17,500 | ✅ Allocate to all remaining EMIs |

**Test Steps:**
1. Try submitting payment with each amount
2. Verify validation messages
3. For valid amounts, verify admin verification works
4. Check EMI allocation is correct

---

### Test Case 14: EMI Calendar - Overdue Detection

**Objective:** Test overdue EMI detection and display

**Setup:**
- Manually update an EMI due date to past date in MongoDB

**Steps:**
1. Update EMI #5 due date to `2026-09-01` (past)
2. Navigate to EMI calendar
3. Check status display

**Expected Results:**
- ✅ EMI #5 shows "Overdue" badge
- ✅ Status icon is ⚠ (warning)
- ✅ Text shows "X days overdue"
- ✅ Red color scheme applied
- ✅ Summary stats show 1 overdue

---

### Test Case 15: Payment Settings - QR Code Management

**Objective:** Test QR code update and delete

**Steps:**
1. Login as admin
2. Go to Payment Settings
3. Upload new QR code
4. Verify old QR deleted from Cloudinary
5. New QR displays correctly
6. Click "Delete QR Code"
7. Confirm deletion

**Expected Results:**
- ✅ Old QR removed from Cloudinary
- ✅ New QR uploaded successfully
- ✅ Database updated with new URL
- ✅ Delete removes QR from DB and Cloudinary
- ✅ Payment page shows "No QR available" after delete

---

### Test Case 16: Concurrent Payment Verification

**Objective:** Test race conditions with multiple admins

**Steps:**
1. Submit payment as client
2. Open admin dashboard in 2 browser windows
3. Click "Verify" in both windows simultaneously
4. Check database state

**Expected Results:**
- ✅ Only one verification succeeds
- ✅ Second attempt shows "already verified" error
- ✅ No duplicate EMI allocation
- ✅ Audit log shows single verification

---

### Test Case 17: Payment History Pagination

**Objective:** Test payment history with multiple payments

**Steps:**
1. Submit 25 test payments
2. Navigate to payment history
3. Verify pagination works

**Expected Results:**
- ✅ Shows 20 payments per page
- ✅ Pagination controls visible
- ✅ Page navigation works
- ✅ Total count displayed correctly

---

### Test Case 18: Mobile Responsiveness

**Objective:** Test all pages on mobile viewport

**Test Pages:**
- `/payment-portal`
- `/payment-portal/calendar`
- `/payment-receipt/[id]`
- `/admin/payments`

**Steps:**
1. Open DevTools
2. Set viewport to 375x667 (iPhone SE)
3. Test all interactions
4. Check touch targets

**Expected Results:**
- ✅ All layouts responsive
- ✅ Forms usable on mobile
- ✅ Touch targets ≥44px
- ✅ No horizontal scroll
- ✅ Images scale correctly

---

### Test Case 19: Security & Authorization

**Objective:** Test access control and security

**Test Scenarios:**

| Scenario | Expected Result |
|----------|-----------------|
| Non-logged user → /payment-portal | ❌ Redirect to login |
| Client → /admin/payments | ❌ Access denied |
| Client → other client's payment | ❌ 404 not found |
| Admin → verify without notes | ✅ Confirmation prompt |
| Client → modify payment status | ❌ API returns 403 |
| Duplicate UTR submission | ❌ "UTR already exists" error |

---

### Test Case 20: Performance Testing

**Objective:** Test system performance under load

**Metrics to Check:**
- Page load time < 2s
- API response time < 500ms
- Image loading optimized
- No memory leaks

**Tools:**
- Chrome DevTools (Performance tab)
- Network tab for API calls
- Lighthouse audit

**Expected Results:**
- ✅ All pages load quickly
- ✅ No console errors
- ✅ Images lazy-loaded
- ✅ Lighthouse score > 80

---

## 🐛 Common Issues & Solutions

### Issue 1: Payment submission fails
**Solution:** Check Cloudinary credentials in `.env`

### Issue 2: EMI allocation incorrect
**Solution:** Verify EMI pre-save hook runs, check EMI status calculation logic

### Issue 3: Receipt not generating
**Solution:** Check if `generateReceiptNumber()` method exists, verify audit log creation

### Issue 4: QR code not uploading
**Solution:** Check file size < 10MB, verify cloudinary config

### Issue 5: UPI copy not working
**Solution:** Check browser clipboard permissions, test on HTTPS

---

## ✅ Final Checklist

Before marking testing complete:

- [ ] All 20 test cases passed
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] Database state is correct
- [ ] All audit logs created
- [ ] Mobile responsive verified
- [ ] Security tests passed
- [ ] Performance acceptable
- [ ] Documentation updated

---

## 📊 Test Results Template

```
Test Date: _______
Tester: _______
Environment: Development / Staging / Production

Total Test Cases: 20
Passed: ___
Failed: ___
Blocked: ___
Pass Rate: ___%

Critical Issues: ___
Major Issues: ___
Minor Issues: ___

Notes:
_______________________
_______________________
```

---

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] All tests passed in staging
- [ ] Real UPI number configured
- [ ] Real QR code uploaded
- [ ] Admin accounts created
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Error tracking setup (Sentry)
- [ ] Payment logs retention configured
- [ ] Cloudinary production credentials set
- [ ] SSL certificate verified
- [ ] CORS settings correct
- [ ] Rate limiting configured

---

## 📞 Support

For testing issues:
- Check logs in browser console
- Check server logs in terminal
- Review MongoDB collections
- Check Cloudinary dashboard
- Review `PAYMENT_SYSTEM_MIGRATION.md`

---

**Testing Status:** Ready for Testing ✅

**System Version:** 1.0.0

**Last Updated:** 2026-09-16
