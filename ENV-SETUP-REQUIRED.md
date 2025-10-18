# ⚙️ Environment Variables - Must be Configured Before Deployment

**Check these are set on your deployment platforms**

---

## 🔴 CRITICAL - MUST HAVE

### On Render (Backend)

Go to: https://dashboard.render.com → Your Backend Service → Environment

**These MUST be set:**

```env
# Email Service (Required for OTP)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Frontend URL (For redirect links in emails)
FRONTEND_URL=https://your-frontend-domain.com
```

**Check if already set:**

```
1. Click "Show All"
2. Look for RESEND_API_KEY
3. Look for FRONTEND_URL
4. Both should have values (not empty)
```

---

### On Vercel (Frontend)

Go to: https://vercel.com → Your Project → Settings → Environment Variables

**These MUST be set:**

```env
# PocketBase Backend URL
REACT_APP_POCKETBASE_URL=https://your-backend-domain.com
```

**Check if already set:**

```
1. Go to Settings tab
2. Click "Environment Variables"
3. Look for REACT_APP_POCKETBASE_URL
4. Should have your backend URL (not empty)
```

---

## ✅ OPTIONAL - Nice to Have

### On Render (Backend)

```env
# Email service domain (if using custom domain with Resend)
RESEND_FROM_EMAIL=noreply@your-domain.com

# SMTP Settings (if using SMTP instead of Resend)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
```

---

## 🔍 HOW TO FIND YOUR VALUES

### RESEND_API_KEY

```
1. Go to: https://resend.com/api-keys
2. Create new API key (if needed)
3. Copy the key (starts with "re_")
4. Go to Render dashboard
5. Paste in RESEND_API_KEY
```

### FRONTEND_URL

```
Your Vercel deployment URL, for example:
- https://makbig-academy.vercel.app
- https://your-custom-domain.com
```

### REACT_APP_POCKETBASE_URL

```
Your Render backend URL, for example:
- https://your-backend-service.onrender.com
- https://api.your-domain.com
```

---

## ⚡ QUICK SETUP (5 minutes)

### 1. Add to Render

```
1. Go to https://dashboard.render.com
2. Click your backend service
3. Go to Settings → Environment
4. Add RESEND_API_KEY=your_key
5. Add FRONTEND_URL=https://your-frontend.vercel.app
6. Click Save
7. Service will auto-redeploy
```

### 2. Add to Vercel

```
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to Settings → Environment Variables
4. Add REACT_APP_POCKETBASE_URL=https://your-backend.onrender.com
5. Click Save
6. Trigger redeploy (git push or click Deploy)
```

---

## 🚨 COMMON MISTAKES

| Mistake                        | Problem                | Solution                      |
| ------------------------------ | ---------------------- | ----------------------------- |
| RESEND_API_KEY not set         | OTP emails won't send  | Add key to Render environment |
| REACT_APP_POCKETBASE_URL wrong | Backend won't connect  | Use https:// not http://      |
| FRONTEND_URL not set           | Email links won't work | Add your Vercel domain        |
| Key with extra spaces          | Authentication fails   | Copy carefully, no spaces     |
| Using old backend URL          | Points to wrong server | Update after migration        |

---

## ✅ VERIFICATION COMMANDS

### Test Render has correct env vars

```bash
# Check Render logs for errors
# Go to: https://dashboard.render.com/your-service
# Click "Logs" tab
# Look for: "API key configured" or similar
```

### Test Vercel has correct env vars

```bash
# Deploy again to verify
# Click "Deployments"
# Click "Redeploy" on latest
# Check build logs for errors
```

---

## 📋 CHECKLIST

Before deployment, verify:

- [ ] RESEND_API_KEY is set on Render
- [ ] FRONTEND_URL is set on Render (with https://)
- [ ] REACT_APP_POCKETBASE_URL is set on Vercel (with https://)
- [ ] All keys don't have extra spaces
- [ ] Services have redeployed after env changes
- [ ] No error messages in deployment logs

---

## 🎯 NEXT STEPS

1. Set environment variables (this document)
2. Run: `DEPLOY-NOW.md` deployment steps
3. Verify on production
4. Announce feature to users!

---

**Ready? Set env vars and then run `DEPLOY-NOW.md`** ✅
