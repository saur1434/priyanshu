# Render Environment Variables Setup

## Required Environment Variables for Render Deployment

Add these variables in Render Dashboard → Your Service → Settings → Environment

### Backend Service Variables
```
PORT=3000
NODE_ENV=production
JWT_SECRET=your-very-secure-jwt-secret-key-here
ALLOWED_ORIGINS=https://your-frontend-domain.onrender.com,https://hotelweb-frontend.onrender.com
```

### Frontend Service Variables
```
VITE_API_URL=https://hotelweb-1990.onrender.com
NODE_ENV=production
```

---

## How to Set Environment Variables in Render

### Step 1: Open Render Dashboard
- Go to [render.com](https://render.com)
- Select your Web Service

### Step 2: Navigate to Environment
- Click **Environment** tab (or **Settings**)

### Step 3: Add Variables One by One
```
Key: PORT
Value: 3000

Key: NODE_ENV
Value: production

Key: JWT_SECRET
Value: your-super-secret-key-min-32-characters-long
```

### Step 4: Save and Redeploy
- Click **Save** or **Update**
- Service will redeploy with new variables

---

## Security Best Practices

### 🔐 JWT_SECRET
- **Must be:** Long and random (min 32 characters)
- **Generate:** Use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **Never commit:** Don't add to .env files in git

### 🔐 API URLs
- Update `ALLOWED_ORIGINS` with your actual frontend domain
- Use HTTPS only in production

### 🔐 Local Development
- Use `.env` file locally (NOT committed)
- Never commit `.env` with real secrets

---

## Verify Deployment

After setting variables, check:

1. **Backend Health**
   ```
   curl https://hotelweb-1990.onrender.com/
   ```

2. **Frontend Loading**
   ```
   Visit https://hotelweb-frontend.onrender.com
   Check browser console (F12) for API errors
   ```

3. **API Requests**
   - Open browser DevTools → Network
   - Try login/register
   - Check requests go to correct backend URL

---

## Troubleshooting

### CORS Errors
- Update `ALLOWED_ORIGINS` in environment variables
- Restart service: Dashboard → Restart

### 404 on Frontend
- Verify `VITE_API_URL` is correct
- Check `config.js` is properly configured

### Authentication Fails
- Ensure `JWT_SECRET` is set correctly
- Check backend logs: Render → Logs tab

### Static Files Not Loading
- Verify `server.js` has `app.use(express.static('.'))`
- Check file paths in HTML files

---

## Environment Variables Summary

| Variable | Service | Value | Type |
|----------|---------|-------|------|
| PORT | Backend | 3000 | Integer |
| NODE_ENV | Both | production | String |
| JWT_SECRET | Backend | Your Secret | String |
| ALLOWED_ORIGINS | Backend | Your Domains | CSV |
| VITE_API_URL | Frontend | Backend URL | URL |

