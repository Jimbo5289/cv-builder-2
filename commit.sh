#!/bin/bash

# Script to commit all changes to the repository

echo "===== CV Builder Git Commit Script ====="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: Git is not installed"
    exit 1
fi

# Check if the directory is a git repository
if [ ! -d .git ]; then
    echo "Initializing Git repository..."
    git init
fi

# Add all files
echo "Adding all files to Git..."
git add .

# Get the commit message
echo "Enter commit message (CV Builder v2.0.0 - Feature Update):"
read -p "> " commit_message
if [ -z "$commit_message" ]; then
    commit_message="CV Builder v2.0.0 - Added LinkedIn Review, Course Recommendations, and Updated Pricing"
fi

# Commit the changes
echo "Committing changes with message: '$commit_message'"
git commit -m "$commit_message"

# Check if remote exists
remote_exists=$(git remote -v | grep origin)
if [ -z "$remote_exists" ]; then
    echo "No remote repository configured."
    echo "Would you like to add a remote repository now? (y/n)"
    read -p "> " add_remote
    
    if [ "$add_remote" = "y" ] || [ "$add_remote" = "Y" ]; then
        echo "Enter the remote repository URL:"
        read -p "> " remote_url
        
        if [ ! -z "$remote_url" ]; then
            git remote add origin "$remote_url"
            echo "Remote added: origin -> $remote_url"
        fi
    fi
fi

# Push changes if remote exists
if git remote -v | grep origin > /dev/null; then
    echo "Would you like to push changes to the remote repository? (y/n)"
    read -p "> " push_changes
    
    if [ "$push_changes" = "y" ] || [ "$push_changes" = "Y" ]; then
        echo "Pushing changes to remote repository..."
        git push -u origin master || git push -u origin main
    fi
fi

echo ""
echo "Commit process completed!"
echo "===== End of CV Builder Git Commit Script =====" 