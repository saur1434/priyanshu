# Login & Dashboard Redirect System

## Overview
The system now automatically redirects users to their own dashboard after successful login:
- **Customers** → `user-dashboard.html`
- **Hotel Owners** → `admin.html`

## What Was Implemented

### 1. Session Management Functions (auth.js)
Added global functions for session control:

```javascript
isUserLoggedIn()        // Check if user is logged in
getCurrentUserType()    // Get user type (Customer/Hotel Owner)
getCurrentUserEmail()   // Get user email
getCurrentUserData()    // Get full user data
logoutUser()           // Clear session and redirect to index.html
requireLogin()         // Verify user is logged in (redirect if not)
requireUserType(type)  // Verify specific user type (redirect if mismatch)
```

### 2. Login Redirect Flow

#### For Customer Login:
1. Customer enters email and password in login modal
2. Backend validates credentials
3. Session data stored in localStorage:
   - `userType`: "Customer"
   - `userEmail`: customer email
   - `userData`: customer details
   - `authToken`: authentication token

4. **Automatic redirect to `user-dashboard.html`**

#### For Owner Login:
1. Owner enters email and password in login modal
2. Backend validates credentials
3. Session data stored in localStorage:
   - `userType`: "Hotel Owner"
   - `userEmail`: owner email
   - `userData`: owner details
   - `authToken`: authentication token
   - `adminToken`: admin authentication token

4. **Automatic redirect to `admin.html`**

### 3. Registration with OTP - Redirect Added
After successful OTP verification during registration:
- Customers → redirect to `user-dashboard.html`
- Owners → redirect to `admin.html`

### 4. Session Protection on Dashboards

#### user-dashboard.js
- Checks if user is logged in via `requireLogin()`
- Verifies user is a "Customer" via `requireUserType('Customer')`
- If either check fails → redirects to `index.html`

#### owner-dashboard.js
- Checks if user is logged in via `requireLogin()`
- Verifies user is a "Hotel Owner" via `requireUserType('Hotel Owner')`
- If either check fails → redirects to `index.html`

#### admin.html
- Checks if user has valid `adminToken`
- Uses session management from auth.js
- Protected routes automatically enforce user type

### 5. Logout Functionality

#### All Dashboards
- **Logout button** calls `logoutUser()`
- Clears all session data:
  - userType
  - userEmail
  - userData
  - authToken
  - adminToken
- Shows confirmation message
- **Redirects to `index.html`**

## File Modifications

### Modified Files:
1. **auth.js**
   - Added session management functions at top (lines 2-60)
   - Added redirect after OTP verification (line 451)

2. **user-dashboard.html**
   - Added `auth.js` script reference
   - Updated logout button onclick: `onclick="logoutUser()"`

3. **user-dashboard.js**
   - Added session checks at start of DOMContentLoaded
   - Verifies customer user type

4. **owner-dashboard.html**
   - Added `auth.js` script reference
   - Updated logout button onclick: `onclick="logoutUser()"`

5. **owner-dashboard.js**
   - Added session checks at start of DOMContentLoaded
   - Verifies owner user type

6. **admin.html**
   - Added `auth.js` script reference
   - Updated logout function to use `logoutUser()`
   - Enhanced session check logic

## User Experience Flow

### For New/Returning Customers:
```
Index.html (homepage with login button)
    ↓
Click "user" button
    ↓
Enter credentials → Submit
    ↓
Backend validates → stores session
    ↓
SUCCESS: Auto-redirect to user-dashboard.html
    ↓
Dashboard loads with customer data
    ↓
Click Logout → Redirects to index.html
```

### For Hotel Owners:
```
Index.html (homepage with login button)
    ↓
Click "Owner" button
    ↓
Enter credentials → Submit
    ↓
Backend validates → stores session
    ↓
SUCCESS: Auto-redirect to admin.html
    ↓
Admin dashboard loads with owner stats
    ↓
Click Logout → Redirects to index.html
```

## Security Features

### Session Protection:
- ✅ Non-logged-in users cannot access dashboards
- ✅ Customers cannot access owner dashboard
- ✅ Owners cannot access customer dashboard
- ✅ Logout clears all sensitive data

### Data Validation:
- ✅ Checks for required localStorage keys
- ✅ Validates user type before allowing access
- ✅ Safe JSON parsing with fallback

## Testing the Implementation

### Test Case 1: Customer Login & Redirect
1. Go to index.html
2. Click "user" button
3. Enter customer credentials
4. Verify redirect to user-dashboard.html
5. Check that customer data displays correctly

### Test Case 2: Owner Login & Redirect
1. Go to index.html
2. Click "Owner" button
3. Enter owner credentials
4. Verify redirect to admin.html
5. Check that admin stats display correctly

### Test Case 3: Session Protection
1. Clear localStorage
2. Try to access user-dashboard.html directly
3. Verify redirect to index.html with alert

### Test Case 4: Logout Flow
1. Login as customer
2. Click Logout button
3. Verify alert message
4. Verify redirect to index.html
5. Verify localStorage is cleared
6. Try to access user-dashboard.html
7. Verify it redirects to index.html

### Test Case 5: Registration + OTP Redirect
1. Go to index.html
2. Click "user" button → Register tab
3. Fill in customer details
4. Submit registration
5. Receive OTP email/phone
6. Enter OTP code
7. Verify redirect to user-dashboard.html

## Available Session Functions

### Check login status:
```javascript
if (isUserLoggedIn()) {
  console.log('User is logged in');
}
```

### Get user information:
```javascript
const userType = getCurrentUserType(); // "Customer" or "Hotel Owner"
const userEmail = getCurrentUserEmail();
const userData = getCurrentUserData(); // Full user object
```

### Force login requirement in any page:
```javascript
if (!requireLogin()) {
  return; // User was redirected
}
```

### Force specific user type:
```javascript
if (!requireUserType('Customer')) {
  return; // User was redirected
}
```

### Logout:
```javascript
logoutUser(); // Clears session and redirects
```

## Notes
- Session data is stored in localStorage (suitable for frontend-only apps)
- For production: Consider using secure HTTP-only cookies
- OTP expires after 5 minutes
- All redirects happen automatically and transparently
