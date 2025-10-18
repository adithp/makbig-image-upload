# 🚀 Deploy Everything to Vercel (100% Free)

Since PocketHost requires upgrade, let's deploy BOTH frontend and backend to Vercel!

## 🎯 Strategy

We'll use **Vercel's Edge Functions** to run PocketBase as a serverless function.

However, there's a simpler approach: **Use Railway.app or Render.com for backend** (both have working free tiers).

---

## ✅ **Recommended: Vercel (Frontend) + Railway (Backend)**

### Why Railway?
- ✅ **$5 free credit/month** (enough for your app)
- ✅ Actually works (no upgrade required)
- ✅ Supports Docker
- ✅ Auto-deploys from GitHub
- ✅ Simple setup

---

## 📋 Step-by-Step: Vercel + Railway

### Part 1: Deploy Backend to Railway (10 min)

#### Step 1: Sign Up for Railway

1. Go to: [https://railway.app](https://railway.app)
2. Click **"Login"** or **"Start a New Project"**
3. Choose **"Login with GitHub"**
4. Authorize Railway

✅ You're in!

#### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `adithp/makbig-image-upload`
4. Click **"Deploy Now"**

#### Step 3: Configure Backend Service

1. Railway will detect your project
2. Click **"Add Service"** → **"GitHub Repo"**
3. Select your repo again
4. Railway will show multiple services detected

5. **Configure Backend:**
   - Click on the backend service
   - Go to **"Settings"**
   - **Root Directory:** `backend`
   - **Dockerfile Path:** `backend/Dockerfile`
   - Click **"Save"**

#### Step 4: Add Environment Variables

1. Go to **"Variables"** tab
2. Add:
   - `PORT` = `8090`

#### Step 5: Generate Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Copy your backend URL (e.g., `https://makbig-backend.up.railway.app`)

✅ **Backend is deploying!** (takes 2-3 minutes)

---

### Part 2: Deploy Frontend to Vercel (5 min)

#### Step 1: Go to Vercel

1. Go to: [https://vercel.com](https://vercel.com)
2. Login with GitHub
3. Click **"Add New"** → **"Project"**

#### Step 2: Import Repository

1. Select: `adithp/makbig-image-upload`
2. Click **"Import"**

#### Step 3: Configure Build Settings

**Build Command:**
```bash
cd frontent && npm install && npm run build
```

**Output Directory:**
```
frontent/build
```

**Install Command:**
```bash
cd frontent && npm install
```

#### Step 4: Add Environment Variable

**Name:** `REACT_APP_POCKETBASE_URL`  
**Value:** `https://your-backend.up.railway.app` (your Railway backend URL)

⚠️ **Use YOUR actual Railway URL!**

#### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Done! 🎉

---

## 🎉 Your App is Live!

- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-backend.up.railway.app`
- **Admin:** `https://your-backend.up.railway.app/_/`

---

## 💰 Cost Breakdown

- **Vercel:** $0/month (free forever)
- **Railway:** $5 credit/month (free tier)
- **Total:** $0/month (Railway credit covers your usage)

---

## 📊 Railway Free Tier Details

- **$5 credit/month**
- **500 hours execution time**
- **100GB egress**
- **Enough for:** Small to medium traffic apps
- **Sleep:** No sleep! Always on

---

## 🔄 Alternative: Use Render.com Instead

If you prefer Render over Railway:

### Deploy to Render.com

1. Go to: [https://render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New"** → **"Blueprint"**
4. Connect your repo
5. Render will use your `render.yaml` file
6. Click **"Apply"**

**Note:** Render free tier sleeps after 15 min of inactivity.

---

## ✅ Which Should You Choose?

| Platform | Cost | Sleep? | Best For |
|----------|------|--------|----------|
| **Railway** | $5 credit | No | Your project! ⭐ |
| **Render** | $0 | Yes (15min) | Testing |
| **Fly.io** | $0 | No | Advanced users |

**Recommendation:** Use **Railway** - it's the easiest and doesn't sleep!

---

## 🚀 Quick Start

1. **Backend:** Deploy to Railway (10 min)
2. **Frontend:** Deploy to Vercel (5 min)
3. **Total time:** 15 minutes
4. **Cost:** $0/month

**Ready?** Start with Railway: [https://railway.app](https://railway.app)
