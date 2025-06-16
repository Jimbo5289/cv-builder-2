# Marketing Consent Query Guide 📧

This guide shows you how to access users' cookie and marketing consent data for your email marketing campaigns.

## 🔍 **What's Now Available:**

### **✅ Database Storage:**
- Cookie consent is now stored in the database (`marketingConsent` field)
- Users can manage preferences via the new `/consent-preferences` page
- All consent changes are logged with timestamps

### **✅ API Endpoints:**

#### 1. **Get Users with Marketing Consent** (Admin Only)
```bash
GET /api/user/marketing-consent
```

**Authentication:** Your admin account (jamesingleton1971@gmail.com)

**Query Parameters:**
- `consent=true` - Only users who consented to marketing
- `consent=false` - Only users who declined marketing
- `page=1` - Page number (default: 1)
- `limit=50` - Results per page (max: 1000)

**Example Requests:**
```bash
# Get all users who consented to marketing (first 50)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://your-api-url.com/api/user/marketing-consent?consent=true"

# Get all users who declined marketing
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://your-api-url.com/api/user/marketing-consent?consent=false"

# Get all users (regardless of consent)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://your-api-url.com/api/user/marketing-consent"
```

**Response Format:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user-id-123",
      "email": "user@example.com",
      "name": "John Doe",
      "marketingConsent": true,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-16T12:45:00Z",
      "lastLogin": "2025-01-16T08:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 245,
    "pages": 5
  },
  "metadata": {
    "queryTimestamp": "2025-01-16T13:00:00Z",
    "consentFilter": "true",
    "summary": {
      "totalUsersReturned": 50,
      "usersWithConsent": 50,
      "usersWithoutConsent": 0
    }
  }
}
```

## 📧 **For Email Marketing:**

### **Export Marketing-Consented Users:**

1. **Get your authentication token** (login to your admin account)
2. **Query consented users:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        "https://your-backend-url.com/api/user/marketing-consent?consent=true&limit=1000" \
        > marketing_users.json
   ```
3. **Extract emails for your email platform** (Mailchimp, etc.)

### **Sample Script to Extract Emails:**
```javascript
// marketing-emails.js
const fs = require('fs');

// Read the JSON response
const data = JSON.parse(fs.readFileSync('marketing_users.json'));

// Extract emails of users who consented
const emails = data.users
  .filter(user => user.marketingConsent === true)
  .map(user => ({
    email: user.email,
    name: user.name,
    joinDate: user.createdAt,
    lastActive: user.lastLogin
  }));

console.log(`Found ${emails.length} users who consented to marketing`);
console.log('First 5 emails:', emails.slice(0, 5));

// Save for CSV import
const csv = emails.map(u => `${u.email},${u.name},${u.joinDate}`).join('\n');
fs.writeFileSync('marketing_emails.csv', 'Email,Name,Join Date\n' + csv);
```

## 🔒 **GDPR Compliance:**

### **Legal Requirements Met:**
- ✅ **Explicit Consent:** Users must actively click "Accept" 
- ✅ **Granular Control:** Separate consent for cookies vs marketing
- ✅ **Easy Withdrawal:** Users can change preferences anytime
- ✅ **Consent Records:** All consent timestamps logged
- ✅ **Data Access:** Users can view their current settings

### **User Consent Management:**
- **Consent Page:** `/consent-preferences` (linked from profile)
- **Cookie Banner:** Updated to save to database
- **Withdrawal:** Users can opt-out anytime via preferences

## 🚀 **Quick Start:**

1. **Login to admin account** (jamesingleton1971@gmail.com)
2. **Visit:** `https://your-frontend-url.com/consent-preferences`
3. **API Test:** 
   ```bash
   # Replace with your actual backend URL and token
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        "https://your-backend-url.com/api/user/marketing-consent?consent=true&limit=10"
   ```

## 📊 **Marketing Lists You Can Create:**

1. **All Consented Users:** `consent=true` 
2. **New Users (Last 30 Days):** Filter by `createdAt`
3. **Active Users:** Filter by recent `lastLogin`
4. **Segmented by Join Date:** Use `createdAt` for cohort analysis

## 🔔 **Important Notes:**

- **Admin Access Only:** Only admin accounts can access marketing consent data
- **Rate Limits:** Max 1000 users per API request
- **GDPR Compliance:** Always respect withdrawal requests immediately
- **Audit Trail:** All consent changes are logged for compliance

## 🆘 **Support:**

If you need help accessing this data or setting up automated exports, the system is now fully configured and ready to use! 