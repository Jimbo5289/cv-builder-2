# CV Builder - Secure Admin Panel

This is a standalone admin panel for managing CV Builder users and data. It's completely separate from the main application and requires admin credentials to access.

## 🔒 Security Features

- **Authentication Required**: Only admin users can log in
- **No Public Access**: This panel is not linked from the main site
- **Token-based Security**: Uses JWT authentication
- **Email Confirmation**: Required for destructive actions
- **Admin-Only Actions**: Critical operations restricted to admin users

## 📁 Files

- `index.html` - The main admin interface
- `admin-panel.js` - JavaScript functionality
- `.htaccess` - Additional web server security (if using Apache)
- `README.md` - This documentation

## 🚀 Setup Instructions

### Option 1: Local File Access
1. Download all files in this directory
2. Open `index.html` in a web browser
3. Log in with your admin credentials

### Option 2: Web Server Deployment
1. Upload all files to a secure directory on your web server
2. Ensure the directory is **not publicly linked** from your main site
3. Access via the direct URL (e.g., `https://yourserver.com/secure-admin-path/`)
4. Consider password-protecting the directory at the server level

### Option 3: Localhost Development
1. Start a local web server in this directory:
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js
   npx http-server -p 8080
   
   # Using PHP
   php -S localhost:8080
   ```
2. Access at `http://localhost:8080`

## 🔑 Admin Credentials

To access the admin panel, you need:
- An admin user account in the CV Builder database
- Either:
  - User with `isAdmin: true` flag
  - User with email: `jamesingleton1971@gmail.com`

## 🛠 Features

### Dashboard Overview
- Total users, active users, CVs, and subscriptions
- Real-time statistics

### User Management
- View all users with pagination
- Search users by name or email
- View detailed user information
- Export user data (GDPR compliance)
- Activate/deactivate user accounts
- Delete user accounts (with email confirmation)

### GDPR Compliance
- **Right to Access**: View all user data
- **Right to Portability**: Export user data as JSON
- **Right to Erasure**: Permanently delete user accounts
- **Audit Trail**: All admin actions are logged

## 🔧 Configuration

The admin panel connects to your backend API at:
```
https://cv-builder-backend-zjax.onrender.com
```

To change the API endpoint, edit the `API_BASE_URL` constant in `admin-panel.js`.

## 🛡️ Security Best Practices

1. **Keep URL Secret**: Don't link to this panel from your main site
2. **Use HTTPS**: Always access over secure connection
3. **Regular Updates**: Keep credentials secure and rotate regularly
4. **Monitor Access**: Check server logs for unauthorized access attempts
5. **Backup Before Actions**: Always backup before performing destructive operations

## 🚨 Important Warnings

- **Destructive Actions**: User deletion is permanent and irreversible
- **No Undo**: Always confirm actions carefully
- **Email Confirmation**: Required for user deletion to prevent accidents
- **Admin Protection**: Admin users cannot be deleted through the interface

## 📱 Mobile Responsive

The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🐛 Troubleshooting

### Can't Log In
- Verify admin credentials in the database
- Check that `isAdmin` flag is set to `true`
- Ensure backend API is accessible

### Connection Issues
- Check internet connection
- Verify backend server is running
- Check browser console for errors

### Missing Features
- Ensure you're using the latest version
- Check browser compatibility (modern browsers required)

## 📞 Support

For technical support or questions:
- Check backend logs for API errors
- Verify database connectivity
- Contact system administrator

---

**⚠️ SECURITY NOTICE**: This admin panel provides full access to user data and destructive operations. Only share access with trusted administrators and always follow your organization's security policies. 