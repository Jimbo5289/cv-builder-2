# IONOS Deployment Fix Guide

## Current Issues from Console
1. CSP violations for script-src and connect-src
2. React bootstrap failure
3. Script loading errors

## Fix 1: Updated .htaccess (Upload to IONOS root)

```apache
# Enable mod_rewrite
RewriteEngine On

# Content Security Policy - More permissive for IONOS
Header always set Content-Security-Policy "default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://cv-builder-backend-zjax.onrender.com wss://cv-builder-backend-zjax.onrender.com; frame-src 'self' https://js.stripe.com; worker-src 'self' blob:"

# MIME types for modern web
AddType application/javascript .js
AddType application/javascript .mjs
AddType text/css .css
AddType application/json .json

# Enable CORS for API calls
Header always set Access-Control-Allow-Origin "https://cv-builder-backend-zjax.onrender.com"
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"

# Handle preflight requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ - [R=200,L]

# API proxy to backend
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ https://cv-builder-backend-zjax.onrender.com/api/$1 [P,L]

# Client-side routing for React
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## Fix 2: Updated index.html

Replace your current index.html with this version that includes fallback loading:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CV Builder - Professional CV Creation Tool</title>
    
    <!-- Meta tags for SEO -->
    <meta name="description" content="Create professional CVs with our advanced CV builder. ATS-friendly templates, AI-powered suggestions, and expert guidance." />
    <meta name="keywords" content="CV builder, resume builder, professional CV, ATS-friendly, career tools" />
    
    <!-- Production Environment Configuration -->
    <script>
      window.ENV = {
        DEV_MODE: false,
        SKIP_AUTH: false,
        API_URL: 'https://cv-builder-backend-zjax.onrender.com',
        FRONTEND_URL: 'https://www.mycvbuilder.co.uk',
        ENABLE_MOCK_DATA: false,
        ENABLE_DEBUG_PANELS: false,
        NODE_ENV: 'production'
      };
    </script>
    
    <!-- Fallback CSS -->
    <style>
      #fallback-app {
        display: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        max-width: 800px;
        margin: 50px auto;
        padding: 20px;
        text-align: center;
      }
      .error-container {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 30px;
        margin: 20px 0;
      }
      .btn-primary {
        background-color: #007bff;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 4px;
        text-decoration: none;
        display: inline-block;
        margin: 10px;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    
    <!-- Fallback Application -->
    <div id="fallback-app">
      <div class="error-container">
        <h1>CV Builder</h1>
        <p>We're having trouble loading the main application.</p>
        <p>This might be due to browser compatibility or network issues.</p>
        <a href="https://cv-builder-2-gkmhn1ekp-jimbo5289s-projects.vercel.app" class="btn-primary">
          Access Alternative Version
        </a>
        <a href="javascript:location.reload()" class="btn-primary">
          Try Again
        </a>
      </div>
    </div>
    
    <!-- Loading timeout fallback -->
    <script>
      setTimeout(function() {
        if (!document.querySelector('#root').innerHTML.trim()) {
          document.getElementById('fallback-app').style.display = 'block';
        }
      }, 10000); // Show fallback after 10 seconds
    </script>
    
    <!-- Try to load the main application -->
    <script type="module" src="/assets/index.js" onerror="showFallback()"></script>
    
    <script>
      function showFallback() {
        document.getElementById('fallback-app').style.display = 'block';
      }
      
      // Handle script loading errors
      window.addEventListener('error', function(e) {
        if (e.filename && e.filename.includes('.js')) {
          showFallback();
        }
      });
    </script>
  </body>
</html>
```

## Fix 3: Deployment Steps

1. **Build your application locally:**
   ```bash
   npm run build
   ```

2. **Upload the entire `dist` folder contents to IONOS**

3. **Upload the new `.htaccess` file to the root directory**

4. **Test the deployment**

## ⚠️ Important Limitations

Even with these fixes, IONOS shared hosting has fundamental limitations:
- Limited support for modern JavaScript modules
- Restricted server configuration
- No Node.js runtime for server-side features

## 🎯 Recommendation

The most reliable solution is to:
1. Keep using Vercel for your main deployment
2. Update DNS for `mycvbuilder.co.uk` to point to Vercel
3. Use IONOS only for static content if needed 