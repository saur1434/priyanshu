# 🗺️ Location-Based Room Search Feature

## Overview

The location-based search feature allows users to find rooms and facilities near their current location or a preferred area on GoCabn Go. Users can search by:

1. **Current Location** - Using device GPS
2. **City/Area Name** - By typing location name
3. **Coordinates** - By entering latitude and longitude
4. **Search Radius** - Within a custom distance (1-200 km)

---

## Features

### 🎯 Search by Current Location
- **How it works**: Click "📍 Use My Current Location" button
- **Requirements**: Browser geolocation permission
- **Privacy**: Device location is used locally only
- **Speed**: Results load within 2-3 seconds

### 🏙️ Search by City/Area Name
- **How it works**: Type city name (e.g., "Mumbai", "Delhi", "Bangalore")
- **Fuzzy Search**: Partial matches work (e.g., "Ban" finds "Bangalore")
- **Results**: Up to 20 properties per search

### 📍 Search by Coordinates
- **Format**: `lat, lon` (e.g., `19.0760, 72.8777`)
- **Precision**: Works with coordinates up to 4 decimal places
- **Useful for**: Exact location searches

### 📏 Adjustable Search Radius
- **Range**: 1 km to 200 km
- **Default**: 50 km
- **Unit**: Kilometers (km)
- **Display**: Shows distance from user location for each property

---

## How to Use

### Step 1: Access Location Search
Scroll to the **"Find Rooms Near You"** section (purple banner with map icon)

### Step 2: Choose Search Method

#### Method A: Use Current Location
```
1. Click "📍 Use My Current Location" button
2. Allow browser to access your location
3. Results will appear automatically
```

#### Method B: Search by City Name
```
1. Type city name in the search box (e.g., "Mumbai")
2. Optionally adjust search radius
3. Click "🔍 Search" button
```

#### Method C: Search by Coordinates
```
1. Enter coordinates: "28.7041, 77.1025" (New Delhi)
2. Adjust radius if needed
3. Click "🔍 Search" button
```

### Step 3: View Results

Results display in 2 ways:

#### List View
- Shows property name, address, phone number
- Distance from your search location
- **Book Now** button for quick booking
- **View Details** button for more information

#### Map View
- Visual representation of properties
- Your location marked in blue
- Properties marked as pins
- Click pins to see property details
- Distance displayed on hover

### Step 4: Book a Property

1. Click **"✅ Book Now"** on any property
2. Property is saved as "Selected Hotel"
3. Booking form opens automatically
4. Follow standard booking process

---

## Supported Locations

Currently available properties in:

### 📍 Patna, Bihar
- Patna Heritage Resort (25.5941°N, 85.1376°E)
- Bamboo Cottage Patna (25.5895°N, 85.1446°E)

### 📍 Delhi, NCR
- Delhi Luxury Villas (28.7041°N, 77.1025°E)

### 📍 Mumbai, Maharashtra
- Mumbai Beach Resort (19.0760°N, 72.8777°E)

### 📍 Bangalore, Karnataka
- Bangalore Tech Hub Rooms (12.9716°N, 77.5946°E)

### 📍 Goa
- Goa Beach Cabins (15.2993°N, 73.8243°E)

### 📍 Jaipur, Rajasthan
- Jaipur Palace Stay (26.9124°N, 75.7873°E)

### 📍 Kolkata, West Bengal
- Kolkata River View (22.5726°N, 88.3639°E)

### 📍 Chennai, Tamil Nadu
- Chennai Coastal Retreat (13.0827°N, 80.2707°E)

---

## Search Examples

### Example 1: Find Properties in Patna (Within 10 km)
```
1. Type "Patna" in location box
2. Change radius from 50 to 10
3. Click Search
4. See: 2 properties within 10 km
```

### Example 2: Find Properties Near Mumbai (Current Location)
```
1. Click "Use My Current Location"
2. Allow location access
3. If in Mumbai: See nearby properties
4. View on map and distance
```

### Example 3: Find Properties in Specific Coordinates
```
1. Type "28.7041, 77.1025" (Delhi)
2. Keep radius 50 km
3. Click Search
4. See all properties within 50 km of Delhi
```

---

## Technical Details

### Distance Calculation
- **Method**: Haversine formula
- **Accuracy**: ±100 meters for realistic calculations
- **Unit**: Kilometers
- **Precision**: Results rounded to 1 decimal place

### Search Algorithm
```
1. Get user location (GPS, coordinates, or search)
2. Calculate distance to each property
3. Filter properties within radius
4. Sort by distance (nearest first)
5. Display results in list and map
```

### Performance
- **Search Response Time**: < 1 second
- **Map Rendering**: < 2 seconds for 20+ properties
- **Geolocation Timeout**: 10 seconds
- **Maximum Results**: 200 per search

---

## Browser Compatibility

### Desktop Browsers
✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  

### Mobile Browsers
✅ Chrome Mobile  
✅ Firefox Mobile  
✅ Safari iOS 14+  
✅ Samsung Internet  

### Requirements
- JavaScript enabled
- Geolocation API support (for location-based search)
- Modern browser (ES6 support)

---

## Privacy & Security

### Data Handling
- **User Location**: Used only for search, not stored
- **Coordinates**: Not logged or tracked
- **Session Data**: Cleared on page refresh
- **HTTPS**: Encrypted transmission

### Permissions
- **Geolocation**: Requested by browser, not stored
- **User Control**: Can deny location access
- **Alternative**: Use city names instead

---

## Troubleshooting

### Issue: "Geolocation not supported"
**Solution**: Your browser doesn't support geolocation. Try:
- Update browser to latest version
- Use a different browser
- Use city name search instead

### Issue: "Search takes too long"
**Solution**: Network or server delay. Try:
- Check internet connection
- Reduce search radius
- Try again in a moment

### Issue: "No properties found"
**Possible Reasons**:
- No approved properties in that area
- Search radius too small
- Try increasing radius to 50-100 km
- Search different city

### Issue: "Map not showing"
**Solution**: Leaflet.js may not have loaded. Try:
- Refresh the page
- Check internet connection
- Clear browser cache

### Issue: Location shows as "Unknown"
**Solution**: GPS signal weak. Try:
- Move to open area (away from buildings)
- Wait 10-15 seconds for GPS fix
- Use manual search instead

---

## Tips & Tricks

### 💡 Quick Tips
1. **Search near airports**: Enter airport coordinates for quick access
2. **Plan trips**: Search destination city before booking
3. **Compare options**: Use map view to compare multiple properties
4. **Adjust radius**: Start with 50 km, narrow down if too many results
5. **Save favorites**: Click "View Details" to check property amenities

### 🎯 Best Practices
- Allow location access for accurate results
- Search from the city you'll be staying
- Check property distance carefully
- Read property reviews before booking
- Confirm room availability for your dates

### 🚫 What Won't Work
- Searching from airplane (no GPS)
- Very far distances (>200 km) with precise radius
- Searching in remote areas (limited signal)
- Searching without internet connection

---

## API Endpoints (Backend)

### Search by Location (Latitude/Longitude)
```
GET /api/hotels/search-by-location?lat=28.7041&lon=77.1025&radius=50
```

**Parameters**:
- `lat` (required): Latitude (-90 to 90)
- `lon` (required): Longitude (-180 to 180)
- `radius` (optional): Search radius in km (default: 50)

**Response**:
```json
{
  "success": true,
  "hotels": [
    {
      "id": 1771700000000,
      "hostelName": "Delhi Luxury Villas",
      "location": "New Delhi, India",
      "distance": 2.5,
      "latitude": "28.7041",
      "longitude": "77.1025",
      "phone": "9876543210"
    }
  ],
  "total": 1,
  "searchRadius": 50
}
```

### Search by Location Name
```
GET /api/hotels/search-by-name?location=Mumbai&limit=20
```

**Parameters**:
- `location` (required): City or area name
- `limit` (optional): Maximum results (default: 20)

**Response**:
```json
{
  "success": true,
  "hotels": [
    {
      "id": 1771700000001,
      "hostelName": "Mumbai Beach Resort",
      "location": "Mumbai, Maharashtra",
      "ownerEmail": "mumbai@gocabingo.com"
    }
  ],
  "total": 1,
  "searchTerm": "Mumbai"
}
```

---

## Future Enhancements

🚀 Upcoming features:
- [ ] Filter by price range
- [ ] Filter by amenities (WiFi, Pool, etc.)
- [ ] User reviews and ratings map
- [ ] Real-time availability check
- [ ] Route optimization (multiple properties)
- [ ] Public transport access
- [ ] Traffic and commute time
- [ ] Weather for location

---

## Support

**For issues or feedback**:
- Contact: support@gocabingo.com
- Report bugs: bugs@gocabingo.com
- Suggest features: features@gocabingo.com

---

**Last Updated**: March 11, 2026  
**Version**: 1.0  
**Feature Status**: ✅ Production Ready
