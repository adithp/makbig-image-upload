# MakBig Academy - Deployment Guide

This guide will help you deploy the MakBig Academy application using Docker on a Linux server.

## 📋 Prerequisites

- Linux server (Ubuntu 20.04+ recommended)
- Docker installed
- Docker Compose installed
- Domain name (optional, for production)
- Ports 80, 443, and 8090 available

## 🏗️ Project Structure

```
makbig-academy/
├── backend/              # PocketBase backend
│   ├── Dockerfile
│   ├── pocketbase       # Linux binary
│   ├── pb_data/         # Database files
│   └── pb_migrations/   # Database migrations
├── frontent/            # React frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── docker-compose.yml   # Orchestration file
└── .env.example        # Environment template
```

## 🚀 Quick Start Deployment

### Step 1: Prepare Your Server

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add your user to docker group (optional)
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Clone Your Repository

```bash
# Clone your project
git clone <your-repository-url> makbig-academy
cd makbig-academy
```

### Step 3: Configure Environment

```bash
# Copy environment example
cp .env.example .env

# Edit environment variables
nano .env
```

Update the `.env` file with your production values:

```env
# For local deployment
REACT_APP_POCKETBASE_URL=http://localhost:8090

# For production with domain
# REACT_APP_POCKETBASE_URL=https://api.yourdomain.com
```

### Step 4: Build and Run

```bash
# Build and start all services
docker-compose up -d --build

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 5: Access Your Application

- **Frontend**: http://your-server-ip:3000
- **Backend (PocketBase)**: http://your-server-ip:8090
- **PocketBase Admin**: http://your-server-ip:8090/_/

## 🔧 Configuration Options

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend Configuration
POCKETBASE_PORT=8090

# Frontend Configuration
REACT_APP_POCKETBASE_URL=http://localhost:8090
```

### Docker Compose Override

For custom configurations, create `docker-compose.override.yml`:

```yaml
version: '3.8'

services:
  backend:
    ports:
      - "8090:8090"
    environment:
      - CUSTOM_VAR=value

  frontend:
    ports:
      - "80:80"
```

## 🌐 Production Deployment with Domain

### Option 1: Using Nginx Reverse Proxy

1. **Install Nginx on host**:

```bash
sudo apt install nginx -y
```

2. **Create Nginx configuration**:

```bash
sudo nano /etc/nginx/sites-available/makbig-academy
```

Add this configuration:

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Enable site and restart Nginx**:

```bash
sudo ln -s /etc/nginx/sites-available/makbig-academy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Setup SSL with Let's Encrypt**:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

5. **Update environment variables**:

```env
REACT_APP_POCKETBASE_URL=https://api.yourdomain.com
```

6. **Rebuild frontend**:

```bash
docker-compose up -d --build frontend
```

### Option 2: Using Traefik (Advanced)

Create `docker-compose.traefik.yml`:

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=your@email.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    networks:
      - makbig-network

  backend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`api.yourdomain.com`)"
      - "traefik.http.routers.backend.entrypoints=websecure"
      - "traefik.http.routers.backend.tls.certresolver=myresolver"

  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=myresolver"
```

## 🔒 Security Best Practices

1. **Change PocketBase Admin Password**:
   - Access http://your-server:8090/_/
   - Create admin account on first visit
   - Use strong password

2. **Firewall Configuration**:

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

3. **Regular Backups**:

```bash
# Backup PocketBase data
docker-compose exec backend ./pocketbase backup

# Or backup the entire pb_data directory
tar -czf pb_data_backup_$(date +%Y%m%d).tar.gz backend/pb_data/
```

4. **Update Docker Images**:

```bash
docker-compose pull
docker-compose up -d --build
```

## 📊 Monitoring and Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100
```

### Check Service Health

```bash
# Check running containers
docker-compose ps

# Check resource usage
docker stats

# Check backend health
curl http://localhost:8090/api/health
```

## 🛠️ Maintenance Commands

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Remove unused images
docker image prune -a
```

## 🐛 Troubleshooting

### Frontend can't connect to backend

1. Check if backend is running:
   ```bash
   docker-compose ps backend
   curl http://localhost:8090/api/health
   ```

2. Verify environment variables:
   ```bash
   docker-compose exec frontend env | grep REACT_APP
   ```

3. Check network connectivity:
   ```bash
   docker-compose exec frontend ping backend
   ```

### PocketBase database issues

1. Check database permissions:
   ```bash
   ls -la backend/pb_data/
   ```

2. Restore from backup:
   ```bash
   docker-compose down
   # Restore pb_data from backup
   docker-compose up -d
   ```

### Port already in use

```bash
# Find process using port
sudo lsof -i :8090
sudo lsof -i :3000

# Kill process or change port in docker-compose.yml
```

## 📱 Mobile Access

To access from mobile devices on the same network:

1. Find your server IP:
   ```bash
   hostname -I
   ```

2. Access from mobile:
   - Frontend: http://SERVER_IP:3000
   - Backend: http://SERVER_IP:8090

3. Update frontend environment:
   ```env
   REACT_APP_POCKETBASE_URL=http://SERVER_IP:8090
   ```

## 🚀 Scaling (Advanced)

### Multiple Frontend Instances

```yaml
services:
  frontend:
    deploy:
      replicas: 3
```

### Load Balancer

Use Nginx or Traefik to distribute traffic across multiple instances.

## 📞 Support

For issues or questions:
- Check logs: `docker-compose logs`
- Review PocketBase docs: https://pocketbase.io/docs/
- Check Docker docs: https://docs.docker.com/

## 📝 Checklist

- [ ] Server prepared with Docker installed
- [ ] Repository cloned
- [ ] Environment variables configured
- [ ] Docker containers built and running
- [ ] PocketBase admin account created
- [ ] Frontend accessible
- [ ] Backend API responding
- [ ] SSL certificates configured (production)
- [ ] Firewall configured
- [ ] Backup strategy implemented
- [ ] Monitoring setup

---

**Last Updated**: 2025
**Version**: 1.0.0
