# Payment System Migration Guide

## Overview

Codelura now has TWO payment systems running in parallel:

### 1. **Custom UPI/QR Payment System** (NEW)
- **Use For:** Client project payments, EMI tracking, custom amounts
- **Features:** Manual admin verification, EMI auto-allocation, receipt generation
- **No Razorpay Required:** Direct UPI/QR code payments

### 2. **Razorpay Integration** (LEGACY - Keep for existing features)
- **Use For:** Course enrollments, premium subscriptions
- **Keep Because:** Existing users, automated verification, established flow
- **Files Using Razorpay:**
  - `App/controllers/web/payment.controller.js`
  - `App/controllers/web/enrollment.controller.js`
  - `App/controllers/web/coursePaymentController.js`
  - `App/config/razorpay.js`
  - Frontend checkout pages for courses

---

## Environment Variables

### ✅ Required for Custom UPI System:
```env
# No additional env vars needed!
# Uses existing Cloudinary for QR upload
```

### ⚠️ Keep for Razorpay (Legacy):
```env
RAZORPAY_KEY_ID=rzp_test_XXXX
RAZORPAY_KEY_SECRET=XXXX
RAZORPAY_WEBHOOK_SECRET=XXXX
```

### ❌ Can Remove from .env (NOT USED):
- None of the Razorpay vars are removed yet because they're needed for courses/premium

---

## What Was Changed

### ✅ NEW Custom Payment System (Created):

**Backend:**
- `App/models/Payment.js` - Payment submissions
- `App/models/ProjectPayment.js` - Project tracking
- `App/models/EMI.js` - Installment tracking
- `App/models/PaymentSettings.js` - UPI/QR config
- `App/models/PaymentAuditLog.js` - Audit trail
- `App/controllers/payment.controller.js` - Payment operations
- `App/controllers/projectPayment.controller.js` - Project management
- `App/controllers/paymentSettings.controller.js` - Settings management
- `App/services/payment.service.js` - Auto-allocation logic
- `App/routes/payment.custom.routes.js` - API routes
- `App/routes/paymentSettings.routes.js` - Settings routes

**Frontend:**
- `app/payment-portal/page.tsx` - Client payment portal
- `app/payment-portal/calendar/page.tsx` - EMI calendar
- `app/payment-receipt/[paymentId]/page.tsx` - Receipt display
- `app/admin/payments/page.tsx` - Admin dashboard
- `components/payment/*` - Payment components
- `components/admin/payments/*` - Admin components
- `lib/utils.ts` - Utility functions

### 🔒 UNCHANGED (Razorpay Still Active):

**Backend - Keep These:**
- `App/config/razorpay.js` - Razorpay configuration
- `App/controllers/web/payment.controller.js` - Premium payments
- `App/controllers/web/enrollment.controller.js` - Course enrollments
- `App/controllers/web/coursePaymentController.js` - Course checkout
- Webhook handler at `/api/payment/webhook`

**Frontend - Keep These:**
- `app/courses/[id]/checkout/page.tsx` - Course checkout
- `components/premium/BuyModal.jsx` - Premium purchase
- `components/career/RazorpayPaymentModal.tsx` - Career track payment
- Razorpay script in `app/layout.tsx`

---

## When to Use Which System?

| Payment Type | System | Reason |
|-------------|---------|---------|
| **Client Project Payment** | ✅ Custom UPI | Flexible amounts, EMI tracking, admin verification |
| **Course Enrollment** | 🔒 Razorpay | Automated verification, existing flow |
| **Premium Subscription** | 🔒 Razorpay | Recurring billing, established |
| **Career Track Payment** | 🔒 Razorpay | Existing implementation |

---

## Future Migration Path (Optional)

If you want to fully remove Razorpay in the future:

### Phase 1: Migrate Courses to Custom System
1. Create course payment flow using custom UPI
2. Update course enrollment to accept manual verification
3. Test thoroughly with real users
4. Migrate existing Razorpay courses data

### Phase 2: Migrate Premium Subscriptions
1. Create subscription model in custom system
2. Handle recurring payments manually
3. Migrate existing subscribers

### Phase 3: Remove Razorpay
1. Remove Razorpay dependency from package.json
2. Delete `App/config/razorpay.js`
3. Remove Razorpay controllers
4. Remove frontend Razorpay modals
5. Remove Razorpay script from layout
6. Remove env variables

**Estimated Effort:** 2-3 weeks per phase

---

## Testing Checklist

### ✅ Custom UPI System:
- [ ] Client can submit payment with UTR
- [ ] Admin can verify payment
- [ ] Admin can reject payment
- [ ] EMI auto-allocation works correctly
- [ ] Receipt generates properly
- [ ] Payment history shows correctly
- [ ] EMI calendar displays correctly
- [ ] QR code upload works
- [ ] UPI number update works

### 🔒 Razorpay (Verify Still Works):
- [ ] Course checkout works
- [ ] Premium purchase works
- [ ] Career track payment works
- [ ] Webhook verification works
- [ ] Payment confirmation emails sent

---

## Support

For questions about:
- **Custom UPI System:** Check `PAYMENT_SYSTEM_MIGRATION.md`
- **Razorpay Issues:** Check Razorpay documentation
- **Migration Planning:** Contact development team

---

## Notes

- Both systems run independently
- No conflicts between systems
- Custom UPI is admin-verified (manual)
- Razorpay is auto-verified (instant)
- Choose based on use case
