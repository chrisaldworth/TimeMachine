# 🌿 Git Branching Strategy for Ticket-First Development

## 📋 **Core Rule: One Branch Per Task**

**CRITICAL:** Every task must have its own branch. No work should be done directly on `main`.

## 🌳 **Branch Naming Convention**

### **Format:** `type/TASK-XXX-short-description`

### **Types:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### **Examples:**
```bash
feature/TASK-026-photo-upload-interface
fix/TASK-039-time-slider-animation-bug
docs/TASK-001-project-setup-documentation
refactor/TASK-059-database-query-optimization
test/TASK-069-comprehensive-testing-suite
chore/TASK-002-project-structure-setup
```

## 🔄 **Complete Workflow**

### **1. Start New Task**
```bash
# Create task
node project-management/task-manager.js create "implement photo upload interface"

# Move to in-progress
node project-management/task-manager.js move TASK-026 to in-progress

# Create branch
git checkout -b feature/TASK-026-photo-upload-interface

# Start working...
```

### **2. During Development**
```bash
# Make changes
# Stage files
git add .

# Commit with task ID (hooks will validate)
git commit -m "feat(TASK-026): implement drag-and-drop photo upload"

# Continue working...
git commit -m "feat(TASK-026): add image validation and processing"
```

### **3. Complete Task**
```bash
# Final commit
git commit -m "feat(TASK-026): complete photo upload interface with error handling"

# Push branch
git push origin feature/TASK-026-photo-upload-interface

# Create Pull Request
# (GitHub will auto-suggest PR creation)

# Move task to review
node project-management/task-manager.js move TASK-026 to review
```

### **4. After PR Approval**
```bash
# Merge PR on GitHub
# Delete branch on GitHub

# Switch back to main
git checkout main

# Pull latest changes
git pull origin main

# Delete local branch
git branch -d feature/TASK-026-photo-upload-interface

# Move task to done
node project-management/task-manager.js move TASK-026 to done
```

## 🚫 **Prohibited Actions**

- ❌ **Never commit directly to `main`**
- ❌ **Never work on multiple tasks in one branch**
- ❌ **Never merge without a Pull Request**
- ❌ **Never delete branches before PR is merged**

## ✅ **Required Actions**

- ✅ **Always create a branch for each task**
- ✅ **Always use the branch naming convention**
- ✅ **Always create a Pull Request for review**
- ✅ **Always move task to review before creating PR**
- ✅ **Always move task to done after PR merge**

## 🔧 **Git Hooks Integration**

The Git hooks will:
- ✅ **Validate task ID** in commit messages
- ✅ **Check task exists** in project board
- ✅ **Verify task status** (in-progress or review)
- ✅ **Enforce commit message format**

## 📊 **Branch Management**

### **List Active Branches**
```bash
# List all branches
git branch -a

# List branches with task IDs
git branch | grep -E "TASK-[0-9]{3}"
```

### **Clean Up Completed Branches**
```bash
# Delete merged branches
git branch --merged | grep -v main | xargs -n 1 git branch -d

# Delete remote tracking branches
git remote prune origin
```

## 🎯 **Benefits**

1. **Clear History** - Each task has its own commit history
2. **Easy Review** - Pull Requests show exactly what changed for each task
3. **Rollback Safety** - Can easily revert specific features
4. **Parallel Development** - Multiple tasks can be worked on simultaneously
5. **Code Review** - All changes go through PR review process
6. **Task Tracking** - Branch names clearly show what work is being done

## 🚀 **Quick Reference**

```bash
# Start new task
git checkout -b feature/TASK-XXX-description
node project-management/task-manager.js move TASK-XXX to in-progress

# Work and commit
git add .
git commit -m "feat(TASK-XXX): implement feature"

# Complete task
git push origin feature/TASK-XXX-description
node project-management/task-manager.js move TASK-XXX to review
# Create PR on GitHub

# After PR merge
git checkout main
git pull origin main
git branch -d feature/TASK-XXX-description
node project-management/task-manager.js move TASK-XXX to done
```

**Remember: One task = One branch = One Pull Request!** 🎯
