#!/bin/bash

# Start Task Script - Creates task and branch for ticket-first development

if [ $# -eq 0 ]; then
    echo "🎯 Start Task Script"
    echo "==================="
    echo ""
    echo "Usage: ./scripts/start-task.sh <task-description>"
    echo ""
    echo "📝 Examples:"
    echo "   ./scripts/start-task.sh \"implement photo upload interface\""
    echo "   ./scripts/start-task.sh \"fix time slider animation bug\""
    echo "   ./scripts/start-task.sh \"set up project structure\""
    echo ""
    exit 1
fi

TASK_DESCRIPTION="$1"

echo "🚀 Starting new task: $TASK_DESCRIPTION"
echo "======================================="

# Navigate to project root
cd "$(dirname "$0")/.."

# Create task with requirement and use case linking
echo "📋 Creating task..."
echo "🔗 Linking to requirements and use cases..."

# Extract task number for linking
TASK_NUMBER=$(echo "$TASK_DESCRIPTION" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | sed 's/  */ /g' | sed 's/ /-/g' | cut -c1-10)

# Create requirement and use case references
REQUIREMENTS="REQ-XXX-$TASK_NUMBER"
USE_CASES="UC-XXX-$TASK_NUMBER,DEV-UC-XXX-$TASK_NUMBER"

TASK_OUTPUT=$(node project-management/task-manager.js create "$TASK_DESCRIPTION" --requirements "$REQUIREMENTS" --usecases "$USE_CASES" 2>&1)

# Extract task ID from output
TASK_ID=$(echo "$TASK_OUTPUT" | grep -oE "TASK-[0-9]{3}" | head -1)

if [ -z "$TASK_ID" ]; then
    echo "❌ Error creating task:"
    echo "$TASK_OUTPUT"
    exit 1
fi

echo "✅ Task created: $TASK_ID"

# Move task to in-progress
echo "🔄 Moving task to in-progress..."
node project-management/task-manager.js move "$TASK_ID" to in-progress

# Determine branch type based on description
BRANCH_TYPE="feature"
if echo "$TASK_DESCRIPTION" | grep -qiE "(fix|bug|error|issue)"; then
    BRANCH_TYPE="fix"
elif echo "$TASK_DESCRIPTION" | grep -qiE "(doc|readme|guide)"; then
    BRANCH_TYPE="docs"
elif echo "$TASK_DESCRIPTION" | grep -qiE "(refactor|clean|optimize)"; then
    BRANCH_TYPE="refactor"
elif echo "$TASK_DESCRIPTION" | grep -qiE "(test|spec)"; then
    BRANCH_TYPE="test"
elif echo "$TASK_DESCRIPTION" | grep -qiE "(setup|config|chore)"; then
    BRANCH_TYPE="chore"
fi

# Create branch name
BRANCH_NAME=$(echo "$TASK_DESCRIPTION" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | sed 's/  */ /g' | sed 's/ /-/g' | cut -c1-30)
BRANCH_NAME="$BRANCH_TYPE/$TASK_ID-$BRANCH_NAME"

echo "🌿 Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

echo ""
echo "🎉 Task setup complete!"
echo "======================"
echo "📋 Task ID: $TASK_ID"
echo "🌿 Branch: $BRANCH_NAME"
echo "📊 Status: in-progress"
echo ""
echo "🚀 Next steps:"
echo "   1. Start working on your task"
echo "   2. Make commits: git commit -m \"feat($TASK_ID): implement feature\""
echo "   3. When ready: git push origin $BRANCH_NAME"
echo "   4. Create Pull Request on GitHub"
echo "   5. Move to review: node project-management/task-manager.js move $TASK_ID to review"
echo ""
echo "✅ Ready to start development!"
