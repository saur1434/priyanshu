# Getting Started - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd c:\Users\saurabh\Desktop\project
npm install
```

### 2. Start Backend Server
```bash
npm start
```

You should see:
```
� GoCabn Go API Server running on http://localhost:3000
📁 Data stored in: [path]/data
```

### 3. Open Frontend
- Go to `http://localhost:5500` (Live Server)
- Or `http://127.0.0.1:5500`

### 4. Test Features

#### Register as Customer
1. Click "Login" button (top right)
2. Fill registration form
3. Check terminal for OTP
4. Enter OTP to verify
5. Login successfully

#### Register as Owner
1. Click "Owner" button
2. Fill owner registration
3. Enter OTP
4. Admin approves in dashboard

#### Access Admin Dashboard
1. Login as owner with `isAdmin: true`
2. Go to `http://localhost:3000/admin.html`
3. View stats and manage platform

#### Test Payment
1. Book a room
2. Click "Proceed to Payment"
3. Choose Card or UPI
4. Use test card: `4532 1234 5678 9010`
5. Payment saved to `/data/payments.json`

---

## 🆘 Troubleshooting

### "Cannot find module 'bcryptjs'"
```bash
npm install bcryptjs jsonwebtoken helmet dotenv
```

### "EADDRINUSE: address already in use :::3000"
Kill Node.js process:
```bash
# Windows PowerShell
Get-Process node | Stop-Process -Force
npm start
```

### "Cannot GET /"
- Frontend not running
- Start Live Server on port 5500
- Or use `python -m http.server 8000` in project folder

### Payment not working
- Check browser console for errors
- Verify backend is running on 3000
- Check `/data/payments.json` exists

### Admin dashboard blank
- Make sure you're logged in with admin account
- Check browser console for API errors
- Verify JWT token in localStorage

### OTP not showing
- Check terminal/console where server running
- Look for: `📧 OTP for email@test.com: 123456`
- For production: [Add email service](IMPLEMENTATION.md#6--add-email-notifications)

---

## 📁 File Structure
```
project/
├── index.html              # Main website
├── admin.html              # Admin dashboard
├── style.css               # All styling
├── auth.js                 # Authentication logic
├── payment.js              # Payment processing
├── chatbot.js              # 24/7 chatbot
├── config.js               # API configuration
├── server.js               # Express.js backend
├── package.json            # Dependencies
│
├── data/                   # Data storage
│   ├── users.json          # Customer data
│   ├── owners.json         # Owner data
│   ├── bookings.json       # Booking records
│   ├── payments.json       # Payment history
│   └── tokens.json         # JWT tokens
│
└── docs/                   # Documentation
    ├── SETUP.md            # Setup instructions
    ├── SECURITY.md         # Security features
    ├── IMPLEMENTATION.md   # Feature roadmap
    ├── DEPLOY.md           # Production deployment
    ├── LOCAL.md            # Local development
    └── README.md           # Project overview
```

---

## 🔧 Common Commands

```bash
# Start server
npm start

# Install specific package
npm install package-name

# View npm logs
npm debug

# Kill process on port 3000
lsof -i :3000    # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Test API endpoint
curl http://localhost:3000/api/chatbot/message -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
```

---

## 📊 Current Features

✅ **Implemented (Ready):**
- User registration with OTP
- Password hashing (bcryptjs)
- JWT authentication
- Admin dashboard with statistics
- Booking management system
- Payment processing (Card + UPI)
- 24/7 Chatbot
- Responsive design

🟡 **Next Priority:**
- Real payment gateway (Razorpay/Stripe)
- Email notifications (OTP, bookings, receipts)
- Production deployment (Netlify + Render)
- Multi-language support (i18n)

---

## 💡 Tips

1. **Local Testing**: Keep server running in one terminal, edit files in editor
2. **Debug Payments**: Check `/data/payments.json` to see payment records
3. **Admin Setup**: Edit `/data/owners.json` to set `"isAdmin": true`
4. **API Testing**: Use Postman or cURL to test endpoints
5. **Data Reset**: Delete JSON files in `/data/` to reset all data

---

## 🔐 Security Features

✅ Passwords hashed with bcrypt (10 salt rounds)  
✅ JWT tokens (7-day expiration)  
✅ Helmet.js security headers  
✅ CORS protection  
✅ Admin-only routes  
✅ Input validation  

---

## 📞 Support

For detailed guides, see:
- [SETUP.md](SETUP.md) - Complete setup guide
- [SECURITY.md](SECURITY.md) - Security documentation
- [IMPLEMENTATION.md](IMPLEMENTATION.md) - Feature roadmap & implementation steps
- [DEPLOY.md](DEPLOY.md) - Production deployment

---

**Ready to proceed?**

1. ✅ Run `npm start` to start backend
2. ✅ Visit `http://localhost:5500` for frontend
3. 📖 Read [IMPLEMENTATION.md](IMPLEMENTATION.md) for next features
4. 🚀 Deploy to production when ready

Last Updated: February 19, 2026
