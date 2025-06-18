# Cloudflare Turnstile Integration Setup

This guide explains how to set up Cloudflare Turnstile for bot protection on your MyCVBuilder application.

## 🚀 **What is Cloudflare Turnstile?**

Cloudflare Turnstile is a CAPTCHA replacement that:
- ✅ **Better User Experience**: Most users won't see any challenge
- ✅ **Privacy-Focused**: No personal data tracking
- ✅ **Better Performance**: Faster than traditional CAPTCHAs  
- ✅ **Free**: Up to 1M requests per month
- ✅ **Easy Integration**: Simple JavaScript API

## 📋 **Pre-Deployment Steps**

### 1. **Get Cloudflare Turnstile Keys**

1. **Sign up/Login to Cloudflare Dashboard**: https://dash.cloudflare.com/
2. **Navigate to Turnstile**: Go to "Turnstile" in the left sidebar
3. **Add a Site**:
   - **Site Name**: MyCVBuilder.co.uk
   - **Domain**: `mycvbuilder.co.uk` (and `www.mycvbuilder.co.uk` if needed)
   - **Widget Mode**: "Managed" (recommended)
4. **Get Your Keys**:
   - **Site Key** (public): Used in frontend
   - **Secret Key** (private): Used in backend

### 2. **Configure Environment Variables**

Add these to your environment configuration:

```bash
# Frontend Environment Variables (Vite)
VITE_TURNSTILE_SITE_KEY="your-turnstile-site-key-here"

# Backend Environment Variables
TURNSTILE_SECRET_KEY="your-turnstile-secret-key-here"
```

### 3. **Update Domain Settings in Cloudflare**

When you deploy to production, update the Turnstile site configuration:
- **Domains**: Add your production domain(s)
- **Widget Mode**: Keep as "Managed" for best user experience

## 🔧 **How It Works**

### **Frontend Integration**
- The `CloudflareTurnstile` component loads automatically on the registration page
- Users complete verification (usually invisible)
- Verification token is sent with registration request

### **Backend Verification**
- The `requireTurnstileVerification()` middleware intercepts registration requests
- Verifies the token with Cloudflare's API
- Blocks registration if verification fails

### **Development Mode**
- Turnstile is **disabled** in development mode for easier testing
- Shows a message: "Security verification disabled in development mode"
- Can be overridden by setting `NODE_ENV=production`

## 🛠️ **Testing Turnstile**

### **Test in Production Mode Locally**
```bash
# Set environment to production for testing
NODE_ENV=production npm run dev
```

### **Cloudflare Test Site Keys**
For testing, you can use Cloudflare's test keys:
```bash
# These always pass verification (testing only)
VITE_TURNSTILE_SITE_KEY="1x00000000000000000000AA"
TURNSTILE_SECRET_KEY="1x0000000000000000000000000000000AA"

# These always fail verification (testing only)
VITE_TURNSTILE_SITE_KEY="2x00000000000000000000AB"  
TURNSTILE_SECRET_KEY="2x0000000000000000000000000000000AA"
```

## 📊 **Monitoring & Analytics**

### **Cloudflare Dashboard**
- View verification statistics
- Monitor blocked bot attempts
- Track success rates

### **Application Logs**
- Backend logs all verification attempts
- Failed verifications are logged with error codes
- Successful verifications include hostname verification

## 🚨 **Error Handling**

The system handles various error scenarios:

| Error Code | User Message | Action |
|------------|--------------|---------|
| `missing-input-response` | "Please complete the security verification" | User must complete challenge |
| `invalid-input-response` | "Security verification failed. Please try again" | User retries |
| `timeout-or-duplicate` | "Security verification expired. Please try again" | User gets fresh challenge |
| `internal-error` | "Temporary verification service error. Please try again" | Retry recommended |

## 🔒 **Security Features**

### **Production Safeguards**
- ✅ Registration form is disabled until verification is complete
- ✅ Backend validates every registration request
- ✅ Tokens are single-use and expire after 5 minutes
- ✅ IP address validation (optional)

### **Rate Limiting**
Turnstile works alongside your existing rate limiting:
- Blocks bot traffic before it hits your API
- Reduces load on your authentication system
- Prevents spam registrations

## 🌐 **Cloudflare Platform Integration**

### **When You Deploy to Cloudflare**

1. **Update Domain Settings**:
   - Add your production domain to Turnstile site configuration
   - Remove localhost/development domains from production config

2. **Environment Variables**:
   - Set `VITE_TURNSTILE_SITE_KEY` in Cloudflare Pages environment
   - Set `TURNSTILE_SECRET_KEY` in your backend environment

3. **DNS & SSL**:
   - Cloudflare handles SSL automatically
   - Turnstile works seamlessly with Cloudflare's network

### **Cloudflare Pages Setup**
```bash
# Build settings for Cloudflare Pages
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)

# Environment variables to set:
VITE_TURNSTILE_SITE_KEY=your-production-site-key
VITE_DEV_MODE=false
NODE_ENV=production
```

## 🧪 **Implementation Details**

### **Components Added**
- `src/components/CloudflareTurnstile.jsx` - React component wrapper
- `server/src/utils/turnstile.js` - Backend verification utilities

### **Modified Files**
- `src/pages/Register.jsx` - Integrated Turnstile into registration form
- `server/src/routes/auth.js` - Added verification middleware

### **Environment Variables**
- `VITE_TURNSTILE_SITE_KEY` - Frontend site key
- `TURNSTILE_SECRET_KEY` - Backend secret key

## 📞 **Support & Troubleshooting**

### **Common Issues**

1. **"Site key not configured" message**:
   - Check `VITE_TURNSTILE_SITE_KEY` is set correctly
   - Restart development server after adding environment variable

2. **"Server configuration error"**:
   - Check `TURNSTILE_SECRET_KEY` is set on backend
   - Verify the secret key matches the site key

3. **Verification always fails**:
   - Check domain is correctly configured in Cloudflare dashboard
   - Ensure you're using the right keys for the right environment

### **Debug Mode**
Enable detailed logging by setting:
```bash
LOG_LEVEL=debug
```

## 🎯 **Next Steps After Deployment**

1. **Monitor Analytics**: Check Cloudflare dashboard for verification stats
2. **Adjust Widget Mode**: Switch between "Managed", "Non-Interactive", or "Invisible" based on user feedback
3. **Review Logs**: Monitor backend logs for any verification issues
4. **Test User Experience**: Have team members test registration flow

---

**📝 Note**: This integration is designed to be minimally intrusive to users while providing strong bot protection. Most legitimate users will complete verification without noticing any additional steps. 