# Git Strategy

## Overview
This document outlines the Git strategy for the Rewind the Map platform, including branching, merging, and version control approach.

## Branching Strategy

### 1. Main Branches
- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`staging`** - Pre-production testing branch

### 2. Supporting Branches
- **`feature/*`** - Feature development branches
- **`bugfix/*`** - Bug fix branches
- **`hotfix/*`** - Critical production fixes
- **`release/*`** - Release preparation branches

## Branch Naming Conventions

### Feature Branches
```
feature/UC-GU-023-decade-selection
feature/REQ-UPLOAD-005-decade-validation
feature/map-time-slider-animation
feature/user-profile-statistics
```

### Bug Fix Branches
```
bugfix/photo-upload-validation-error
bugfix/map-clustering-performance
bugfix/time-slider-mobile-gestures
```

### Hotfix Branches
```
hotfix/critical-security-patch
hotfix/production-database-connection
hotfix/map-rendering-crash
```

### Release Branches
```
release/v1.0.0
release/v1.1.0
release/v2.0.0
```

## Git Workflow

### 1. Feature Development
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/UC-GU-023-decade-selection

# Development work
git add .
git commit -m "feat: add decade selection to photo upload form

- Add decade dropdown to upload form
- Implement decade validation
- Update photo model to include decade field
- Add tests for decade selection

Closes #123"

# Push and create PR
git push origin feature/UC-GU-023-decade-selection
```

### 2. Bug Fix Workflow
```bash
# Start bug fix
git checkout develop
git pull origin develop
git checkout -b bugfix/photo-upload-validation-error

# Fix implementation
git add .
git commit -m "fix: resolve photo upload validation error

- Fix validation logic for required fields
- Add proper error handling
- Update error messages for better UX

Fixes #456"

# Push and create PR
git push origin bugfix/photo-upload-validation-error
```

### 3. Hotfix Workflow
```bash
# Start hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-patch

# Implement fix
git add .
git commit -m "hotfix: patch critical security vulnerability

- Update authentication middleware
- Add input sanitization
- Fix XSS vulnerability

Fixes #789"

# Push and create PR
git push origin hotfix/critical-security-patch
```

## Commit Message Convention

### Format
```
<type>(<scope>): <description>

<body>

<footer>
```

### Types
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks
- **perf:** Performance improvements
- **ci:** CI/CD changes

### Examples
```bash
# Feature commit
git commit -m "feat(upload): add decade selection to photo upload

- Add decade dropdown component
- Implement decade validation
- Update photo model schema
- Add unit tests for decade selection

Closes #123"

# Bug fix commit
git commit -m "fix(map): resolve clustering performance issue

- Optimize clustering algorithm
- Add performance monitoring
- Update cluster size calculations

Fixes #456"

# Documentation commit
git commit -m "docs(api): update photo upload API documentation

- Add decade parameter to upload endpoint
- Update request/response examples
- Add validation rules documentation"
```

## Pull Request Process

### 1. PR Creation
```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Closes #123
Fixes #456

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or documented)
```

### 2. PR Review Process
1. **Automated Checks**
   - CI/CD pipeline runs
   - Code quality checks
   - Security scans
   - Test coverage validation

2. **Code Review**
   - At least 2 reviewers required
   - Review checklist completed
   - Feedback addressed
   - Approval received

3. **Merge Process**
   - Squash and merge to develop
   - Delete feature branch
   - Update related issues

## Version Control

### 1. Semantic Versioning
```
MAJOR.MINOR.PATCH
```

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes (backward compatible)

### 2. Tagging Strategy
```bash
# Create release tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Create hotfix tag
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin v1.0.1
```

### 3. Release Notes
```markdown
# Release Notes v1.0.0

## New Features
- Interactive map with photo pins
- Time slider with decade filtering
- Photo upload with drag-and-drop
- User profiles and statistics

## Bug Fixes
- Fixed map clustering performance
- Resolved photo upload validation
- Fixed time slider mobile gestures

## Breaking Changes
- None

## Migration Guide
- No migration required
```

## Branch Protection Rules

### 1. Main Branch Protection
```yaml
# .github/branch-protection.yml
main:
  required_status_checks:
    strict: true
    contexts:
      - ci/tests
      - ci/security-scan
      - ci/code-quality
  enforce_admins: true
  required_pull_request_reviews:
    required_approving_review_count: 2
    dismiss_stale_reviews: true
    require_code_owner_reviews: true
  restrictions:
    users: []
    teams: []
```

### 2. Develop Branch Protection
```yaml
develop:
  required_status_checks:
    strict: true
    contexts:
      - ci/tests
      - ci/code-quality
  enforce_admins: false
  required_pull_request_reviews:
    required_approving_review_count: 1
    dismiss_stale_reviews: true
  restrictions:
    users: []
    teams: []
```

## Git Hooks

### 1. Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test:unit

# Check commit message format
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci)(\(.+\))?: .{1,50}'

if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format!"
    echo "Format: <type>(<scope>): <description>"
    exit 1
fi
```

### 2. Pre-push Hook
```bash
#!/bin/sh
# .git/hooks/pre-push

# Run full test suite
npm run test

# Run build
npm run build

# Check for TODO/FIXME comments
if grep -r "TODO\|FIXME" src/ --exclude-dir=node_modules; then
    echo "Found TODO/FIXME comments. Please address before pushing."
    exit 1
fi
```

## Repository Structure

### 1. Directory Organization
```
rewind-the-map/
├── .github/
│   ├── workflows/
│   ├── branch-protection.yml
│   └── ISSUE_TEMPLATE/
├── docs/
│   ├── architecture/
│   ├── api/
│   └── deployment/
├── src/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── types/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .gitignore
├── .gitattributes
├── package.json
└── README.md
```

### 2. .gitignore Configuration
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port
```

## Collaboration Guidelines

### 1. Code Review Best Practices
- **Be Constructive:** Provide helpful feedback
- **Be Specific:** Point out exact issues
- **Be Timely:** Review within 24 hours
- **Be Thorough:** Check functionality, security, performance

### 2. Conflict Resolution
- **Communication:** Discuss conflicts in team chat
- **Documentation:** Document resolution decisions
- **Testing:** Ensure resolved code works correctly
- **Review:** Have conflicts reviewed by senior developer

### 3. Team Coordination
- **Daily Standups:** Discuss current work and blockers
- **Sprint Planning:** Plan work for upcoming sprint
- **Retrospectives:** Review process and improve
- **Knowledge Sharing:** Share learnings and best practices

## Monitoring and Metrics

### 1. Git Metrics
- **Commit Frequency:** Commits per day/week
- **PR Cycle Time:** Time from PR creation to merge
- **Code Review Time:** Time for reviews to complete
- **Branch Lifecycle:** Time branches exist

### 2. Quality Metrics
- **Test Coverage:** Percentage of code covered
- **Bug Rate:** Bugs found per feature
- **Technical Debt:** Code quality metrics
- **Security Issues:** Vulnerabilities found

### 3. Team Metrics
- **Velocity:** Story points completed per sprint
- **Burndown:** Progress toward sprint goals
- **Team Satisfaction:** Developer experience metrics
- **Knowledge Sharing:** Documentation and training metrics

This Git strategy ensures consistent, high-quality code delivery while maintaining clear version control and collaboration practices.
