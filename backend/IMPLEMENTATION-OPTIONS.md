# Email OTP Implementation Options

This document outlines different ways to implement the email OTP feature based on your infrastructure.

---

## Option 1: PocketBase Hooks (Recommended for Simple Setup)

### Pros:

- ✅ No additional services needed
- ✅ Everything runs with PocketBase
- ✅ Simple to debug
- ✅ No external dependencies

### Cons:

- ⚠️ Limited email functionality in hooks
- ⚠️ Harder to handle errors
- ⚠️ Limited async operations

### Implementation:

1. PocketBase hooks intercept API calls
2. Generate OTP and save to database
3. Call Resend API directly from hook
4. Verify OTP on second call

**Files:**

- `pb_hooks/request-otp.js` - Request OTP
- `pb_hooks/verify-otp.js` - Verify OTP

---

## Option 2: Separate Node.js Microservice (Recommended for Production)

### Pros:

- ✅ Better error handling
- ✅ Easier to maintain
- ✅ Can run independently
- ✅ Easier to test
- ✅ Can handle retries

### Cons:

- ⚠️ Requires additional infrastructure
- ⚠️ More complex deployment
- ⚠️ Additional latency

### Architecture:

```
Frontend (React)
    ↓ HTTP Request
PocketBase
    ↓ Internal Call
OTP Microservice (Node.js)
    ↓ HTTP Request
Resend API
```

### Setup Steps:

1. **Create Express app:**

```bash
cd backend
npm install express cors dotenv resend axios
```

2. **Create otp-service.js:**

```javascript
const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);
const pb = axios.create({
  baseURL: process.env.POCKETBASE_URL || "http://localhost:8090",
});

// Request OTP endpoint
app.post("/api/otp/request", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Update user in PocketBase
    const pbResponse = await pb.patch(
      `/api/collections/users/records/${email}`,
      {
        otp_code: otp,
        otp_expires_at: expiresAt,
      }
    );

    // Send email
    const emailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Makbig Academy - Email Verification Code",
      html: `<p>Your OTP: <strong>${otp}</strong></p><p>Expires in 5 minutes</p>`,
    });

    res.json({
      success: true,
      message: "OTP sent",
      messageId: emailResponse.id,
    });
  } catch (error) {
    console.error("OTP request error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP endpoint
app.post("/api/otp/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP required" });
    }

    // Get user from PocketBase
    const records = await pb.get(`/api/collections/users/records`, {
      params: { filter: `email = "${email}"` },
    });

    const user = records.data.items[0];
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify OTP
    if (user.otp_code !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Mark email as verified
    await pb.patch(`/api/collections/users/records/${user.id}`, {
      email_verified: true,
      otp_code: null,
      otp_expires_at: null,
    });

    res.json({
      success: true,
      message: "Email verified",
      userId: user.id,
    });
  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("OTP Service running on port 3001");
});
```

3. **Run service:**

```bash
node otp-service.js
```

4. **Update PocketBase to call this service:**

In `pb_hooks/request-otp.js`:

```javascript
// Instead of handling directly, call OTP service
const response = await fetch("http://localhost:3001/api/otp/request", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: data.email }),
});
```

---

## Option 3: Serverless Functions (AWS Lambda / Vercel)

### Pros:

- ✅ No server to manage
- ✅ Auto-scaling
- ✅ Pay per use
- ✅ Easy deployment

### Cons:

- ⚠️ Cold start latency
- ⚠️ Vendor lock-in
- ⚠️ Cost at scale

### Example for Vercel:

1. **Create vercel/functions/otp-request.ts:**

```typescript
import { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update PocketBase
    const pbRes = await fetch(
      `${process.env.POCKETBASE_URL}/api/collections/users/records/${email}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp_code: otp,
          otp_expires_at: new Date(Date.now() + 5 * 60 * 1000),
        }),
      }
    );

    // Send email
    const emailRes = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your code: <strong>${otp}</strong></p>`,
    });

    res.json({ success: true, messageId: emailRes.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

2. **Deploy to Vercel:**

```bash
vercel deploy
```

---

## Option 4: External Email Service Webhook

### Concept:

Use your email service provider's webhook capabilities

### Example with Mailgun:

1. Set up webhook in Mailgun dashboard
2. Configure callback URL
3. Email service calls your backend
4. Update database when email is sent/failed

---

## Comparison Matrix

| Feature          | Hooks   | Microservice | Serverless | Webhook |
| ---------------- | ------- | ------------ | ---------- | ------- |
| Setup Complexity | Low     | Medium       | Medium     | High    |
| Cost             | $0      | Low          | $0-20      | $0-10   |
| Scalability      | Good    | Excellent    | Excellent  | Good    |
| Error Handling   | Limited | Excellent    | Excellent  | Good    |
| Debugging        | Easy    | Medium       | Hard       | Medium  |
| Maintenance      | Low     | Medium       | Low        | Low     |
| Latency          | Fast    | Medium       | Slow       | Fast    |
| Vendor Lock-in   | No      | No           | Yes        | Yes     |

---

## Recommendation

### For Development:

Use **Option 1 (Hooks)** - Simple and everything in one place

### For Production:

Use **Option 2 (Microservice)** - Best balance of features and simplicity

### For Enterprise:

Use **Option 3 (Serverless)** - Maximum scalability and zero maintenance

---

## Migration Path

1. Start with **Hooks** (quick setup)
2. Monitor email delivery
3. If issues, migrate to **Microservice**
4. If scaling needed, migrate to **Serverless**

Each option has the same frontend code - only backend changes.

---

## Current Implementation

**Current:** Option 1 (Hooks)

**To upgrade to Option 2:**

1. Create Express app
2. Update hook endpoints to call service
3. Deploy service
4. Test thoroughly

**To upgrade to Option 3:**

1. Create Vercel functions
2. Deploy to Vercel
3. Update hook endpoints
4. Test

---

## Support

For issues with specific options, check:

- [Resend Docs](https://resend.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [PocketBase Docs](https://pocketbase.io/docs/)
