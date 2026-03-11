# 🧪 Location Search - Testing Guide

## ✅ Quick Test Steps

### Step 1: Start the Server
```bash
npm start
```
You should see:
```
🌐 GoCabn Go API Server running on http://localhost:3000
```

### Step 2: Test API Endpoints

#### Option A: Use Test Page (Easiest)
1. Open: **http://localhost:3000/test-location-search.html**
2. Click test buttons to verify APIs work
3. Check console for logs

#### Option B: Manual API Test

**Test 1: Search by Coordinates**
```
URL: http://localhost:3000/api/hotels/search-by-location?lat=28.7041&lon=77.1025&radius=50
Expected: JSON with hotels in Delhi area
```

**Test 2: Search by City Name**
```
URL: http://localhost:3000/api/hotels/search-by-name?location=Mumbai
Expected: JSON with Mumbai hotels
```

**Test 3: Search Patna**
```
URL: http://localhost:3000/api/hotels/search-by-name?location=Patna
Expected: 2 hotels in Patna
```

### Step 3: Test on Main Website

1. Open: **http://localhost:3000**
2. Scroll to **"🗺️ Find Rooms Near You"** section (purple banner)
3. Try these:
   - **Type "Mumbai"** and click Search
   - **Type "Delhi"** and click Search
   - **Click "Use My Current Location"** (allow GPS access)

### Step 4: Check Browser Console for Logs

**Open DevTools** (F12) and check Console tab:

**Expected Logs:**
```
🔧 Location Search Initialized
Search Button: <button>...</button>
Location Button: <button>...</button>
API_CONFIG: { endpoint: f }
✅ Found 2 hotels within 50km
```

---

## ❌ Troubleshooting

### Issue 1: API Returns Empty List

**Check:**
1. Is server running? (Check console)
2. Do owners have `isApproved: true` and location data?
   ```
   Check: /data/owners.json
   ```
3. Test URL directly: http://localhost:3000/api/hotels/search-by-location?lat=25.5941&lon=85.1376&radius=50

### Issue 2: Buttons Don't Work

**Check:**
1. Open F12 → Console tab
2. Look for error messages
3. Type in console: `LocationSearch` (should show object)
4. Type: `document.getElementById('locationSearchBtn')` (should show button element)

### Issue 3: "Geolocation not supported"

**Solution:**
- Use HTTPS (geolocation requires secure context)
- Or type city names instead of using GPS
- Try different browser

### Issue 4: Map Not Showing

**Check:**
1. Are results actually loading? (Check list)
2. Is Leaflet.js loaded?
3. Open Console and verify no JS errors
4. Try refreshing the page

---

## 📊 Expected Results

### Search Results for "Patna"
- Should return 2 properties:
  - Patna Heritage Resort (25.5941°N, 85.1376°E)
  - Bamboo Cottage Patna (25.5895°N, 85.1446°E)

### Search Results for "Mumbai"  
- Should return 1 property:
  - Mumbai Beach Resort (19.0760°N, 72.8777°E)

### Search Results for Delhi Coordinates (28.7041, 77.1025)
- Should return 1 property within 50km:
  - Delhi Luxury Villas

---

## 🔍 Server Console Logs

When using location search, server console should show:

```
🔍 [LOCATION SEARCH] Received: lat=28.7041, lon=77.1025, radius=50
📊 Total owners in database: 8
✅ Approved owners with coordinates: 8
📍 Found 1 hotels within 50km

🔍 [CITY SEARCH] Searching for: Mumbai
📍 Found 1 hotels matching "Mumbai"
```

---

## 💡 Quick Fixes

### If Nothing Works:
1. **Restart server**: Kill and run `npm start` again
2. **Clear browser cache**: Ctrl + Shift + Delete
3. **Hard refresh**: Ctrl + Shift + R
4. **Check localhost**: Try http://127.0.0.1:3000 instead

### Check if API is responding:
```powershell
# In PowerShell
$url = "http://localhost:3000/api/hotels/search-by-name?location=Patna"
Invoke-WebRequest -Uri $url | Select-Object -ExpandProperty Content
```

### Check owners data:
```powershell
Get-Content .\data\owners.json | ConvertFrom-Json | Select-Object -First 2
```

---

## 📋 Verification Checklist

- [ ] Server running on port 3000
- [ ] Test page loads: http://localhost:3000/test-location-search.html
- [ ] API test buttons work (show results)
- [ ] Main site loads: http://localhost:3000
- [ ] Location search section visible (purple banner)
- [ ] Search by city name works
- [ ] Map displays when searching
- [ ] GPS button works (if HTTPS or localhost)

---

## 🎯 Next Steps if All Works

1. Test on mobile device
2. Test with different coordinates
3. Test with different search radii (10km, 100km, 200km)
4. Add more properties to owners.json
5. Deploy to Render

---

**Last Updated**: March 11, 2026
