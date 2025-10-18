# Pre-Deployment Checklist

## ✅ Before You Deploy

### 1. Server Preparation
- [ ] Linux server is ready (Ubuntu 20.04+ recommended)
- [ ] Server has at least 2GB RAM
- [ ] Server has at least 10GB free disk space
- [ ] You have SSH access to the server
- [ ] Server has a public IP address

### 2. Software Requirements
- [ ] Docker is installed on server
- [ ] Docker Compose is installed on server
- [ ] Git is installed on server
- [ ] Ports 80, 443, 8090, and 3000 are available

Check with:
```bash
docker --version
docker-compose --version
git --version
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :8090
sudo lsof -i :3000
```

### 3. Project Files
- [ ] PocketBase Linux binary is in `backend/` folder
- [ ] PocketBase binary has correct name: `pocketbase` (not `pocketbase.exe`)
- [ ] Windows `.exe` files are removed from backend folder
- [ ] `.zip` files are removed or in `.gitignore`
- [ ] All source code is committed to Git

Verify:
```bash
ls -la backend/pocketbase
file backend/pocketbase  # Should show: ELF 64-bit LSB executable
```

### 4. Configuration Files
- [ ] `.env.example` exists in root
- [ ] `docker-compose.yml` exists in root
- [ ] `backend/Dockerfile` exists
- [ ] `frontent/Dockerfile` exists
- [ ] `frontent/nginx.conf` exists
- [ ] `.dockerignore` files are in place

### 5. Environment Variables
- [ ] Created `.env` file from `.env.example`
- [ ] Updated `REACT_APP_POCKETBASE_URL` for your deployment
- [ ] Verified no sensitive data in `.env.example`

For local deployment:
```env
REACT_APP_POCKETBASE_URL=http://localhost:8090
```

For production with domain:
```env
REACT_APP_POCKETBASE_URL=https://api.yourdomain.com
```

### 6. Domain Setup (Production Only)
- [ ] Domain name is registered
- [ ] DNS A record points to server IP
- [ ] DNS propagation is complete (check with `nslookup yourdomain.com`)
- [ ] Subdomain for API is configured (e.g., api.yourdomain.com)

### 7. Security
- [ ] Strong password ready for PocketBase admin
- [ ] Firewall rules planned
- [ ] SSL certificate plan (Let's Encrypt recommended)
- [ ] Backup strategy planned

## 🚀 Deployment Steps

### Step 1: Upload to Server

```bash
# On your local machine
git push origin main

# On server
git clone <your-repo-url> makbig-academy
cd makbig-academy
```

### Step 2: Verify Files

```bash
# Check PocketBase binary
ls -la backend/pocketbase
file backend/pocketbase

# Should output: ELF 64-bit LSB executable
# If it shows Windows executable, you need the Linux version!
```

### Step 3: Configure Environment

```bash
cp .env.example .env
nano .env
```

### Step 4: Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

Or manually:
```bash
docker-compose build
docker-compose up -d
```

### Step 5: Verify Deployment

```bash
# Check services are running
docker-compose ps

# Check logs
docker-compose logs -f

# Test backend
curl http://localhost:8090/api/health

# Test frontend
curl http://localhost:3000
```

### Step 6: Initial Setup

1. **Create PocketBase Admin Account**:
   - Visit: http://your-server:8090/_/
   - Create admin account (first-time only)
   - Login to admin panel

2. **Verify Database**:
   - Check collections are created
   - Verify migrations ran successfully

3. **Test Frontend**:
   - Visit: http://your-server:3000
   - Try to register a test user
   - Try to login

## 🔒 Post-Deployment Security

### Immediate Actions
- [ ] Changed PocketBase admin password
- [ ] Configured firewall
- [ ] Setup SSL certificates
- [ ] Tested backup process

### Firewall Setup

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### SSL Setup (with Certbot)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## 📊 Monitoring Setup

### Check Service Status

```bash
# View running containers
docker-compose ps

# View resource usage
docker stats

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Setup Log Rotation

Logs are automatically rotated (max 10MB, 3 files) in production config.

### Health Checks

```bash
# Backend health
curl http://localhost:8090/api/health

# Frontend health
curl http://localhost:3000/health
```

## 🔄 Backup Strategy

### Automated Backup Script

Create `/home/user/backup-makbig.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/home/user/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup PocketBase data
cd /home/user/makbig-academy
tar -czf $BACKUP_DIR/pb_data_$DATE.tar.gz backend/pb_data/

# Keep only last 7 backups
ls -t $BACKUP_DIR/pb_data_*.tar.gz | tail -n +8 | xargs rm -f

echo "Backup completed: pb_data_$DATE.tar.gz"
```

Setup cron job:
```bash
chmod +x /home/user/backup-makbig.sh
crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * /home/user/backup-makbig.sh
```

## 🐛 Common Issues

### Issue: PocketBase won't start

**Solution**:
```bash
# Check if binary is Linux version
file backend/pocketbase

# If Windows binary, download Linux version:
cd backend
wget https://github.com/pocketbase/pocketbase/releases/download/v0.30.4/pocketbase_0.30.4_linux_amd64.zip
unzip pocketbase_0.30.4_linux_amd64.zip
chmod +x pocketbase
rm pocketbase_0.30.4_linux_amd64.zip
```

### Issue: Frontend can't connect to backend

**Solution**:
```bash
# Check backend is running
curl http://localhost:8090/api/health

# Rebuild frontend with correct URL
nano .env  # Update REACT_APP_POCKETBASE_URL
docker-compose up -d --build frontend
```

### Issue: Port already in use

**Solution**:
```bash
# Find what's using the port
sudo lsof -i :8090
sudo lsof -i :3000

# Kill the process or change port in docker-compose.yml
```

## 📝 Final Checklist

- [ ] All services are running
- [ ] Frontend is accessible
- [ ] Backend API is responding
- [ ] PocketBase admin panel is accessible
- [ ] Admin account is created
- [ ] Test user can register and login
- [ ] Images can be uploaded
- [ ] Firewall is configured
- [ ] SSL is setup (production)
- [ ] Backups are configured
- [ ] Monitoring is in place
- [ ] Documentation is accessible

## 🎉 Success!

If all items are checked, your deployment is complete!

Access your application:
- **Frontend**: http://your-server:3000 (or https://yourdomain.com)
- **Backend**: http://your-server:8090 (or https://api.yourdomain.com)
- **Admin**: http://your-server:8090/_/ (or https://api.yourdomain.com/_/)

## 📚 Next Steps

1. Monitor logs for first 24 hours
2. Test all features thoroughly
3. Setup monitoring alerts
4. Document any custom configurations
5. Share access with team members

---

**Need Help?**
- Check `DEPLOYMENT.md` for detailed guide
- Check `README-DEPLOYMENT.md` for quick reference
- Review Docker logs: `docker-compose logs -f`
