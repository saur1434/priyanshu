# Reviews & Photos Feature Guide

## Overview
This guide explains the reviews and photos system added to GoCabn Go's hotel search functionality. When users search for available rooms near their location, they now see hotel reviews and photos to help make informed booking decisions.

## Features

### 1. **Hotel Reviews**
- Display average rating (1-5 stars) with review count
- Show top 2 most recent reviews for each hotel
- Display reviewer name, rating, review title, and review text
- Reviews are sorted newest first

### 2. **Hotel Photos**
- Photo gallery/carousel for each hotel
- Display up to 5 photos per hotel
- Hover effect (scale up) for interactivity
- Fallback to placeholder if image fails to load

### 3. **Average Rating**
- Calculate and display average rating from all reviews
- Show total review count
- Visual star display (⭐ for full stars, ✨ for half, ☆ for empty)

## API Endpoints

### Get Hotel Reviews
```
GET /api/hotels/:hotelId/reviews
```
**Response:**
```json
{
  "success": true,
  "reviews": [
    {
      "id": 1,
      "hotelId": 1771564508824,
      "hotelName": "Patna Heritage Resort",
      "reviewerName": "Rajesh Kumar",
      "rating": 5,
      "title": "Excellent Stay!",
      "review": "Great location, clean rooms, and friendly staff.",
      "createdAt": "2026-03-05T10:30:00.000Z"
    }
  ],
  "total": 2
}
```

### Get Hotel Photos
```
GET /api/hotels/:hotelId/photos
```
**Response:**
```json
{
  "success": true,
  "photos": [
    {
      "id": 1,
      "hotelId": 1771564508824,
      "photoUrl": "https://images.unsplash.com/...",
      "caption": "Luxurious Room View",
      "type": "room",
      "uploadedBy": "owner_patna_1"
    }
  ],
  "total": 3
}
```

### Get Average Rating
```
GET /api/hotels/:hotelId/average-rating
```
**Response:**
```json
{
  "success": true,
  "averageRating": 4.5,
  "totalReviews": 2
}
```

### Post New Review (Authenticated)
```
POST /api/hotels/:hotelId/reviews
```
**Required Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```
**Request Body:**
```json
{
  "rating": 5,
  "title": "Great Place!",
  "review": "Amazing experience with excellent service"
}
```

## Data Files

### reviews.json
Stores all hotel reviews. Schema:
```json
{
  "id": 1,
  "hotelId": 1771564508824,
  "hotelName": "Hotel Name",
  "reviewerName": "Guest Name",
  "reviewerEmail": "guest@email.com",
  "rating": 5,
  "title": "Review Title",
  "review": "Detailed review text",
  "createdAt": "2026-03-05T10:30:00.000Z"
}
```

### photos.json
Stores hotel photos. Schema:
```json
{
  "id": 1,
  "hotelId": 1771564508824,
  "hotelName": "Hotel Name",
  "photoUrl": "https://example.com/photo.jpg",
  "caption": "Photo Description",
  "type": "room|lobby|amenity",
  "uploadedBy": "owner_id"
}
```

## Sample Data
- **8 hotels** with reviews and photos
- **8+ reviews** across properties
- **14 photos** total (2-3 per hotel)
- Sample hotels: Patna, Delhi, Mumbai, Bangalore, Goa, Jaipur, Kolkata, Chennai

## Frontend Functions (location-search.js)

### Key Functions

1. **displayResults(hotels, containerId)**
   - Main function to display search results
   - Now includes async loading of reviews/photos
   - Calls `loadHotelReviews()` and `loadHotelPhotos()` for each hotel

2. **loadHotelReviews(hotelId)**
   - Fetches reviews and average rating
   - Displays star ratings and review text
   - Shows top 2 reviews in a styled card

3. **loadHotelPhotos(hotelId)**
   - Fetches photos for hotel
   - Creates horizontal scroll carousel
   - Shows 5 photos max per hotel
   - Includes hover animation effects

4. **getAverageRating(hotelId)**
   - Fetches average rating and total review count
   - Returns object: `{ rating, count }`

5. **displayHotelReviews(hotelId)**
   - Fetches and returns sorted reviews
   - Returns array of review objects
   - Sorted newest first

6. **getHotelPhotos(hotelId)**
   - Fetches all photos for hotel
   - Returns array of photo objects

7. **createStarRating(rating)**
   - Converts numeric rating to star display
   - Uses: ⭐ (full), ✨ (half), ☆ (empty)

## User Interface

### Search Result Card Structure
Each hotel card now includes:
1. Hotel name and basic info
2. Distance badge
3. **Photos carousel** (new)
4. **Reviews section with rating** (new)
   - Star rating with review count
   - Top 2 recent reviews displayed
5. Booking buttons

### Visual Elements
- Reviews in light gray box (#f8f9fa background)
- Photos in horizontal scrollable carousel
- Interactive hover effects on photos
- Loading indicators while fetching
- Fallback messages for no reviews/photos

## Testing

### Test Location Search with Reviews/Photos
1. Open `http://localhost:3000/index.html`
2. Scroll to "Find Rooms Near You" section
3. Click "Use My Current Location" or enter location manually
4. Review results now show:
   - Hotel photos carousel
   - Star ratings from reviews
   - Sample review snippets

### Test API Endpoints
```bash
# Get reviews for hotel
curl http://localhost:3000/api/hotels/1771564508824/reviews

# Get photos for hotel
curl http://localhost:3000/api/hotels/1771564508824/photos

# Get average rating
curl http://localhost:3000/api/hotels/1771564508824/average-rating
```

## Backend Integration (server.js)

New API endpoint implementations:
- `/api/hotels/:hotelId/reviews` - GET/POST
- `/api/hotels/:hotelId/photos` - GET
- `/api/hotels/:hotelId/average-rating` - GET

All endpoints:
- Return JSON success response
- Include proper error handling
- Use file system data persistence
- Support filtering by hotelId

## Future Enhancements

1. **Photo Upload**
   - Add owner photo upload functionality
   - File size/format validation
   - Image hosting/CDN integration

2. **Review Submission UI**
   - Modal form for new review submission
   - Star rating widget
   - Submit button with validation

3. **Review Moderation**
   - Admin approval system for reviews
   - Spam/abuse filtering

4. **Advanced Filtering**
   - Filter by rating range
   - Sort by rating, date, relevance

5. **Photo Categorization**
   - Filter photos by type (room, lobby, amenity)
   - Slideshow viewer interface

## Troubleshooting

### Reviews Not Showing
- Check `data/reviews.json` exists and has valid JSON
- Verify hotelIds match between owners.json and reviews.json
- Check browser console for fetch errors

### Photos Not Loading
- Verify image URLs are accessible
- Check `data/photos.json` is valid JSON
- Browser may block external images - check CORS/CSP headers

### Missing Rating
- Ensure reviews exist for the hotel
- Check averageRating calculation at `/api/hotels/:hotelId/average-rating`

## Summary
The reviews and photos system enhances the hotel search experience by displaying:
- ✅ Customer reviews with ratings
- ✅ Property photos and galleries
- ✅ Average rating calculations
- ✅ Beautiful, responsive UI
- ✅ RESTful API endpoints
- ✅ Asynchronous data loading

This feature increases user trust and booking conversion by providing social proof and visual information about properties.
