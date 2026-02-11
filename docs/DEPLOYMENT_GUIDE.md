# SKYNT Production Deployment Guide

Complete guide for deploying SKYNT to mainnet with Docker, Nginx, and CI/CD.

## 🎯 Prerequisites

- Ubuntu 20.04+ server with public IP
- Domain name (e.g., skynt.io)
- GitHub repository access
- Docker and Docker Compose installed

## 🚀 Quick Deploy

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER
```

### 2. Clone Repository

```bash
git clone https://github.com/Holedozer1229/SkyNet.git
cd SkyNet
```

### 3. Configure Environment

```bash
# Frontend configuration
cd frontend
cp .env.example .env
nano .env  # Edit with your values

# Required variables:
# VITE_OPENSEA_COLLECTION=your-collection-address
# VITE_EVM_CHAIN=ethereum
```

### 4. Deploy with Docker Compose

```bash
cd ..
docker-compose up -d
```

Your application is now live at `http://your-server-ip`

## 🔐 Production Security

### Enable HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Stop Docker nginx temporarily
docker stop skynt

# Generate SSL certificate
sudo certbot certonly --standalone -d skynt.io -d www.skynt.io

# Update nginx.conf with SSL
```

Update `frontend/nginx.conf`:

```nginx
server {
  listen 443 ssl http2;
  server_name skynt.io;

  ssl_certificate /etc/letsencrypt/live/skynt.io/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/skynt.io/privkey.pem;

  # ... rest of config
}

server {
  listen 80;
  server_name skynt.io;
  return 301 https://$server_name$request_uri;
}
```

### Firewall Configuration

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## 🔄 CI/CD with GitHub Actions

### 1. Configure GitHub Secrets

Go to: Repository → Settings → Secrets and variables → Actions

Add these secrets:

- `SERVER_IP`: Your production server IP
- `SSH_KEY`: SSH private key for deployment user
- `GITHUB_TOKEN`: Auto-provided by GitHub

### 2. Generate SSH Key

On your server:

```bash
ssh-keygen -t ed25519 -C "github-deploy"
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/id_ed25519  # Copy this to GitHub secret SSH_KEY
```

### 3. Enable Actions

The workflow at `.github/workflows/mainnet.yml` automatically:

1. Builds Docker image on push to `main`
2. Pushes to GitHub Container Registry
3. SSH deploys to production server
4. Restarts with zero downtime

### 4. Deploy

```bash
git push origin main
```

Check deployment: Actions tab in GitHub

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Frontend only
docker logs skynt -f

# Miners only
docker logs skynt_miners_1 -f
```

### Check Status

```bash
docker-compose ps
```

### Resource Usage

```bash
docker stats
```

## 🔧 Maintenance

### Update Application

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Backup Data

```bash
# Backup volumes
docker run --rm -v skynt_data:/data -v $(pwd):/backup \
  ubuntu tar czf /backup/skynt-backup-$(date +%Y%m%d).tar.gz /data
```

### Restore Data

```bash
docker run --rm -v skynt_data:/data -v $(pwd):/backup \
  ubuntu tar xzf /backup/skynt-backup-YYYYMMDD.tar.gz
```

## 🌐 Domain Configuration

### DNS Setup

Add these records:

```
Type  Name  Value           TTL
A     @     your-server-ip  3600
A     www   your-server-ip  3600
```

### Nginx Configuration

Update server_name in `frontend/nginx.conf`:

```nginx
server_name skynt.io www.skynt.io;
```

## 📈 Performance Optimization

### Enable Nginx Caching

Add to `frontend/nginx.conf`:

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

### Enable Gzip Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

### Docker Build Fails

```bash
docker system prune -a
docker-compose build --no-cache
```

### Cannot Connect to Server

```bash
# Check firewall
sudo ufw status

# Check nginx
docker exec skynt nginx -t

# Check DNS
dig skynt.io
```

### SSL Certificate Renewal

```bash
sudo certbot renew
docker restart skynt
```

## 📞 Support

- GitHub Issues: https://github.com/Holedozer1229/SkyNet/issues
- Documentation: See `/docs` directory
- Discord: [Coming Soon]

## 🎯 Post-Deployment Checklist

- [ ] HTTPS enabled and working
- [ ] DNS pointing to server
- [ ] Firewall configured
- [ ] GitHub Actions deploying successfully
- [ ] Logs showing no errors
- [ ] OpenSea links working
- [ ] Oracle overlay displaying
- [ ] NFT cards rendering
- [ ] API endpoints responding

## 📝 Environment Variables Reference

### Frontend (.env)

```env
# OpenSea Integration
VITE_OPENSEA_COLLECTION=0x...    # Your NFT collection address
VITE_EVM_CHAIN=ethereum          # or 'base'

# API Configuration
VITE_API_BASE_URL=https://api.skynt.io
VITE_WS_URL=wss://api.skynt.io

# Blockchain RPCs
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY

# Contract Addresses
VITE_BRIDGE_CONTRACT=0x...
VITE_NFT_CONTRACT=0x...
```

## 🏁 Success Metrics

Your deployment is successful when:

1. ✅ Frontend loads at your domain
2. ✅ HTTPS shows secure padlock
3. ✅ Oracle overlay updates every 3s
4. ✅ OpenSea links open correctly
5. ✅ GitHub Actions badge is green
6. ✅ Docker containers are healthy
7. ✅ No errors in logs

---

**Status**: Production Ready  
**Last Updated**: 2026-02-11  
**Version**: 1.0
