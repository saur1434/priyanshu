# Website Testing - Results Tracker

**Start Date:** February 20, 2026  
**Backend Status:** ✅ Running on localhost:3000  
**Browser:** Open at http://localhost:3000  

---

## 🎯 Phase 1: Account Creation (FIRST - Do This First!)

### Create Customer Test Account
**Objective:** Register a new customer account and verify OTP redirect

**Instructions:**
1. Open: http://localhost:3000/index.html (should already be open in simple browser)
2. Click **"user"** button (blue button on top right)
3. Click **"Register"** tab
4. Fill form:
   - Full Name: `Test Customer`
   - Email: `testcustomer@test.com`
   - Phone: `9841234567`
   - Password: `Test@123`
   - Confirm Password: `Test@123`
5. Click **"Create Account"** button
6. **IMPORTANT:** Check terminal output for OTP code (6 digits)
7. Enter OTP in form
8. Click **"Verify OTP"**

**Expected Result:**
```
✅ PASS: Redirects to user-dashboard.html with customer details displayed
❌ FAIL: Shows error or stays on registration page
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

### Create Owner Test Account
**Objective:** Register a new owner account and verify OTP redirect

**Instructions:**
1. Go to: http://localhost:3000/index.html
2. Click **"Owner"** button (brown button on top right)
3. Click **"Register"** tab
4. Fill form:
   - Hostel Name: `Test Hotel`
   - Owner Email: `testowner@test.com`
   - Phone: `9841234567`
   - Location: `Kathmandu, Nepal`
   - Password: `Test@123`
   - Confirm Password: `Test@123`
5. Click **"Register Hostel"** button
6. **IMPORTANT:** Check terminal for OTP code (6 digits)
7. Enter OTP in form
8. Click **"Verify OTP"**

**Expected Result:**
```
✅ PASS: Redirects to admin.html (owner/admin dashboard)
❌ FAIL: Shows error or stays on registration page
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

## 🔑 Phase 2: Login Tests

### Test 2.1: Customer Login
**Objective:** Verify customer can login and redirects correctly

**Instructions:**
1. Go to: http://localhost:3000/index.html
2. Click **"user"** button
3. Click **"Login"** tab (should be default)
4. Enter:
   - Email: `testcustomer@test.com`
   - Password: `Test@123`
5. Click **"Login"** button
6. Observe modal and page behavior

**Expected Result:**
```
✅ PASS: 
  - Modal closes with success message
  - Page redirects to user-dashboard.html
  - Customer name appears in header/sidebar
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

### Test 2.2: Owner Login
**Objective:** Verify owner can login and redirects to admin dashboard

**Instructions:**
1. Go to: http://localhost:3000/index.html
2. Click **"Owner"** button
3. Click **"Login"** tab
4. Enter:
   - Email: `testowner@test.com`
   - Password: `Test@123`
5. Click **"Login"** button
6. Observe modal and page behavior

**Expected Result:**
```
✅ PASS:
  - Modal closes with success message
  - Page redirects to admin.html
  - Admin dashboard displays with stats cards
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

## 🏠 Phase 3: Dashboard Tests

### Test 3.1: Customer Dashboard Navigation
**Objective:** Verify all customer dashboard sections work

**Prerequisites:** Must be logged in as customer

**Instructions:**
1. Verify you're on user-dashboard.html
2. Click on each menu item on the left:
   - **Profile** - Check customer info displays
   - **Nearby Hotels** - Check hotels load/display
   - **My Bookings** - Check booking table
   - **My Payments** - Check payments table
3. Verify no console errors (F12)

**Expected Result:**
```
✅ PASS: All sections load without errors, showing either data or "No items" message
❌ FAIL: Sections show errors or blank screen
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

### Test 3.2: Owner Dashboard Navigation
**Objective:** Verify all owner/admin dashboard sections work

**Prerequisites:** Must be logged in as owner

**Instructions:**
1. Verify you're on admin.html
2. Click menu items:
   - **Dashboard** - Check stats cards display
   - **Owners** - Check owners table
   - **Customers** - Check customers table
   - **Bookings** - Check bookings table
   - **Payments** - Check payments table
3. Verify no console errors (F12)

**Expected Result:**
```
✅ PASS: All sections load, showing data or "No items" message
❌ FAIL: Sections show errors or blank screen
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

## 🔒 Phase 4: Session Security Tests

### Test 4.1: Direct Dashboard Access Without Login
**Objective:** Verify user cannot access dashboard without logging in

**Instructions:**
1. Open new private/incognito tab or clear localStorage
   - Open DevTools (F12) → Console
   - Type: `localStorage.clear()`
   - Press Enter
2. Navigate to: http://localhost:3000/user-dashboard.html
3. Observe behavior

**Expected Result:**
```
✅ PASS: Shows alert "Please log in first", redirects to index.html
❌ FAIL: Loads dashboard without authentication
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

### Test 4.2: Customer Cannot Access Owner Dashboard
**Objective:** Verify access control between user types

**Instructions:**
1. Login as customer
2. Manually change URL to: http://localhost:3000/admin.html
3. Press Enter
4. Observe behavior

**Expected Result:**
```
✅ PASS: Shows alert "Access denied", redirects to index.html
❌ FAIL: Loads admin dashboard
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

### Test 4.3: Owner Cannot Access Customer Dashboard
**Objective:** Verify reverse access control

**Instructions:**
1. Make sure you're logged out (click Logout)
2. Login as owner
3. Manually change URL to: http://localhost:3000/user-dashboard.html
4. Press Enter
5. Observe behavior

**Expected Result:**
```
✅ PASS: Shows alert "Access denied", redirects to index.html
❌ FAIL: Loads customer dashboard
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

## 🚪 Phase 5: Logout Tests

### Test 5.1: Customer Logout
**Objective:** Verify logout clears session and redirects

**Prerequisites:** Must be logged in as customer

**Instructions:**
1. While on customer dashboard
2. Click **"Logout"** button (top right)
3. Observe behavior and LocalStorage

**Expected Result:**
```
✅ PASS:
  - Shows logout alert
  - Redirects to index.html
  - localStorage is cleared (check DevTools)
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

### Test 5.2: Owner Logout
**Objective:** Verify owner logout clears session

**Prerequisites:** Must be logged in as owner

**Instructions:**
1. While on admin dashboard
2. Click **"Logout"** button
3. Observe behavior

**Expected Result:**
```
✅ PASS:
  - Shows logout alert
  - Redirects to index.html
  - localStorage is cleared
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

## ✔️ Phase 6: Form Validation Tests

### Test 6.1: Login with Empty Fields
**Objective:** Verify form validation

**Instructions:**
1. Click "user" button
2. Leave both email and password empty
3. Click "Login"

**Expected Result:**
```
✅ PASS: Shows alert "Email and password are required"
❌ FAIL: Allows login or shows no error
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

### Test 6.2: Registration with Mismatched Passwords
**Objective:** Verify password matching validation

**Instructions:**
1. Click "user" → "Register"
2. Fill form with password: `Test@123`
3. Confirm password: `Different@123`
4. Click "Create Account"

**Expected Result:**
```
✅ PASS: Shows alert "Passwords do not match"
❌ FAIL: Allows registration or shows no error
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

### Test 6.3: Invalid Credentials Login
**Objective:** Verify invalid login rejection

**Instructions:**
1. Click "user" → "Login"
2. Enter valid email: `testcustomer@test.com`
3. Enter wrong password: `WrongPassword123`
4. Click "Login"

**Expected Result:**
```
✅ PASS: Shows error "Login failed"
❌ FAIL: Logs in with wrong credentials
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

## 📊 Phase 7: Data Persistence Tests

### Test 7.1: Page Refresh After Login
**Objective:** Verify session persists after page refresh

**Prerequisites:** Must be logged in as customer

**Instructions:**
1. Login to customer dashboard
2. Verify customer data displays
3. Press F5 to refresh page
4. Observe if session is maintained

**Expected Result:**
```
✅ PASS: 
  - Page reloads
  - Still shows logged-in state
  - Customer data displays
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

### Test 7.2: LocalStorage Verification
**Objective:** Verify session data is correctly stored

**Prerequisites:** Must be logged in

**Instructions:**
1. Login (as any user)
2. Open DevTools: Press F12
3. Go to: Application → Local Storage
4. Click on http://localhost:3000
5. Check for these keys:
   - `userType` (should be "Customer" or "Hotel Owner")
   - `userEmail` (should show email)
   - `userData` (should show JSON object)
   - `authToken` (should show token string)

**Expected Result:**
```
✅ PASS: All keys present with correct values
❌ FAIL: Keys missing or incorrect values
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

## 📱 Phase 8: Browser Console Tests (F12)

### Test 8.1: Check for JavaScript Errors
**Objective:** Verify no critical errors in console

**Instructions:**
1. Open DevTools: F12
2. Click "Console" tab
3. Login to application
4. Navigate through dashboard
5. Check for red error messages

**Expected Result:**
```
✅ PASS: 
  - No red error messages
  - Only info/warning messages OK
  - No critical failures
```

**Actual Result:** [To be filled by tester]

**Status:** ⏳ Not Started

---

## 📊 Summary Report

### Overall Status
- ✅ Tests Passed: ___/40+
- ❌ Tests Failed: ___
- ⚠️ Issues Found: ___
- ⏳ Not Started: ___

### Critical Issues Found
[List any blocking issues here]

---

### Minor Issues & Observations
[List any non-critical issues]

---

### Notes
[Any additional observations or comments]

---

### Sign-Off
- **Tested By:** [Your Name]
- **Date:** [Date]
- **Status:** ⏳ In Progress / ✅ Complete / ❌ Blocked

---

## 🎓 Quick Reference Commands

### Clear LocalStorage (DevTools Console)
```javascript
localStorage.clear()
```

### View All Session Data (DevTools Console)
```javascript
console.log({
  userType: localStorage.getItem('userType'),
  userEmail: localStorage.getItem('userEmail'),
  userData: JSON.parse(localStorage.getItem('userData')),
  authToken: localStorage.getItem('authToken')
})
```

### Logout Programmatically (DevTools Console)
```javascript
logoutUser()
```

---

**Last Updated:** February 20, 2026
**Status:** ✅ Ready to Test
