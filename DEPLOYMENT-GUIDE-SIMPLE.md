# 🚀 Simple Deployment Guide - MakBig Academy

## 📌 What You Need

1. **A Linux Server** (Ubuntu, Debian, or similar)
2. **Docker installed** on that server
3. **Your PocketBase Linux binary** (already in `backend/` folder)

## 🎯 3-Step Deployment

### Step 1: Get Your Code on the Server

```bash
# On your server, run:
git clone <your-github-repo-url> makbig-academy
cd makbig-academy
```

### Step 2: Setup Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit it (use nano or vim)
nano .env
```

Change this line based on your setup:
```env
# For local server (no domain):
REACT_APP_POCKETBASE_URL=http://YOUR_SERVER_IP:8090

# For production with domain:
REACT_APP_POCKETBASE_URL=https://api.yourdomain.com
```

### Step 3: Deploy!

```bash
# Make the deploy script executable
chmod +x deploy.sh

# Run it
./deploy.sh
```

That's it! 🎉

## 🌐 Access Your App

After deployment completes:

- **Your Website**: `http://YOUR_SERVER_IP:3000`
- **API Backend**: `http://YOUR_SERVER_IP:8090`
- **Admin Panel**: `http://YOUR_SERVER_IP:8090/_/`

Replace `YOUR_SERVER_IP` with your actual server IP address.

## 🔐 First Login

1. Go to `http://YOUR_SERVER_IP:8090/_/`
2. Create your admin account (first time only)
3. Login and you're ready!

## 📱 Access from Phone/Other Devices

To access from your phone or other computers:

1. Find your server IP:
   ```bash
   hostname -I
   ```

2. On your phone browser, go to:
   - `http://SERVER_IP:3000`

3. Make sure your firewall allows these connections!

## 🔧 Useful Commands

```bash
# See if everything is running
docker-compose ps

# View logs (see what's happening)
docker-compose logs -f

# Restart everything
docker-compose restart

# Stop everything
docker-compose down

# Start again
docker-compose up -d
```

## ❓ Common Problems

### Problem: "Port already in use"

**Solution**: Something else is using port 3000 or 8090

```bash
# Find what's using the port
sudo lsof -i :3000
sudo lsof -i :8090

# Kill that process or change the port in docker-compose.yml
```

### Problem: "Frontend can't connect to backend"

**Solution**: Wrong backend URL

1. Check your `.env` file
2. Make sure `REACT_APP_POCKETBASE_URL` is correct
3. Rebuild: `docker-compose up -d --build frontend`

### Problem: "PocketBase won't start"

**Solution**: Wrong binary (Windows instead of Linux)

```bash
# Check what you have
file backend/pocketbase

# Should say: "ELF 64-bit LSB executable"
# If it says "Windows", download Linux version:

cd backend
wget https://github.com/pocketbase/pocketbase/releases/download/v0.30.4/pocketbase_0.30.4_linux_amd64.zip
unzip pocketbase_0.30.4_linux_amd64.zip
chmod +x pocketbase
```

## 🔒 Security (Important!)

### Firewall Setup

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH (so you can login)
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Change Admin Password

1. Login to admin panel
2. Go to Settings
3. Change your password to something strong!

## 💾 Backup Your Data

```bash
# Backup database
docker-compose exec backend ./pocketbase backup

# Or backup the whole data folder
tar -czf backup.tar.gz backend/pb_data/
```

## 🌐 Using a Domain Name (Optional)

If you have a domain like `myapp.com`:

### 1. Point Domain to Server

In your domain registrar (GoDaddy, Namecheap, etc.):
- Add A record: `myapp.com` → `YOUR_SERVER_IP`
- Add A record: `api.myapp.com` → `YOUR_SERVER_IP`

### 2. Install Nginx

```bash
sudo apt install nginx -y
```

### 3. Setup SSL (Free HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d myapp.com -d api.myapp.com
```

### 4. Update Environment

```bash
nano .env
```

Change to:
```env
REACT_APP_POCKETBASE_URL=https://api.myapp.com
```

### 5. Rebuild

```bash
docker-compose up -d --build frontend
```

Now access via:
- `https://myapp.com` (your website)
- `https://api.myapp.com` (your API)

## 📊 Check Everything is Working

```bash
# Check services
docker-compose ps

# Test backend
curl http://localhost:8090/api/health

# Test frontend
curl http://localhost:3000

# View logs
docker-compose logs -f
```

## 🎯 Quick Reference

| What | Command |
|------|---------|
| Start | `docker-compose up -d` |
| Stop | `docker-compose down` |
| Restart | `docker-compose restart` |
| Logs | `docker-compose logs -f` |
| Status | `docker-compose ps` |
| Rebuild | `docker-compose up -d --build` |

## 📞 Need More Help?

- **Detailed Guide**: Read `DEPLOYMENT.md`
- **Step-by-Step**: Read `PRE-DEPLOYMENT-CHECKLIST.md`
- **Quick Start**: Read `README-DEPLOYMENT.md`

## ✅ Success Checklist

- [ ] Code is on server
- [ ] `.env` file is configured
- [ ] `./deploy.sh` ran successfully
- [ ] Can access frontend at `http://SERVER_IP:3000`
- [ ] Can access backend at `http://SERVER_IP:8090`
- [ ] Created admin account
- [ ] Can register and login as user
- [ ] Can upload images

If all checked ✅ - **You're done!** 🎉

---

**Remember**: 
- Keep your admin password safe
- Backup your data regularly
- Check logs if something goes wrong
- Update your app regularly

**Your app is now live!** 🚀
