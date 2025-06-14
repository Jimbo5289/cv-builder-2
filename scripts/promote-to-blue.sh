#!/bin/bash

# Promote Green to Blue (Production) Script
# This script promotes the tested staging environment to production

set -e  # Exit on any error

echo "🔵 Starting Blue Environment Promotion..."
echo "================================================"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if staging branch exists
if ! git show-ref --verify --quiet refs/heads/staging; then
    echo "❌ Error: staging branch does not exist"
    echo "💡 Run ./scripts/deploy-green.sh first to create staging environment"
    exit 1
fi

# Confirmation prompt
echo "⚠️  You are about to promote staging to production!"
echo "🧪 Staging: https://staging.mycvbuilder.co.uk"
echo "🌐 Production: https://mycvbuilder.co.uk"
echo ""
read -p "Have you tested the staging environment thoroughly? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Promotion cancelled"
    echo "💡 Please test staging environment first: https://staging.mycvbuilder.co.uk"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Switch to main branch
echo "🔄 Switching to main branch..."
git checkout main

# Pull latest changes
echo "🔄 Pulling latest changes..."
git pull origin main

# Merge staging into main
echo "🔄 Merging staging into main..."
git merge staging --no-edit

# Push to main
echo "🚀 Pushing to production (main branch)..."
git push origin main

# Switch back to original branch
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Switching back to $CURRENT_BRANCH..."
    git checkout "$CURRENT_BRANCH"
fi

echo ""
echo "🎉 Blue Environment Promotion Complete!"
echo "================================================"
echo "🌐 Production Frontend: https://mycvbuilder.co.uk"
echo "🔧 Production Backend: https://cv-builder-2.onrender.com"
echo ""
echo "⏱️  Production deployment may take 2-3 minutes to complete"
echo "📊 Monitor deployment:"
echo "   - Vercel: https://vercel.com/dashboard"
echo "   - Render: https://dashboard.render.com"
echo ""
echo "✅ Your changes are now live in production!"
echo "🔍 Monitor for any issues and be ready to rollback if needed" 