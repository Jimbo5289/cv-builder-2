#!/bin/bash

# Emergency Rollback Script
# This script helps rollback to a previous version in case of issues

set -e  # Exit on any error

echo "🚨 Emergency Rollback Script"
echo "================================================"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

echo "⚠️  This script will help you rollback production to a previous version"
echo ""

# Show recent commits
echo "📋 Recent commits on main branch:"
git log --oneline -10 main

echo ""
echo "🔍 Choose rollback method:"
echo "1) Rollback to previous commit (recommended)"
echo "2) Rollback to specific commit"
echo "3) Cancel rollback"
echo ""

read -p "Enter your choice (1-3): " -n 1 -r
echo

case $REPLY in
    1)
        echo "🔄 Rolling back to previous commit..."
        ROLLBACK_COMMIT=$(git rev-parse HEAD~1)
        ;;
    2)
        echo ""
        read -p "Enter commit hash to rollback to: " ROLLBACK_COMMIT
        
        # Validate commit hash
        if ! git cat-file -e "$ROLLBACK_COMMIT" 2>/dev/null; then
            echo "❌ Error: Invalid commit hash"
            exit 1
        fi
        ;;
    3)
        echo "❌ Rollback cancelled"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# Show what we're rolling back to
echo ""
echo "📍 Rolling back to commit:"
git show --oneline -s "$ROLLBACK_COMMIT"
echo ""

# Final confirmation
read -p "⚠️  Are you sure you want to rollback production? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Rollback cancelled"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Switch to main branch
echo "🔄 Switching to main branch..."
git checkout main

# Create rollback commit
echo "🔄 Creating rollback commit..."
git revert --no-edit HEAD.."$ROLLBACK_COMMIT" || {
    echo "🔄 Using reset method instead..."
    git reset --hard "$ROLLBACK_COMMIT"
}

# Push the rollback
echo "🚀 Pushing rollback to production..."
git push origin main --force-with-lease

# Switch back to original branch
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Switching back to $CURRENT_BRANCH..."
    git checkout "$CURRENT_BRANCH"
fi

echo ""
echo "✅ Rollback Complete!"
echo "================================================"
echo "🌐 Production: https://mycvbuilder.co.uk"
echo "🔧 Backend: https://cv-builder-2.onrender.com"
echo ""
echo "⏱️  Rollback deployment may take 2-3 minutes to complete"
echo "📊 Monitor deployment:"
echo "   - Vercel: https://vercel.com/dashboard"
echo "   - Render: https://dashboard.render.com"
echo ""
echo "🔍 Monitor the application to ensure the rollback resolved the issues"
echo "📝 Don't forget to investigate and fix the original problem" 