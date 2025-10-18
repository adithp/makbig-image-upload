# MakBig Academy - Quick Deployment Guide

## 🎯 Quick Start (5 Minutes)

### Prerequisites
- Linux server with Docker installed
- Your PocketBase Linux binary in `backend/` folder
- Ports 3000 and 8090 available

### One-Command Deployment

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

That's it! Your application will be running at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8090
- **Admin Panel**: http://localhost:8090/_/

## 📦 What's Included

### Backend (PocketBase)
- ✅ Dockerized PocketBase backend
- ✅ Persistent data storage
- ✅ Database migrations
- ✅ Health checks
- ✅ Auto-restart on failure

### Frontend (React)
- ✅ Optimized production build
- ✅ Nginx web server
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ React Router support

## 🔧 Manual Deployment

If you prefer manual control:

```bash
# 1. Configure environment
cp .env.example .env
nano .env

# 2. Build images
docker-compose build

# 3. Start services
docker-compose up -d

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f
```

## 🌐 Production Deployment

### With Your Own Domain

1. **Update environment variables**:
```bash
nano .env
```

Set:
```env
REACT_APP_POCKETBASE_URL=https://api.yourdomain.com
```

2. **Setup Nginx reverse proxy** (on host):

```nginx
# /etc/nginx/sites-available/makbig-academy

server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. **Enable SSL with Certbot**:

```bash
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

4. **Rebuild frontend with new URL**:

```bash
docker-compose up -d --build frontend
```

## 🔒 First-Time Setup

### Create PocketBase Admin Account

1. Open http://your-server:8090/_/
2. Create your admin account (first visit only)
3. Login and configure your collections

### Initialize Database

The database schema is already configured through migrations in `backend/pb_migrations/`.

## 📊 Common Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Update and rebuild
git pull
docker-compose up -d --build

# Backup database
docker-compose exec backend ./pocketbase backup

# Check service health
curl http://localhost:8090/api/health
```

## 🐛 Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Check port availability
sudo lsof -i :3000
sudo lsof -i :8090
```

### Frontend can't connect to backend
```bash
# Verify backend is running
curl http://localhost:8090/api/health

# Check environment variables
docker-compose exec frontend env | grep REACT_APP

# Rebuild frontend
docker-compose up -d --build frontend
```

### Database issues
```bash
# Check database files
ls -la backend/pb_data/

# Restart backend
docker-compose restart backend
```

## 📱 Access from Other Devices

To access from mobile or other computers on your network:

1. Find your server IP:
```bash
hostname -I
```

2. Update `.env`:
```env
REACT_APP_POCKETBASE_URL=http://YOUR_SERVER_IP:8090
```

3. Rebuild frontend:
```bash
docker-compose up -d --build frontend
```

4. Access from any device:
   - Frontend: http://YOUR_SERVER_IP:3000
   - Backend: http://YOUR_SERVER_IP:8090

## 🔐 Security Checklist

- [ ] Change default PocketBase admin password
- [ ] Setup firewall (UFW)
- [ ] Enable SSL/HTTPS
- [ ] Regular backups
- [ ] Keep Docker images updated
- [ ] Monitor logs regularly

## 📚 Additional Resources

- **Full Documentation**: See `DEPLOYMENT.md`
- **PocketBase Docs**: https://pocketbase.io/docs/
- **Docker Docs**: https://docs.docker.com/

## 💡 Tips

1. **Always backup before updates**:
   ```bash
   tar -czf backup_$(date +%Y%m%d).tar.gz backend/pb_data/
   ```

2. **Monitor disk space**:
   ```bash
   df -h
   docker system df
   ```

3. **Clean up unused images**:
   ```bash
   docker image prune -a
   ```

## 🆘 Need Help?

Check the logs first:
```bash
docker-compose logs -f
```

For detailed troubleshooting, see `DEPLOYMENT.md`.

---

**Quick Links**:
- 📖 [Full Deployment Guide](DEPLOYMENT.md)
- 🐳 [Docker Compose File](docker-compose.yml)
- ⚙️ [Environment Config](.env.example)
