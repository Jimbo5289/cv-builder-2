# 🔧 Superuser System Setup Guide

This guide helps you set up the new superuser system for your CV Builder application, which will allow you to delete admin accounts and manage user roles with elevated privileges.

## 📋 What's Been Added

### 🏗️ Database Changes
- **New `role` field** added to User model with values: `user`, `admin`, `superuser`
- **Backward compatible** - existing users default to `user` role
- **Your account** (`jamesingleton1971@gmail.com`) will be promoted to `superuser`

### 🛡️ New Permission System
- **Users** - Standard access to CV builder features
- **Admins** - Can view admin panel, manage regular users
- **Superusers** - Can delete admin accounts, manage all users, change roles

### 🌐 Enhanced Admin Panel
- **Role badges** showing user permissions (👑 Superuser, 🛡️ Admin, 👤 User)
- **Protected accounts** - Admins can't delete other admins/superusers
- **Superuser controls** - Additional API endpoints for elevated operations

### 🔧 Management Tools
- **Command-line utility** for user management
- **Automated setup scripts** for easy deployment
- **Safety features** to prevent accidental self-deletion

## 🚀 Setup Instructions

### Step 1: Deploy Updated Code

**Option A: Push to Git and Deploy**
```bash
# From your project root
git add .
git commit -m "Add superuser role system and enhanced admin controls"
git push origin main
```

**Option B: Manual File Upload (if using file upload to Render)**
1. Upload these updated files to your Render backend:
   - `server/prisma/schema.prisma`
   - `server/src/routes/admin.js`
   - `server/src/scripts/manage-superuser.js`
   - `server/setup-superuser.js`
   - `public/admin-panel/admin-panel.js`

### Step 2: Update Database Schema

**On Render (Production):**
1. Go to your Render dashboard
2. Navigate to your backend service
3. Go to "Shell" tab
4. Run: `npx prisma db push`

**Locally (Development):**
```bash
cd server
npx prisma db push
```

### Step 3: Run Superuser Setup

**On Render (Production):**
```bash
# In the Render shell
node setup-superuser.js
```

**Locally (Development):**
```bash
cd server
node setup-superuser.js
```

The script will:
- ✅ Test database connection
- ✅ Verify schema is updated
- ✅ Make `jamesingleton1971@gmail.com` a superuser
- ✅ Show current user role distribution

## 🎯 Using Your New Powers

### 🌐 Admin Panel Features

**Enhanced User List:**
- Role badges next to each user
- Protected admin/superuser accounts (no delete buttons)
- Improved user information display

**New Capabilities:**
- Delete any user account (including test admins)
- Role-based access control
- Enhanced security for admin accounts

### 🔧 Command Line Management

**List all users:**
```bash
node server/src/scripts/manage-superuser.js list
```

**List users by role:**
```bash
node server/src/scripts/manage-superuser.js list admin
node server/src/scripts/manage-superuser.js list superuser
```

**Promote a user to admin:**
```bash
node server/src/scripts/manage-superuser.js promote user@example.com admin jamesingleton1971@gmail.com
```

**Delete any user (including admins):**
```bash
node server/src/scripts/manage-superuser.js delete testadmin@example.com jamesingleton1971@gmail.com confirm
```

### 🌐 API Endpoints (Superuser Only)

**Change user role:**
```bash
PUT /api/admin/superuser/users/:id/role
{
  "role": "admin"  // or "user", "superuser"
}
```

**Force delete any user:**
```bash
DELETE /api/admin/superuser/users/:id
{
  "confirmEmail": "user@example.com"
}
```

**List users with role information:**
```bash
GET /api/admin/superuser/users?role=admin&page=1&limit=20
```

## 🔒 Security Features

### ✅ Built-in Protections
- **Cannot delete yourself** - Prevents accidental self-deletion
- **Cannot demote yourself** - Prevents locking yourself out
- **Email confirmation required** - All deletions need email verification
- **Audit logging** - All superuser actions are logged
- **Role validation** - Only valid roles can be assigned

### 🛡️ Access Levels
- **Regular admins** cannot delete admin/superuser accounts
- **Superusers** can delete anyone (except themselves)
- **Fallback protection** for your email even without superuser role

## 🏥 Troubleshooting

### Issue: "Role field missing from database schema"
**Solution:** Run `npx prisma db push` to update your database schema.

### Issue: "User not found" during setup
**Solution:** Ensure `jamesingleton1971@gmail.com` is registered in your system first.

### Issue: Database connection failed
**Solution:** 
1. Check your `DATABASE_URL` environment variable
2. Verify your database server is running
3. Test connection from your application

### Issue: Admin panel not showing role badges
**Solution:**
1. Clear browser cache
2. Redeploy frontend files
3. Check browser console for JavaScript errors

## 📊 Monitoring

### Check Role Distribution
```bash
node server/src/scripts/manage-superuser.js list
```

### Verify Superuser Status
```bash
# Should show your account with superuser role
node server/src/scripts/manage-superuser.js list superuser
```

### Test Deletion Powers
```bash
# Create a test user first, then delete them
node server/src/scripts/manage-superuser.js delete testuser@example.com jamesingleton1971@gmail.com confirm
```

## 🎉 What You Can Do Now

✅ **Delete test admin accounts** you created during development
✅ **Manage user roles** through command line or API
✅ **Enhanced admin panel** with role-based interface
✅ **Secure account management** with built-in safety features
✅ **Full audit trail** of all administrative actions

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console output for specific error messages
3. Verify all files were deployed correctly
4. Test in development environment first

The superuser system is now ready to help you clean up those test accounts and manage your user base with confidence! 🚀 