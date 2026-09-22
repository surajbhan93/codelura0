# Custom Payment System - Quick Start Guide

## 🚀 How to Use the Payment System

### For Admin: Creating Projects with EMI

1. **Login as Admin**
   - Navigate to: `http://localhost:3000/admin/payments`
   - Login with admin credentials

2. **Create New Project**
   - Click on **"All Projects"** tab
   - Click **"Create New Project"** button (blue button top-right)
   
3. **Fill Project Details:**
   ```
   Select Client: Choose from dropdown
   Project Name: e.g., "Business Website Development"
   Project Description: Brief description
   Total Project Amount: e.g., ₹25,000
   EMI Amount: e.g., ₹2,500
   Number of EMIs: e.g., 10
   EMI Start Date: Select date
   EMI Frequency: Monthly/Weekly/Custom
   Admin Notes: Optional notes
   ```

4. **Click "Create Project & Generate EMIs"**
   - System will automatically:
     - Create ProjectPayment record
     - Generate all EMI records with due dates
     - Set EMI statuses to PENDING
     - Client can now see project in payment portal

### For Client: Making Payments

1. **Login as Client**
   - Navigate to: `http://localhost:3000/payment-portal`
   - Login with client credentials

2. **View Your Project**
   - See project details
   - View EMI schedule (number line)
   - Check next EMI due

3. **Make Payment**
   - Click "Make Payment Now"
   - Enter amount (₹1 to remaining balance)
   - Choose payment method:
     - **UPI**: Copy UPI number `9336289192`
     - **QR Code**: Scan QR with any UPI app
   - Make payment in your UPI app
   - Return to form

4. **Submit Payment Details**
   - Enter UTR/Transaction ID
   - Select payment date
   - Upload screenshot (proof)
   - Add notes (optional)
   - Click "Submit Payment"

5. **Wait for Verification**
   - Status: "Verification Pending"
   - Admin will verify payment
   - You'll see status update

### For Admin: Verifying Payments

1. **Go to "Pending Verification" Tab**
   - See count badge with pending payments
   - Review payment cards

2. **Review Payment**
   - Check client details
   - View project name
   - See payment amount
   - Check UTR number
   - **View screenshot** (click to enlarge)
   - Verify payment method

3. **Verify or Reject**
   - **To Verify:**
     - Add verification notes
     - Click "✓ Verify Payment"
     - System auto-allocates to EMIs
     - Receipt auto-generates
   
   - **To Reject:**
     - Add rejection reason
     - Click "✕ Reject Payment"
     - Client can see rejection reason

4. **After Verification**
   - Payment status → PAID
   - EMIs auto-updated
   - Receipt number generated
   - Client can download receipt

### EMI Calendar View

**For Clients:**
- Navigate to: `/payment-portal/calendar`
- See EMIs grouped by month
- Check due dates
- View payment history per EMI
- See days remaining/overdue

**Status Indicators:**
- ✓ = Paid (green)
- ◐ = Partially Paid (yellow)
- ○ = Pending (gray)
- ⚠ = Overdue (red)

---

## 📊 Complete User Flow Example

### Scenario: Create ₹25,000 project with 10 EMIs of ₹2,500

**Step 1: Admin Creates Project**
```
Login → Admin Dashboard → All Projects → Create New Project
Fill form:
  - Client: John Doe (john@example.com)
  - Project: E-commerce Website
  - Total: ₹25,000
  - EMI: ₹2,500
  - Number: 10
  - Start: 2026-10-05
  - Frequency: Monthly
Submit → Project Created ✅
System creates 10 EMIs with due dates:
  EMI #1: 2026-10-05
  EMI #2: 2026-11-05
  ...
  EMI #10: 2027-07-05
```

**Step 2: Client Makes First Payment**
```
Login → Payment Portal → See Project
Click "Make Payment Now"
Enter: ₹2,500
Choose: UPI
Copy UPI: 9336289192
Open PhonePe/GPay → Send ₹2,500
Get UTR: TEST123456789
Return to form:
  - UTR: TEST123456789
  - Date: Today
  - Screenshot: Upload
Submit → "Payment Submitted Successfully" ✅
Status: Verification Pending 🟡
```

**Step 3: Admin Verifies Payment**
```
Login → Admin Dashboard → Pending Verification
See payment card:
  - John Doe
  - E-commerce Website
  - ₹2,500
  - UTR: TEST123456789
  - Screenshot: ✓ Valid
Click "Review Payment"
Add notes: "Payment verified via bank statement"
Click "✓ Verify Payment"
System:
  - Payment status → PAID ✅
  - EMI #1 → PAID ✅
  - EMI #1 paidAmount → ₹2,500
  - Project totalPaid → ₹2,500
  - Project remaining → ₹22,500
  - Receipt: CL-202609-0001
Toast: "Payment verified successfully!" 🎉
```

**Step 4: Client Views Receipt**
```
Login → Payment Portal → Payment History
Find payment → Click "View Receipt"
Receipt page shows:
  - Receipt #: CL-202609-0001
  - Client: John Doe
  - Project: E-commerce Website
  - Amount: ₹2,500
  - UTR: TEST123456789
  - Related EMIs: EMI #1
  - Previous Balance: ₹25,000
  - Amount Paid: ₹2,500
  - Remaining: ₹22,500
Click "Print Receipt" or "Download PDF" ✅
```

**Step 5: Client Makes Bigger Payment**
```
Click "Make Payment Now"
Enter: ₹7,500 (covers 3 EMIs)
Submit → Admin Verifies
System auto-allocates:
  - EMI #2 → PAID (₹2,500)
  - EMI #3 → PAID (₹2,500)
  - EMI #4 → PAID (₹2,500)
Project status:
  - Total Paid: ₹10,000
  - Remaining: ₹15,000
  - Progress: 40%
EMI Number Line: ✓✓✓✓○○○○○○
```

**Step 6: Client Makes Partial Payment**
```
Enter: ₹1,000 (partial EMI)
Submit → Admin Verifies
System:
  - EMI #5 → PARTIALLY_PAID
  - EMI #5 paidAmount → ₹1,000
  - EMI #5 remaining → ₹1,500
EMI Number Line: ✓✓✓✓◐○○○○○
Calendar shows progress bar: 40% paid
```

---

## 🎯 API Routes Reference

### Client Routes
```
POST   /api/payments/submit              - Submit payment
GET    /api/payments/history             - Get payment history
GET    /api/payments/receipt/:paymentId  - Get receipt
GET    /api/payments/projects            - Get user projects
GET    /api/payments/project/:id         - Get project details
GET    /api/payments/emi-calendar/:id    - Get EMI calendar
```

### Admin Routes
```
GET    /api/payments/admin/pending              - Pending payments
POST   /api/payments/admin/verify/:paymentId    - Verify payment
POST   /api/payments/admin/reject/:paymentId    - Reject payment
GET    /api/payments/admin/audit-logs/:id       - Audit logs
POST   /api/payments/admin/create-project       - Create project ⭐
GET    /api/payments/admin/all-projects         - All projects
GET    /api/users                               - Get users list ⭐
```

### Settings Routes
```
GET    /api/payment-settings             - Get public settings
GET    /api/payment-settings/admin       - Get admin settings
PUT    /api/payment-settings/admin/upi   - Update UPI number
POST   /api/payment-settings/admin/qr    - Upload QR code
DELETE /api/payment-settings/admin/qr    - Delete QR code
```

---

## 🔧 Admin Configuration

### First Time Setup

1. **Upload QR Code**
   ```
   Admin Dashboard → Payment Settings
   Upload QR Code → Choose image
   QR uploads to Cloudinary
   Displays in client payment page
   ```

2. **Set UPI Number**
   ```
   Default: 9336289192
   To change:
     Payment Settings → UPI Number field
     Enter 10-digit number
     Click "Save"
   ```

3. **Create Test Project**
   ```
   All Projects → Create New Project
   Fill minimal details
   Submit → Test project created
   Login as client to test payment flow
   ```

---

## 📱 Frontend Pages

### Client Pages
- `/payment-portal` - Main portal with project & payment form
- `/payment-portal/calendar` - EMI calendar view
- `/payment-receipt/[paymentId]` - Receipt page

### Admin Pages
- `/admin/payments` - Main admin dashboard
  - Tab 1: Pending Verification
  - Tab 2: All Projects (with Create button)
  - Tab 3: Payment Settings

---

## 💡 Common Scenarios

### Scenario 1: Client Pays Full Amount at Once
```
Client: Enter full ₹25,000
System: Allocates to all 10 EMIs
Result: All EMIs → PAID
Project: Status → Completed
```

### Scenario 2: Client Pays Random Amount
```
Client: Enter ₹6,200
System allocates:
  - EMI #1: ₹2,500 (PAID)
  - EMI #2: ₹2,500 (PAID)
  - EMI #3: ₹1,200 (PARTIALLY_PAID, ₹1,300 remaining)
```

### Scenario 3: Admin Rejects Payment
```
Admin: Review → Invalid screenshot
Action: Add reason "Screenshot unclear"
Click: Reject Payment
Result:
  - Payment status → REJECTED
  - No EMI allocation
  - Client sees rejection reason
  - Client can resubmit with correct details
```

### Scenario 4: Multiple Admins
```
Admin A: Clicks verify on Payment #123
Admin B: Also clicks verify on Payment #123
System: Only first verification succeeds
Admin B: Gets error "Payment already verified"
Prevention: Database transaction + status check
```

---

## ⚠️ Important Notes

1. **UTR Must Be Unique**
   - Each UTR can only be used once
   - Prevents duplicate payment submissions
   - Client gets error if UTR already exists

2. **Screenshot Required**
   - Upload is mandatory for verification
   - Admin can view full-size image
   - Stored in Cloudinary (permanent)

3. **EMI Auto-Allocation**
   - Sequential allocation (EMI #1, #2, #3...)
   - Partial payments supported
   - Cannot skip EMIs (pays oldest pending first)

4. **Receipt Numbers**
   - Format: CL-YYYYMM-XXXX
   - Example: CL-202609-0001
   - Auto-incremented per month
   - Unique across system

5. **Audit Trail**
   - Every action logged
   - Who, When, What recorded
   - Immutable (cannot be deleted)
   - View per payment

---

## 🐛 Troubleshooting

### Issue: "No projects found"
**Solution:** Admin needs to create project first via "Create New Project" button

### Issue: "Payment submission failed"
**Solution:** Check Cloudinary credentials in backend `.env`

### Issue: "UTR already exists"
**Solution:** Each UTR is unique. Use different transaction ID.

### Issue: "Access denied" on admin pages
**Solution:** User must have `role: "admin"` in database

### Issue: QR code not showing
**Solution:** Upload QR via Payment Settings → Admin tab

---

## ✅ Testing Checklist

- [ ] Create project as admin
- [ ] View project as client
- [ ] Submit payment with screenshot
- [ ] Verify payment as admin
- [ ] Check EMI allocation
- [ ] View receipt
- [ ] Check EMI calendar
- [ ] Test partial payment
- [ ] Test rejection
- [ ] Upload/update QR code

---

**System Ready!** 🎉

All features working. Start by creating your first project in Admin Dashboard → All Projects → Create New Project button.
