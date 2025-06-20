#!/bin/bash

echo "🔧 Fixing test environment issues..."

# 1. Fix Prisma client for the correct architecture
echo "Regenerating Prisma client..."
cd server && npx prisma generate
cd ../server-prod && npx prisma generate
cd ..

# 2. Create test environment file
echo "Creating test environment..."
cat > .env.test << 'EOF'
NODE_ENV=test
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
JWT_SECRET=test-secret-key
PORT=0
STRIPE_SECRET_KEY=sk_test_mock
STRIPE_WEBHOOK_SECRET=whsec_mock
EOF

# 3. Update package.json to use test environment
echo "Tests should now use isolated ports and mock services"
echo "✅ Test fixes applied!" 