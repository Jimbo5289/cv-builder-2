# AWS + Application User Management Guide

## 🏗️ **Database Access Methods**

### **Method 1: AWS RDS Query Editor** (Recommended for Quick Queries)

1. **Access RDS Console**: https://console.aws.amazon.com/rds/
2. **Select Your Database**: `cvbuilder-db-encrypted`
3. **Query Editor**: Enable if not already done
4. **Connect**: Use your database credentials

### **Method 2: Direct Database Connection** (For Complex Operations)

```bash
# Connect via psql (install PostgreSQL client)
psql -h cvbuilder-db-encrypted.c1augguy6rx8.eu-central-1.rds.amazonaws.com \
     -p 5432 \
     -U postgres \
     -d cvbuilder-db

# Or use GUI tools like:
# - pgAdmin
# - DBeaver  
# - TablePlus
```

### **Method 3: Application Admin API** (GDPR Compliant)

Base URL: `https://cv-builder-backend-zjax.onrender.com/api/admin`

Authentication: Your admin account token

## 📊 **Common User Management Tasks**

### **1. View All Users**

**AWS SQL:**
```sql
SELECT 
    id, 
    email, 
    name, 
    "createdAt", 
    "isActive", 
    "marketingConsent",
    "lastLogin"
FROM "User" 
ORDER BY "createdAt" DESC 
LIMIT 50;
```

**Application API:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://cv-builder-backend-zjax.onrender.com/api/admin/users?limit=50"
```

### **2. Find Specific User**

**AWS SQL:**
```sql
-- By email
SELECT * FROM "User" WHERE email = 'user@example.com';

-- By name (partial match)
SELECT * FROM "User" WHERE name ILIKE '%john%';

-- By registration date
SELECT * FROM "User" 
WHERE "createdAt" >= '2025-01-01' 
ORDER BY "createdAt" DESC;
```

**Application API:**
```bash
# Get user details
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://cv-builder-backend-zjax.onrender.com/api/admin/users/USER_ID"
```

### **3. User Activity Analysis**

**AWS SQL:**
```sql
-- Users with their CV counts
SELECT 
    u.email,
    u.name,
    u."createdAt",
    u."lastLogin",
    COUNT(cv.id) as cv_count
FROM "User" u
LEFT JOIN "CV" cv ON u.id = cv."userId"
GROUP BY u.id, u.email, u.name, u."createdAt", u."lastLogin"
ORDER BY cv_count DESC;

-- Active subscribers
SELECT 
    u.email,
    u.name,
    s.status,
    s."currentPeriodEnd"
FROM "User" u
JOIN "Subscription" s ON u.id = s."userId"
WHERE s.status = 'active'
ORDER BY s."currentPeriodEnd" ASC;
```

### **4. Marketing Consent Analysis**

**AWS SQL:**
```sql
-- Marketing consent summary
SELECT 
    "marketingConsent",
    COUNT(*) as user_count
FROM "User" 
GROUP BY "marketingConsent";

-- Users who consented to marketing
SELECT email, name, "createdAt"
FROM "User" 
WHERE "marketingConsent" = true
ORDER BY "createdAt" DESC;
```

**Application API:**
```bash
# Get users with marketing consent
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://cv-builder-backend-zjax.onrender.com/api/user/marketing-consent?consent=true"
```

## 🚨 **GDPR Data Deletion**

### **⚠️ CRITICAL: Use Application API for GDPR Compliance**

**✅ Proper GDPR Deletion (Recommended):**
```bash
# Export user data first (legal requirement)
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     "https://cv-builder-backend-zjax.onrender.com/api/admin/users/USER_ID/export" \
     > user_data_export.json

# Then delete (requires email confirmation)
curl -X DELETE \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"confirmEmail": "user@example.com"}' \
     "https://cv-builder-backend-zjax.onrender.com/api/admin/users/USER_ID"
```

**❌ Emergency AWS Deletion (Use Only If Application Unavailable):**
```sql
-- WARNING: No audit trail, use only in emergencies
-- ALWAYS export data first manually

-- 1. Get user info for records
SELECT * FROM "User" WHERE email = 'user@example.com';

-- 2. Delete in order (foreign key constraints)
DELETE FROM "CVSection" 
WHERE "cvId" IN (
    SELECT id FROM "CV" 
    WHERE "userId" = 'USER_ID_HERE'
);

DELETE FROM "CV" WHERE "userId" = 'USER_ID_HERE';
DELETE FROM "Subscription" WHERE "userId" = 'USER_ID_HERE';
DELETE FROM "TemporaryAccess" WHERE "userId" = 'USER_ID_HERE';
DELETE FROM "User" WHERE id = 'USER_ID_HERE';
```

## 🔒 **Account Management**

### **Deactivate User**

**Application API (Recommended):**
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     "https://cv-builder-backend-zjax.onrender.com/api/admin/users/USER_ID/deactivate"
```

**AWS SQL (Emergency):**
```sql
UPDATE "User" 
SET "isActive" = false, "updatedAt" = NOW()
WHERE email = 'user@example.com';
```

### **Update User Information**

**Application API:**
```bash
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "New Name",
       "email": "new@email.com",
       "isActive": true,
       "marketingConsent": false
     }' \
     "https://cv-builder-backend-zjax.onrender.com/api/admin/users/USER_ID"
```

## 📈 **Useful Reporting Queries**

### **User Growth Analysis**

```sql
-- Monthly user registrations
SELECT 
    DATE_TRUNC('month', "createdAt") as month,
    COUNT(*) as new_users
FROM "User"
GROUP BY DATE_TRUNC('month', "createdAt")
ORDER BY month DESC;

-- Daily active users (based on last login)
SELECT 
    COUNT(*) as active_users
FROM "User" 
WHERE "lastLogin" >= NOW() - INTERVAL '30 days'
AND "isActive" = true;
```

### **Revenue Analysis**

```sql
-- Active subscriptions by status
SELECT 
    status,
    COUNT(*) as count,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM "Subscription") as percentage
FROM "Subscription"
GROUP BY status;

-- Revenue analysis would require Stripe webhook data
-- Check your Stripe dashboard for financial reports
```

## 🛡️ **Security Best Practices**

### **When to Use AWS Direct Access:**
- ✅ Read-only reporting and analysis
- ✅ Emergency database maintenance
- ✅ Bulk operations (with extreme caution)
- ✅ Performance troubleshooting

### **When to Use Application API:**
- ✅ GDPR compliance operations
- ✅ User data modifications
- ✅ Account management
- ✅ Any operation requiring audit trails

### **Security Checklist:**
- [ ] Always backup before bulk operations
- [ ] Test queries on development first
- [ ] Document all direct database changes
- [ ] Use transactions for multi-step operations
- [ ] Verify foreign key constraints
- [ ] Export user data before deletion

## 🚀 **Quick Access Links**

- **AWS RDS Console**: https://console.aws.amazon.com/rds/
- **Your Database**: `cvbuilder-db-encrypted.c1augguy6rx8.eu-central-1.rds.amazonaws.com`
- **Admin API Base**: `https://cv-builder-backend-zjax.onrender.com/api/admin`
- **User Management API**: `https://cv-builder-backend-zjax.onrender.com/api/user`

## 📞 **Emergency Contacts**

For GDPR deletion requests:
1. **First**: Try application API
2. **Backup**: Direct AWS access with manual documentation
3. **Always**: Export user data before deletion
4. **Document**: All actions taken for compliance records 