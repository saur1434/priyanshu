# 🚀 Render Deployment Checklist

## Pre-Deployment Verification ✅

### Files Ready for Render
- ✅ `server.js` - Backend server (uses PORT env variable)
- ✅ `frontend-server.js` - Frontend server (updated for Render)
- ✅ `config.js` - API config (supports environment variables)
- ✅ `package.json` - Dependencies + Node version specified
- ✅ `index.html` - Frontend entry
- ✅ `auth.js`, `chatbot.js`, `payment.js` - Core logic
- ✅ `data/` - Database files (JSON)
- ✅ `.env` - Local config
- ✅ `.env.production` - Production config

### Known Fixes Applied ✅
- ✅ CORS updated to include Render domains
- ✅ Dynamic PORT configuration in both servers
- ✅ Environment variable support in config.js
- ✅ Node version specified in package.json

---

## Step-by-Step Deployment

### Phase 1: Prepare Local Environment
```powershell
# 1. Install dependencies
npm install

# 2. Test locally
node server.js
# Visit http://localhost:3000

# 3. Initialize git (if not done)
git init
git add .
git commit -m "Ready for Render deployment"

# 4. Push to GitHub
git push origin main
```

### Phase 2: Deploy on Render

#### Option A: Monolithic Deployment (Recommended for Simple Setup)
Both frontend + backend on one service

**Step 1: Create Web Service on Render**
- Go to [render.com](https://render.com)
- Click **New +** → **Web Service**
- Connect your GitHub repo
- Fill in details:
  - **Name:** `hotelweb`
  - **Environment:** `Node`
  - **Build Command:** `npm install`
  - **Start Command:** `node server.js`
  - **Plan:** Free or Starter

**Step 2: Add Environment Variables**
- Click **Advanced** or **Environment**
- Add:
  ```
  PORT=3000
  NODE_ENV=production
  JWT_SECRET=<generate-secure-key>
  ALLOWED_ORIGINS=https://<your-render-url>.onrender.com
  ```

**Step 3: Deploy**
- Click **Create Web Service**
- Wait 2-5 minutes for deployment
- Check status in Dashboard

**Step 4: Get Your URL**
- Once deployed, Render gives you URL like: `https://hotelweb.onrender.com`
- This is your public deployment URL

---

#### Option B: Separate Frontend & Backend (Advanced)

**Backend Service:**
- Create Web Service for backend
- Build: `npm install`
- Start: `node server.js`
- Environment: same as above

**Frontend Service:**
- Create Web Service for frontend
- Build: `npm install`
- Start: `node frontend-server.js`
- Environment:
  ```
  VITE_API_URL=https://<backend-url>.onrender.com
  ```

---

### Phase 3: Post-Deployment Verification

#### Step 1: Check Service Status
- Render Dashboard → Your Service → Status
- Should show "Live" 🟢

#### Step 2: Test Backend
```powershell
# Replace with your actual URL
curl https://your-service.onrender.com/

# Should return some response (not 404)
```

#### Step 3: Test Frontend
- Visit `https://your-service.onrender.com`
- Open DevTools (F12)
- Check **Console** for errors
- Check **Network** tab for API calls

#### Step 4: Test Authentication
- Try to register/login
- Check network requests go to correct API

#### Step 5: View Logs
- Render Dashboard → Logs
- Look for errors

---

## Common Issues & Fixes

### Issue: Site showing blank page
**Solution:**
```
1. Check browser console (F12) for errors
2. Verify config.js is loaded
3. Check Render logs for backend errors
```

### Issue: API 500 Error
**Solution:**
```
1. Check JWT_SECRET is set in Render
2. Verify ALLOWED_ORIGINS includes your domain
3. Check backend logs for detailed error
```

### Issue: CORS Error (browser console)
**Solution:**
```
1. Go to Render Dashboard → Settings
2. Add your domain to ALLOWED_ORIGINS
3. Restart service
```

### Issue: 404 on static files
**Solution:**
```
1. Verify file exists in repo
2. Check case sensitivity (Linux is case-sensitive)
3. Ensure express.static('.') in server.js
```

---

## Environment Variables Reference

Generate a secure JWT_SECRET:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Common variables:
```
PORT = 3000
NODE_ENV = production
JWT_SECRET = <generated-secure-key>
ALLOWED_ORIGINS = https://your-domain.onrender.com
VITE_API_URL = https://your-backend.onrender.com
```

---

## Post-Deployment Checklist

- [ ] Service is "Live" in Render dashboard
- [ ] Frontend loads without blank page
- [ ] Console has no major errors
- [ ] API calls go to correct backend
- [ ] Can register/login successfully
- [ ] Payment tests work
- [ ] Admin dashboard accessible
- [ ] Logs show no critical errors

---

## Useful Links

- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Custom Domains](https://render.com/docs/custom-domains)

---

## Next Steps After Deployment

1. **Domain:** Add custom domain in Render settings
2. **SSL:** Automatically provided by Render
3. **Monitoring:** Set up alerts for service crashes
4. **Database:** Consider using Render Database instead of JSON files
5. **Backup:** Regular backup of `/data/` directory

---

## Support

If you encounter issues:
1. Check Render Logs (Dashboard → Logs)
2. Review `RENDER_ENV_VARS.md`
3. Verify environment variables are set
4. Check `config.js` is properly loading
5. Review `SECURITY.md` for security guidelines
