# Cyberduck Upload Guide for CV Builder

## Step 1: Connect to IONOS Server

1. Open Cyberduck
2. Click "Open Connection"
3. Enter your IONOS FTP details:
   - Server: fan7985420.webspace-host.com
   - Username: a1859709
   - Password: [Your FTP password]
   - Port: 21
4. Click "Connect"

## Step 2: Create Directory Structure

1. In the root directory, create two folders:
   - Right-click in empty space → "New Folder" → Name it `public_html`
   - Right-click in empty space → "New Folder" → Name it `server`

## Step 3: Upload Frontend Files

1. Open your local file explorer and navigate to:
   `/Users/jamesingleton/cv-builder 2/cv-builder-2/dist`
2. Select all files and folders in this directory
3. Drag them into the `public_html` folder in Cyberduck
4. Wait for the upload to complete

## Step 4: Create .htaccess File

1. In Cyberduck, navigate to the `public_html` folder
2. Right-click → "New File" → Name it `.htaccess`
3. Right-click on the new `.htaccess` file → "Edit With" → Choose a text editor
4. Paste the following content:

```apache
# Enable rewrite engine
RewriteEngine On

# Redirect all requests to index.html except for existing files and directories
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]

# Set security headers
<IfModule mod_headers.c>
    # Prevent clickjacking
    Header set X-Frame-Options "SAMEORIGIN"
    
    # Enable XSS protection
    Header set X-XSS-Protection "1; mode=block"
    
    # Prevent MIME type sniffing
    Header set X-Content-Type-Options "nosniff"
    
    # Content Security Policy
    Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; connect-src 'self' https://api.stripe.com; frame-src 'self' https://js.stripe.com; img-src 'self' data:; style-src 'self' 'unsafe-inline';"
</IfModule>
```

5. Save and close the file

## Step 5: Upload Backend Files

1. Open your local file explorer and navigate to:
   `/Users/jamesingleton/cv-builder 2/cv-builder-2/server`
2. Select all files and folders in this directory (EXCEPT the `node_modules` folder)
3. Drag them into the `server` folder in Cyberduck
4. Wait for the upload to complete

## Step 6: Create Production Environment File

1. In Cyberduck, navigate to the `server` folder
2. Right-click → "New File" → Name it `production.env`
3. Right-click on the new file → "Edit With" → Choose a text editor
4. Paste the content from your local `server/production.env` file
5. Update the values with your actual production credentials
6. Save and close the file

## Step 7: Verify Upload

1. Navigate to each directory to make sure all files were uploaded properly
2. Check that the `.htaccess` file and `production.env` files are present in their respective directories

## Step 8: Contact IONOS Support

After uploading all files, contact IONOS support to:
1. Set up Node.js environment
2. Install npm dependencies in the server directory
3. Configure the web server to proxy API requests to your Node.js backend
4. Set up PostgreSQL database
5. Start your Node.js application with PM2 or similar process manager 