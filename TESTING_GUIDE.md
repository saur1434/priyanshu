# Website Testing Guide - Quick Start

## ✅ Backend Status
- **Server:** Running on `http://localhost:3000`
- **Status:** Responding to API requests
- **Database Files:** Located in `/data` folder

---

## 🔐 Test Accounts Available

### Customer Account
- **Email:** `rajakumar17889@gmail.com`
- **Password:** `9103674693` (phone number used as password - check users.json)
- **Status:** ✅ Verified
- **Note:** This account was created through registration

### Owner Account #1
- **Email:** `saurabh1435neha@gmail.com`
- **Password:** `saurabhg` (plain text - check owners.json)
- **Hostel:** "salsap" in Patna, India
- **Status:** ⏳ Pending Approval

### Owner Account #2
- **Email:** `saurabhsingham1435kumar@gmail.com`
- **Password:** (Hashed - needs to be reset)
- **Hostel:** "tftyfgi" in Patna
- **Status:** ⏳ Pending Approval
- **Last Login:** 2026-02-20 05:29:18

---

## 🚀 Quick Testing Steps

### **CRITICAL: Create New Test Accounts**

Since passwords are stored/hashed differently, create fresh test accounts:

#### Step 1: Create Customer Account
1. Open browser: `http://localhost:3000/index.html`
2. Click **"user"** button
3. Click **"Register"** tab
4. Fill form:
   - **Full Name:** Test Customer
   - **Email:** testcustomer@test.com
   - **Phone:** 9841234567
   - **Password:** Test@123
   - **Confirm:** Test@123
5. Click **"Create Account"**
6. Wait for OTP (check backend console for code)
7. Enter OTP code
8. ✅ Should redirect to `user-dashboard.html`

---

#### Step 2: Create Owner Account
1. Go back to homepage: `http://localhost:3000/index.html`
2. Click **"Owner"** button
3. Click **"Register"** tab
4. Fill form:
   - **Hostel Name:** Test Hotel
   - **Email:** testowner@test.com
   - **Phone:** 9841234567
   - **Location:** Kathmandu, Nepal
   - **Password:** Test@123
   - **Confirm:** Test@123
5. Click **"Register Hostel"**
6. Wait for OTP (check backend console for code)
7. Enter OTP code
8. ✅ Should redirect to `admin.html`

---

## 📋 Main Test Scenarios

### Scenario 1: Customer Login & Dashboard Access

**Test 1.1 - Customer Login**
```
1. Go to http://localhost:3000/index.html
2. Click "user" button
3. Enter email: testcustomer@test.com
4. Enter password: Test@123
5. Click "Login"
✅ Expected: Modal closes, page redirects to user-dashboard.html
```

**Test 1.2 - Customer Dashboard**
```
1. Verify URL shows: user-dashboard.html
2. Check sidebar shows customer name
3. Click each menu item (Profile, Hotels, Bookings, Payments)
✅ Expected: All sections load without errors
```

**Test 1.3 - Customer Logout**
```
1. Click "Logout" button
2. Check alert message
3. Verify redirect to index.html
✅ Expected: Session cleared, back on homepage
```

---

### Scenario 2: Owner/Admin Dashboard Access

**Test 2.1 - Owner Login**
```
1. Go to http://localhost:3000/index.html
2. Click "Owner" button
3. Enter email: testowner@test.com
4. Enter password: Test@123
5. Click "Login"
✅ Expected: Modal closes, page redirects to admin.html
```

**Test 2.2 - Admin Dashboard**
```
1. Verify URL shows: admin.html
2. Check sidebar shows: Dashboard, Owners, Customers, Bookings, Payments
3. Click "Dashboard" menu
4. View statistics cards
✅ Expected: Admin dashboard displays stats
```

**Test 2.3 - Owner Logout**
```
1. Click "Logout" button
2. Check alert and redirect
✅ Expected: Session cleared, back on homepage
```

---

### Scenario 3: Session Protection

**Test 3.1 - Direct Dashboard Access (No Login)**
```
1. Open new private/incognito tab
2. Go directly to: http://localhost:3000/user-dashboard.html
3. Observe behavior
✅ Expected: Alert "Please log in first" → redirects to index.html
```

**Test 3.2 - Cross-Access (Customer to Owner Dashboard)**
```
1. Login as customer
2. Manually type: user-dashboard.html change to admin.html
3. Navigate to: http://localhost:3000/admin.html
✅ Expected: Alert "Access denied" → redirects to index.html
```

**Test 3.3 - Cross-Access (Owner to Customer Dashboard)**
```
1. Login as owner
2. Manually navigate to: http://localhost:3000/user-dashboard.html
✅ Expected: Alert "Access denied" → redirects to index.html
```

---

### Scenario 4: Login Form Validation

**Test 4.1 - Empty Credentials**
```
1. Click "user" button
2. Leave email & password empty
3. Click "Login"
✅ Expected: Alert "Email and password are required"
```

**Test 4.2 - Invalid Email**
```
1. Click "user" button
2. Enter: notanemail
3. Enter password: Test@123
4. Click "Login"
✅ Expected: Backend returns error message
```

**Test 4.3 - Wrong Password**
```
1. Click "user" button
2. Enter: testcustomer@test.com
3. Enter: WrongPassword
4. Click "Login"
✅ Expected: Alert "Error: Login failed"
```

---

### Scenario 5: Registration Form Validation

**Test 5.1 - Mismatched Passwords**
```
1. Click "user" → "Register"
2. Fill form with password: Test@123
3. Confirm password: Different@123
4. Click "Create Account"
✅ Expected: Alert "Passwords do not match"
```

**Test 5.2 - Missing Required Fields**
```
1. Click "Owner" → "Register"
2. Leave "Hostel Name" empty
3. Click "Register Hostel"
✅ Expected: Alert "Hostel name is required"
```

**Test 5.3 - Invalid Email**
```
1. Click "user" → "Register"
2. Enter email: invalidemail
3. Fill rest of form
4. Click "Create Account"
✅ Expected: Backend validation error
```

---

### Scenario 6: OTP Verification

**Test 6.1 - Registration with OTP**
```
1. Complete customer registration form
2. OTP form appears
3. Check BACKEND CONSOLE for 6-digit OTP code
4. Enter OTP code
5. Click "Verify OTP"
✅ Expected: Redirects to user-dashboard.html
```

**Test 6.2 - Wrong OTP**
```
1. Complete registration, OTP form appears
2. Enter wrong OTP code (e.g., 000000)
3. Click "Verify OTP"
✅ Expected: Alert "Error: OTP verification failed"
```

---

### Scenario 7: Data Persistence

**Test 7.1 - Refresh Page After Login**
```
1. Login as customer
2. Verify dashboard loads with data
3. Press F5 to refresh
4. Observe behavior
✅ Expected: Dashboard reloads with session intact
```

**Test 7.2 - LocalStorage Check**
```
1. Login as customer
2. Open DevTools (F12)
3. Go to: Application → Storage → Local Storage
4. Select: http://localhost:3000
5. Check keys: userType, userEmail, userData, authToken
✅ Expected: All keys present with correct values
```

---

## 🐛 Debugging Tips

### Check Browser Console
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for any error messages
4. Errors will show in red, warnings in yellow

### Check Backend Console
1. Look at the terminal running `node server.js`
2. Look for OTP codes displayed for testing
3. Check for any error messages from API calls

### Check LocalStorage
1. Press **F12**
2. Go to **Application** tab
3. Click **Local Storage** on left
4. Select your domain
5. View all stored session data

### Clear Session
```
Since testing multiple accounts, clear localStorage between tests:
1. Open DevTools (F12)
2. Console tab
3. Type: localStorage.clear()
4. Press Enter
```

---

## 📊 Testing Matrix

| Feature | Customer | Owner | Status |
|---------|----------|-------|--------|
| Login | ✅ | ✅ | Ready |
| Auto Redirect | ✅ | ✅ | Ready |
| Dashboard Load | ✅ | ✅ | Ready |
| Logout | ✅ | ✅ | Ready |
| Session Protection | ✅ | ✅ | Ready |
| Cross-Access Block | ✅ | ✅ | Ready |
| Registration | ✅ | ✅ | Ready |
| OTP Verification | ✅ | ✅ | Ready |
| Form Validation | ✅ | ✅ | Ready |

---

## 🎯 Test Results Template

Print this and use to document test results:

```
TEST CASE: [Name]
Date: [Date]
Tester: [Name]

Steps Performed:
[List steps]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Status: ✅ PASS / ❌ FAIL

Notes:
[Any additional notes]
```

---

## ⚠️ Common Issues & Fixes

### Issue 1: "Connection error" when logging in
**Fix:**
- Make sure backend server is running: `node server.js`
- Check that port 3000 is not blocked
- Verify terminal shows server running

### Issue 2: "Route not found" errors
**Fix:**
- Check that you're using correct endpoints
- Verify server.js has the routes defined
- Check for any typos in API calls

### Issue 3: OTP not appearing
**Fix:**
- Check backend console for OTP code
- OTP appears in terminal where server is running
- OTP is valid for 5 minutes

### Issue 4: "Remember me" checkbox issue
**Fix:**
- Checkbox is for future development
- Currently not affecting login functionality
- Safe to ignore for now

### Issue 5: Language selector not working on dashboard
**Fix:**
- Check that i18n.js is loaded
- Verify translation files are present
- Check browser console for errors

---

## 🚀 Performance Notes

- First load may take a moment
- OTP generation takes 1-2 seconds
- Dashboard data loads in background
- All API calls are non-blocking

---

## 📞 Support

If tests fail:
1. Check backend console for error messages
2. Clear browser cache (Ctrl+Shift+Delete)
3. Clear localStorage (Dev tools console)
4. Refresh page
5. Try again

---

**Last Updated:** February 20, 2026
**Status:** ✅ Ready for Testing
