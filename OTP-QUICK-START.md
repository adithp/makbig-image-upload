# Email OTP Feature - Quick Start Guide

## What Was Implemented

Your application now has a complete email OTP verification system for user signup and login:

✅ 6-digit OTP codes  
✅ 5-minute expiry time  
✅ Resend email service integration  
✅ Beautiful OTP input UI  
✅ Auto-focus between digits  
✅ Paste support  
✅ Resend functionality  
✅ Error handling

---

## Getting Started in 5 Steps

### 1️⃣ Get Resend API Key (2 minutes)

- Go to [resend.dev](https://resend.dev)
- Click "Sign Up" and create an account
- Verify your email
- Go to **Settings → API Keys**
- Copy your API key

### 2️⃣ Update Environment Variables (1 minute)

Create/update your `.env` file in the `backend/` directory:

```env
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### 3️⃣ Install Backend Dependencies (1 minute)

```powershell
Set-Location "c:\Users\adith\makbig-academy\backend"
npm install resend
```

### 4️⃣ Apply Database Migration (Automatic)

The database migration will run automatically when you start PocketBase. It adds:

- `otp_code` - stores the OTP
- `otp_expires_at` - when OTP expires
- `email_verified` - email verification status

### 5️⃣ Test It Out (2 minutes)

**Terminal 1 - Start Backend:**

```powershell
Set-Location "c:\Users\adith\makbig-academy\backend"
./pocketbase serve
```

**Terminal 2 - Start Frontend:**

```powershell
Set-Location "c:\Users\adith\makbig-academy\frontent"
npm start
```

**Test the flow:**

1. Create a new account at `http://localhost:3000`
2. Logout
3. Login with your new account
4. You'll see "Verify Your Email" screen
5. Check backend console logs for OTP code
6. Enter the code to complete login

---

## File Changes Summary

### New Files Created:

- ✨ `backend/pb_migrations/1760809400_add_otp_fields.js` - Database migration
- ✨ `backend/pb_hooks/request-otp.js` - Generate & send OTP
- ✨ `backend/pb_hooks/verify-otp.js` - Verify OTP code
- ✨ `backend/services/otp.service.js` - OTP logic
- ✨ `backend/services/email.service.js` - Email templates
- ✨ `frontent/src/components/auth/OTPVerification.tsx` - OTP UI
- 📄 `EMAIL-OTP-SETUP.md` - Full setup guide
- 📄 `OTP-QUICK-START.md` - This file

### Updated Files:

- 📝 `frontent/src/contexts/PocketBaseAuthContext.tsx` - Added OTP logic
- 📝 `frontent/src/components/auth/LoginForm.tsx` - Added OTP flow
- 📝 `frontent/src/pocketbase/config.ts` - Added OTP helpers

---

## Understanding the Flow

```
User Login
    ↓
[Email & Password] → ❌ Fails? Show error
    ↓ ✓ Success
Check email_verified field
    ↓
NOT verified → Send OTP → Show OTP screen → User enters code → Verify → ✓ Complete login
    ↓
Already verified → ✓ Complete login immediately
```

---

## Frontend Components

### OTPVerification.tsx

Beautiful OTP input component with:

- 6 input fields (auto-focus)
- Paste support
- 5-minute timer
- Resend button
- Error messages
- Success animation

### LoginForm.tsx Updates

- Detects if OTP is required
- Handles OTP flow
- Shows OTP component when needed
- Redirects to dashboard after verification

---

## Backend Implementation

### OTP Helpers (config.ts)

```typescript
requestOTP(email); // Send OTP to email
verifyOTP(email, otpCode); // Verify the code
```

### Auth Context Updates

```typescript
login(); // Now returns { requiresOTP: boolean }
verifyOTP(); // New function to verify OTP
requestOTP(); // New function to request OTP
```

---

## Testing Without Emails (Development)

For local development, OTP codes are logged to console:

```
[OTP Sent] Email: user@example.com Code: 123456
```

To use in testing:

1. Check backend console output
2. Copy the 6-digit code
3. Paste into OTP verification screen
4. Click "Verify Email"

---

## Common Issues

### ❌ "RESEND_API_KEY not set"

→ Check your `.env` file has the API key

### ❌ "OTP has expired"

→ You have 5 minutes. Request a new one using "Resend Code"

### ❌ "Invalid OTP code"

→ Double-check you entered it correctly

### ❌ "User not found"

→ Make sure you're using the email that was used during signup

---

## Next Steps

1. **✅ Complete basic setup** - Follow steps 1-5 above
2. **📧 Set up custom domain** - For production, add domain to Resend
3. **🎨 Customize email template** - Edit `backend/services/email.service.js`
4. **🔐 Add rate limiting** - Prevent OTP request abuse
5. **📊 Monitor delivery** - Set up Resend webhooks
6. **🚀 Deploy to production** - Update environment variables on hosting

---

## Production Checklist

- [ ] Add custom domain to Resend
- [ ] Update email template with branding
- [ ] Set up error tracking/monitoring
- [ ] Add rate limiting to OTP endpoints
- [ ] Test with real emails
- [ ] Set up email delivery monitoring
- [ ] Document OTP flow for team

---

## For More Details

See **`EMAIL-OTP-SETUP.md`** for:

- Complete setup guide
- Advanced configuration
- Multiple email service providers
- Troubleshooting
- Production deployment guide

---

## Support

Questions? Check:

1. Backend logs (Terminal 1)
2. Browser console (F12)
3. Email-OTP-SETUP.md troubleshooting section
4. Resend dashboard for API usage

Happy coding! 🚀
