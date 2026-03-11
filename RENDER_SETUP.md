# Render Deployment Guide

## Environment Setup for Render

Follow these steps to deploy your project on Render with proper environment configuration:

### Step 1: Prepare Your Backend
1. Deploy your backend server to Render first (if separate)
2. Note the backend URL, e.g., `https://your-backend-name.onrender.com`

### Step 2: Configure Frontend on Render

#### Option A: Via Render Dashboard (Recommended)

1. **Create/Edit Web Service on Render**
   - Go to your Render dashboard
   - Click on your frontend service

2. **Add Environment Variables**
   - Go to **Settings** (or **Environment** tab)
   - Add these variables:
     ```
     VITE_API_URL=https://hotelweb-1990.onrender.com
     NODE_ENV=production
     ```

3. **Build Configuration**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start` (or your frontend server command)
   - Publish Directory: `./` (if using frontend-server.js)

#### Option B: Via Environment File

Create a `.env.production` file (already created):
```
VITE_API_URL=https://hotelweb-1990.onrender.com
NODE_ENV=production
```

### Step 3: Update Your API Calls

In your JavaScript code, use:
```javascript
const apiUrl = API_CONFIG.endpoint('/your-endpoint');
```

Example:
```javascript
fetch(API_CONFIG.endpoint('/api/bookings'))
  .then(response => response.json())
  .then(data => console.log(data));
```

### Step 4: Backend Environment Setup

For your backend (if on Render), set:
```
PORT=3000
NODE_ENV=production
```

### Step 5: Database Configuration

Ensure your backend has:
```
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key
```

### Testing

1. **Local Testing**
   ```bash
   npm install
   npm start
   ```

2. **Production URLs**
   - Frontend: `https://your-frontend-name.onrender.com`
   - Backend: `https://hotelweb-1990.onrender.com`

### Troubleshooting

- **CORS errors**: Ensure backend allows requests from your frontend domain
- **API 404s**: Verify `VITE_API_URL` is correct in Render's environment variables
- **Build fails**: Check `package.json` build scripts
- **Blank page**: Check browser console for errors and Render logs

### Useful Links
- [Render Docs](https://render.com/docs)
- [Environment Variables Guide](https://render.com/docs/environment-variables)
