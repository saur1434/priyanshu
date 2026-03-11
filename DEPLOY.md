# GoCabn Go - Deployment Guide

Complete guide to deploy your property booking website on **Netlify** (frontend) and **Render** (backend).

## 📋 Overview
- **Frontend**: Static HTML, CSS, JS deployed on Netlify (free)
- **Backend**: Node.js/Express deployed on Render (free tier)
- **Database**: JSON files (can upgrade to MongoDB later)
- **Total Cost**: $0/month (free tier)

---

## 🚀 FRONTEND DEPLOYMENT (Netlify)

### Prerequisites
- GitHub account (free at github.com)
- Netlify account (free at netlify.com)

### Step 1: Create GitHub Repository

1. Go to **github.com** and sign in
2. Click **+ New repository**
3. Name it: `gocabingo`
4. Description: "Hotel booking platform"
5. Choose **Public** (so Netlify can see it)
6. Click **Create repository**

### Step 2: Upload Your Code to GitHub

**Option A: Using Git CLI (Recommended)**
```bash
cd c:\Users\saurabh\Desktop\project
git init
git add .
git commit -m "Initial commit: GoCabn Go booking platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/gocabingo.git
git push -u origin main
```

**Option B: GitHub Desktop**
1. Download GitHub Desktop from desktop.github.com
2. Click "Create new repository"
3. Select your project folder
4. Publish to GitHub

### Step 3: Deploy to Netlify

1. Go to **netlify.com** and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** as your provider
4. Select **`gocabingo`** repository
5. Configuration:
   - **Build command**: `echo 'Ready'` (leave empty or default)
   - **Publish directory**: `.` (current folder)
6. Click **Deploy site**

### Step 4: Configure Backend URL

Once Netlify deployment is complete:

1. Find your **Netlify domain** (e.g., `gocabingo-abc123.netlify.app`)
2. In your admin panel, you can set environment variables:
   - Go to **Site settings** → **Build & deploy** → **Environment**
   - Add: `REACT_APP_API_URL = https://your-backend-url.render.com`

3. **Update config.js** with your Render backend URL (after Step 2 is complete):
```javascript
const API_CONFIG = {
  LOCAL: 'http://localhost:3000',
  PRODUCTION: 'https://gocabingo-backend.onrender.com',  // Your Render URL
  // ...
};
```

---

## 🔧 BACKEND DEPLOYMENT (Render)

### Prerequisites
- GitHub account (same as above)
- Render account (free at render.com)

### Step 1: Prepare Backend for Deployment

**Already done in your project:**
- ✅ `server.js` - Configured to read PORT from environment
- ✅ `Procfile` - Created for deployment
- ✅ `.gitignore` - Excludes node_modules

### Step 2: Create Render Service

1. Go to **render.com** and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Select your **`gocabingo`** repository
4. Configuration:
   - **Name**: `gocabingo-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` or `node server.js`
5. Click **Deploy**

### Step 3: Get Your Backend URL

After deployment completes:
- Your Render URL will be: `https://gocabingo-backend-xxxxx.onrender.com`
- Copy this URL

### Step 4: Update Frontend Configuration

Update `config.js` in your project:
```javascript
const API_CONFIG = {
  LOCAL: 'http://localhost:3000',
  PRODUCTION: 'https://gocabingo-backend-xxxxx.onrender.com',  // Replace xxxxx with your ID
  
  getURL: function() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return this.LOCAL;
    }
    return this.PRODUCTION;
  },
  
  endpoint: function(path) {
    return this.getURL() + path;
  }
};

window.API_CONFIG = API_CONFIG;
```

### Step 5: Push Changes to GitHub

```bash
git add config.js
git commit -m "Update backend URL for production"
git push origin main
```

Netlify will automatically redeploy with the new configuration!

---

## 🔗 API Endpoints (Production)

Once deployed, your API will be at:

```
https://gocabingo-backend-xxxxx.onrender.com/api/customer/register
https://gocabingo-backend-xxxxx.onrender.com/api/customer/login
https://gocabingo-backend-xxxxx.onrender.com/api/owner/register
https://gocabingo-backend-xxxxx.onrender.com/api/payment/process
https://gocabingo-backend-xxxxx.onrender.com/api/chatbot/message
```

---

## 📊 View Your Live Website

- **Frontend**: `https://gocabingo-xxxxx.netlify.app`
- **Backend API**: `https://gocabingo-backend-xxxxx.onrender.com/api/admin/users`

---

## 💾 Database Persistence (Important!)

**⚠️ Current Issue with Render Free Tier:**

Render's free tier uses ephemeral storage, meaning **data is lost when the service restarts**.

### Solution: Upgrade to Paid Database

**Option 1: MongoDB Atlas (Recommended)**
- Free tier: 512MB storage
- Setup: 5 minutes
- Steps:
  1. Create account at mongodb.com/cloud/atlas
  2. Create free cluster
  3. Get connection string
  4. Update server.js to use MongoDB instead of JSON files
  5. Add connection string as env variable in Render

**Option 2: Render PostgreSQL**
- Free tier available (limited)
- Built-in with Render
- Can add in Render dashboard

**Option 3: Firebase**
- Free tier: 1GB storage
- Real-time updates
- No backend needed (use Firebase client SDK directly)

**For now (development):**
- Data will reset when Render free dyno restarts (every 15 mins of inactivity)
- This is fine for testing
- Upgrade to paid tier or database before production

---

## 🛠️ Troubleshooting

### "Cannot reach backend" error
1. Check Render service is running (check Render logs)
2. Verify your API URL in `config.js`
3. Check CORS is enabled in server.js (already done)
4. Wait 2-3 minutes for Render to fully deploy

### "Data not saving"
- This is normal on Render free tier (ephemeral storage)
- Upgrade to MongoDB Atlas or paid Render plan

### Netlify shows "Site not found"
1. Check build logs in Netlify dashboard
2. Ensure `netlify.toml` exists
3. Try triggering manual deploy from Netlify dashboard

### CORS errors
Add this to server.js if not present:
```javascript
app.use(cors({
  origin: ['https://gocabingo-xxxxx.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
```

---

## 📈 Monitoring & Logs

### Netlify Logs
1. Go to Netlify dashboard
2. Select your site
3. Go to **Deploys** → Click latest deploy → View logs

### Render Logs
1. Go to Render dashboard
2. Select your service
3. Click **Logs** tab
4. View real-time backend logs

---

## 🔐 Security Checklist

Before going to production:

- [ ] Update `config.js` with correct API URLs
- [ ] Remove test data from `/data/` files
- [ ] Set random API keys/secrets as environment variables
- [ ] Enable HTTPS (automatic on both Netlify & Render)
- [ ] Set up email for OTP/notifications (SendGrid, Mailgun)
- [ ] Add input validation & sanitization
- [ ] Implement rate limiting
- [ ] Use environment variables for sensitive data
- [ ] Set up monitoring & error tracking

---

## 💳 Payment Gateway Integration

Your payment system is ready to connect to:

1. **Razorpay** (India, cards + UPI)
   - Redirect payment.js to Razorpay API
   
2. **Stripe** (Global, cards)
   - Use Stripe Elements in payment form
   
3. **PayU** (Asia, multiple payment methods)
   - Call PayU API from server.js

Update payment endpoint to call real gateway instead of mock processing.

---

## 📱 Custom Domain

To use your own domain:

### Netlify
1. Buy domain (GoDaddy, NameCheap, etc.)
2. In Netlify: Site settings → Domain management
3. Add custom domain
4. Update DNS records (Netlify provides instructions)

### Render
1. Same domain registration process
2. Add custom domain in Render dashboard
3. Update DNS records

---

## 📞 Support & Resources

- **Netlify Docs**: docs.netlify.com
- **Render Docs**: render.com/docs
- **Express.js Docs**: expressjs.com
- **Node.js Docs**: nodejs.org

---

## 🎉 Deployment Summary

✅ **Frontend**: Deployed on Netlify (free, ~2 hours)
✅ **Backend**: Deployed on Render (free, ~15 mins)
✅ **Database**: JSON files (ephemeral on free tier)
✅ **SSL/HTTPS**: Automatic
✅ **Custom Domain**: Available (paid)
✅ **Auto Redeploy**: On every GitHub push

**Total Time to Deploy**: ~30 minutes
**Monthly Cost**: $0 (free tier)

---

## 🚀 Next Steps

1. Deploy frontend to Netlify
2. Deploy backend to Render
3. Test all APIs
4. Upgrade database when ready
5. Set up custom domain
6. Monitor logs for errors
7. Implement real payment gateway
8. Set up email notifications
9. Launch to users!

Good luck! 🎊
