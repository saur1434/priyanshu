// Owner Dashboard Script
document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  if (!requireLogin()) {
    return;
  }
  
  // Check if user is an owner (not a customer)
  if (!requireUserType('Hotel Owner')) {
    return;
  }
  
  loadOwnerProfile();
  loadHotelPhotos();
  loadBookingsReceived();
  loadPaymentsReceived();
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

// Load owner profile
function loadOwnerProfile() {
  const ownerData = JSON.parse(localStorage.getItem('userData') || '{}');
  const ownerEmail = localStorage.getItem('userEmail');
  
  document.getElementById('hostelName').textContent = ownerData.hostelName || '-';
  document.getElementById('ownerEmail').textContent = ownerEmail || '-';
  document.getElementById('ownerPhone').textContent = ownerData.phone || '-';
  document.getElementById('hostelLocation').textContent = ownerData.location || '-';
  
  const registeredDate = ownerData.registeredAt ? new Date(ownerData.registeredAt).toLocaleDateString() : '-';
  document.getElementById('registeredAt').textContent = registeredDate;
  
  const status = ownerData.isApproved ? '✅ Approved' : '⏳ Pending Approval';
  document.getElementById('approvalStatus').textContent = status;
}

// Handle photo upload
async function handlePhotoUpload(event) {
  const files = Array.from(event.target.files);
  
  if (files.length === 0) {
    alert('Please select at least one photo');
    return;
  }

  // Check file types
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const invalidFiles = files.filter(f => !validTypes.includes(f.type));
  
  if (invalidFiles.length > 0) {
    alert('❌ Please upload only image files (JPG, PNG, GIF, WebP)');
    return;
  }

  // Check file sizes (max 5MB per file)
  const largeFiles = files.filter(f => f.size > 5 * 1024 * 1024);
  if (largeFiles.length > 0) {
    alert('❌ Each photo must be less than 5MB');
    return;
  }

  // Upload photos
  const ownerEmail = localStorage.getItem('userEmail');
  
  for (let file of files) {
    const formData = new FormData();
    formData.append('email', ownerEmail);
    formData.append('photo', file);
    
    try {
      const endpoint = window.API_CONFIG ? window.API_CONFIG.endpoint('/api/owner/upload-photo') : '/api/owner/upload-photo';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Upload failed:', data.message);
      }
    } catch (error) {
      console.error('Photo upload error:', error);
    }
  }

  alert('✅ Photos uploaded successfully!');
  
  // Clear input
  event.target.value = '';
  
  // Reload gallery
  loadHotelPhotos();
}

// Load hotel photos
async function loadHotelPhotos() {
  try {
    const ownerEmail = localStorage.getItem('userEmail');
    const endpoint = window.API_CONFIG ? window.API_CONFIG.endpoint(`/api/owner/photos?email=${ownerEmail}`) : `/api/owner/photos?email=${ownerEmail}`;
    
    const response = await fetch(endpoint);
    const data = await response.json();
    
    const photoGallery = document.getElementById('photoGallery');
    
    if (data.success && data.photos && data.photos.length > 0) {
      photoGallery.innerHTML = data.photos.map(photo => `
        <div class="photo-item">
          <img src="${photo.url}" alt="Hotel Photo">
          <div class="photo-overlay">
            <button class="photo-btn" onclick="deletePhoto('${photo.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `).join('');
    } else {
      photoGallery.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #999;">
          <i class="fas fa-image" style="font-size: 60px; margin-bottom: 10px; display: block; opacity: 0.5;"></i>
          <p>No photos uploaded yet. Start by uploading your first hotel photo!</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading photos:', error);
  }
}

// Delete photo
async function deletePhoto(photoId) {
  const confirmDelete = confirm('Are you sure you want to delete this photo?');
  
  if (!confirmDelete) return;
  
  try {
    const endpoint = window.API_CONFIG ? window.API_CONFIG.endpoint(`/api/owner/delete-photo/${photoId}`) : `/api/owner/delete-photo/${photoId}`;
    
    const response = await fetch(endpoint, { method: 'DELETE' });
    const data = await response.json();
    
    if (data.success) {
      alert('✅ Photo deleted successfully!');
      loadHotelPhotos();
    } else {
      alert('❌ Failed to delete photo: ' + data.message);
    }
  } catch (error) {
    console.error('Photo delete error:', error);
    alert('❌ Error deleting photo');
  }
}

// Load bookings received
async function loadBookingsReceived() {
  try {
    const ownerEmail = localStorage.getItem('userEmail');
    const endpoint = window.API_CONFIG ? window.API_CONFIG.endpoint(`/api/owner/bookings?email=${ownerEmail}`) : `/api/owner/bookings?email=${ownerEmail}`;
    
    const response = await fetch(endpoint);
    const data = await response.json();
    
    const bookingBody = document.getElementById('bookingBody');
    
    if (data.success && data.bookings && data.bookings.length > 0) {
      bookingBody.innerHTML = data.bookings.map(booking => `
        <tr>
          <td>${booking.customerName || 'Customer'}</td>
          <td>${new Date(booking.checkIn).toLocaleDateString()}</td>
          <td>${new Date(booking.checkOut).toLocaleDateString()}</td>
          <td>${booking.rooms || 1}</td>
          <td>${booking.customerPhone || 'N/A'}</td>
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
          <td colspan="6" style="text-align: center; color: #999;">No bookings received yet</td>
        </tr>
      `;
    }
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
}

// Load payments received
async function loadPaymentsReceived() {
  try {
    const ownerEmail = localStorage.getItem('userEmail');
    const endpoint = window.API_CONFIG ? window.API_CONFIG.endpoint(`/api/owner/payments?email=${ownerEmail}`) : `/api/owner/payments?email=${ownerEmail}`;
    
    const response = await fetch(endpoint);
    const data = await response.json();
    
    const paymentBody = document.getElementById('paymentBody');
    
    if (data.success && data.payments && data.payments.length > 0) {
      paymentBody.innerHTML = data.payments.map(payment => `
        <tr>
          <td>${payment.id || 'N/A'}</td>
          <td>${payment.customerName || 'N/A'}</td>
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
          <td colspan="6" style="text-align: center; color: #999;">No payments received yet</td>
        </tr>
      `;
    }
  } catch (error) {
    console.error('Error loading payments:', error);
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
