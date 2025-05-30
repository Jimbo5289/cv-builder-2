# IONOS Server Setup Guide for CV Builder

## 1. Server Directory Structure

Your IONOS hosting should have the following directory structure:

```
/
├── public_html/  (Frontend - React app)
└── server/       (Backend - Node.js server)
```

## 2. Upload Files

### Frontend (public_html)
- Upload all files from your local `dist` directory to the `public_html` directory

### Backend (server)
- Upload all files from your local `server` directory to the `server` directory (except node_modules)
- Create a `production.env` file in the `server` directory

## 3. Install Node.js and Dependencies

SSH into your IONOS server and run the following commands:

```bash
# Navigate to server directory
cd server

# Install Node.js dependencies
npm install

# Install PM2 globally for process management
npm install -g pm2
```

## 4. Database Setup

1. Create a PostgreSQL database through IONOS control panel
2. Update the `DATABASE_URL` in `production.env` with the correct credentials

## 5. Start the Server

```bash
# Navigate to server directory
cd server

# Start the server with PM2
NODE_ENV=production pm2 start src/index.js --name "cv-builder-api"

# Ensure PM2 starts on system reboot
pm2 startup
pm2 save
```

## 6. Configure Nginx/Apache

Add the following to your Apache configuration (if using Apache):

```apache
# In your virtual host configuration
<VirtualHost *:80>
    ServerName mycvbuilder.co.uk
    DocumentRoot /public_html
    
    # Frontend
    <Directory /public_html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # API Proxy
    ProxyRequests Off
    ProxyPreserveHost On
    <Location /api>
        ProxyPass http://localhost:3005
        ProxyPassReverse http://localhost:3005
    </Location>
</VirtualHost>
```

## 7. Set Up SSL

Enable SSL through IONOS control panel and ensure all traffic is redirected to HTTPS.

## 8. Stripe Webhook Setup

1. In your Stripe dashboard, create a webhook endpoint pointing to: `https://mycvbuilder.co.uk/api/payments/webhook`
2. Update the `STRIPE_WEBHOOK_SECRET` in your `production.env` file with the secret from Stripe

## 9. Monitor Your Application

```bash
# Check server status
pm2 status

# View logs
pm2 logs cv-builder-api
``` 