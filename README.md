# 🎓 MakBig Academy - Image Upload Platform

A full-stack web application for managing student image submissions with admin review capabilities, built with React and PocketBase.

## 🚀 Quick Start

### For Deployment (Production)

```bash
# 1. Clone repository
git clone <your-repo> makbig-academy
cd makbig-academy

# 2. Configure environment
cp .env.example .env
nano .env  # Update REACT_APP_POCKETBASE_URL

# 3. Deploy
chmod +x deploy.sh
./deploy.sh
```

**📖 New to deployment?** Start with **[START-HERE.md](START-HERE.md)**

### For Development (Local)

```bash
# 1. Install dependencies
cd frontent
npm install

# 2. Start backend (in separate terminal)
cd backend
./pocketbase serve

# 3. Start frontend
cd frontent
npm start
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[START-HERE.md](START-HERE.md)** | 👈 **Start here!** Overview and guide selection |
| **[DEPLOYMENT-GUIDE-SIMPLE.md](DEPLOYMENT-GUIDE-SIMPLE.md)** | Quick 3-step deployment guide |
| **[PRE-DEPLOYMENT-CHECKLIST.md](PRE-DEPLOYMENT-CHECKLIST.md)** | Complete deployment checklist |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Comprehensive deployment guide |
| **[README-DEPLOYMENT.md](README-DEPLOYMENT.md)** | Quick reference for deployments |
| **[DEPLOYMENT-SUMMARY.md](DEPLOYMENT-SUMMARY.md)** | Technical overview |
| **[WHAT-CHANGED.md](WHAT-CHANGED.md)** | What was modified for deployment |
| **[VISUAL-GUIDE.md](VISUAL-GUIDE.md)** | Visual architecture diagrams |

## ✨ Features

### For Students
- 📝 User registration and authentication
- 📸 Image upload functionality
- 📊 View submission history
- 💬 Receive admin feedback
- 🎯 Domain-based organization

### For Admins
- 👥 Manage all student submissions
- 💬 Provide feedback on uploads
- 📊 View analytics and statistics
- 🏷️ Manage domains/categories
- 👨‍💼 User management

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           MakBig Academy Platform           │
│                                             │
│  ┌──────────────┐      ┌─────────────────┐ │
│  │   Frontend   │      │     Backend     │ │
│  │   (React)    │◄────►│  (PocketBase)   │ │
│  │              │      │                 │ │
│  │  - React 19  │      │  - SQLite DB    │ │
│  │  - Tailwind  │      │  - REST API     │ │
│  │  - TypeScript│      │  - Auth         │ │
│  └──────────────┘      └─────────────────┘ │
└─────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Nginx** - Production web server

### Backend
- **PocketBase** - Backend as a Service
- **SQLite** - Database
- **REST API** - API architecture

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Nginx** - Reverse proxy & web server

## 📦 Project Structure

```
makbig-academy/
├── backend/                    # PocketBase backend
│   ├── Dockerfile             # Backend container config
│   ├── pocketbase             # PocketBase binary (Linux)
│   ├── pb_data/               # Database and storage
│   └── pb_migrations/         # Database migrations
│
├── frontent/                  # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # Context providers
│   │   ├── pocketbase/        # PocketBase config
│   │   └── utils/             # Utility functions
│   ├── Dockerfile             # Frontend container config
│   ├── nginx.conf             # Nginx configuration
│   └── package.json           # Dependencies
│
├── docker-compose.yml         # Development orchestration
├── docker-compose.prod.yml    # Production orchestration
├── deploy.sh                  # Deployment script
├── .env.example               # Environment template
│
└── docs/                      # Documentation
    ├── START-HERE.md
    ├── DEPLOYMENT-GUIDE-SIMPLE.md
    └── ...
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file from `.env.example`:

```env
# Backend URL
REACT_APP_POCKETBASE_URL=http://localhost:8090

# For production:
# REACT_APP_POCKETBASE_URL=https://api.yourdomain.com
```

### Ports

- **3000** - Frontend (React app)
- **8090** - Backend (PocketBase API)

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up -d --build
```

### Option 2: Manual Deployment

**Backend:**
```bash
cd backend
./pocketbase serve --http=0.0.0.0:8090
```

**Frontend:**
```bash
cd frontent
npm run build
# Serve build folder with Nginx or similar
```

### Option 3: Production with Domain

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete production setup with SSL.

## 🔐 Security

- ✅ Environment-based configuration
- ✅ PocketBase authentication
- ✅ Role-based access control
- ✅ Container isolation
- ✅ Nginx security headers
- ✅ HTTPS support (production)

## 📊 Database Schema

### Collections

- **users** - User accounts (students and admins)
- **domains** - Subject/category domains
- **uploads** - Image submissions with metadata

### Relationships

- Users → Uploads (one-to-many)
- Domains → Uploads (one-to-many)
- Uploads → Admin replies (one-to-one)

## 🎯 Getting Started

### First-Time Setup

1. **Deploy the application** (see Quick Start above)
2. **Create admin account**:
   - Visit `http://your-server:8090/_/`
   - Create admin credentials (first visit only)
3. **Configure domains**:
   - Login to admin panel
   - Add subject domains
4. **Test the application**:
   - Register a test student
   - Upload test images
   - Verify admin can review

### For Developers

```bash
# Install dependencies
cd frontent
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 📝 Common Commands

```bash
# Docker Commands
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose logs -f            # View logs
docker-compose ps                 # Check status
docker-compose restart            # Restart services
docker-compose up -d --build      # Rebuild and start

# Backup
tar -czf backup.tar.gz backend/pb_data/

# Update
git pull
docker-compose up -d --build
```

## 🐛 Troubleshooting

### Services won't start
```bash
docker-compose logs -f
```

### Frontend can't connect to backend
1. Check `.env` file
2. Verify `REACT_APP_POCKETBASE_URL`
3. Rebuild: `docker-compose up -d --build frontend`

### Database issues
```bash
# Check database files
ls -la backend/pb_data/

# Restart backend
docker-compose restart backend
```

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed troubleshooting.

## 📈 Performance

- ✅ Production-optimized React build
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ Nginx reverse proxy
- ✅ Container resource limits

## 🔄 Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Verify
docker-compose ps
docker-compose logs -f
```

## 💾 Backup Strategy

### Manual Backup
```bash
# Backup database
docker-compose exec backend ./pocketbase backup

# Or backup entire data folder
tar -czf backup_$(date +%Y%m%d).tar.gz backend/pb_data/
```

### Automated Backup
See **[PRE-DEPLOYMENT-CHECKLIST.md](PRE-DEPLOYMENT-CHECKLIST.md)** for automated backup setup.

## 🌐 Production Deployment

For production deployment with domain and SSL:

1. Read **[PRE-DEPLOYMENT-CHECKLIST.md](PRE-DEPLOYMENT-CHECKLIST.md)**
2. Follow **[DEPLOYMENT.md](DEPLOYMENT.md)**
3. Setup SSL with Let's Encrypt
4. Configure firewall
5. Setup automated backups

## 📞 Support

- **Documentation**: Check the docs folder
- **Logs**: `docker-compose logs -f`
- **PocketBase Docs**: https://pocketbase.io/docs/
- **Docker Docs**: https://docs.docker.com/

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

[Your License Here]

## 👥 Authors

MakBig Academy Team

## 🎉 Acknowledgments

- PocketBase for the amazing backend
- React team for the frontend framework
- Docker for containerization

---

## 🚀 Ready to Deploy?

1. **New to deployment?** → Read **[START-HERE.md](START-HERE.md)**
2. **Want quick deployment?** → Read **[DEPLOYMENT-GUIDE-SIMPLE.md](DEPLOYMENT-GUIDE-SIMPLE.md)**
3. **Need detailed guide?** → Read **[DEPLOYMENT.md](DEPLOYMENT.md)**

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2025

**Your application is ready to deploy!** 🎉
