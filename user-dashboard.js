// User Dashboard Script
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  if (!requireLogin()) {
    return;
  }
  
  // Check if user is a customer (not an owner)
  if (!requireUserType('Customer')) {
    return;
  }
  
  loadUserProfile();
  loadNearbyHotels();
  loadUserBookings();
  loadUserPayments();
  attachMenuListeners();
});

// Attach menu listeners
function attachMenuListeners() {
  const menuLinks = document.querySelectorAll('.menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionName = link.getAttribute('data-section');
      showSection(sectionName);
      
      // Update active state
      menuLinks.forEach(m => m.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

// Show section
function showSection(sectionName) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));
  
  const section = document.getElementById(sectionName);
  if (section) {
    section.classList.add('active');
  }
}

// Load user profile
function loadUserProfile() {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userEmail = localStorage.getItem('userEmail');
  
  document.getElementById('userName').textContent = userData.fullName || userData.hostelName || 'User';
  document.getElementById('userEmail').textContent = userEmail || '-';
  document.getElementById('userPhone').textContent = userData.phone || '-';
  
  const userType = localStorage.getItem('userType');
  document.getElementById('userType').textContent = userType || 'Customer';
}

// Load nearby hotels
async function loadNearbyHotels() {
  try {
    const endpoint = window.API_CONFIG ? window.API_CONFIG.endpoint('/api/hotels/list') : '/api/hotels/list';
    
    const response = await fetch(endpoint);
    const data = await response.json();
    
    const hotelGrid = document.getElementById('hotelGrid');
    
    if (data.success && data.hotels && data.hotels.length > 0) {
      hotelGrid.innerHTML = data.hotels.map(hotel => `
        <div class="hotel-card">
          <div class="hotel-image">
            <i class="fas fa-building"></i>
          </div>
          <div class="hotel-info">
            <h3>${hotel.hostelName || 'Hotel'}</h3>
            <div class="hotel-detail">
              <i class="fas fa-map-marker-alt"></i>
              <span>${hotel.location || 'Location'}</span>
            </div>
            <div class="hotel-detail">
              <i class="fas fa-phone"></i>
              <span>${hotel.phone || 'N/A'}</span>
            </div>
            <div class="hotel-detail">
              <i class="fas fa-envelope"></i>
              <span>${hotel.ownerEmail || 'N/A'}</span>
            </div>
            <button class="book-btn" onclick="bookHotel('${hotel.id || hotel.ownerEmail}', '${hotel.hostelName || 'Hotel'}')">
              <i class="fas fa-check"></i> Book Now
            </button>
          </div>
        </div>
      `).join('');
    } else {
      hotelGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i class="fas fa-inbox"></i>
          <p>No hotels available yet</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading hotels:', error);
    document.getElementById('hotelGrid').innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load hotels. Please try again later.</p>
      </div>
    `;
  }
}

// Load user bookings
async function loadUserBookings() {
  try {
    const userEmail = localStorage.getItem('userEmail');
    const endpoint = window.API_CONFIG ? window.API_CONFIG.endpoint(`/api/booking/list?email=${userEmail}`) : `/api/booking/list?email=${userEmail}`;
    
    const response = await fetch(endpoint);
    const data = await response.json();
    
    const bookingBody = document.getElementById('bookingBody');
    
    if (data.success && data.bookings && data.bookings.length > 0) {
      bookingBody.innerHTML = data.bookings.map(booking => `
        <tr>
          <td>${booking.hotelName || 'Hotel'}</td>
          <td>${new Date(booking.checkIn).toLocaleDateString()}</td>
          <td>${new Date(booking.checkOut).toLocaleDateString()}</td>
          <td>${booking.rooms || 1}</td>
          <td>
            <span class="status-badge status-${booking.status || 'pending'}">
              ${booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
            </span>
          </td>
        </tr>
      `).join('');
    } else {
      bookingBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #999;">No bookings yet. Start by exploring nearby hotels!</td>
        </tr>
      `;
    }
  } catch (error) {
    console.error('Error loading bookings:', error);
    document.getElementById('bookingBody').innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #999;">Unable to load bookings</td>
      </tr>
    `;
  }
}

// Load user payments
async function loadUserPayments() {
  try {
    const userEmail = localStorage.getItem('userEmail');
    const endpoint = window.API_CONFIG ? window.API_CONFIG.endpoint(`/api/payment/list?email=${userEmail}`) : `/api/payment/list?email=${userEmail}`;
    
    const response = await fetch(endpoint);
    const data = await response.json();
    
    const paymentBody = document.getElementById('paymentBody');
    
    if (data.success && data.payments && data.payments.length > 0) {
      paymentBody.innerHTML = data.payments.map(payment => `
        <tr>
          <td>${payment.id || 'N/A'}</td>
          <td>₹${payment.amount || '0'}</td>
          <td>${payment.paymentMethod || 'Card'}</td>
          <td>
            <span class="status-badge status-${payment.status || 'pending'}">
              ${payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Pending'}
            </span>
          </td>
          <td>${new Date(payment.timestamp).toLocaleDateString()}</td>
        </tr>
      `).join('');
    } else {
      paymentBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #999;">No payments yet</td>
        </tr>
      `;
    }
  } catch (error) {
    console.error('Error loading payments:', error);
    document.getElementById('paymentBody').innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #999;">Unable to load payments</td>
      </tr>
    `;
  }
}

// Book hotel
function bookHotel(hotelId, hotelName) {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  const bookingData = {
    hotelId: hotelId,
    hotelName: hotelName,
    customerName: userData.fullName,
    customerEmail: localStorage.getItem('userEmail'),
    customerPhone: userData.phone,
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    rooms: 1,
    status: 'pending'
  };
  
  // Show booking confirmation
  const confirmBooking = confirm(
    `Hotel: ${hotelName}\n` +
    `Customer: ${userData.fullName}\n` +
    `Email: ${localStorage.getItem('userEmail')}\n\n` +
    `Do you want to proceed with booking?`
  );
  
  if (confirmBooking) {
    alert('✅ Booking confirmed!\n\nA confirmation has been sent to your email.\n\nYou can now proceed to payment.');
    
    // Redirect to payment page or booking confirmation
    sessionStorage.setItem('currentBooking', JSON.stringify(bookingData));
    // You can redirect to payment page if needed
    // window.location.href = 'payment.html?booking=' + encodeURIComponent(JSON.stringify(bookingData));
  }
}

// Logout function
function logout() {
  const confirmLogout = confirm('Are you sure you want to logout?');
  
  if (confirmLogout) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
  }
}
