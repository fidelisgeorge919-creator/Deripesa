# Deripesa Deployment Guide

This guide covers deploying Deripesa to production environments.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] SSL/HTTPS configured
- [ ] Payment gateway credentials verified
- [ ] Email service configured
- [ ] Redis instance running
- [ ] Database migrations tested

## 🚀 Deployment Options

### 1. Docker Compose (Recommended for Small-Medium Scale)

#### On Linux Server:

```bash
# Clone repository
git clone <repository-url>
cd Deripesa

# Create .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit environment variables
nano backend/.env
nano frontend/.env

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Update Deployment:

```bash
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 2. AWS Deployment

#### Using ECS + RDS + ElastiCache:

```bash
# Push Docker image to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker build -t deripesa-backend ./backend
docker tag deripesa-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/deripesa-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/deripesa-backend:latest

# Deploy using CloudFormation or Terraform
terraform apply
```

#### For Frontend (CloudFront + S3):

```bash
npm run build:frontend
aws s3 sync frontend/dist s3://deripesa-frontend-bucket
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

### 3. Heroku Deployment

```bash
# Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# Login to Heroku
heroku login

# Create app
heroku create deripesa-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set FRONTEND_URL=https://deripesa.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### 4. DigitalOcean App Platform

```bash
# Install doctl
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.98.1/doctl-1.98.1-linux-amd64.tar.gz
tar xf ~/doctl-1.98.1-linux-amd64.tar.gz
sudo mv ~/doctl /usr/local/bin

# Authenticate
doctl auth init

# Create App
doctl apps create --spec app.yaml
```

### 5. Manual VPS Deployment (DigitalOcean, Linode, etc.)

```bash
# Install dependencies
sudo apt update
sudo apt install -y nodejs npm postgresql redis-server nginx

# Clone repository
git clone <repository-url>
cd Deripesa

# Backend setup
cd backend
npm install
npm run build

# Create systemd service
sudo nano /etc/systemd/system/deripesa-backend.service
```

Add this to the service file:

```ini
[Unit]
Description=Deripesa Backend
After=network.target

[Service]
User=deripesa
WorkingDirectory=/home/deripesa/Deripesa/backend
ExecStart=/usr/bin/node /home/deripesa/Deripesa/backend/dist/index.js
Restart=always
Environment="NODE_ENV=production"
Environment="DATABASE_URL=postgresql://..."

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl start deripesa-backend
sudo systemctl enable deripesa-backend

# Frontend setup
cd ../frontend
npm run build

# Copy to web root
sudo cp -r dist /var/www/deripesa

# Nginx configuration
sudo nano /etc/nginx/sites-available/deripesa
```

Add this nginx config:

```nginx
server {
    listen 80;
    server_name deripesa.com www.deripesa.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name deripesa.com www.deripesa.com;
    
    ssl_certificate /etc/letsencrypt/live/deripesa.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deripesa.com/privkey.pem;
    
    # Frontend
    location / {
        root /var/www/deripesa;
        try_files $uri $uri/ /index.html;
    }
    
    # API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/deripesa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL Certificate (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d deripesa.com -d www.deripesa.com
```

## 📊 Database Setup

### PostgreSQL Backup Strategy

```bash
# Automatic daily backups
0 2 * * * /usr/bin/pg_dump -U deripesa -d deripesa -F c -f /backups/deripesa-$(date +\%Y\%m\%d).dump

# Restore from backup
pg_restore -U deripesa -d deripesa /backups/deripesa-20240101.dump
```

### Database Monitoring

```bash
# Check connections
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;

# Check disk usage
SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) FROM pg_tables;

# Check index usage
SELECT schemaname, tablename, indexname, idx_scan FROM pg_stat_user_indexes ORDER BY idx_scan;
```

## 🔒 Security Configuration

### SSL/TLS Setup

```bash
# Generate self-signed certificate (development only)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Or use Let's Encrypt for free
certbot certonly --standalone -d yourdomain.com
```

### Environment Variables

```bash
# Create secure .env file
sudo chmod 600 .env

# Use environment secrets manager
# AWS Secrets Manager, HashiCorp Vault, etc.
```

### Firewall Configuration

```bash
# UFW (Uncomplicated Firewall)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5432/tcp  # PostgreSQL (internal only)
sudo ufw allow 6379/tcp  # Redis (internal only)
sudo ufw enable
```

## 📈 Performance Optimization

### Nginx Caching

```nginx
# Cache static files
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### GZIP Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### Database Connection Pooling

```env
# Backend .env
DATABASE_POOL_SIZE=20
DATABASE_POOL_TIMEOUT=30
```

## 🔍 Monitoring & Logging

### Application Monitoring

```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name "deripesa-backend"
pm2 save
pm2 startup

# Monitor
pm2 monit
```

### Log Aggregation

```bash
# Using ELK Stack or similar
docker run -d -p 9200:9200 -p 9300:9300 docker.elastic.co/elasticsearch/elasticsearch:8.0.0
docker run -d -p 5601:5601 docker.elastic.co/kibana/kibana:8.0.0
```

### Metrics Collection

```bash
# Using Prometheus
docker run -d -p 9090:9090 prom/prometheus

# Using Grafana
docker run -d -p 3000:3000 grafana/grafana
```

## 🚨 Backup & Disaster Recovery

### Automated Backups

```bash
#!/bin/bash
# backup.sh

# Database backup
pg_dump -U deripesa deripesa | gzip > backups/db-$(date +%Y%m%d-%H%M%S).sql.gz

# Files backup
tar -czf backups/files-$(date +%Y%m%d-%H%M%S).tar.gz /var/www/deripesa

# Upload to S3
aws s3 sync backups/ s3://deripesa-backups/
```

### Recovery Procedure

```bash
# Restore database
gunzip < backups/db-latest.sql.gz | psql -U deripesa deripesa

# Restore files
tar -xzf backups/files-latest.tar.gz -C /var/www
```

## 📞 Support & Maintenance

### Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update
npm audit fix
npm run build
npm restart
```

### Health Checks

```bash
# Endpoint availability
curl -f http://localhost:5000/health || exit 1

# Database connectivity
psql -U deripesa -d deripesa -c "SELECT 1" || exit 1
```

## 🎯 Performance Targets

- **API Response Time**: < 200ms
- **Frontend Load Time**: < 3s
- **Database Query Time**: < 100ms
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%

---

For questions or issues, contact: devops@deripesa.com
