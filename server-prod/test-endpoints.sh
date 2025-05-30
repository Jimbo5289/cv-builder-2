#!/bin/bash

BASE_URL="http://localhost:3005"
TOKEN=""

echo "🧪 Testing CV Builder API Endpoints"
echo "=================================="

# 1. Test health endpoint
echo "\n1. Testing health endpoint"
curl -s "$BASE_URL/health" | jq '.'

# 2. Test user registration
echo "\n2. Testing user registration"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "name": "Test User"
  }')
echo $REGISTER_RESPONSE | jq '.'

# 3. Test user login
echo "\n3. Testing user login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }')
echo $LOGIN_RESPONSE | jq '.'

# Extract token from login response
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

# 4. Test CV endpoints
echo "\n4. Testing CV creation"
CV_RESPONSE=$(curl -s -X POST "$BASE_URL/api/cv" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Software Engineer CV",
    "sections": [
      {
        "title": "Experience",
        "content": "Senior Developer at Tech Corp"
      }
    ]
  }')
echo $CV_RESPONSE | jq '.'

# 5. Test subscription endpoints
echo "\n5. Testing subscription creation"
SUBSCRIPTION_RESPONSE=$(curl -s -X POST "$BASE_URL/api/subscription/create-checkout-session" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "priceId": "price_test",
    "successUrl": "http://localhost:5173/success",
    "cancelUrl": "http://localhost:5173/cancel"
  }')
echo $SUBSCRIPTION_RESPONSE | jq '.'

echo "\n✅ API Tests completed" 