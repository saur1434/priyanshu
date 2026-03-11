# GoCabn Go - Setup Guide

## Overview
This is a hotel booking website with separate registration and login for:
- **Hotel Owners** - Can register their hostels/hotels
- **Customers** - Can browse and book accommodations
- **Payment System** - Card and UPI payment options
- **Chatbot** - 24/7 customer support AI

## Features
✅ Responsive design with modern UI  
✅ User-location Google Maps (Leaflet/OpenStreetMap)  
✅ Separate owner & customer auth portals  
✅ Backend API with data persistence  
✅ JSON-based data storage  
✅ **Card Payment** - Visa, Mastercard, Amex  
✅ **UPI Payment** - Google Pay, PhonePe, Paytm, BHIM  
✅ **24/7 Chatbot** - AI-powered customer support  
✅ Payment history tracking  
✅ OTP & Email verification  

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend Server (Port 3000)
```bash
npm start
```
The server will run at `http://localhost:3000`

### 3. Serve Frontend (Port 5500)
Keep your existing Live Server running on `http://127.0.0.1:5500`

## Architecture

### Frontend
- `index.html` - Main website
- `style.css` - Styling (includes payment & chatbot)
- `auth.js` - Authentication modal logic & API calls
- `payment.js` - Payment processing & UI logic
- `chatbot.js` - 24/7 chatbot assistant

### Backend
- `server.js` - Express.js API server
- `/data/users.json` - Customer data storage
- `/data/owners.json` - Hotel owner data storage
- `/data/payments.json` - Payment transaction history

## API Endpoints

### Customer endpoints
```
POST /api/customer/register
POST /api/customer/verify-otp
POST /api/customer/login
GET /api/admin/users
```

### Owner endpoints
```
POST /api/owner/register
POST /api/owner/verify-otp
POST /api/owner/login
GET /api/admin/owners
```

### Payment endpoints
```
POST /api/payment/process
GET /api/admin/payments
```

### Chatbot endpoints
```
POST /api/chatbot/message
```

## How to Use

### For Customers
1. Click "Login" button in top-right
2. Choose "Register" tab
3. Enter: Full Name, Email, Phone, Password
4. Enter OTP received
5. Book a room and click Payment
6. Choose Card or UPI payment
7. Data saved to `/data/users.json`

### For Hotel Owners
1. Click "Owner" button in navigation
2. Choose "Register" tab
3. Enter: Hostel Name, Email, Phone, Location, Password
4. Enter OTP received
5. Data saved to `/data/owners.json`
6. Awaiting admin approval

### Payment Options
**Card Payment:**
- Supported: Visa, Mastercard, American Express
- Test Card: 4532 1234 5678 9010 (any future expiry, any CVV)
- Your payments receive: Full card details (stored securely)

**UPI Payment:**
- Supported: Google Pay, PhonePe, Paytm, BHIM, Manual UPI ID
- Format: username@upi
- Your account receives: Payment from customer's UPI ID

## Data Structure

### User (Customer)
```json
{
  "id": 1708370000000,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "registeredAt": "2026-02-19T10:30:00.000Z",
  "verified": true
}
```

### Owner (Hotel)
```json
{
  "id": 1708370000001,
  "hostelName": "GoCabn Go",
  "ownerEmail": "owner@resort.com",
  "phone": "+1234567890",
  "location": "Kathmandu, Nepal",
  "password": "password123",
  "registeredAt": "2026-02-19T10:30:00.000Z",
  "isApproved": false,
  "verified": true
}
```

### Payment Transaction
```json
{
  "id": "1708370000002",
  "bookingId": "BK1708370000002",
  "paymentMethod": "card|upi",
  "amount": 5000,
  "status": "completed",
  "timestamp": "2026-02-19T10:30:00.000Z",
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "cardLast4": "9010" // or upiId for UPI
  },
  "bookingDetails": {}
}
```

## File Structure
```
project/
├── index.html
├── style.css
├── auth.js
├── payment.js
├── chatbot.js
├── server.js
├── package.json
└── data/
    ├── users.json
    ├── owners.json
    └── payments.json
```

## Payment Testing

### Test Card Numbers
```
Visa:       4532 1234 5678 9010
Mastercard: 5425 2334 3010 9903
Amex:       3782 822463 10005
```

Any future expiry date (MM/YY) and any 3-digit CVV will work.

### Test UPI
```
UPI ID Format: username@upi
Example: john.doe@upi
```

## Integrating Real Payment Gateway

### For Card Payments (Stripe/Razorpay)
1. Replace the payment form with Stripe Elements
2. Update payment.js to call Stripe API
3. Update server.js `/api/payment/process` to verify with payment gateway

### For UPI Payments (Razorpay/PayU)
1. Call Razorpay UPI API instead of direct processing
2. Handle async payment confirmation webhook
3. Update payment status accordingly

## Security Notes (For Production)
⚠️ **Current limitations:**
- Passwords stored in plain text (use bcrypt in production)
- No authentication tokens (use JWT)
- Card details shown in logs (integrate with secure payment gateway)
- No HTTPS
- No input sanitization (use validation libraries)
- CORS open to all origins
- Payment webhook not implemented

## Recommended Production Upgrades
1. **Payment Gateway:** Integrate Razorpay or Stripe
2. **Email Verification:** SendGrid or Mailgun for OTP/confirmation
3. **SSL/HTTPS:** Let's Encrypt certificate
4. **Database:** MySQL/MongoDB instead of JSON files
5. **Authentication:** JWT tokens instead of localStorage
6. **Security:** Helmet.js, rate limiting, input validation
7. **Webhooks:** Verify real payment confirmations
8. **Admin Dashboard:** Approve owners, view payments, manage bookings

## Troubleshooting

**"Connection error" when trying to login/register?**
- Make sure backend is running: `npm start`
- Check that port 3000 is not in use
- Verify backend console shows: "� GoCabn Go API Server running on http://localhost:3000"

**Payment not processing?**
- Check browser console for API errors
- Verify backend is running
- Check `/data/payments.json` for payment records
- Ensure all required payment fields are filled

**Chatbot not responding?**
- Refresh the page
- Check browser console for errors
- Verify backend `/api/chatbot/message` endpoint is accessible

**Data not saving?**
- Check `/data/` folder exists
- Ensure write permissions on data folder
- Check backend console for errors

## Production Ro
