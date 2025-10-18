# 📊 Visual Deployment Guide

## 🎯 The Big Picture

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR PROJECT                         │
│                                                         │
│  ┌──────────────┐              ┌──────────────┐       │
│  │   Frontend   │              │   Backend    │       │
│  │   (React)    │◄────────────►│ (PocketBase) │       │
│  │              │   API Calls  │              │       │
│  │  Port 3000   │              │  Port 8090   │       │
│  └──────────────┘              └──────────────┘       │
│         │                              │               │
│         │                              │               │
│         ▼                              ▼               │
│  ┌──────────────┐              ┌──────────────┐       │
│  │    Nginx     │              │   Database   │       │
│  │ Web Server   │              │   (SQLite)   │       │
│  └──────────────┘              └──────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Docker Compose
                         │
                         ▼
              ┌──────────────────┐
              │  Linux Server    │
              │  (Your VPS)      │
              └──────────────────┘
```

## 🔄 Deployment Flow

```
Step 1: Prepare
┌─────────────────┐
│ Your Computer   │
│                 │
│ 1. Git Clone    │
│ 2. Edit .env    │
│ 3. Commit       │
└────────┬────────┘
         │
         │ git push
         ▼
┌─────────────────┐
│  GitHub/GitLab  │
└────────┬────────┘
         │
         │ git clone
         ▼
┌─────────────────┐
│ Linux Server    │
└─────────────────┘

Step 2: Deploy
┌─────────────────┐
│ Linux Server    │
│                 │
│ ./deploy.sh     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Docker Build    │
│                 │
│ Building...     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Services Start  │
│                 │
│ ✓ Backend       │
│ ✓ Frontend      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ App Running! 🎉 │
└─────────────────┘
```

## 📦 Docker Container Structure

```
┌───────────────────────────────────────────────────────┐
│                  Docker Host (Linux Server)           │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │         Docker Network (makbig-network)     │    │
│  │                                             │    │
│  │  ┌──────────────────┐  ┌─────────────────┐ │    │
│  │  │ Frontend         │  │ Backend         │ │    │
│  │  │ Container        │  │ Container       │ │    │
│  │  │                  │  │                 │ │    │
│  │  │ ┌──────────────┐ │  │ ┌─────────────┐ │ │    │
│  │  │ │ Nginx:80     │ │  │ │ PocketBase  │ │ │    │
│  │  │ │              │ │  │ │ :8090       │ │ │    │
│  │  │ │ React Build  │ │  │ │             │ │ │    │
│  │  │ └──────────────┘ │  │ └─────────────┘ │ │    │
│  │  │                  │  │                 │ │    │
│  │  │ Port: 3000       │  │ Port: 8090      │ │    │
│  │  └────────┬─────────┘  └────────┬────────┘ │    │
│  │           │                     │          │    │
│  └───────────┼─────────────────────┼──────────┘    │
│              │                     │               │
│              │                     │               │
│  ┌───────────┴─────────────────────┴──────────┐    │
│  │            Volume Mounts                    │    │
│  │  • backend/pb_data → /app/pb_data          │    │
│  │  • backend/pb_migrations → /app/pb_migrations│  │
│  └─────────────────────────────────────────────┘    │
│                                                       │
└───────────────────────────────────────────────────────┘
         │                           │
         │ Port 3000                 │ Port 8090
         ▼                           ▼
    [Internet Users]            [API Requests]
```

## 🌐 Network Flow

```
User Browser
     │
     │ http://your-server:3000
     ▼
┌─────────────────┐
│  Frontend       │
│  (Nginx)        │
│  Port 3000      │
└────────┬────────┘
         │
         │ Needs data?
         │
         │ API Request
         │ http://backend:8090/api/...
         ▼
┌─────────────────┐
│  Backend        │
│  (PocketBase)   │
│  Port 8090      │
└────────┬────────┘
         │
         │ Query database
         ▼
┌─────────────────┐
│  Database       │
│  (SQLite)       │
│  pb_data/       │
└─────────────────┘
```

## 📁 File System Layout

```
Linux Server
│
└── /home/user/makbig-academy/
    │
    ├── docker-compose.yml          ← Orchestration
    ├── .env                        ← Your config
    ├── deploy.sh                   ← Deploy script
    │
    ├── backend/
    │   ├── Dockerfile              ← How to build
    │   ├── pocketbase              ← Linux binary
    │   ├── pb_data/                ← DATABASE (backup!)
    │   │   ├── data.db            ← Main database
    │   │   └── logs.db            ← Logs
    │   └── pb_migrations/          ← Schema
    │
    └── frontent/
        ├── Dockerfile              ← How to build
        ├── nginx.conf              ← Web server
        ├── src/                    ← Source code
        └── build/                  ← Built files (in container)
```

## 🔄 Data Flow

### User Registration Flow:
```
1. User fills form
   ↓
2. Frontend sends to: http://backend:8090/api/collections/users/records
   ↓
3. PocketBase validates
   ↓
4. Saves to database (pb_data/data.db)
   ↓
5. Returns success
   ↓
6. Frontend shows confirmation
```

### Image Upload Flow:
```
1. User selects image
   ↓
2. Frontend uploads to: http://backend:8090/api/collections/uploads/records
   ↓
3. PocketBase saves file
   ↓
4. Stores in: pb_data/storage/
   ↓
5. Creates database record
   ↓
6. Returns file URL
   ↓
7. Frontend displays image
```

## 🚀 Deployment Process Visualization

```
┌─────────────────────────────────────────────────────┐
│ STEP 1: Prepare Server                             │
│                                                     │
│ $ sudo apt update                                   │
│ $ sudo apt install docker docker-compose           │
│                                                     │
│ Status: [████████████████████████] 100%            │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 2: Clone Repository                           │
│                                                     │
│ $ git clone <repo> makbig-academy                   │
│ $ cd makbig-academy                                 │
│                                                     │
│ Status: [████████████████████████] 100%            │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 3: Configure Environment                      │
│                                                     │
│ $ cp .env.example .env                              │
│ $ nano .env                                         │
│   REACT_APP_POCKETBASE_URL=http://server:8090      │
│                                                     │
│ Status: [████████████████████████] 100%            │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 4: Build & Deploy                             │
│                                                     │
│ $ ./deploy.sh                                       │
│                                                     │
│ Building backend...  [████████████] 100%           │
│ Building frontend... [████████████] 100%           │
│ Starting services... [████████████] 100%           │
│                                                     │
│ ✓ Backend running on port 8090                     │
│ ✓ Frontend running on port 3000                    │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ STEP 5: Initial Setup                              │
│                                                     │
│ 1. Visit: http://server:8090/_/                    │
│ 2. Create admin account                            │
│ 3. Login to admin panel                            │
│                                                     │
│ Status: [████████████████████████] 100%            │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│ 🎉 DEPLOYMENT COMPLETE!                            │
│                                                     │
│ Frontend: http://your-server:3000                  │
│ Backend:  http://your-server:8090                  │
│ Admin:    http://your-server:8090/_/               │
└─────────────────────────────────────────────────────┘
```

## 🔧 Environment Variables Flow

```
.env file
   │
   │ REACT_APP_POCKETBASE_URL=http://backend:8090
   │
   ├─────────────────────────────────┐
   │                                 │
   ▼                                 ▼
docker-compose.yml          frontent/Dockerfile
   │                                 │
   │ args:                           │ ARG REACT_APP_POCKETBASE_URL
   │   REACT_APP_POCKETBASE_URL      │ ENV REACT_APP_POCKETBASE_URL
   │                                 │
   └─────────────┬───────────────────┘
                 │
                 ▼
         React Build Process
                 │
                 │ process.env.REACT_APP_POCKETBASE_URL
                 ▼
         pocketbase/config.ts
                 │
                 │ const pb = new PocketBase(URL)
                 ▼
         Application Runtime
```

## 📊 Service Health Check

```
Every 30 seconds:

Docker ──► Backend Container
           │
           │ wget http://localhost:8090/api/health
           │
           ├─► ✓ Response 200 OK
           │   └─► Status: Healthy
           │
           └─► ✗ No response
               └─► Status: Unhealthy
                   └─► Auto-restart container
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│ Layer 1: Firewall (UFW)                │
│ • Allow: 22 (SSH), 80 (HTTP), 443      │
│ • Block: Everything else                │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Layer 2: Nginx (Reverse Proxy)         │
│ • SSL/TLS termination                   │
│ • Security headers                      │
│ • Rate limiting                         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Layer 3: Docker Network                 │
│ • Container isolation                   │
│ • Internal communication only           │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Layer 4: Application                    │
│ • PocketBase authentication             │
│ • Role-based access control             │
│ • Input validation                      │
└─────────────────────────────────────────┘
```

## 💾 Backup Strategy Visualization

```
Daily Backup (2 AM)
        │
        ▼
┌─────────────────┐
│ Backup Script   │
│ runs            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Compress        │
│ pb_data/        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Save to         │
│ /backups/       │
│ pb_data_DATE    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Keep last 7     │
│ Delete older    │
└─────────────────┘
```

## 🔄 Update Process

```
New Code Available
        │
        ▼
┌─────────────────┐
│ git pull        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ docker-compose  │
│ up -d --build   │
└────────┬────────┘
         │
         ├─► Build new images
         │   └─► Frontend
         │   └─► Backend
         │
         ├─► Stop old containers
         │
         ├─► Start new containers
         │
         └─► Health check
             ├─► ✓ Success → Done
             └─► ✗ Failed → Rollback
```

## 📱 Access Patterns

```
Local Development:
┌──────────────┐
│ Your PC      │
│ localhost    │
└──────┬───────┘
       │
       ├─► http://localhost:3000 (Frontend)
       └─► http://localhost:8090 (Backend)


Same Network:
┌──────────────┐
│ Your Phone   │
│ WiFi         │
└──────┬───────┘
       │
       ├─► http://192.168.1.100:3000 (Frontend)
       └─► http://192.168.1.100:8090 (Backend)


Production:
┌──────────────┐
│ Any Device   │
│ Internet     │
└──────┬───────┘
       │
       ├─► https://yourdomain.com (Frontend)
       └─► https://api.yourdomain.com (Backend)
```

## 🎯 Quick Reference

```
┌─────────────────────────────────────────────────┐
│ COMMAND CHEAT SHEET                             │
├─────────────────────────────────────────────────┤
│                                                 │
│ Start:     docker-compose up -d                 │
│ Stop:      docker-compose down                  │
│ Restart:   docker-compose restart               │
│ Logs:      docker-compose logs -f               │
│ Status:    docker-compose ps                    │
│ Rebuild:   docker-compose up -d --build         │
│                                                 │
│ Backend logs:   docker-compose logs -f backend  │
│ Frontend logs:  docker-compose logs -f frontend │
│                                                 │
│ Backup:    tar -czf backup.tar.gz backend/pb_data/ │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 🎉 Success Indicators

```
✓ Deployment Successful When:

┌─────────────────────────────────────────┐
│ ✓ docker-compose ps shows "Up"         │
│ ✓ Frontend loads at :3000               │
│ ✓ Backend responds at :8090             │
│ ✓ Admin panel accessible at :8090/_/    │
│ ✓ Can create admin account              │
│ ✓ Can register test user                │
│ ✓ Can upload images                     │
│ ✓ Database persists after restart       │
└─────────────────────────────────────────┘
```

---

## 📚 Next Steps

Now that you understand the architecture, proceed to:

1. **`START-HERE.md`** - Choose your deployment path
2. **`DEPLOYMENT-GUIDE-SIMPLE.md`** - Follow deployment steps
3. **`PRE-DEPLOYMENT-CHECKLIST.md`** - Verify everything

---

*Visual Guide v1.0.0*  
*Last Updated: 2025*
