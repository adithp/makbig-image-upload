# 🆓 Free Hosting Guide - MakBig Academy

## 🎯 Best Free Hosting Option: Vercel + PocketHost

**Total Cost: $0/month** | **Setup Time: 15 minutes**

---

## 📋 Step-by-Step Deployment

### Part 1: Deploy Backend to PocketHost (5 minutes)

#### 1. Sign Up for PocketHost

1. Go to [pockethost.io](https://pockethost.io)
2. Click "Sign Up" (it's FREE)
3. Verify your email

#### 2. Create PocketBase Instance

1. Click "Create Instance"
2. Choose a subdomain (e.g., `makbig-academy`)
3. Your backend URL will be: `https://makbig-academy.pockethost.io`
4. Wait for instance to be created

#### 3. Setup Database

1. Click on your instance
2. Go to "Admin" → Opens PocketBase admin panel
3. Create your admin account
4. Your database collections will be auto-created from migrations

#### 4. Upload Migrations (Optional)

If collections aren't created automatically:
1. Download your `backend/pb_migrations` folder
2. In PocketHost dashboard, go to "Files"
3. Upload migration files to `pb_migrations/` folder
4. Restart instance

✅ **Backend is now live at:** `https://your-subdomain.pockethost.io`

---

### Part 2: Deploy Frontend to Vercel (10 minutes)

#### 1. Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

#### 2. Import Your Project

1. Click "Add New" → "Project"
2. Import your GitHub repository: `adithp/makbig-image-upload`
3. Click "Import"

#### 3. Configure Build Settings

**Framework Preset:** Create React App

**Root Directory:** Leave as `.` (root)

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

#### 4. Add Environment Variable

Click "Environment Variables" and add:

**Name:** `REACT_APP_POCKETBASE_URL`  
**Value:** `https://your-subdomain.pockethost.io`

(Replace with your actual PocketHost URL)

#### 5. Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Your app will be live!

✅ **Frontend is now live at:** `https://your-project.vercel.app`

---

## 🎉 Your App is Live!

- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-subdomain.pockethost.io`
- **Admin Panel:** `https://your-subdomain.pockethost.io/_/`

---

## 🔧 Alternative: Deploy Everything to Render.com

If you prefer one platform for both frontend and backend:

### Deploy to Render.com

#### 1. Sign Up

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render

#### 2. Deploy Backend

1. Click "New" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name:** `makbig-backend`
   - **Environment:** Docker
   - **Dockerfile Path:** `backend/Dockerfile`
   - **Port:** 8090
   - **Plan:** Free

4. Add Environment Variable:
   - `PORT=8090`

5. Click "Create Web Service"

#### 3. Deploy Frontend

1. Click "New" → "Static Site"
2. Connect your GitHub repo
3. Configure:
   - **Name:** `makbig-frontend`
   - **Build Command:** `cd frontent && npm install && npm run build`
   - **Publish Directory:** `frontent/build`

4. Add Environment Variable:
   - `REACT_APP_POCKETBASE_URL=https://makbig-backend.onrender.com`

5. Click "Create Static Site"

✅ **Your app is live!**

**Note:** Free tier sleeps after 15 min of inactivity (first request takes 30s to wake up)

---

## 🆓 Other Free Hosting Options

### Railway.app
- **Free Tier:** $5 credit/month
- **Best For:** Full-stack apps
- **Setup:** Auto-detects Docker Compose
- **URL:** [railway.app](https://railway.app)

### Fly.io
- **Free Tier:** 3 VMs free
- **Best For:** Production apps
- **Setup:** CLI-based deployment
- **URL:** [fly.io](https://fly.io)

### Oracle Cloud
- **Free Tier:** Always free (2 VMs)
- **Best For:** Full control
- **Setup:** Like your own Linux server
- **URL:** [oracle.com/cloud/free](https://www.oracle.com/cloud/free/)

---

## 📊 Comparison Table

| Platform | Frontend | Backend | Database | Cost | Sleep? |
|----------|----------|---------|----------|------|--------|
| **Vercel + PocketHost** | ✅ | ✅ | ✅ | $0 | No |
| **Render** | ✅ | ✅ | ✅ | $0 | Yes (15min) |
| **Railway** | ✅ | ✅ | ✅ | $5 credit | Yes |
| **Fly.io** | ✅ | ✅ | ✅ | $0 | No |
| **Oracle Cloud** | ✅ | ✅ | ✅ | $0 | No |

---

## 🎯 Recommended Setup

**For Your Project (MakBig Academy):**

### Option 1: Vercel + PocketHost (Easiest)
```
✅ Completely free
✅ No sleep/downtime
✅ Easy setup
✅ Auto-deploy from GitHub
✅ SSL included
```

### Option 2: Render.com (All-in-One)
```
✅ Free tier
✅ One platform for everything
✅ Auto-deploy from GitHub
✅ SSL included
⚠️ Sleeps after 15 min inactivity
```

---

## 🚀 Quick Start Commands

### For Vercel Deployment

```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy from command line
cd c:\Users\adith\makbig-academy
vercel

# Or just use the web dashboard (easier)
```

### For Render Deployment

Just connect your GitHub repo through the web dashboard - no CLI needed!

---

## 🔐 Important: Update Environment Variables

After deploying, update your frontend environment variable:

**On Vercel:**
1. Go to Project Settings
2. Click "Environment Variables"
3. Update `REACT_APP_POCKETBASE_URL` to your PocketHost URL
4. Redeploy

**On Render:**
1. Go to your static site
2. Click "Environment"
3. Update `REACT_APP_POCKETBASE_URL`
4. Redeploy

---

## 📝 Deployment Checklist

- [ ] Backend deployed to PocketHost
- [ ] Got backend URL (e.g., `https://makbig.pockethost.io`)
- [ ] Created admin account in PocketBase
- [ ] Frontend deployed to Vercel
- [ ] Environment variable set with backend URL
- [ ] Tested user registration
- [ ] Tested image upload
- [ ] Tested admin panel

---

## 🐛 Troubleshooting

### Frontend can't connect to backend

**Solution:** Check environment variable
```
REACT_APP_POCKETBASE_URL=https://your-subdomain.pockethost.io
```
Make sure there's no trailing slash!

### Build fails on Vercel

**Solution:** Check build command
```bash
cd frontent && npm install && npm run build
```

### PocketBase collections not created

**Solution:** Upload migrations manually or create collections in admin panel

---

## 💡 Pro Tips

1. **Custom Domain:** Both Vercel and PocketHost support custom domains (free)
2. **Auto-Deploy:** Push to GitHub → Auto-deploys to Vercel
3. **Monitoring:** Use Vercel Analytics (free) to monitor your app
4. **Backups:** PocketHost auto-backs up your database

---

## 🎉 You're Done!

Your app is now live and accessible from anywhere in the world - **completely free!**

**Next Steps:**
1. Share your app URL with users
2. Monitor usage in Vercel/PocketHost dashboards
3. Setup custom domain (optional)
4. Add more features!

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- PocketHost Docs: https://pockethost.io/docs
- Render Docs: https://render.com/docs

**Your app is live! 🚀**
