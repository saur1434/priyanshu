# Website Testing Checklist

## Setup Status
- ✅ Backend server started on port 3000
- ✅ Session management implemented
- ✅ Login redirect system active
- ⏳ Testing in progress...

---

## TEST SUITE 1: Customer Login & Redirect

### Test 1.1: Customer Login Flow
**Steps:**
1. Open http://localhost:3000/index.html
2. Click "user" button in navigation
3. Enter valid customer credentials:
   - Email: `customer@example.com`
   - Password: `password123`
4. Click "Login" button
5. Verify modal closes
6. Verify page redirects to `user-dashboard.html`

**Expected Result:** ✅ Redirects to user-dashboard.html with customer data displayed

**Actual Result:** [To be filled]

---

### Test 1.2: Customer Dashboard Session Check
**Steps:**
1. After login, verify URL shows `user-dashboard.html`
2. Check that "My Profile" section shows customer information
3. Verify user name, email, and phone are displayed
4. Check sidebar navigation is visible

**Expected Result:** ✅ Dashboard loads with customer profile data

**Actual Result:** [To be filled]

---

### Test 1.3: Customer Logout Flow
**Steps:**
1. From customer dashboard, click "Logout" button
2. Verify alert message shows logout confirmation
3. Verify localStorage is cleared (check browser DevTools)
4. Verify page redirects to `index.html`

**Expected Result:** ✅ Redirects to homepage, session cleared

**Actual Result:** [To be filled]

---

## TEST SUITE 2: Owner/Hotel Login & Redirect

### Test 2.1: Owner Login Flow
**Steps:**
1. Go to http://localhost:3000/index.html
2. Click "Owner" button in navigation
3. Enter valid owner credentials:
   - Email: `owner@example.com`
   - Password: `password123`
4. Click "Login" button
5. Verify modal closes
6. Verify page redirects to `admin.html`

**Expected Result:** ✅ Redirects to admin.html (owner dashboard)

**Actual Result:** [To be filled]

---

### Test 2.2: Owner Admin Dashboard
**Steps:**
1. Verify dashboard shows admin stats:
   - Total Customers count
   - Total Owners count
   - Approved Owners count
   - Pending Owners count
   - Total Bookings count
   - Total Revenue amount
2. Check sidebar menu with options:
   - Dashboard
   - Owners
   - Customers
   - Bookings
   - Payments
   - Logout

**Expected Result:** ✅ Admin dashboard displays with all stats and menu items

**Actual Result:** [To be filled]

---

### Test 2.3: Owner Logout Flow
**Steps:**
1. From admin dashboard, click "Logout" button
2. Verify session cleared
3. Verify redirect to `index.html`

**Expected Result:** ✅ Redirects to homepage, session cleared

**Actual Result:** [To be filled]

---

## TEST SUITE 3: Session Protection

### Test 3.1: Direct Access to Customer Dashboard (No Login)
**Steps:**
1. Clear browser cache/localStorage
2. Go directly to `http://localhost:3000/user-dashboard.html`
3. Observe behavior

**Expected Result:** ✅ Alerts "Please log in first", redirects to index.html

**Actual Result:** [To be filled]

---

### Test 3.2: Direct Access to Owner Dashboard (No Login)
**Steps:**
1. Clear browser cache/localStorage
2. Go directly to `http://localhost:3000/admin.html`
3. Observe behavior

**Expected Result:** ✅ Redirects to index.html (authentication check fails)

**Actual Result:** [To be filled]

---

### Test 3.3: Cross-Access Protection (Customer Accessing Owner Dashboard)
**Steps:**
1. Login as customer
2. Try to manually access `admin.html` via URL
3. Observe behavior

**Expected Result:** ✅ Alerts "Access denied", redirects to index.html

**Actual Result:** [To be filled]

---

### Test 3.4: Cross-Access Protection (Owner Accessing Customer Dashboard)
**Steps:**
1. Login as owner
2. Try to manually access `user-dashboard.html` via URL
3. Observe behavior

**Expected Result:** ✅ Alerts "Access denied", redirects to index.html

**Actual Result:** [To be filled]

---

## TEST SUITE 4: Customer Registration with OTP

### Test 4.1: Customer Registration Form
**Steps:**
1. Go to index.html
2. Click "user" button
3. Click "Register" tab
4. Fill customer registration form:
   - Full Name: "John Doe"
   - Email: "johndoe@example.com"
   - Phone: "9841234567"
   - Password: "password123"
   - Confirm Password: "password123"
5. Click "Create Account" button

**Expected Result:** ✅ OTP form appears, alert shows "OTP sent!"

**Actual Result:** [To be filled]

---

### Test 4.2: Customer OTP Verification & Redirect
**Steps:**
1. After showing OTP form, check backend console for OTP code
2. Enter 6-digit OTP in the form
3. Click "Verify OTP" button
4. Observe redirect

**Expected Result:** ✅ Redirects to user-dashboard.html after successful OTP verification

**Actual Result:** [To be filled]

---

## TEST SUITE 5: Owner Registration with OTP

### Test 5.1: Owner Registration Form
**Steps:**
1. Go to index.html
2. Click "Owner" button
3. Click "Register" tab
4. Fill owner registration form:
   - Property Name: "GoCabn Go"
   - Owner Email: "newowner@example.com"
   - Phone: "9841234567"
   - Location: "Kathmandu, Nepal"
   - Password: "password123"
   - Confirm Password: "password123"
5. Click "Register Hostel" button

**Expected Result:** ✅ OTP form appears, alert shows "OTP sent!"

**Actual Result:** [To be filled]

---

### Test 5.2: Owner OTP Verification & Redirect
**Steps:**
1. After showing OTP form, check backend console for OTP code
2. Enter 6-digit OTP in the form
3. Click "Verify OTP" button
4. Observe redirect

**Expected Result:** ✅ Redirects to admin.html after successful OTP verification

**Actual Result:** [To be filled]

---

## TEST SUITE 6: Form Validation

### Test 6.1: Login with Empty Credentials
**Steps:**
1. Click "user" or "Owner" button
2. Leave email and password empty
3. Click "Login" button
4. Observe error

**Expected Result:** ✅ Alert: "Email and password are required"

**Actual Result:** [To be filled]

---

### Test 6.2: Registration with Mismatched Passwords
**Steps:**
1. Click "user" button → "Register" tab
2. Fill form with mismatched passwords
3. Click "Create Account" button
4. Observe error

**Expected Result:** ✅ Alert: "Passwords do not match"

**Actual Result:** [To be filled]

---

### Test 6.3: Registration with Incomplete Fields
**Steps:**
1. Click "Owner" button → "Register" tab
2. Leave some required fields empty
3. Click "Register Hostel" button
4. Observe error

**Expected Result:** ✅ Alert: "[Field name] is required"

**Actual Result:** [To be filled]

---

## TEST SUITE 7: Navigation & UI

### Test 7.1: Customer Dashboard Navigation
**Steps:**
1. Login as customer
2. Click on each menu item:
   - Profile
   - Nearby Hotels
   - My Bookings
   - My Payments
3. Verify each section loads without errors

**Expected Result:** ✅ All sections load with content or "No data" messages

**Actual Result:** [To be filled]

---

### Test 7.2: Owner Dashboard Navigation
**Steps:**
1. Login as owner
2. Click on each menu item:
   - Dashboard
   - Owners
   - Customers
   - Bookings
   - Payments
3. Verify each section loads without errors

**Expected Result:** ✅ All sections display data or empty states

**Actual Result:** [To be filled]

---

## TEST SUITE 8: Language Support

### Test 8.1: Homepage UI Language
**Steps:**
1. Go to index.html
2. Verify all text content is in English
3. Check language selector (if present)
4. Verify admin panel shows English interface

**Expected Result:** ✅ All content is in English language

**Actual Result:** [To be filled]

---

### Test 8.2: Dashboard UI Language
**Steps:**
1. Login to dashboard
2. Verify all menu items are in English
3. Check all sections display English text
4. Verify form labels and buttons are in English

**Expected Result:** ✅ Dashboard displays entirely in English

**Actual Result:** [To be filled]

---

## TEST SUITE 9: Data Persistence

### Test 9.1: Refresh Customer Dashboard
**Steps:**
1. Login as customer
2. Refresh page (F5)
3. Verify dashboard still shows logged-in state
4. Verify customer data persists

**Expected Result:** ✅ Dashboard reloads with session intact

**Actual Result:** [To be filled]

---

### Test 9.2: Refresh Owner Dashboard
**Steps:**
1. Login as owner
2. Refresh page (F5)
3. Verify dashboard still shows logged-in state
4. Verify admin data persists

**Expected Result:** ✅ Dashboard reloads with session intact

**Actual Result:** [To be filled]

---

## TEST SUITE 10: Browser Console (DevTools)

### Test 10.1: Check for JavaScript Errors
**Steps:**
1. Open DevTools (F12)
2. Go to Console tab
3. Perform login flow
4. Check for any error messages in console

**Expected Result:** ✅ No critical errors in console (warnings OK)

**Actual Result:** [To be filled]

---

### Test 10.2: Check localStorage After Login
**Steps:**
1. Login as customer
2. Open DevTools (F12)
3. Go to Application → Storage → localStorage
4. Verify keys present:
   - `userType` = "Customer"
   - `userEmail` = [customer email]
   - `userData` = [JSON object]
   - `authToken` = [token string]

**Expected Result:** ✅ All key-value pairs correctly stored

**Actual Result:** [To be filled]

---

## TEST SUITE 11: Mobile Responsiveness

### Test 11.1: Mobile View - Homepage
**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone 12)
4. Verify homepage layout is responsive

**Expected Result:** ✅ Layout adapts to mobile screen

**Actual Result:** [To be filled]

---

### Test 11.2: Mobile View - Customer Dashboard
**Steps:**
1. Login as customer in mobile view
2. Verify sidebar collapses properly
3. Verify buttons are touch-friendly
4. Check all sections are accessible

**Expected Result:** ✅ Dashboard is fully functional on mobile

**Actual Result:** [To be filled]

---

## Summary Statistics

### Total Tests: 30+
- ✅ Passed: [Count]
- ❌ Failed: [Count]
- ⚠️ Issues: [Count]
- ⏳ Not Tested: [Count]

---

## Critical Issues Found
[List any critical issues that block functionality]

---

## Minor Issues & Improvements
[List any non-critical issues or suggestions for improvement]

---

## Sign-Off

**Tested By:** [Your Name]
**Date:** [Testing Date]
**Status:** [Ready for Production / Needs Fixes / In Progress]

---
