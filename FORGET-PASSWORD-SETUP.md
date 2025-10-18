# Forget Password Feature - Implementation Guide

## 📋 Overview

The Forget Password feature has been fully implemented using the same secure OTP approach as email verification. Users can reset their passwords in 3 simple steps:

1. **Enter Email** → System sends 6-digit OTP
2. **Verify OTP** → User enters code from email
3. **Set New Password** → User creates a strong new password

## 🎨 Features

✅ **Minimalist Clean UI** - Simple, spacious design with focus on typography
✅ **OTP Verification** - Secure 6-digit code sent via email (same as login OTP)
✅ **Password Strength Indicator** - Real-time feedback on password strength
✅ **Password Requirements** - Visual checklist showing requirements
✅ **Error Handling** - Clear error messages at each step
✅ **5-Minute Expiry** - OTP codes expire after 5 minutes for security
✅ **Multi-Step Flow** - Guided process through reset journey

## 📁 Files Created

### Frontend Components

- **ForgetPasswordForm.tsx** - Main component managing the forget password flow
- **ResetPasswordForm.tsx** - Password reset form with strength indicator
- **LoginFormNew.tsx** - Updated login form with minimalist design
- **OTPVerification.tsx** - Reused for OTP entry in forget password flow

### Backend Hooks

- **pb_hooks/request-password-reset.js** - Generates and sends password reset OTP
- **pb_hooks/verify-password-reset-otp.js** - Verifies password reset OTP
- **pb_hooks/reset-password.js** - Updates password in database

### Database Migration

- **pb_migrations/1760809500_add_password_reset_fields.js** - Adds password reset fields to users collection

## 🔧 Installation Steps

### Step 1: Database Migration

The migration adds two new fields to the `users` collection:

- `password_reset_otp` (text) - Stores the 6-digit OTP
- `password_reset_otp_expires_at` (date) - OTP expiry timestamp

**Run in PocketBase Console:**

```bash
# Navigate to PocketBase admin panel and run migrations
# Or simply restart PocketBase to auto-run pending migrations
```

### Step 2: Update Frontend

The auth context has been updated with three new functions:

```typescript
// Request password reset (sends OTP)
requestPasswordReset(email: string) => Promise<void>

// Verify password reset OTP
verifyPasswordResetOTP(email: string, otpCode: string) => Promise<void>

// Reset password
resetPassword(email: string, newPassword: string) => Promise<void>
```

### Step 3: Update Login Page

Replace the old LoginForm with the new minimalist design:

```typescript
// In your router or wherever LoginForm is imported
import LoginFormNew from "@/components/auth/LoginFormNew";

// Use instead of LoginForm
<LoginFormNew />;
```

### Step 4: Deploy

Deploy the backend hooks and frontend components:

```bash
# Backend: PocketBase hooks are auto-loaded
# Frontend: Build and deploy to Vercel
npm run build
```

## 🎯 User Flow

### Reset Password Journey

```
Login Page
    ↓
[Forgot password?] link
    ↓
Email Entry Form
    ↓
[Send Reset Code]
    ↓
OTP Sent to Email
    ↓
OTP Verification Form
    ↓
[Resend] or [Back]
    ↓
New Password Form
    ↓
Password Strength Check
    ↓
[Reset Password]
    ↓
✅ Success → Redirect to Login
```

## 🔐 Password Requirements

Users must create passwords that meet:

- ✓ At least 8 characters
- ✓ One uppercase letter (A-Z)
- ✓ One number (0-9)
- ✓ Special character recommended (optional)

### Password Strength Levels

| Strength  | Color  | Requirements Met |
| --------- | ------ | ---------------- |
| Very Weak | Red    | Only length      |
| Weak      | Yellow | Length + 1 more  |
| Fair      | Blue   | Length + 2 more  |
| Good      | Blue   | Length + 3 more  |
| Strong    | Green  | All requirements |

## 🎨 UI Design - Minimalist Clean Style

### Design Principles

1. **Typography Focus**

   - Large, light heading fonts
   - Clear hierarchy (h1, h2, p)
   - Generous whitespace

2. **Minimal Color Palette**

   - Blue (#1E40AF) for primary actions
   - Red (#DC2626) for errors/warnings
   - Gray (#6B7280) for secondary text
   - White background

3. **Spacing & Layout**

   - Max width: 448px (max-w-md)
   - Padding: 8px (32px total)
   - Input height: 40px (py-2.5)
   - Button height: 40px (py-2.5)

4. **Interactions**
   - Smooth transitions (150ms)
   - Focus rings for accessibility
   - Hover states on interactive elements
   - Disabled states with reduced opacity

### Components Styled

All auth components follow this design:

- **Login Form** - Email, password, forgot link
- **Register Form** - Name, email, password, domain
- **Forget Password Form** - Email entry → OTP → Password reset
- **OTP Verification** - 6-digit input fields
- **Password Reset** - Strong password creation

## 📧 Email Templates

### Password Reset OTP Email

```html
Welcome to Makbig Academy! Hi [User Name], We received a request to reset your
password. Use the code below to proceed: Your Password Reset Code: 1 2 3 4 5 6
This code will expire in 5 minutes. If you didn't request this, please ignore
this email. © 2024 Makbig Academy
```

### Success Email (Optional)

You can enhance by sending a success notification when password is reset.

## 🐛 Error Handling

| Scenario          | Error Message                                 |
| ----------------- | --------------------------------------------- |
| Email not found   | "User not found"                              |
| Empty email       | "Email is required"                           |
| Invalid OTP       | "Invalid OTP code. Please try again."         |
| Expired OTP       | "OTP has expired. Please request a new one"   |
| Weak password     | "Password is too weak..."                     |
| Password mismatch | "Passwords do not match"                      |
| Short password    | "Password must be at least 8 characters long" |
| Network error     | Connection errors are handled gracefully      |

## 🔗 Integration Checklist

- [ ] Database migration added and run
- [ ] Backend hooks created
- [ ] Frontend components created
- [ ] Auth context updated
- [ ] LoginFormNew component imported in router
- [ ] Forget password link visible on login page
- [ ] OTP emails configured to send
- [ ] Password validation working
- [ ] Error messages displaying correctly
- [ ] Tested on multiple devices
- [ ] Deployed to production

## 🚀 Testing

### Test Scenarios

1. **Request Password Reset**

   - Enter email that exists
   - Verify OTP sent to email
   - Invalid email shows "User not found"

2. **OTP Verification**

   - Enter incorrect code → error
   - Code expires after 5 minutes
   - Can resend code before expiry
   - Correct code advances to password reset

3. **Password Reset**

   - Enter weak password → validation error
   - Password too short → error
   - Passwords don't match → error
   - Valid password → success screen

4. **UI/UX**
   - Check responsiveness on mobile
   - Test keyboard navigation
   - Verify all icons render
   - Check loading states
   - Test error states

### Manual Testing Steps

```bash
# 1. Start backend
# PocketBase should be running on http://localhost:8090

# 2. Start frontend
npm start

# 3. Navigate to login page
# http://localhost:3000/auth/login

# 4. Click "Forgot password?"

# 5. Enter an existing user's email

# 6. Check email inbox for OTP

# 7. Enter OTP in verification form

# 8. Create new strong password

# 9. Verify success message

# 10. Try logging in with new password
```

## ⚙️ Configuration

### Customize OTP Expiry

In `backend/pb_hooks/request-password-reset.js`:

```javascript
// Change 5 minutes to desired value
const expiryTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
```

### Customize Password Requirements

In `frontent/src/components/auth/ResetPasswordForm.tsx`:

```typescript
// Modify password validation logic
if (password.length < 8) {
  // Change 8 to desired length
  setError("Password must be at least 8 characters long");
}
```

## 🌐 Deployment on Render + Vercel

### For Render (Backend)

```bash
# 1. Push changes to GitHub
git add .
git commit -m "Add forget password feature"
git push origin main

# 2. Render auto-deploys PocketBase
# 3. Migrations run automatically
```

### For Vercel (Frontend)

```bash
# 1. Build locally to verify
npm run build

# 2. Push to GitHub
git add .
git commit -m "Add forget password UI"
git push origin main

# 3. Vercel auto-deploys on push
```

## 📱 Response Format

### Request Password Reset

```json
POST /api/collections/users/request-password-reset
{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "Password reset code sent to your email",
  "expiresIn": 300
}
```

### Verify OTP

```json
POST /api/collections/users/verify-password-reset-otp
{
  "email": "user@example.com",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "OTP verified successfully",
  "userId": "abc123..."
}
```

### Reset Password

```json
POST /api/collections/users/reset-password
{
  "email": "user@example.com",
  "newPassword": "SecurePass123!"
}

Response:
{
  "success": true,
  "message": "Password reset successfully",
  "userId": "abc123...",
  "user": {
    "id": "abc123...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

## 🎓 Key Learning Points

1. **OTP Pattern**: Reused OTP approach for consistency
2. **Multi-Step Forms**: Managed state across multiple screens
3. **Password Security**: Real-time strength validation
4. **Error Handling**: Comprehensive error messages
5. **UI/UX Design**: Minimalist clean aesthetic
6. **Backend Hooks**: Secure API endpoints in PocketBase

## 🆘 Troubleshooting

**OTP not sending?**

- Check Resend API key is configured
- Verify email service is running
- Check backend logs for errors

**"User not found" error?**

- Verify email is registered in system
- Check email spelling
- Confirm user account exists

**Password validation failing?**

- Password must be 8+ characters
- Must contain uppercase letter
- Must contain number
- Check for typos in confirmation

**Migrations not running?**

- Restart PocketBase
- Check migration files in `pb_migrations` folder
- Verify file naming (timestamp format)

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review console logs (DevTools)
3. Check PocketBase admin panel
4. Review error messages in UI

---

## 🎉 Success!

You now have a complete password reset system with:

- ✅ Minimalist clean UI
- ✅ Secure OTP verification
- ✅ Strong password requirements
- ✅ Professional error handling
- ✅ Smooth user experience

Ready to deploy? Follow the deployment section above!
