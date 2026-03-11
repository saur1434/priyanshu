// Payment Management System
class PaymentManager {
  constructor() {
    this.currentPaymentMethod = 'card';
    this.selectedUPIApp = null;
    this.bookingData = null;
    this.init();
  }

  init() {
    this.paymentModal = document.getElementById('payment-modal');
    this.paymentOverlay = document.getElementById('payment-overlay');
    this.paymentMessage = document.getElementById('payment-message');

    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', (e) => this.formatCardNumber(e));
    }

    // Format expiry date input
    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', (e) => this.formatExpiry(e));
    }

    // Only allow numbers in CVV
    const cardCVVInput = document.getElementById('cardCVV');
    if (cardCVVInput) {
      cardCVVInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
      });
    }
  }

  // Open Payment Modal with booking details
  openPayment(bookingDetails) {
    this.bookingData = bookingDetails;
    
    // Update booking summary
    document.getElementById('summary-room').textContent = bookingDetails.roomType || 'Standard Room';
    document.getElementById('summary-checkin').textContent = bookingDetails.checkIn || '-';
    document.getElementById('summary-checkout').textContent = bookingDetails.checkOut || '-';
    document.getElementById('summary-nights').textContent = bookingDetails.nights || '-';
    document.getElementById('summary-total').textContent = `₹${(bookingDetails.total || 0).toLocaleString('en-IN')}`;

    // Update amount in buttons
    document.getElementById('card-amount').textContent = (bookingDetails.total || 0).toLocaleString('en-IN');
    document.getElementById('upi-amount').textContent = (bookingDetails.total || 0).toLocaleString('en-IN');

    // Show modal
    this.paymentModal.classList.remove('hidden');
    this.paymentOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Reset forms
    this.resetForms();
  }

  // Close Payment Modal
  closeModal() {
    this.paymentModal.classList.add('hidden');
    this.paymentOverlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
    this.paymentMessage.classList.add('hidden');
    this.resetForms();
  }

  // Reset all forms
  resetForms() {
    document.getElementById('card-form')?.reset();
    document.getElementById('upi-form')?.reset();
    this.selectedUPIApp = null;
  }

  // Switch between payment tabs
  switchTab(method) {
    this.currentPaymentMethod = method;

    // Update tab buttons
    document.querySelectorAll('.payment-tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update content
    document.querySelectorAll('.payment-tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${method}-payment`).classList.add('active');
  }

  // Format card number with spaces
  formatCardNumber(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = formattedValue;
  }

  // Format expiry date MM/YY
  formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
  }

  // Validate card number (Luhn algorithm)
  validateCardNumber(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Validate expiry date
  validateExpiry(expiry) {
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expiryYear = parseInt(year, 10);
    const expiryMonth = parseInt(month, 10);

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return false;
    }

    return expiryMonth >= 1 && expiryMonth <= 12;
  }

  // Validate UPI ID format
  validateUPIId(upiId) {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;
    return upiRegex.test(upiId);
  }

  // Process Card Payment
  async processCardPayment(event) {
    event.preventDefault();

    const cardName = document.getElementById('cardName').value.trim();
    const cardEmail = document.getElementById('cardEmail').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value.trim();
    const cardCVV = document.getElementById('cardCVV').value.trim();
    const agreement = document.getElementById('cardAgreement').checked;

    // Validation
    if (!cardName) {
      this.showMessage('Please enter your name', 'error');
      return;
    }

    if (!this.validateCardNumber(cardNumber)) {
      this.showMessage('Invalid card number', 'error');
      return;
    }

    if (!this.validateExpiry(cardExpiry)) {
      this.showMessage('Invalid or expired card', 'error');
      return;
    }

    if (cardCVV.length !== 3) {
      this.showMessage('CVV must be 3 digits', 'error');
      return;
    }

    if (!agreement) {
      this.showMessage('Please agree to payment terms', 'error');
      return;
    }

    // Show processing message
    this.showMessage('Processing payment...', 'processing');

    try {
      const paymentData = {
        paymentMethod: 'card',
        cardName,
        cardEmail,
        cardNumber: cardNumber.slice(-4), // Only send last 4 digits for security
        amount: this.bookingData.total,
        bookingDetails: this.bookingData,
        timestamp: new Date().toISOString()
      };

      // Send to backend
      const response = await fetch(window.API_CONFIG ? window.API_CONFIG.endpoint('/api/payment/process') : 'http://localhost:3000/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        this.showMessage('✅ Payment successful! Your booking is confirmed.', 'success');
        
        // Store payment info in localStorage
        localStorage.setItem('lastPayment', JSON.stringify({
          method: 'card',
          amount: paymentData.amount,
          date: new Date().toLocaleString(),
          bookingId: result.bookingId
        }));

        // Close modal after 2 seconds
        setTimeout(() => {
          this.closeModal();
          alert('Booking confirmed! Check your email for details.');
        }, 2000);
      } else {
        this.showMessage(`❌ Payment failed: ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      this.showMessage('❌ Error processing payment. Please try again.', 'error');
    }
  }

  // Process UPI Payment
  async processUPIPayment(event) {
    event.preventDefault();

    const upiId = document.getElementById('upiId').value.trim();
    const upiName = document.getElementById('upiName').value.trim();
    const upiEmail = document.getElementById('upiEmail').value.trim();
    const upiPhone = document.getElementById('upiPhone').value.trim();
    const agreement = document.getElementById('upiAgreement').checked;

    // Validation
    if (!this.validateUPIId(upiId)) {
      this.showMessage('Invalid UPI ID format (e.g., username@upi)', 'error');
      return;
    }

    if (!upiName) {
      this.showMessage('Please enter your name', 'error');
      return;
    }

    if (!upiPhone) {
      this.showMessage('Please enter your phone number', 'error');
      return;
    }

    if (!agreement) {
      this.showMessage('Please agree to payment terms', 'error');
      return;
    }

    // Show processing message
    this.showMessage('Processing UPI payment...', 'processing');

    try {
      const paymentData = {
        paymentMethod: 'upi',
        upiId,
        upiName,
        upiEmail,
        upiPhone,
        upiApp: this.selectedUPIApp || 'manual',
        amount: this.bookingData.total,
        bookingDetails: this.bookingData,
        timestamp: new Date().toISOString()
      };

      // Send to backend
      const response = await fetch(window.API_CONFIG ? window.API_CONFIG.endpoint('/api/payment/process') : 'http://localhost:3000/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();

      if (result.success) {
        this.showMessage('✅ UPI payment successful! Your booking is confirmed.', 'success');
        
        // Store payment info in localStorage
        localStorage.setItem('lastPayment', JSON.stringify({
          method: 'upi',
          upiId: upiId.split('@')[0] + '@' + '****',
          amount: paymentData.amount,
          date: new Date().toLocaleString(),
          bookingId: result.bookingId
        }));

        // Close modal after 2 seconds
        setTimeout(() => {
          this.closeModal();
          alert('Booking confirmed! Check your email for details.');
        }, 2000);
      } else {
        this.showMessage(`❌ Payment failed: ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Payment error:', error);
      this.showMessage('❌ Error processing UPI payment. Please try again.', 'error');
    }
  }

  // Select UPI App
  selectUPIApp(app) {
    this.selectedUPIApp = app;

    // Update UI
    document.querySelectorAll('.upi-option').forEach(btn => {
      btn.classList.remove('selected');
    });
    event.target.closest('.upi-option').classList.add('selected');
  }

  // Show payment message
  showMessage(message, type = 'info') {
    this.paymentMessage.textContent = message;
    this.paymentMessage.className = `payment-message ${type}`;
    this.paymentMessage.classList.remove('hidden');

    // Auto-hide info/processing messages
    if (type === 'info' || type === 'processing') {
      setTimeout(() => {
        this.paymentMessage.classList.add('hidden');
      }, 3000);
    }
  }
}

// Initialize payment manager
let paymentManager;
document.addEventListener('DOMContentLoaded', () => {
  paymentManager = new PaymentManager();
  console.log('💳 Payment system initialized!');
});

// Global functions for HTML onclick handlers
function openPaymentModal(bookingDetails) {
  if (!bookingDetails) {
    bookingDetails = {
      roomType: 'Standard Room',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      nights: 1,
      total: 5000
    };
  }
  paymentManager.openPayment(bookingDetails);
}

function closePaymentModal() {
  paymentManager.closeModal();
}

function switchPaymentTab(method) {
  paymentManager.switchTab(method);
}

function processCardPayment(event) {
  paymentManager.processCardPayment(event);
}

function processUPIPayment(event) {
  paymentManager.processUPIPayment(event);
}

function selectUPIApp(app) {
  paymentManager.selectUPIApp(app);
}
