# 🚀 PocketBase Setup Guide for Makbig Academy

## Why PocketBase is Perfect for Your Academy

✅ **100% FREE** - No usage limits or hidden costs  
✅ **Self-hosted** - You control your data completely  
✅ **Built-in Admin UI** - No need to build admin dashboard  
✅ **Real-time** - Perfect for admin replies  
✅ **File Storage** - Built-in image handling  
✅ **Authentication** - User management included  

## 📦 Installation Steps

### 1. Download PocketBase

**Windows:**
```bash
# Download from https://pocketbase.io/docs/
# Or use PowerShell:
Invoke-WebRequest -Uri "https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_0.22.4_windows_amd64.zip" -OutFile "pocketbase.zip"
Expand-Archive -Path "pocketbase.zip" -DestinationPath "."
```

**macOS/Linux:**
```bash
curl -L https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase_0.22.4_darwin_amd64.zip -o pocketbase.zip
unzip pocketbase.zip
```

### 2. Start PocketBase Server

```bash
# Start PocketBase (creates database automatically)
./pocketbase serve
```

This will start PocketBase at `http://127.0.0.1:8090`

### 3. Setup Database Schema

1. **Go to Admin UI**: `http://127.0.0.1:8090/_/`
2. **Create Admin Account** (first time only)
3. **Create Collections** (see schema below)

## 🗄️ Database Schema

### Collection 1: `users`
```json
{
  "name": "users",
  "type": "auth",
  "schema": [
    {
      "name": "name",
      "type": "text",
      "required": true
    },
    {
      "name": "role",
      "type": "select",
      "required": true,
      "options": {
        "values": ["student", "admin"]
      }
    },
    {
      "name": "domain",
      "type": "text",
      "required": false
    }
  ]
}
```

### Collection 2: `domains`
```json
{
  "name": "domains",
  "type": "base",
  "schema": [
    {
      "name": "name",
      "type": "text",
      "required": true,
      "unique": true
    }
  ]
}
```

### Collection 3: `uploads`
```json
{
  "name": "uploads",
  "type": "base",
  "schema": [
    {
      "name": "student_id",
      "type": "relation",
      "required": true,
      "collectionId": "users_collection_id"
    },
    {
      "name": "image",
      "type": "file",
      "required": true,
      "options": {
        "maxSelect": 1,
        "maxSize": 5242880,
        "mimeTypes": ["image/jpeg", "image/png", "image/gif"]
      }
    },
    {
      "name": "week",
      "type": "number",
      "required": true
    },
    {
      "name": "domain",
      "type": "text",
      "required": true
    },
    {
      "name": "admin_reply",
      "type": "text",
      "required": false
    }
  ]
}
```

## 🔐 Security Rules

### Users Collection Rules
```javascript
// List rule
@request.auth.id != ""

// View rule  
@request.auth.id = id

// Create rule
@request.auth.id = ""

// Update rule
@request.auth.id = id

// Delete rule
@request.auth.id = id
```

### Domains Collection Rules
```javascript
// List rule
true

// View rule
true

// Create rule
@request.auth.role = "admin"

// Update rule
@request.auth.role = "admin"

// Delete rule
@request.auth.role = "admin"
```

### Uploads Collection Rules
```javascript
// List rule
@request.auth.id != ""

// View rule
@request.auth.id != ""

// Create rule
@request.auth.role = "student" && @request.auth.id = student_id

// Update rule
@request.auth.role = "admin" || (@request.auth.id = student_id && admin_reply = "")

// Delete rule
@request.auth.role = "admin"
```

## 🎯 Quick Start

### 1. Initialize Sample Data

After creating collections, add sample domains:

```javascript
// In PocketBase Admin UI, go to domains collection and add:
- Python Programming
- Full Stack Development  
- Data Analytics
- Machine Learning
- Web Design
- Mobile Development
```

### 2. Create Admin User

1. Go to `http://127.0.0.1:8090/_/`
2. Create admin account
3. Edit the user record and set `role` to `admin`

### 3. Update Frontend Config

Update `src/pocketbase/config.ts`:
```typescript
const pb = new PocketBase('http://127.0.0.1:8090');
```

### 4. Start Your App

```bash
npm start
```

## 🌟 PocketBase Admin UI Features

- **Real-time Dashboard** - See all data updates instantly
- **User Management** - Manage students and admins
- **File Management** - View uploaded images
- **Collection Editor** - Modify database schema
- **API Explorer** - Test API endpoints
- **Logs** - Monitor system activity

## 🚀 Deployment Options

### Option 1: Railway (Recommended)
```bash
# Deploy to Railway for free
railway login
railway init
railway up
```

### Option 2: Render
```bash
# Deploy to Render
# Upload pocketbase binary and create web service
```

### Option 3: Self-hosted VPS
```bash
# Deploy to any VPS with Docker
docker run -d -p 8090:8090 pocketbase/pocketbase serve
```

## 🎉 Benefits Over Firebase

| Feature | Firebase | PocketBase |
|---------|----------|------------|
| **Cost** | Pay per usage | 100% Free |
| **Data Control** | Google owns data | You own data |
| **Admin UI** | Need to build | Built-in |
| **Real-time** | Complex setup | Built-in |
| **File Storage** | Separate service | Integrated |
| **Database** | NoSQL only | SQLite |
| **Deployment** | Vendor lock-in | Anywhere |

## 🔧 Troubleshooting

### Common Issues

1. **"Connection refused"**
   - Make sure PocketBase is running on port 8090
   - Check firewall settings

2. **"Collection not found"**
   - Create collections in Admin UI first
   - Check collection names match exactly

3. **"Permission denied"**
   - Check security rules
   - Ensure user is authenticated

4. **"File upload failed"**
   - Check file size limits (5MB default)
   - Verify MIME types are allowed

### Getting Help

- **PocketBase Docs**: https://pocketbase.io/docs/
- **Community**: https://github.com/pocketbase/pocketbase/discussions
- **Examples**: https://github.com/pocketbase/pocketbase/tree/master/examples

---

**🎯 Your Makbig Academy is now powered by PocketBase - completely free and self-hosted!**
