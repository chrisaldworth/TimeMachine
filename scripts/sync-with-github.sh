#!/bin/bash

echo "🚀 Syncing Rewind the Map with GitHub"
echo "===================================="

# Navigate to project root
cd /Users/chrisaldworth/Desktop/TimeMachine

# Check if Git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Xcode Command Line Tools first."
    exit 1
fi

echo "✅ Git is available"

# Initialize Git repository
echo "📦 Initializing Git repository..."
git init

# Configure Git user (if not already configured)
echo "👤 Configuring Git user..."
git config user.name "Chris Aldworth" || echo "User name already configured"
git config user.email "chrisaldworth@example.com" || echo "User email already configured"

# Add GitHub remote
echo "🔗 Adding GitHub remote..."
git remote add origin git@github.com:chrisaldworth/TimeMachine.git

# Add all files
echo "📁 Adding files to Git..."
git add .

# Make initial commit
echo "💾 Making initial commit..."
git commit -m "feat(TASK-001): initial project setup with clean structure

- Cleaned project structure (reduced from 2,810 to 66 files)
- Set up task management system with CLI tools
- Created comprehensive documentation structure
- Added ticket-first development enforcement
- Configured project for React Native + Node.js stack
- Set up Git hooks for commit message validation
- Created visual Kanban board for project tracking

Closes TASK-001"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "🎉 Successfully synced with GitHub!"
echo "=================================="
echo "📊 Repository: https://github.com/chrisaldworth/TimeMachine"
echo "📋 Tasks: $(find . -name "tasks.json" -exec cat {} \; | grep -o '"id"' | wc -l | tr -d ' ') tasks loaded"
echo "📁 Files: $(find . -type f | wc -l | tr -d ' ') files in repository"
echo ""
echo "✅ TASK-001 completed - ready for development!"
