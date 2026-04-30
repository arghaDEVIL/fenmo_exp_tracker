# 🚀 Deployment Guide

Complete step-by-step guide to deploy the Expense Tracker application to production.

## Prerequisites

- GitHub account
- Neon DB account (free tier available)
- Render account (free tier available)
- Vercel account (free tier available)

## 1️⃣ Database Setup (Neon DB)

### Create Database

1. Go to [neon.tech](https://neon.tech) and sign up
2. Click **"Create Project"**
3. Choose:
   - **Project name**: expense-tracker
   - **Region**: Choose closest to your users
   - **PostgreSQL version**: 15 (recommended)
4. Click **"Create Project"**

### Get Connection String

1. In your project dashboard, click **"Connection Details"**
2. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. Save this for later - you'll need it for Render

### Important Notes

- Neon DB automatically handles SSL connections
- Free tier includes 0.5 GB storage (plenty for this app)
- Database automatically scales and pauses when inactive

## 2️⃣ Backend Deployment (Render)

### Push Code to GitHub

```bash
git add .
git commit -m "feat: initial expense tracker implementation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker.git
git push -u origin main
```

### Create Web Service

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: expense-tracker-api
- **Region**: Choose closest to your users
- **Branch**: main
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: 
  ```bash
  npm install && npx prisma generate && npx prisma migrate deploy
  ```
- **Start Command**: 
  ```bash
  npm start
  ```

**Environment Variables:**
Click **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon DB connection string |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (add after frontend deployment) |

**Instance Type:**
- Select **"Free"** (sufficient for demo/small apps)

5. Click **"Create Web Service"**

### Wait for Deployment

- First deployment takes 2-5 minutes
- Watch the logs for any errors
- Once deployed, you'll get a URL like: `https://expense-tracker-api.onrender.com`
- Test the health endpoint: `https://your-api.onrender.com/health`

### Important Notes

- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid tier ($7/month) for always-on service

## 3️⃣ Frontend Deployment (Vercel)

### Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

**Build Settings:**
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

**Environment Variables:**
Click **"Add"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-api.onrender.com` (your Render URL) |

5. Click **"Deploy"**

### Wait for Deployment

- First deployment takes 1-2 minutes
- Once deployed, you'll get a URL like: `https://expense-tracker-xyz.vercel.app`
- Test the app in your browser

### Update Backend CORS

1. Go back to Render dashboard
2. Open your web service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL` to your Vercel URL
5. Save changes (triggers automatic redeploy)

## 4️⃣ Verification

### Test the Application

1. **Open your Vercel URL**
2. **Add an expense**:
   - Amount: 50.00
   - Category: Food
   - Description: Lunch
   - Date: Today
3. **Verify it appears in the list**
4. **Check total updates**
5. **Test filtering by category**
6. **Test sorting**

### Test Idempotency

1. Open browser DevTools (F12)
2. Go to Network tab
3. Add an expense
4. Right-click the POST request → "Replay XHR"
5. Verify only one expense was created (check the list)

### Common Issues

**Backend not responding:**
- Check Render logs for errors
- Verify DATABASE_URL is correct
- Ensure Prisma migrations ran successfully

**CORS errors:**
- Verify FRONTEND_URL in Render matches your Vercel URL exactly
- Include protocol (https://)
- No trailing slash

**Database connection errors:**
- Verify Neon DB connection string includes `?sslmode=require`
- Check Neon DB is not paused (free tier auto-pauses)

## 5️⃣ Custom Domain (Optional)

### Vercel Custom Domain

1. In Vercel project settings → **"Domains"**
2. Add your domain (e.g., `expenses.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update Render's `FRONTEND_URL` to your custom domain

### Render Custom Domain

1. In Render service settings → **"Custom Domain"**
2. Add your domain (e.g., `api.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update Vercel's `VITE_API_URL` to your custom domain

## 6️⃣ Monitoring & Maintenance

### Render Monitoring

- View logs: Service → **"Logs"** tab
- Monitor metrics: Service → **"Metrics"** tab
- Set up alerts: Service → **"Alerts"** tab

### Vercel Monitoring

- View deployments: Project → **"Deployments"**
- Analytics: Project → **"Analytics"** (requires upgrade)
- Logs: Deployment → **"Functions"** → **"Logs"**

### Database Monitoring

- Neon dashboard shows:
  - Storage usage
  - Connection count
  - Query performance
  - Backup status

## 7️⃣ Continuous Deployment

Both Render and Vercel automatically deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push

# Automatic deployment triggers:
# 1. Render rebuilds backend
# 2. Vercel rebuilds frontend
# 3. Both go live in ~2-3 minutes
```

## 8️⃣ Scaling Considerations

### When to Upgrade

**Render:**
- Upgrade to Starter ($7/mo) when:
  - Need always-on service (no spin-down)
  - Expect consistent traffic
  - Need faster response times

**Vercel:**
- Free tier is generous (100 GB bandwidth)
- Upgrade to Pro ($20/mo) when:
  - Need analytics
  - Need password protection
  - Exceed free tier limits

**Neon DB:**
- Free tier: 0.5 GB storage, 1 project
- Upgrade to Pro ($19/mo) when:
  - Need more storage
  - Need multiple databases
  - Need point-in-time recovery

### Performance Optimization

1. **Add Redis for idempotency** (current: in-memory)
   - Use Upstash Redis (free tier available)
   - Survives server restarts
   - Shared across instances

2. **Add CDN for static assets**
   - Vercel includes CDN by default
   - Consider Cloudflare for additional caching

3. **Database indexing**
   - Already included in Prisma schema
   - Monitor slow queries in Neon dashboard

4. **Rate limiting**
   - Add express-rate-limit middleware
   - Prevent abuse and reduce costs

## 🎉 Success!

Your Expense Tracker is now live and production-ready!

**Share your app:**
- Frontend: `https://your-app.vercel.app`
- API: `https://your-api.onrender.com`

**Next steps:**
- Add authentication (Auth0, Clerk, or NextAuth)
- Implement user accounts
- Add data export features
- Build mobile app
- Add analytics and insights
