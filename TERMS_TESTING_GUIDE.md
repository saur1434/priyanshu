# Terms & Conditions - Quick Testing Guide

## 🚀 Testing Checklist

### Test 1: Customer Signup with T&Cs ✅
**Steps:**
1. Open http://localhost:3000/index.html
2. Scroll to bottom and locate "Sign Up Now" or similar button
3. Click on "Sign Up as Customer" button in the page
4. A modal appears with login/register tabs
5. Click "Register" tab
6. Fill in form:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Password: Test@123
   - Confirm Password: Test@123
7. **IMPORTANT:** Scroll down in the form to see T&C checkbox
8. **Try to submit WITHOUT checking the checkbox**
   - Expected: Alert says "You must agree to the Terms and Conditions to continue"
   - Expected: Form doesn't submit
9. **Click the purple "Terms & Conditions" link**
   - Expected: Full scrollable modal opens
   - Expected: Contains 14 sections of user terms
   - Expected: Close button (×) in top right
10. **Scroll through the modal** to see all sections
11. **Close the modal** by clicking × button
12. **Now click the checkbox** to agree
13. **Click "Create Account"**
    - Expected: OTP verification screen appears
    - Expected: Registration continues normally

### Test 2: Owner/Hostel Signup with T&Cs ✅
**Steps:**
1. Open http://localhost:3000/index.html
2. Look for "Register as Hotel Owner" or similar button
3. Click to open owner registration modal
4. Click "Register" tab
5. Fill in form:
   - Hostel Name: My Awesome Hostel
   - Owner Email: owner@example.com
   - Phone: 9876543210
   - Location: Mumbai, India
   - Password: Test@123
   - Confirm Password: Test@123
6. **Scroll down to see T&C checkboxes**
7. **You should see TWO links:**
   - "Terms & Conditions"
   - "Cabin Design Policy"
8. **Try to submit WITHOUT checking**
   - Expected: Alert appears
9. **Click "Terms & Conditions" link**
   - Expected: Modal opens with OWNER SPECIFIC terms (16 sections)
10. **Close modal and click "Cabin Design Policy" link**
    - Expected: Same modal but with BOTH owner terms AND cabin policy (9 additional sections)
    - Expected: Total ~25 sections in modal
11. **Scroll through to verify cabin design requirements**
    - Look for "No Fully Lockable Cabins" section
    - Look for "Semi-Private Cabin Design Requirement" section
12. **Close modal and check the checkbox**
13. **Click "Register Hostel"**
    - Expected: Proceeds to OTP verification

### Test 3: View T&Cs in User Dashboard ✅
**Steps:**
1. Complete customer signup from Test 1
2. After OTP verification, you should be logged in
3. You should see user-dashboard.html OR go to it directly
4. **In the left sidebar, look for "Terms & Conditions" menu item**
   - Should have 📄 icon
   - Should be last menu item
5. **Click on it**
   - Expected: Main content area changes to show Terms section
6. **Verify you can see:**
   - Introduction paragraph
   - "📄 View Full Terms & Conditions" button
   - "Key Points:" section with 5 bullet points
7. **Scroll down to see all key points**
8. **Click "View Full Terms & Conditions" button**
   - Expected: Full modal opens with all 14 user terms
9. **Scroll through modal**
   - Expected: Can see all sections
   - Expected: Professional styling with proper headings
10. **Close modal**
    - Click × button
11. **Go back to other dashboard sections**
    - Click Profile, Find Hotels, etc.
    - T&C section should still be accessible

### Test 4: View T&Cs in Owner Dashboard ✅
**Steps:**
1. Complete owner signup from Test 2
2. After OTP verification, you should be logged in to owner dashboard
3. **In the left sidebar (RED theme), find "Terms & Conditions"**
4. **Click on it**
   - Expected: Shows comprehensive compliance section
5. **Verify you can see:**
   - Introduction about compliance
   - "📄 View Full Terms & Compliance Policy" button
   - "Critical Compliance Requirements:" with 6 items
   - RED warning banner at bottom
6. **Read critical requirements:**
   - Legal compliance (licenses, FSSAI, GST)
   - Cabin design policy
   - Accurate information
   - Customer service
   - No illegal activity
   - Content licensing
7. **Click "View Full Terms & Compliance Policy" button**
   - Expected: Modal opens with BOTH:
     - 16 Owner-specific terms
     - 9 Cabin design requirements
   - Expected: Total ~25 sections
8. **Scroll to find these key sections:**
   - "No Fully Lockable Cabins Policy"
   - "Semi-Private Cabin Design Requirement"
   - Check the "Acceptable cabin designs include:" list
9. **Close modal and verify warning banner text**
10. **Navigate to other sections** to confirm T&C remains accessible

### Test 5: Modal Functionality ✅
**Steps:**
1. From any dashboard, click T&C view button
2. Modal opens - **Try these actions:**

**Action: Scroll**
- Expected: Smooth scrolling through all sections
- Max height should be ~90% of viewport
- No content should be cut off

**Action: Click outside modal**
- Expected: Nothing happens (modal stays open)

**Action: Click Close (×) button**
- Expected: Modal disappears smoothly
- Expected: Return to previous view

**Action: Open modal again**
- Expected: Opens to top of content (scroll position reset)

**Action: Test on mobile**
- Expected: Modal scales to 90% width
- Expected: Takes up reasonable screen space
- Expected: Still scrollable and readable
- Expected: Text doesn't become too small

### Test 6: Responsive Design ✅
**Steps:**
1. Open browser Developer Tools (F12)
2. Click Device Toolbar to enable mobile view
3. Test on different screen sizes:
   - iPhone 12 (390px)
   - iPad (768px)
   - Desktop (1920px)

**For each size:**
- [ ] Checkbox is visible and clickable
- [ ] T&C link text is readable
- [ ] Modal opens properly
- [ ] Modal content is scrollable
- [ ] Buttons are tappable (>44px recommended)
- [ ] No horizontal scrolling
- [ ] Text is readable without zoom

### Test 7: Error Handling ✅
**Steps:**
1. Open browser console (F12 → Console tab)
2. Look for any red error messages
3. **Expected:** No errors related to:
   - terms-conditions.js
   - displayTermsModal
   - validateTermsAgreement
   - undefined variables

**If you see errors:**
- [ ] Verify terms-conditions.js loaded (Network tab)
- [ ] Check script load order (auth.js after terms-conditions.js)
- [ ] Hard refresh page (Ctrl+Shift+R)

### Test 8: Cross-Browser Testing ✅
**Test in:**
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

**For each browser:**
- [ ] Modal opens correctly
- [ ] Text displays properly (no encoding issues)
- [ ] Scrolling works smoothly
- [ ] Checkboxes function
- [ ] Close button works
- [ ] Colors display correctly

## 🎯 What Should Work

✅ **Signup Flow:**
- Cannot register without T&C agreement
- Clear error message if not checked
- T&C links open proper modals
- Different modals for users vs owners

✅ **Dashboard Access:**
- T&Cs visible in sidebar
- Dedicated section shows summary
- "View Full" button opens complete T&Cs
- Can switch between dashboard sections

✅ **Modal Display:**
- Fullscreen overlay appears
- All sections visible and readable
- Scrollable content
- Professional styling
- Close button works

✅ **Content Quality:**
- User T&Cs: 14 sections covering all requirements
- Owner T&Cs: 16 sections + 9 cabin policy sections
- Indian law compliance
- Clear language
- Proper organization

## 🚨 Known Limitations (Expected Behavior)

⚠️ **Stored Temporarily:**
- T&C acceptance not currently saved to database
- Acceptance resets on new browser/device
- **Future:** Will add database storage

⚠️ **Agreement Validation:**
- Client-side only (for now)
- No backend verification
- **Future:** Will add server-side validation

⚠️ **PDF Export:**
- Not implemented yet
- Users can print modal manually (Ctrl+P)
- **Future:** Add "Print as PDF" button

## 📋 Verification Checklist

Use this to verify everything works:

```
SIGNUP TESTS:
[ ] Customer can't signup without T&C checkbox
[ ] Customer sees clear error message
[ ] Customer can click T&C link to view terms
[ ] Customer can read full 14-section T&Cs
[ ] Customer can close modal and return to form
[ ] Customer can check box and complete signup

OWNER TESTS:
[ ] Owner can't signup without T&C checkbox
[ ] Owner sees two clickable links (Terms + Cabin)
[ ] Owner can view both complete term sections
[ ] Owner can see cabin design requirements
[ ] Owner can complete signup after agreement
[ ] Owner sees all 25 sections when clicking links

DASHBOARD TESTS:
[ ] User dashboard has T&C menu item
[ ] User can view T&C section with summary
[ ] User can click to view full 14 terms
[ ] Owner dashboard has T&C menu item (RED theme)
[ ] Owner can view compliance section with 6 requirements
[ ] Owner can view full 25 sections (terms + cabin policy)
[ ] Modal close button works on all pages

DISPLAY TESTS:
[ ] Text is readable on all screen sizes
[ ] Modal properly sized on mobile
[ ] Modal properly sized on desktop
[ ] Checkbox is easily clickable
[ ] Links are visually distinct (purple color)
[ ] Color themes match (blue for users, red for owners)
[ ] Warning banner shows for owners

TECHNICAL TESTS:
[ ] No console errors
[ ] terms-conditions.js is loaded
[ ] displayTermsModal() function exists
[ ] Modal appears/disappears smoothly
[ ] Scrolling works in modal
[ ] Works in multiple browsers
```

## 💡 Pro Tips for Testing

1. **Test actual signup:**
   - Use different email addresses each time
   - Test both customer and owner paths

2. **Check console:**
   - Open F12 → Console tab
   - Should see no red errors
   - May see normal info logs

3. **Test on phone:**
   - Use browser DevTools mobile emulation
   - Or use actual phone/tablet
   - Verify touch interactions work

4. **Test both paths:**
   - Customer path: Blue theme, 14 T&Cs
   - Owner path: Red theme, 25 sections total

5. **Leave browser open:**
   - Sign up → Check dashboard → Verify T&Cs
   - Don't close and reopen (tests session persistence)

## 📞 Support

**If tests fail:**

1. **Check console for errors** (F12)
2. **Verify terms-conditions.js exists** in project root
3. **Hard refresh page** (Ctrl+Shift+R)
4. **Restart server** (npm start)
5. **Review TERMS_CONDITIONS_GUIDE.md** for detailed info
6. **Review TERMS_IMPLEMENTATION_SUMMARY.md** for technical details

---

**Happy Testing! 🎉**

All features should work smoothly. Report any issues found during testing.
