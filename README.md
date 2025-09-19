# 🎯 Rewind the Map

A web-based platform for uploading historical photos, tagging them to locations, and exploring changes over time with an interactive time slider.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev

# View project board
open project-management/kanban-board.html
```

## 📋 Development Workflow

This project uses **ticket-first development** - all work must be tracked through the task management system.

### Core Rules:
- ❌ **No work without tickets** - All development must be tracked
- ✅ **Create task first** - Before any code changes
- ✅ **Update progress** - Regular task updates required

### Cursor Commands:
```
@cursor Create a new task for: [description]
@cursor Move task TASK-XXX to in-progress
@cursor Update task TASK-XXX with: actualHours=4
```

## 🎛️ Task Management

```bash
# View tasks
node project-management/task-manager.js list

# Generate report
node project-management/task-manager.js report

# Update web board
node scripts/update-final-board.js
```

## 📚 Documentation

- [Project Plan](docs/master-project-plan.md)
- [Architecture](docs/architecture/)
- [Requirements](docs/requirements/)
- [Use Cases](docs/usecases/)

## 🎯 Core Rule

**NO WORK WITHOUT TICKETS! EVERY LINE OF CODE MUST BE TRACKED!**
