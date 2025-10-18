# Email OTP Feature Setup Guide

This guide explains how to set up and configure the email OTP (One-Time Password) verification feature for user login.

## Overview

The email OTP feature adds an extra layer of security to your application by requiring users to verify their email address during their first login using a 6-digit OTP code sent via email.

### Flow:

1. User creates an account
2. On first login, after entering password, user is prompted to verify email
3. OTP is sent to their registered email
4. User enters the 6-digit code to complete verification
5. User gains full access to the platform

---

## Setup Steps

### Step 1: Set Up Resend API Account

1. **Create Resend Account:**

   - Go to [resend.dev](https://resend.dev)
   - Sign up for a free account
   - Verify your email

2. **Get API Key:**

   - Go to Dashboard → API Keys
   - Copy your API key (starts with `re_`)

3. **Add Domain (Optional but Recommended):**
   - For production, add your custom domain in Resend dashboard
   - For testing, use the default `onboarding@resend.dev`

### Step 2: Update Environment Variables

1. **Backend Environment (.env):**

   ```env
   RESEND_API_KEY=your_resend_api_key_here
   RESEND_FROM_EMAIL=your-email@yourdomain.com
   ```

   Or use default:

   ```env
   RESEND_API_KEY=your_resend_api_key_here
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```

2. **Frontend Environment (.env.production):**
   ```env
   REACT_APP_POCKETBASE_URL=http://your-backend-url:8090
   ```

### Step 3: Apply Database Migration

1. **Run Migration:**
   The migration file adds three new fields to the `users` collection:

   - `otp_code` (text): Stores the 6-digit OTP
   - `otp_expires_at` (date): Stores when OTP expires
   - `email_verified` (boolean): Tracks if email is verified

   To apply migration:

   ```bash
   # PocketBase will automatically apply migrations on startup
   # If running PocketBase manually, it will apply automatically
   ```

### Step 4: Install Dependencies

1. **Backend Dependencies:**

   ```bash
   cd backend
   npm install resend
   ```

2. **Frontend Dependencies:**
   (Already included in package.json, but verify)
   ```bash
   cd frontent
   npm install
   ```

### Step 5: Integrate Email Service

The email service is implemented in `backend/services/email.service.js`.

To enable actual email sending, you need to integrate it with PocketBase. Here are the options:

#### Option A: Use PocketBase Cloud Functions (Recommended)

1. Create a custom endpoint in PocketBase that calls the email service:
   ```javascript
   // In PocketBase admin panel or hooks
   routerAdd("POST", "/api/send-otp", (c) => {
     const email = c.queryParam("email");
     // Call sendOTPEmail function
   });
   ```

#### Option B: Use External Service

1. Deploy a Node.js service that handles email sending
2. Call it from the OTP hooks using HTTP requests

#### Option C: Mock for Testing

For development/testing without actual emails:

1. OTP codes will be logged to console
2. Test codes can be viewed in PocketBase logs
3. For production, implement one of the above options

### Step 6: Test the Feature

1. **Start Backend:**

   ```bash
   cd backend
   ./pocketbase serve
   ```

2. **Start Frontend:**

   ```bash
   cd frontent
   npm start
   ```

3. **Test Flow:**
   - Create a new account
   - Log out
   - Try to log in with your new account
   - You should see the OTP verification screen
   - Check backend logs for OTP code
   - Enter the OTP to complete verification

---

## File Structure

```
backend/
├── pb_hooks/
│   ├── request-otp.js      # Hook to generate and send OTP
│   └── verify-otp.js       # Hook to verify OTP code
├── pb_migrations/
│   └── 1760809400_add_otp_fields.js  # Database migration
└── services/
    ├── email.service.js    # Email sending service
    └── otp.service.js      # OTP generation and validation

frontent/
├── src/
│   ├── components/
│   │   └── auth/
│   │       └── OTPVerification.tsx    # OTP input component
│   ├── contexts/
│   │   └── PocketBaseAuthContext.tsx  # Updated with OTP methods
│   └── pocketbase/
│       └── config.ts                  # Updated with OTP helpers
```

---

## Configuration Options

### OTP Expiry Time

Default: 5 minutes

To change, edit `backend/services/otp.service.js`:

```javascript
function getOTPExpiryTime() {
  const now = new Date();
  const expiryTime = new Date(now.getTime() + 10 * 60 * 1000); // Change 10 for 10 minutes
  return expiryTime;
}
```

### OTP Length

Default: 6 digits

To change, edit `backend/services/otp.service.js`:

```javascript
function generateOTP() {
  // For 8 digits:
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
```

### Email Template

Edit `backend/services/email.service.js` to customize the email template sent to users.

---

## Troubleshooting

### OTP Not Sending

1. Check `RESEND_API_KEY` is correctly set
2. Verify Resend account has email credits
3. Check backend logs for errors

### OTP Verification Fails

1. Ensure OTP code is correct (check logs)
2. Verify OTP hasn't expired (5 minutes)
3. Check that `otp_code` field matches exactly

### Users Can't Login

1. Check that `email_verified` field exists in database
2. For existing users, set `email_verified = true` manually in database
3. Verify PocketBase URL is correct in frontend config

### Email Not Received

1. Check spam/junk folder
2. Verify email address is correct
3. If using `onboarding@resend.dev`, emails might be delayed

---

## Production Deployment

### Before Going Live:

1. **Add Custom Domain to Resend:**

   - Set up your custom domain (e.g., noreply@yourdomain.com)
   - Improves email deliverability

2. **Update Email Template:**

   - Customize with your branding
   - Add logo and company details

3. **Monitor Email Sending:**

   - Set up Resend webhooks to track bounces
   - Monitor delivery rates

4. **Set Appropriate Limits:**

   - Consider rate limiting OTP requests
   - Add maximum attempts for OTP verification

5. **Secure Environment Variables:**
   - Use strong, unique API keys
   - Rotate keys regularly
   - Never commit keys to version control

---

## Advanced: Custom Implementation

If you want to use a different email service instead of Resend:

1. **Update email.service.js** with your provider's SDK
2. **Modify the request-otp.js hook** to call your email service
3. **Test thoroughly** before deploying

Supported alternatives:

- SendGrid
- AWS SES
- Mailgun
- Brevo (formerly Sendinblue)

---

## API Endpoints

### Request OTP

```
POST /api/collections/users/request-otp
Content-Type: application/json

Body:
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "OTP sent to your email",
  "expiresIn": 300
}
```

### Verify OTP

```
POST /api/collections/users/verify-otp
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Email verified successfully",
  "userId": "user_id",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "student"
  }
}
```

---

## Support & Issues

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend logs for error messages
3. Verify all environment variables are set correctly
4. Ensure database migration was applied successfully

---

## Next Steps

- [ ] Set up Resend account and get API key
- [ ] Update environment variables
- [ ] Apply database migration
- [ ] Install dependencies
- [ ] Test OTP feature locally
- [ ] Deploy to production
- [ ] Monitor email delivery rates
- [ ] Collect user feedback
