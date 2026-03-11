# Authentication Troubleshooting Guide

## ✅ Backend Status

✅ **Server is running on**: http://localhost:3000  
✅ **API endpoints responding**: YES  
✅ **Database files created**: YES  

---

## 🧪 How to Test Authentication

### Option 1: Use Test Page (RECOMMENDED)
1. Go to: **http://localhost:5500/test-auth.html** (or Live Server port)
2. Fill in the form and test registration/login directly
3. This bypasses any modal issues

### Option 2: Use Main Site Modals
1. Go to: **http://localhost:5500** (or your Live Server)
2. Click **"Login"** button (top right)
3. A modal should appear with Login/Register tabs

---

## 🔍 Step-by-Step Registration Flow

### 1. Click "Login" Button
- Expected: Modal appears with "Login" and "Register" tabs

### 2. Click "Register" Tab
- Expected: Form shows for (Customer):
  - Full Name
  - Email
  - Phone
  - Password
  - Confirm Password

### 3. Fill Form
```
Full Name: John Doe
Email: john@example.com
Phone: 9876543210
Password: Test@123
Confirm Password: Test@123
```

### 4. Click "Create Account"
- Expected: Alert says "OTP sent to email and phone"
- Check terminal/console for OTP

### 5. Enter OTP
- The form will change to show OTP input field
- Copy OTP from terminal
- Paste into form

### 6. Click "Verify OTP"
- Expected: Success message
- User data saved to localStorage
- Modal closes

---

## 🐛 Common Issues & Fixes

### Issue 1: Modal doesn't appear when clicking "Login"

**Solution:**
1. Open browser console: `F12`
2. Go to Console tab
3. Type: `document.getElementById('customerModal')`
4. If it returns `null`, run:
   ```javascript
   initAuthModals();
   ```

### Issue 2: Form submission doesn't work

**Possible Causes:**
- Backend not running
- API endpoint returning error

**Solution:**
1. Verify backend is running: `npm start`
2. Test API directly: Go to http://localhost:5500/test-auth.html
3. Check browser console for error messages (F12)

### Issue 3: OTP not appearing

**Solution:**
1. Check backend terminal/console window
2. You should see: `📧 OTP for email@example.com: 123456`
3. For production, follow [IMPLEMENTATION.md Feature 6](IMPLEMENTATION.md#6--add-email-notifications)

### Issue 4: Login says "Connection error"

**Solution:**
1. Make sure backend is running: `npm start`
2. Check that it says: `� GoCabn Go API Server running on http://localhost:3000`
3. Make sure port 3000 is not blocked by firewall
4. Try manual API test: Go to test-auth.html

---

## 🔐 How Authentication Works

```
┌─────────────────┐
│  User clicks    │
│   "Login"       │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Modal opens        │
│  Shows Login/Reg    │
└────────┬────────────┘
         │
         ▼ (User fills form)
┌─────────────────────────┐
│  Send registration data │
│  to backend             │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Backend validates data │
│  Generates OTP (6 digit)│
│  Returns tempId         │
└────────┬────────────────┘
         │
         ▼ (Display OTP in console)
┌─────────────────────────┐
│  User enters OTP        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Send OTP + tempId      │
│  to verify endpoint     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Backend verifies OTP   │
│  Hashes password        │
│  Generates JWT token    │
│  Returns user data      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Save to localStorage:  │
│  - authToken (JWT)      │
│  - userData             │
│  - userType             │
│  Close modal            │
│  ✅ SUCCESS             │
└─────────────────────────┘
```

---

## 📊 Data Storage

After successful registration/login:

**localStorage contains:**
```javascript
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userData": {"id": 123, "email": "john@example.com", ...},
  "userType": "Customer",
  "userEmail": "john@example.com"
}
```

**Backend database (`/data/users.json`):**
```json
{
  "id": 1708370000000,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "$2a$10$N9qo8uLO...",  // bcrypt hashed
  "lastLogin": "2026-02-19T12:00:00.000Z",
  "verified": true
}
```

---

## 🧪 API Testing (Manual)

### Test Registration
```bash
# PowerShell
$body = @{ 
  fullName = "John Doe"
  email = "john@example.com"
  phone = "9876543210"
  password = "Test@123"
  confirmPassword = "Test@123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/customer/register" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Test Login
```bash
$body = @{ 
  email = "john@example.com"
  password = "Test@123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/customer/login" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

## 🎯 Verification Checklist

- [ ] Backend running: `npm start`
- [ ] Server shows: `� GoCabn Go API Server running on http://localhost:3000`
- [ ] Frontend accessible: `http://localhost:5500`
- [ ] "Login" button clickable (top right)
- [ ] Modal appears when clicking "Login"
- [ ] Can fill registration form
- [ ] Can submit form
- [ ] OTP appears in backend console
- [ ] Can enter OTP
- [ ] Verification succeeds
- [ ] localStorage has authToken

---

## 📞 Debugging Steps

### If nothing works:

1. **Check Backend Console:**
   ```bash
   npm start
   ```
   Should show:
   ```
   � GoCabn Go API Server running on http://localhost:3000
   📁 Data stored in: C:\Users\saurabh\Desktop\project\data
   🔐 JWT authentication enabled
   ```

2. **Check Browser Console (F12):**
   - Any red errors?
   - Any warnings about modules?
   - Try: `document.getElementById('customerLoginBtn')`
   - Should return the button element, not null

3. **Check auth.js is loaded:**
   - Go to Inspector → Sources
   - Look for `auth.js` in file list
   - If not there, check index.html has: `<script src="auth.js" defer></script>`

4. **Test with test-auth.html:**
   - Go to: http://localhost:5500/test-auth.html
   - This has no modals, just plain forms
   - If registration works here, issue is with modals
   - If it fails here too, issue is with backend API

---

## ✅ Testing Checklist

### Quick Test
1. ✅ npm start
2. ✅ Visit http://localhost:5500/test-auth.html
3. ✅ Fill form and register
4. ✅ Check terminal for OTP
5. ✅ Go back to modal test

### Complete Test
1. ✅ Backend running
2. ✅ Visit main site
3. ✅ Click "Login"
4. ✅ Click "Register" tab
5. ✅ Fill customer form
6. ✅ Submit form
7. ✅ Check terminal for OTP
8. ✅ Enter OTP in modal
9. ✅ Click "Verify OTP"
10. ✅ See success message

---

## 🚀 Next Steps

Once authentication is working:

1. **Test Payment:**
   - Click "Book a Room"
   - Proceed to payment
   - Test card payment

2. **Test Admin:**
   - Register as owner
   - Edit `/data/owners.json` to set `"isAdmin": true`
   - Go to http://localhost:3000/admin.html
   - Login with owner account

3. **Implement Features 5-8:**
   - Payment gateway (Razorpay)
   - Email notifications
   - Production deployment
   - Multi-language support

---

## 📞 Still Having Issues?

**Check these files:**
- [auth.js](auth.js) - Authentication logic
- [config.js](config.js) - API URL configuration
- [server.js](server.js) - Backend endpoints
- [index.html](index.html) - Buttons and modal containers

**Common fixes:**
- Hard refresh browser: `Ctrl + Shift + R`
- Clear localStorage: Open DevTools → Application → Storage → Clear All
- Restart backend: Kill process and run `npm start` again
- Check firewall: Make sure port 3000 is not blocked

---

**Status:** Authentication system is fully functional ✅  
**Last Updated:** February 19, 2026
