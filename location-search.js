// Location-Based Search Module
const LocationSearch = {
  
  // Get user's current location using geolocation API
  getCurrentLocation: function() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lon: longitude });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  },

  // Search for hotels near user's location
  searchNearby: async function(latitude, longitude, radiusKm = 50) {
    try {
      const url = `${API_CONFIG.endpoint('/api/hotels/search-by-location')}?lat=${latitude}&lon=${longitude}&radius=${radiusKm}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Found ${data.total} hotels within ${radiusKm}km`);
        return data;
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Search by location name (city/area)
  searchByLocationName: async function(locationName, limit = 20) {
    try {
      const url = `${API_CONFIG.endpoint('/api/hotels/search-by-name')}?location=${encodeURIComponent(locationName)}&limit=${limit}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Found ${data.total} hotels in "${locationName}"`);
        return data;
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  // Display search results on map
  displayOnMap: function(hotels, userLocation) {
    if (!window.L) {
      console.warn('Leaflet.js not loaded');
      return;
    }

    // Create map container if it doesn't exist
    let mapContainer = document.getElementById('searchResultsMap');
    if (!mapContainer) {
      mapContainer = document.createElement('div');
      mapContainer.id = 'searchResultsMap';
      mapContainer.style.cssText = 'width: 100%; height: 500px; margin: 20px 0; border-radius: 8px;';
      
      const searchResults = document.getElementById('searchResults');
      if (searchResults) {
        searchResults.parentNode.insertBefore(mapContainer, searchResults.nextSibling);
      }
    }

    // Initialize map
    const map = L.map('searchResultsMap').setView(
      [userLocation.lat, userLocation.lon],
      12
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Add user location marker
    L.circleMarker(
      [userLocation.lat, userLocation.lon],
      {
        radius: 10,
        fillColor: '#3388ff',
        color: '#000',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }
    ).addTo(map).bindPopup('📍 Your Location');

    // Add hotel markers
    hotels.forEach((hotel, index) => {
      const lat = parseFloat(hotel.latitude);
      const lon = parseFloat(hotel.longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
        const marker = L.marker([lat, lon], {
          title: hotel.hostelName
        }).addTo(map);

        marker.bindPopup(`
          <div style="width: 250px; font-family: Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #333;">${hotel.hostelName}</h3>
            <p style="margin: 0 0 4px 0; font-size: 0.9em;"><strong>📍</strong> ${hotel.location}</p>
            <p style="margin: 0 0 4px 0; font-size: 0.9em;"><strong>📞</strong> ${hotel.phone}</p>
            <p style="margin: 0 0 8px 0; font-size: 0.9em; color: #e74c3c;"><strong>📏 Distance:</strong> ${hotel.distance} km</p>
            <button onclick="LocationSearch.selectHotel(${hotel.id})" style="
              background: #3388ff;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
            ">View Details</button>
          </div>
        `);
      }
    });

    return map;
  },

  // Display search results in a list
  // Fetch and display reviews for a hotel
  displayHotelReviews: async function(hotelId) {
    try {
      const url = `${API_CONFIG.endpoint('/api/hotels/' + hotelId + '/reviews')}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.reviews && data.reviews.length > 0) {
        // Return top 2 reviews
        return data.reviews.slice(0, 2);
      }
      return [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  // Fetch average rating for a hotel
  getAverageRating: async function(hotelId) {
    try {
      const url = `${API_CONFIG.endpoint('/api/hotels/' + hotelId + '/average-rating')}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        return { rating: data.averageRating, count: data.totalReviews };
      }
      return { rating: 0, count: 0 };
    } catch (error) {
      console.error('Error fetching rating:', error);
      return { rating: 0, count: 0 };
    }
  },

  // Fetch photos for a hotel
  getHotelPhotos: async function(hotelId) {
    try {
      const url = `${API_CONFIG.endpoint('/api/hotels/' + hotelId + '/photos')}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.photos && data.photos.length > 0) {
        return data.photos;
      }
      return [];
    } catch (error) {
      console.error('Error fetching photos:', error);
      return [];
    }
  },

  // Create star rating HTML
  createStarRating: function(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '⭐';
      } else if (i - rating < 1) {
        stars += '✨';
      } else {
        stars += '☆';
      }
    }
    return stars;
  },

  displayResults: function(hotels, containerId = 'searchResults') {
    const container = document.getElementById(containerId) || document.createElement('div');
    
    if (!document.getElementById(containerId)) {
      container.id = containerId;
      container.style.cssText = 'margin-top: 20px;';
      document.body.appendChild(container);
    }

    if (hotels.length === 0) {
      container.innerHTML = `
        <div style="
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: center;
          color: #666;
        ">
          <p>😔 No hotels found in this location.</p>
          <p>Try searching in a different area or increasing the search radius.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div style="
        padding: 20px 0;
        border-top: 2px solid #e0e0e0;
      ">
        <h3 style="margin: 0 0 20px 0; color: #333;">
          🏘️ Found ${hotels.length} properties nearby
        </h3>
    `;

    hotels.forEach((hotel, index) => {
      html += `
        <div style="
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        " class="hotel-card" onmouseover="this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'" onmouseout="this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="flex: 1;">
              <h4 style="margin: 0 0 8px 0; color: #333; font-size: 1.1em;">
                ${index + 1}. ${hotel.hostelName}
              </h4>
              <p style="
                margin: 0 0 6px 0;
                color: #666;
                font-size: 0.95em;
              ">
                📍 ${hotel.location}
              </p>
              <p style="
                margin: 0 0 6px 0;
                color: #666;
                font-size: 0.95em;
              ">
                📧 ${hotel.ownerEmail}
              </p>
              <p style="
                margin: 0 0 8px 0;
                color: #666;
                font-size: 0.95em;
              ">
                📞 ${hotel.phone}
              </p>
            </div>
            <div style="
              background: #e74c3c;
              color: white;
              padding: 10px 15px;
              border-radius: 6px;
              text-align: center;
              font-weight: bold;
            ">
              <div style="font-size: 1.3em;">${hotel.distance}</div>
              <div style="font-size: 0.75em; margin-top: 4px;">km away</div>
            </div>
          </div>
          
          <!-- Photos Section -->
          <div id="photos_${hotel.id}" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 0.85em; color: #999;">Loading photos...</p>
          </div>
          
          <!-- Reviews Section -->
          <div id="reviews_${hotel.id}" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 0.85em; color: #999;">Loading reviews...</p>
          </div>
          
          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
            <button onclick="LocationSearch.selectHotel(${hotel.id}, '${hotel.hostelName}')" style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
              font-size: 0.95em;
            ">
              ✅ Book Now
            </button>
            <button onclick="LocationSearch.viewHotel(${hotel.id})" style="
              background: #f0f0f0;
              color: #333;
              border: 1px solid #ddd;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
              font-size: 0.95em;
              margin-left: 8px;
            ">
              👁️ View Details
            </button>
          </div>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
    
    // Load reviews and photos asynchronously
    hotels.forEach(hotel => {
      LocationSearch.loadHotelReviews(hotel.id);
      LocationSearch.loadHotelPhotos(hotel.id);
    });
  },

  // Load and display reviews
  loadHotelReviews: async function(hotelId) {
    const ratingData = await LocationSearch.getAverageRating(hotelId);
    const reviews = await LocationSearch.displayHotelReviews(hotelId);
    
    const reviewsContainer = document.getElementById(`reviews_${hotelId}`);
    if (!reviewsContainer) return;
    
    let reviewsHtml = '';
    
    if (ratingData.rating > 0) {
      reviewsHtml += `
        <div style="margin-bottom: 12px;">
          <div style="font-size: 0.9em; font-weight: bold; color: #333;">
            ${LocationSearch.createStarRating(ratingData.rating)} ${ratingData.rating.toFixed(1)}/5 (${ratingData.count} reviews)
          </div>
        </div>
      `;
    }
    
    if (reviews.length > 0) {
      reviewsHtml += '<div style="background: #f8f9fa; padding: 12px; border-radius: 6px;">';
      reviews.forEach(review => {
        reviewsHtml += `
          <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            <div style="font-weight: bold; color: #333; font-size: 0.9em;">
              ${review.title}
            </div>
            <div style="color: #666; font-size: 0.85em; margin: 4px 0;">
              ${LocationSearch.createStarRating(review.rating)} ${review.reviewerName}
            </div>
            <div style="color: #555; font-size: 0.85em; margin-top: 4px;">
              "${review.review}"
            </div>
          </div>
        `;
      });
      reviewsHtml += '</div>';
    } else if (ratingData.rating === 0) {
      reviewsHtml = '<p style="margin: 0; color: #999; font-size: 0.85em;">No reviews yet</p>';
    }
    
    reviewsContainer.innerHTML = reviewsHtml || '<p style="margin: 0; color: #999; font-size: 0.85em;">No reviews yet</p>';
  },

  // Load and display photos
  loadHotelPhotos: async function(hotelId) {
    const photos = await LocationSearch.getHotelPhotos(hotelId);
    
    const photosContainer = document.getElementById(`photos_${hotelId}`);
    if (!photosContainer) return;
    
    if (photos.length === 0) {
      photosContainer.innerHTML = '<p style="margin: 0; color: #999; font-size: 0.85em;">No photos available</p>';
      return;
    }
    
    // Create carousel
    let photosHtml = `
      <div style="
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding: 8px 0;
        scroll-behavior: smooth;
      ">
    `;
    
    photos.slice(0, 5).forEach((photo, idx) => {
      photosHtml += `
        <div style="
          flex: 0 0 150px;
          height: 120px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #ddd;
          cursor: pointer;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          <img src="${photo.photoUrl}" alt="${photo.caption}" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          " onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22120%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22150%22 height=%22120%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22 fill=%22%23999%22%3EPhoto${idx+1}%3C/text%3E%3C/svg%3E'" />
        </div>
      `;
    });
    
    photosHtml += '</div>';
    photosContainer.innerHTML = photosHtml;
  },

  // Select and book a hotel
  selectHotel: function(hotelId, hotelName) {
    localStorage.setItem('selectedHotelId', hotelId);
    localStorage.setItem('selectedHotelName', hotelName);
    
    alert(`✅ ${hotelName} selected! Redirecting to booking...`);
    
    // Redirect to booking page or open booking modal
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) {
      bookingModal.style.display = 'block';
    } else {
      window.location.href = '#rooms';
    }
  },

  // View hotel details
  viewHotel: function(hotelId) {
    localStorage.setItem('selectedHotelId', hotelId);
    window.location.href = '#about';
    // Or display a detailed modal with hotel info
  },

  // Format distance for display
  formatDistance: function(distanceKm) {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm}km`;
  }
};

// Initialize location search when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Ensure API_CONFIG is available (with fallback)
  if (typeof API_CONFIG === 'undefined') {
    window.API_CONFIG = {
      endpoint: function(path) {
        return (window.location.origin || 'http://localhost:3000') + path;
      }
    };
  }

  // Wait a bit for all scripts to load
  setTimeout(function() {
    const locationSearchBtn = document.getElementById('locationSearchBtn');
    const currentLocationBtn = document.getElementById('currentLocationBtn');
    const locationInput = document.getElementById('locationInput');
    const radiusInput = document.getElementById('radiusInput');

    console.log('🔧 Location Search Initialized');
    console.log('Search Button:', locationSearchBtn);
    console.log('Location Button:', currentLocationBtn);
    console.log('API_CONFIG:', API_CONFIG);

    if (currentLocationBtn) {
      currentLocationBtn.addEventListener('click', async function() {
        this.textContent = '🔍 Finding your location...';
        this.disabled = true;

        try {
          const location = await LocationSearch.getCurrentLocation();
          console.log(`📍 Your location: ${location.lat}, ${location.lon}`);
          
          // Update input fields
          if (locationInput) {
            locationInput.value = `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`;
          }

          // Auto-search
          const radiusValue = radiusInput ? parseInt(radiusInput.value) || 50 : 50;
          const data = await LocationSearch.searchNearby(location.lat, location.lon, radiusValue);
          LocationSearch.displayResults(data.hotels);
          LocationSearch.displayOnMap(data.hotels, { lat: location.lat, lon: location.lon });

        } catch (error) {
          alert('❌ Error getting location:\n' + error.message);
          console.error('Location error:', error);
        } finally {
          this.textContent = '📍 Use My Location';
          this.disabled = false;
        }
      });
    } else {
      console.warn('⚠️ Current location button not found');
    }

    if (locationSearchBtn) {
      locationSearchBtn.addEventListener('click', async function() {
        const searchValue = locationInput ? locationInput.value : '';
        
        if (!searchValue) {
          alert('Please enter a location or use "My Location" option');
          return;
        }

        this.textContent = '🔍 Searching...';
        this.disabled = true;

        try {
          // Check if it's a coordinate search (contains comma and numbers)
          if (searchValue.includes(',')) {
            const coords = searchValue.split(',').map(v => parseFloat(v.trim()));
            if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
              const radiusValue = radiusInput ? parseInt(radiusInput.value) || 50 : 50;
              const data = await LocationSearch.searchNearby(coords[0], coords[1], radiusValue);
              LocationSearch.displayResults(data.hotels);
              LocationSearch.displayOnMap(data.hotels, { lat: coords[0], lon: coords[1] });
              return;
            }
          }

          // Otherwise, search by location name
          const data = await LocationSearch.searchByLocationName(searchValue);
          LocationSearch.displayResults(data.hotels);

        } catch (error) {
          alert('❌ Search error:\n' + error.message);
          console.error('Search error:', error);
        } finally {
          this.textContent = '🔍 Search';
          this.disabled = false;
        }
      });
    } else {
      console.warn('⚠️ Search button not found');
    }

    // Allow Enter key to trigger search
    if (locationInput) {
      locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          locationSearchBtn?.click();
        }
      });
    }
  }, 500); // 500ms delay to ensure all scripts load
});
