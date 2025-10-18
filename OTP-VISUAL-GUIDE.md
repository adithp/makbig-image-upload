# Email OTP Feature - Visual Guide

## User Flow Diagrams

### 1️⃣ First Time User: Signup & First Login

```
┌─────────────────┐
│  Signup Page    │
│  (RegisterForm) │
└────────┬────────┘
         │
         ├─ User enters:
         │  - Name
         │  - Email
         │  - Password
         │  - Domain
         │
    [Sign Up Button]
         │
         ▼
┌─────────────────────────────────┐
│  Account Created ✓              │
│  email_verified = FALSE         │
│  Auto-login performed           │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Dashboard      │
│  (User logged)  │
└─────────────────┘
```

### 2️⃣ First Login With OTP

```
┌──────────────────┐
│   Login Page     │
│  (LoginForm)     │
└────────┬─────────┘
         │
         ├─ User enters:
         │  - Email
         │  - Password
         │
    [Sign In Button]
         │
         ▼
┌────────────────────────────┐
│ Verify Credentials         │
│ Check: email_verified      │
└────────┬───────────────────┘
         │
    ┌────▼─────┐
    │           │
    NO         YES
    │           │
    ▼           ▼
┌─────────────────┐    ┌──────────────┐
│  email_verified │    │  Dashboard   │
│    = FALSE      │    │  (Direct to) │
│ (needs OTP)     │    └──────────────┘
└────────┬────────┘
         │
         ▼
   [Send OTP]
         │
         ├─ Generate 6-digit OTP
         ├─ Save to database
         ├─ Set expiry (5 min)
         └─ Send via email
         │
         ▼
┌─────────────────────────────────────┐
│  OTPVerification Component          │
│  (OTPVerification.tsx)              │
│                                     │
│  ┌─────┬─────┬─────┬─────┬─────┬──│──┐
│  │ [ ] │ [ ] │ [ ] │ [ ] │ [ ] │ [ ]│
│  └─────┴─────┴─────┴─────┴─────┴────┘
│                                     │
│  ⏱️  Expires in: 4:55              │
│                                     │
│  [Verify Email Button]              │
│  Resend Code (appears after 5m)     │
│  Back to Login                      │
└─────────────────────────────────────┘
         │
         ├─ User enters OTP
         │  (from email)
         │
    [Verify Email Button]
         │
         ▼
┌───────────────────────────┐
│ Verify OTP               │
│ ✓ Code matches           │
│ ✓ Not expired            │
│ ✓ email_verified = TRUE  │
└────────┬─────────────────┘
         │
         ▼
┌────────────────────────────┐
│  ✓ Email Verified!        │
│  Redirecting to           │
│  Dashboard...             │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────┐
│  Dashboard           │
│  (Successfully       │
│   logged in)         │
└──────────────────────┘
```

### 3️⃣ Subsequent Logins (Already Verified)

```
┌──────────────────┐
│   Login Page     │
│  (LoginForm)     │
└────────┬─────────┘
         │
         ├─ User enters:
         │  - Email
         │  - Password
         │
    [Sign In Button]
         │
         ▼
┌────────────────────────────┐
│ Verify Credentials         │
│ Check: email_verified      │
└────────┬───────────────────┘
         │
    ┌────▼─────┐
    │           │
    NO         YES
    │           │
    ▼           ▼
  [OTP]    ┌──────────────┐
           │  Dashboard   │
           │  (Direct     │
           │   login)     │
           └──────────────┘
```

---

## Screen Mockups

### Login Form

```
╔═══════════════════════════════════════════╗
║   Sign in to Makbig Academy              ║
║   Access your student or admin dashboard ║
║                                          ║
║  Email:                                  ║
║  ┌──────────────────────────────────────┐║
║  │ user@example.com                     ││
║  └──────────────────────────────────────┘║
║                                          ║
║  Password:                               ║
║  ┌──────────────────────────────────────┐║
║  │ ••••••••••   👁️                      ││
║  └──────────────────────────────────────┘║
║                                          ║
║  ┌──────────────────────────────────────┐║
║  │      Sign in                          ║
║  └──────────────────────────────────────┘║
║                                          ║
╚═══════════════════════════════════════════╝
```

### OTP Verification Screen

```
╔═══════════════════════════════════════════╗
║          Verify Your Email               ║
║                                          ║
║     📧                                   ║
║   We sent a verification code to:       ║
║   user@example.com                       ║
║                                          ║
║  Enter verification code:                ║
║  ┌─────┬─────┬─────┬─────┬─────┬─────┐ ║
║  │ 1   │ 2   │ 3   │ 4   │ 5   │ 6   │ ║
║  └─────┴─────┴─────┴─────┴─────┴─────┘ ║
║                                          ║
║  ⏱️  Code expires in: 4:55              ║
║                                          ║
║  ┌──────────────────────────────────────┐║
║  │   Verify Email                        ║
║  └──────────────────────────────────────┘║
║                                          ║
║  Didn't receive the code?                ║
║  Try again in 4:55                       ║
║                                          ║
║              Back to Login               ║
║                                          ║
╚═══════════════════════════════════════════╝
```

### Success Screen

```
╔═══════════════════════════════════════════╗
║                                          ║
║              ✅                          ║
║                                          ║
║        Email Verified!                   ║
║                                          ║
║   Your email has been successfully       ║
║   verified. Redirecting to your          ║
║   dashboard...                           ║
║                                          ║
║   ⏳ Redirecting in 3 seconds...        ║
║                                          ║
╚═══════════════════════════════════════════╝
```

---

## Email Templates

### OTP Email

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Welcome to Makbig Academy!                        │
│                                                     │
│  Hi User,                                          │
│                                                     │
│  Thank you for signing up. To complete your        │
│  email verification, please use the following      │
│  code:                                             │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │  Verification Code                          │   │
│  │  1 2 3 4 5 6                               │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ⏱️  This code will expire in 5 minutes           │
│                                                     │
│  If you didn't sign up for Makbig Academy,         │
│  please ignore this email.                         │
│                                                     │
│  © 2024 Makbig Academy. All rights reserved.       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Welcome Email

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Welcome to Makbig Academy! 🎉                    │
│                                                     │
│  Hi User,                                          │
│                                                     │
│  ✓ Your email has been successfully verified!      │
│                                                     │
│  You can now log in to your account and start      │
│  your learning journey.                            │
│                                                     │
│  Getting Started:                                  │
│  • Complete your profile information               │
│  • Explore available courses and domains           │
│  • Start submitting your weekly assignments        │
│  • Connect with other students                     │
│                                                     │
│  If you have any questions, contact our team.      │
│                                                     │
│  Happy learning!                                   │
│                                                     │
│  © 2024 Makbig Academy. All rights reserved.       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        React Frontend                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  LoginForm Component                                       │ │
│  │  ├─ Email input                                           │ │
│  │  ├─ Password input                                        │ │
│  │  └─ Shows OTPVerification when needed                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│               │                              ▲                   │
│               │ login()                      │ verifyOTP()        │
│               ▼                              │                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Auth Context                                            │ │
│  │  ├─ login(email, password)                               │ │
│  │  ├─ requestOTP(email)                                    │ │
│  │  └─ verifyOTP(email, otp)                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                      │ HTTP Requests      ▲
                      │                   │ HTTP Responses
                      ▼                   │
┌──────────────────────────────────────────────────────────────────┐
│                     PocketBase Backend                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  API Endpoints                                             │ │
│  │  ├─ POST /auth (login)                                    │ │
│  │  ├─ POST /api/collections/users/request-otp              │ │
│  │  └─ POST /api/collections/users/verify-otp               │ │
│  └────────┬───────────────────────────────────────┬──────────┘ │
│           │                                        │             │
│           ▼                                        ▼             │
│  ┌──────────────────────┐         ┌──────────────────────────┐ │
│  │  Database (SQLite)   │         │  Services                │ │
│  │  users collection    │         │  ├─ otp.service.js      │ │
│  │  ├─ email_verified   │         │  ├─ email.service.js    │ │
│  │  ├─ otp_code         │         │  └─ resend (npm)        │ │
│  │  └─ otp_expires_at   │         └──────────┬──────────────┘ │
│  └──────────────────────┘                    │                 │
│                                              ▼                  │
│                                    ┌──────────────────────┐    │
│                                    │  Resend API Service  │    │
│                                    │  (Email Provider)    │    │
│                                    └──────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
                                              │
                                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      User's Email (Inbox)                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  From: onboarding@resend.dev                               │ │
│  │  Subject: Makbig Academy - Email Verification Code         │ │
│  │                                                            │ │
│  │  Your OTP: 123456                                         │ │
│  │  Expires in 5 minutes                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
User enters OTP
        │
        ▼
    Is OTP empty?
    ├─ YES → ❌ "Please enter all 6 digits"
    └─ NO → Continue
        │
        ▼
    Send to backend
        │
        ├─ Network error → ❌ "Connection failed"
        │
        ├─ User not found → ❌ "User not found"
        │
        ├─ OTP invalid → ❌ "Invalid OTP code"
        │
        ├─ OTP expired → ❌ "OTP has expired. Resend code?"
        │
        └─ OTP valid → ✅ Success → Redirect to dashboard
```

---

## Technology Stack

```
┌─────────────────────────────────────────────┐
│           Frontend (React)                  │
│                                             │
│  TypeScript                                 │
│  Tailwind CSS                               │
│  Lucide Icons                               │
│  Context API (Auth)                         │
└─────────────────────────────────────────────┘
                  │
                  │ HTTP/REST
                  │
┌─────────────────────────────────────────────┐
│      Backend (PocketBase + Node.js)         │
│                                             │
│  PocketBase (SQLite)                        │
│  JavaScript Hooks                           │
│  Node.js Services                           │
│  Resend (npm package)                       │
└─────────────────────────────────────────────┘
                  │
                  │ HTTP
                  │
┌─────────────────────────────────────────────┐
│      Email Service (Resend)                 │
│                                             │
│  REST API                                   │
│  Email templates                            │
│  Delivery tracking                          │
└─────────────────────────────────────────────┘
```

---

## Security Flow

```
┌──────────────────────────────────────────────┐
│  User Registration                           │
│  1. Create account                           │
│  2. Set email_verified = FALSE               │
│  3. Password hashed by PocketBase           │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────────────────────────────────┐
│  First Login                                 │
│  1. Validate email & password                │
│  2. Generate random 6-digit OTP              │
│  3. Set expiry to 5 minutes                  │
│  4. Send OTP via email                       │
│  5. Store in database (not accessible)       │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────────────────────────────────┐
│  OTP Entry                                   │
│  1. User receives email                      │
│  2. User enters code                         │
│  3. Frontend sends code to backend           │
│  4. Backend verifies:                        │
│     - Code matches                           │
│     - Not expired                            │
│  5. If valid, set email_verified = TRUE      │
│  6. Clear OTP from database                  │
└──────────────────┬───────────────────────────┘
                   │
┌──────────────────────────────────────────────┐
│  Full Access Granted                         │
│  1. User fully authenticated                 │
│  2. Access to dashboard                      │
│  3. Future logins skip OTP                   │
└──────────────────────────────────────────────┘
```

---

## Environment Setup

```
Development
├─ RESEND_API_KEY: (from resend.dev)
├─ RESEND_FROM_EMAIL: onboarding@resend.dev
└─ PocketBase: http://localhost:8090

Production
├─ RESEND_API_KEY: (prod key)
├─ RESEND_FROM_EMAIL: noreply@yourdomain.com
└─ PocketBase: https://your-api.com
```

---

## Feature Matrix

```
┌──────────────────┬──────────┬─────────────┬──────────────┐
│ Feature          │ Dev Mode │ Production  │ Notes        │
├──────────────────┼──────────┼─────────────┼──────────────┤
│ OTP Generation   │    ✓     │      ✓      │ 6 digits     │
│ OTP Storage      │    ✓     │      ✓      │ Encrypted    │
│ Email Sending    │  Mocked  │      ✓      │ Via Resend   │
│ OTP Verification │    ✓     │      ✓      │ 5 min expiry │
│ Rate Limiting    │    ✗     │  Recommend │ Optional     │
│ Audit Log        │    ✗     │  Recommend │ Optional     │
│ SMS OTP          │    ✗     │  Future    │ Twilio       │
└──────────────────┴──────────┴─────────────┴──────────────┘
```

---

That's it! You now have a complete visual understanding of the email OTP feature. 🎉
