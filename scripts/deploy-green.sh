#!/bin/bash

# Deploy to Green Environment Script
# This script deploys the current main branch to the green (staging) environment

set -e  # Exit on any error

echo "🟢 Starting Green Environment Deployment..."
echo "================================================"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes"
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Create or switch to staging branch
echo "🔄 Switching to staging branch..."
if git show-ref --verify --quiet refs/heads/staging; then
    git checkout staging
    echo "✅ Switched to existing staging branch"
else
    git checkout -b staging
    echo "✅ Created new staging branch"
fi

# Merge main into staging
echo "🔄 Merging main into staging..."
git merge main --no-edit

# Push to remote
echo "🚀 Pushing to remote staging branch..."
git push origin staging

# Switch back to original branch
echo "🔄 Switching back to $CURRENT_BRANCH..."
git checkout "$CURRENT_BRANCH"

echo ""
echo "🎉 Green Environment Deployment Complete!"
echo "================================================"
echo "🌐 Frontend: https://cv-builder-green.vercel.app"
echo "🔧 Backend: https://cv-builder-green.onrender.com"
echo "🧪 Staging URL: https://staging.mycvbuilder.co.uk"
echo ""
echo "⏱️  Deployment may take 2-3 minutes to complete"
echo "📊 Monitor deployment:"
echo "   - Vercel: https://vercel.com/dashboard"
echo "   - Render: https://dashboard.render.com"
echo ""
echo "🧪 Test your changes on the staging environment before promoting to production" 