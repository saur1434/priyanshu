// Login & Registration system for hotel owners and customers
(function () {
  // ============================================
  // SESSION MANAGEMENT FUNCTIONS
  // ============================================
  
  // Check if user is logged in
  window.isUserLoggedIn = function() {
    return localStorage.getItem('userEmail') && localStorage.getItem('userType') && localStorage.getItem('userData');
  };
  
  // Get current logged in user type
  window.getCurrentUserType = function() {
    return localStorage.getItem('userType');
  };
  
  // Get current logged in user email
  window.getCurrentUserEmail = function() {
    return localStorage.getItem('userEmail');
  };
  
  // Get current logged in user data
  window.getCurrentUserData = function() {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch (e) {
      return {};
    }
  };
  
  // Logout function - clear session and redirect
  window.logoutUser = function() {
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminToken');
    alert('You have been logged out successfully');
    window.location.href = 'index.html';
  };
  
  // Require login - redirect to index if not logged in
  window.requireLogin = function() {
    if (!isUserLoggedIn()) {
      alert('Please log in first');
      window.location.href = 'index.html';
      return false;
    }
    return true;
  };
  
  // Require specific user type (owner or customer)
  window.requireUserType = function(requiredType) {
    const currentType = getCurrentUserType();
    if (currentType !== requiredType) {
      alert(`Access denied. This page is for ${requiredType}s only.`);
      window.location.href = 'index.html';
      return false;
    }
    return true;
  };

  // Initialize modals on DOM ready
  function initAuthModals() {
    // Create modals if not already present
    if (!document.getElementById('adminModal')) {
      createAdminModal();
    }
    if (!document.getElementById('ownerModal')) {
      createOwnerModal();
    }
    if (!document.getElementById('customerModal')) {
      createCustomerModal();
    }

    // Attach button event listeners
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const ownerLoginBtn = document.getElementById('ownerLoginBtn');
    const customerLoginBtn = document.getElementById('customerLoginBtn');

    if (adminLoginBtn) {
      adminLoginBtn.addEventListener('click', () => openModal('adminModal'));
    }
    if (ownerLoginBtn) {
      ownerLoginBtn.addEventListener('click', () => openModal('ownerModal'));
    }
    if (customerLoginBtn) {
      customerLoginBtn.addEventListener('click', () => openModal('customerModal'));
    }
  }

  // Try immediate initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthModals);
  } else {
    // Page already loaded, initialize immediately
    setTimeout(initAuthModals, 100);
  }

  // Also initialize when page fully loads
  window.addEventListener('load', initAuthModals);

  function createAdminModal() {
    const html = `
      <div id="adminModal" class="auth-modal">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <div class="modal-header">
            <h2>Admin Dashboard</h2>
            <p>Super Admin Login</p>
          </div>

          <!-- Admin Login Form -->
          <div id="admin-login" class="tab-content active">
            <form id="adminLoginForm">
              <div class="form-group">
                <label>Admin Email</label>
                <input type="email" name="adminEmail" placeholder="admin@example.com" required>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Enter password" required>
              </div>
              <button type="submit" class="btn-submit">Login as Admin</button>
            </form>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    attachAdminModalListeners('adminModal', 'adminLoginForm');
  }

  function createOwnerModal() {
    const html = `
      <div id="ownerModal" class="auth-modal">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <div class="modal-header">
            <h2>Hotel Owner Portal</h2>
            <p>Register or login your hostel</p>
          </div>
          <div class="auth-tabs">
            <button type="button" class="tab-btn active" data-tab="owner-login">Login</button>
            <button type="button" class="tab-btn" data-tab="owner-register">Register</button>
          </div>

          <!-- Login Tab -->
          <div id="owner-login" class="tab-content active">
            <form id="ownerLoginForm">
              <div class="form-group">
                <label>Email</label>
                <input type="email" name="ownerEmail" placeholder="your@hostel.com" required>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Enter password" required>
              </div>
              <button type="submit" class="btn-submit">Login</button>
            </form>
          </div>

          <!-- Register Tab -->
          <div id="owner-register" class="tab-content">
            <form id="ownerRegisterForm">
              <div id="ownerRegisterFields">
                <div class="form-group">
                  <label>Hostel Name</label>
                  <input type="text" name="hostelName" placeholder="Your hostel name" required>
                </div>
                <div class="form-group">
                  <label>Owner Email</label>
                  <input type="email" name="ownerEmail" placeholder="your@email.com" required>
                  <small class="form-error" style="display:none;color:#e74c3c;"></small>
                </div>
                <div class="form-group">
                  <label>Phone (10-15 digits)</label>
                  <input type="tel" name="phone" placeholder="+1 234 567 8900" required>
                  <small class="form-error" style="display:none;color:#e74c3c;"></small>
                </div>
                <div class="form-group">
                  <label>Location</label>
                  <input type="text" name="location" placeholder="City, Country" required>
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <input type="password" name="password" placeholder="Min 6 characters" required>
                </div>
                <div class="form-group">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" placeholder="Confirm password" required>
                </div>
                <div class="form-checkbox" style="background: #f8f9fa; padding: 12px; border-radius: 6px; margin: 15px 0;">
                  <input type="checkbox" id="ownerTermsCheckbox" name="agreeTerms" required>
                  <label for="ownerTermsCheckbox" style="margin: 0;">
                    I agree to the <span style="color: #667eea; cursor: pointer; font-weight: bold;" onclick="displayTermsModal('owner')">Terms & Conditions</span> and <span style="color: #667eea; cursor: pointer; font-weight: bold;" onclick="displayTermsModal('owner')">Cabin Design Policy</span>
                  </label>
                </div>
              </div>
              <div id="ownerOTPFields" style="display:none;">
                <div class="otp-message">
                  <p>✅ OTP sent to your email and phone</p>
                  <p>Enter the 6-digit code below</p>
                </div>
                <div class="form-group">
                  <label>Enter OTP</label>
                  <input type="text" name="otp" id="ownerOTP" placeholder="000000" maxlength="6" pattern="[0-9]{6}">
                </div>
                <small class="otp-error" style="display:none;color:#e74c3c;"></small>
              </div>
              <button type="submit" class="btn-submit" id="ownerRegisterBtn">Register Hostel</button>
            </form>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    attachModalListeners('ownerModal', 'ownerLoginForm', 'ownerRegisterForm');
  }

  function createCustomerModal() {
    const html = `
      <div id="customerModal" class="auth-modal">
        <div class="modal-content">
          <button class="modal-close">&times;</button>
          <div class="modal-header">
            <h2>Customer Account</h2>
            <p>Sign in or create a new account</p>
          </div>
          <div class="auth-tabs">
            <button type="button" class="tab-btn active" data-tab="customer-login">Login</button>
            <button type="button" class="tab-btn" data-tab="customer-register">Register</button>
          </div>

          <!-- Login Tab -->
          <div id="customer-login" class="tab-content active">
            <form id="customerLoginForm">
              <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" placeholder="your@email.com" required>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Enter password" required>
              </div>
              <div class="form-checkbox">
                <input type="checkbox" id="rememberMe" name="rememberMe">
                <label for="rememberMe">Remember me</label>
              </div>
              <button type="submit" class="btn-submit">Login</button>
            </form>
          </div>

          <!-- Register Tab -->
          <div id="customer-register" class="tab-content">
            <form id="customerRegisterForm">
              <div id="customerRegisterFields">
                <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" name="fullName" placeholder="John Doe" required>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="your@email.com" required>
                  <small class="form-error" style="display:none;color:#e74c3c;"></small>
                </div>
                <div class="form-group">
                  <label>Phone (10-15 digits)</label>
                  <input type="tel" name="phone" placeholder="+1 234 567 8900" required>
                  <small class="form-error" style="display:none;color:#e74c3c;"></small>
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <input type="password" name="password" placeholder="Min 6 characters" required>
                </div>
                <div class="form-group">
                  <label>Confirm Password</label>
                  <input type="password" name="confirmPassword" placeholder="Confirm password" required>
                </div>
                <div class="form-checkbox" style="background: #f8f9fa; padding: 12px; border-radius: 6px; margin: 15px 0;">
                  <input type="checkbox" id="customerTermsCheckbox" name="agreeTerms" required>
                  <label for="customerTermsCheckbox" style="margin: 0;">
                    I agree to the <span style="color: #667eea; cursor: pointer; font-weight: bold;" onclick="displayTermsModal('user')">Terms & Conditions</span>
                  </label>
                </div>
              </div>
              <div id="customerOTPFields" style="display:none;">
                <div class="otp-message">
                  <p>✅ OTP sent to your email and phone</p>
                  <p>Enter the 6-digit code below</p>
                </div>
                <div class="form-group">
                  <label>Enter OTP</label>
                  <input type="text" name="otp" id="customerOTP" placeholder="000000" maxlength="6" pattern="[0-9]{6}">
                </div>
                <small class="otp-error" style="display:none;color:#e74c3c;"></small>
              </div>
              <button type="submit" class="btn-submit" id="customerRegisterBtn">Create Account</button>
            </form>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    attachModalListeners('customerModal', 'customerLoginForm', 'customerRegisterForm');
  }

  function attachAdminModalListeners(modalId, loginFormId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error('Modal not found:', modalId);
      return;
    }

    console.log('Attaching listeners to admin modal:', modalId);

    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        console.log('Close button clicked');
        closeModal(modalId);
      });
    }

    // Form submissions
    const loginForm = document.getElementById(loginFormId);

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]')?.value;
        handleAdminLogin(email, modalId);
      });
    }

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('auth-modal')) {
        closeModal(modalId);
      }
    });
  }

  function attachModalListeners(modalId, loginFormId, registerFormId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error('Modal not found:', modalId);
      return;
    }

    console.log('Attaching listeners to modal:', modalId);

    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        console.log('Close button clicked');
        closeModal(modalId);
      });
    }

    // Tab switching - use delegation on the modal
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const tabId = e.target.getAttribute('data-tab');
        console.log('Tab button clicked:', tabId);
        if (tabId) {
          switchTab(modal, tabId);
        }
        return false;
      }
    });

    // Form submissions
    const loginForm = document.getElementById(loginFormId);
    const registerForm = document.getElementById(registerFormId);

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        handleLogin(email, modalId);
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = registerForm.querySelector('input[type="email"]').value;
        handleRegister(email, modalId);
      });
    }

    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('auth-modal')) {
        closeModal(modalId);
      }
    });
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  function switchTab(modal, tabId) {
    // Hide all tabs
    modal.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    // Update active button
    modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    // Show selected tab
    const tab = modal.querySelector(`#${tabId}`);
    if (tab) tab.classList.add('active');
    // Mark button active
    const btn = modal.querySelector(`[data-tab="${tabId}"]`);
    if (btn) btn.classList.add('active');
  }

  function handleAdminLogin(email, modalId) {
    // Use dedicated admin login endpoint
    const endpoint = window.API_CONFIG ? window.API_CONFIG.endpoint('/api/admin/login') : '/api/admin/login';
    const modal = document.getElementById(modalId);
    const form = document.getElementById('adminLoginForm');
    
    // Get email and password
    const emailField = form.querySelector('input[type="email"]')?.value || email;
    const passwordField = form.querySelector('input[type="password"]')?.value;
    
    if (!emailField || !passwordField) {
      alert('Email and password are required');
      return;
    }

    // Show loading state
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Loading...';
    btn.disabled = true;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailField, password: passwordField })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('userType', 'Admin');
          localStorage.setItem('userEmail', emailField);
          localStorage.setItem('userData', JSON.stringify(data.admin));
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('adminToken', data.token);
          }
          alert('Admin login successful!');
          closeModal(modalId);
          // Redirect to admin dashboard
          setTimeout(() => {
            window.location.href = 'admin.html';
          }, 500);
        } else {
          alert('Error: ' + (data.message || 'Login failed'));
        }
      })
      .catch(err => {
        console.error('Admin login error:', err);
        alert('Connection error. Is the backend running on port 3000?\n\nDetails: ' + err.message);
      })
      .finally(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      });
  }

  function handleLogin(email, modalId) {
    const userType = modalId.includes('owner') ? 'owner' : 'customer';
   const endpoint = window.API_CONFIG 
  ? window.API_CONFIG.endpoint(`/api/${userType}/login`) 
  : `https://hotelweb-1990.onrender.com/api/${userType}/login`;
    const modal = document.getElementById(modalId);
    const form = userType === 'owner' ? document.getElementById('ownerLoginForm') : document.getElementById('customerLoginForm');
    
    // Get all inputs to get email and password reliably
    const allInputs = form.querySelectorAll('input');
    const emailField = form.querySelector('input[type="email"]')?.value || email;
    const passwordField = form.querySelector('input[type="password"]')?.value;
    
    if (!emailField || !passwordField) {
      alert('Email and password are required');
      return;
    }

    // Show loading state
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Loading...';
    btn.disabled = true;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailField, password: passwordField })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('userType', userType === 'owner' ? 'Hotel Owner' : 'Customer');
          localStorage.setItem('userEmail', emailField);
          localStorage.setItem('userData', JSON.stringify(data.user || data.owner));
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            if (userType === 'owner' && data.owner?.isAdmin) {
              localStorage.setItem('adminToken', data.token);
            }
          }
          alert(`${userType === 'owner' ? 'Hotel Owner' : 'Customer'} login successful!`);
          closeModal(modalId);
          // Redirect to dashboard after login
          setTimeout(() => {
            if (userType === 'customer') {
              window.location.href = 'user-dashboard.html';
            } else {
              window.location.href = 'owner-dashboard.html';
            }
          }, 500);
        } else {
          alert('Error: ' + (data.message || 'Login failed'));
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        alert('Connection error. Is the backend running on port 3000?\n\nDetails: ' + err.message);
      })
      .finally(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      });
  }

  function handleRegister(email, modalId) {
    const userType = modalId.includes('owner') ? 'owner' : 'customer';
    const form = userType === 'owner' ? document.getElementById('ownerRegisterForm') : document.getElementById('customerRegisterForm');
    
    // Check if this is OTP verification
    if (form.dataset.tempId) {
      const otpInput = userType === 'owner' ? document.getElementById('ownerOTP') : document.getElementById('customerOTP');
      const otp = otpInput?.value;

      if (!otp || otp.length !== 6) {
        alert('Please enter a valid 6-digit OTP');
        return;
      }

      // Verify OTP
      const endpoint = window.API_CONFIG ? window.API_CONFIG.endpoint(`/api/${userType}/verify-otp`) : `/api/${userType}/verify-otp`;
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Verifying...';
      btn.disabled = true;

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempId: form.dataset.tempId, otp: parseInt(otp) })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem('userType', userType === 'owner' ? 'Hotel Owner' : 'Customer');
            localStorage.setItem('userData', JSON.stringify(data.user || data.owner));
            if (data.token) {
              localStorage.setItem('authToken', data.token);
              if (userType === 'owner' && data.owner?.isAdmin) {
                localStorage.setItem('adminToken', data.token);
              }
            }
            alert('✅ Verification successful!');
            closeModal(modalId);
            // Redirect to appropriate dashboard after OTP verification
            setTimeout(() => {
              if (userType === 'customer') {
                window.location.href = 'user-dashboard.html';
              } else {
                window.location.href = 'owner-dashboard.html';
              }
            }, 500);
          } else {
            alert('Error: ' + data.message);
          }
        })
        .catch(err => {
          console.error('OTP verification error:', err);
          alert('Connection error');
        })
        .finally(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        });
      return;
    }

    // Initial registration
    const endpoint = window.API_CONFIG ? window.API_CONFIG.endpoint(`/api/${userType}/register`) : `/api/${userType}/register`;
    
    let formData = {};
    
    if (userType === 'customer') {
      formData = {
        fullName: form.querySelector('input[type="text"]')?.value || '',
        email: form.querySelector('input[type="email"]')?.value || '',
        phone: form.querySelector('input[type="tel"]')?.value || '',
        password: form.querySelectorAll('input[type="password"]')[0]?.value || '',
        confirmPassword: form.querySelectorAll('input[type="password"]')[1]?.value || ''
      };
    } else {
      // For owner: text (hostelName), email, tel (phone), text (location), password, confirmPassword
      const allInputs = form.querySelectorAll('input');
      let textInputs = 0;
      let hostelName = '', location = '';
      
      for (let input of allInputs) {
        if (input.type === 'text') {
          if (textInputs === 0) {
            hostelName = input.value;
          } else if (textInputs === 1) {
            location = input.value;
          }
          textInputs++;
        }
      }
      
      formData = {
        hostelName: hostelName,
        ownerEmail: form.querySelector('input[type="email"]')?.value || '',
        phone: form.querySelector('input[type="tel"]')?.value || '',
        location: location,
        password: form.querySelectorAll('input[type="password"]')[0]?.value || '',
        confirmPassword: form.querySelectorAll('input[type="password"]')[1]?.value || ''
      };
    }

    console.log('📝 Form Data to be sent:', formData);

    // Validate
    if (!formData.password || !formData.confirmPassword) {
      alert('❌ Passwords are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('❌ Passwords do not match');
      return;
    }

    if (userType === 'customer' && !formData.fullName) {
      alert('❌ Full name is required');
      return;
    }

    if (userType === 'owner' && !formData.hostelName) {
      alert('❌ Hostel name is required');
      return;
    }
    
    if (userType === 'owner' && !formData.location) {
      alert('❌ Location is required');
      return;
    }
    
    if (userType === 'owner' && !formData.ownerEmail) {
      alert('❌ Email is required');
      return;
    }
    
    if (userType === 'owner' && !formData.phone) {
      alert('❌ Phone number is required');
      return;
    }

    // Show loading state
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Loading...';
    btn.disabled = true;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        console.log('✅ Backend response:', data);
        if (data.success && data.requiresOTP) {
          // Show OTP verification UI
          const registerFields = userType === 'owner' ? document.getElementById('ownerRegisterFields') : document.getElementById('customerRegisterFields');
          const otpFields = userType === 'owner' ? document.getElementById('ownerOTPFields') : document.getElementById('customerOTPFields');
          
          if (registerFields) registerFields.style.display = 'none';
          if (otpFields) otpFields.style.display = 'block';
          
          // Store tempId for OTP verification
          form.dataset.tempId = data.tempId;
          
          btn.textContent = 'Verify OTP';
          btn.disabled = false;
          
          alert(`✅ OTP sent!\n\nCheck your email and phone for the 6-digit OTP code.\nOTP is valid for 5 minutes.\n\nNote: For testing, check the backend console for the OTP code.`);
          console.log(`\n🔐 OTP for testing: Check the backend console for the OTP code (5 minute expiry)\n`);
        } else if (data.success) {
          localStorage.setItem('userType', userType === 'owner' ? 'Hotel Owner' : 'Customer');
          localStorage.setItem('userData', JSON.stringify(data.user || data.owner));
          alert(`✅ ${userType === 'owner' ? 'Hotel Owner' : 'Customer'} registration successful!`);
          closeModal(modalId);
        } else {
          console.error('❌ Backend error:', data);
          alert('❌ Error: ' + (data.message || 'Registration failed'));
          btn.textContent = originalText;
          btn.disabled = false;
        }
      })
      .catch(err => {
        console.error('❌ Registration error:', err);
        alert('❌ Connection error. Is the backend running on port 3000?\n\nEnsure the server is running with:\nnode server.js\n\nDetails: ' + err.message);
        btn.textContent = originalText;
        btn.disabled = false;
      });
  }
})();
