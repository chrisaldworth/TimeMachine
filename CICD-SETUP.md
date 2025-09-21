# 🚀 CI/CD Pipeline Setup Guide

## 📋 **Overview**

This document describes the CI/CD pipeline configuration for the Rewind the Map project, including automated testing, building, security scanning, and deployment processes.

## 🔄 **Pipeline Architecture**

### **CI Pipeline (Continuous Integration)**
- **Trigger**: Push to main/develop branches, Pull Requests
- **Jobs**: Code Quality, Unit Tests, Build, Security, Integration Tests, E2E Tests, Performance Tests
- **Duration**: ~15 minutes
- **Status**: Required for PR merging

### **CD Pipeline (Continuous Deployment)**
- **Trigger**: Push to main branch, Manual workflow dispatch
- **Environments**: Staging (auto), Production (manual approval)
- **Duration**: ~10 minutes
- **Approval**: Staging (1 reviewer), Production (2 reviewers + 5min wait)

## 🛠️ **Pipeline Jobs**

### **1. Code Quality Checks**
```yaml
- TypeScript type checking
- ESLint code linting
- Prettier formatting validation
- Code coverage reporting
```

### **2. Unit Tests**
```yaml
- Jest test execution
- Coverage report generation
- Test result reporting
- Codecov integration
```

### **3. Build Process**
```yaml
- Shared package build
- Backend package build
- Frontend package build
- Artifact upload
```

### **4. Security Scanning**
```yaml
- npm audit vulnerability scan
- Snyk security analysis
- Trivy vulnerability scanner
- TruffleHog secret detection
- License compliance check
- Security headers validation
```

### **5. Integration Tests**
```yaml
- PostgreSQL test database
- Redis test instance
- API integration tests
- Database integration tests
```

### **6. E2E Tests**
```yaml
- End-to-end test execution
- Browser automation tests
- User workflow validation
```

### **7. Performance Tests**
```yaml
- Load testing
- Performance benchmarking
- Memory usage analysis
```

## 🌍 **Environment Configuration**

### **Staging Environment**
- **Auto-deploy**: On merge to main
- **Reviewers**: 1 required
- **Wait time**: 0 minutes
- **Variables**: Staging-specific secrets

### **Production Environment**
- **Manual deploy**: Workflow dispatch only
- **Reviewers**: 2 required
- **Wait time**: 5 minutes
- **Variables**: Production-specific secrets

## 🔐 **Security Features**

### **Dependency Scanning**
- **npm audit**: High-severity vulnerabilities
- **Snyk**: Moderate-severity vulnerabilities
- **License check**: Open source compliance

### **Code Security**
- **Trivy**: File system vulnerability scan
- **TruffleHog**: Secret detection
- **Security headers**: HTTP security validation

### **Secret Management**
- **GitHub Secrets**: Encrypted environment variables
- **Environment-specific**: Separate secrets per environment
- **Rotation**: Regular secret rotation required

## 📊 **Monitoring and Notifications**

### **Status Checks**
- **Required**: All CI jobs must pass
- **Blocking**: Failed checks prevent merging
- **Visibility**: Status shown in PRs and commits

### **Notifications**
- **Email**: On failure (configurable)
- **Slack**: Team notifications (optional)
- **GitHub**: Built-in status updates

### **Artifacts**
- **Build artifacts**: Stored for 30 days
- **Test reports**: Coverage and results
- **Security reports**: Vulnerability summaries

## 🚀 **Usage Guide**

### **For Developers**

#### **Pull Request Workflow**
1. **Create PR**: From feature branch to main
2. **CI Runs**: Automatically on PR creation
3. **Review**: Code review + CI status check
4. **Merge**: Only when CI passes

#### **Local Development**
```bash
# Run same checks as CI
npm run lint
npm run type-check
npm test
npm run build
```

#### **Debugging CI Failures**
1. **Check logs**: GitHub Actions tab
2. **Reproduce locally**: Run failing commands
3. **Fix issues**: Update code and push
4. **Re-run**: CI will run automatically

### **For DevOps**

#### **Environment Setup**
1. **Create environments**: In GitHub repository settings
2. **Add secrets**: Environment-specific variables
3. **Configure protection**: Review requirements
4. **Test deployment**: Manual workflow dispatch

#### **Monitoring**
1. **Check status**: GitHub Actions dashboard
2. **Review logs**: Job execution details
3. **Monitor security**: Security tab
4. **Update secrets**: Regular rotation

## 🔧 **Configuration Files**

### **Workflow Files**
- `.github/workflows/ci.yml` - Continuous Integration
- `.github/workflows/cd.yml` - Continuous Deployment
- `.github/workflows/security.yml` - Security Scanning

### **Environment Files**
- `.github/environments/staging.yml` - Staging configuration
- `.github/environments/production.yml` - Production configuration

### **Package Scripts**
- `npm run test:unit` - Unit tests
- `npm run test:integration` - Integration tests
- `npm run test:e2e` - End-to-end tests
- `npm run test:performance` - Performance tests

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. CI Failures**
```bash
# Check specific job logs
# Common fixes:
npm ci --legacy-peer-deps
npm run lint:fix
npm run type-check
```

#### **2. Build Failures**
```bash
# Check build order
npm run build:shared
npm run build:backend
npm run build:frontend
```

#### **3. Test Failures**
```bash
# Run tests locally
npm test
npm run test:unit
npm run test:integration
```

#### **4. Security Failures**
```bash
# Check vulnerabilities
npm audit
npm audit fix
```

### **Debugging Steps**
1. **Check logs**: GitHub Actions → Workflow → Job
2. **Reproduce locally**: Run same commands
3. **Check dependencies**: Update if needed
4. **Verify secrets**: Environment variables
5. **Test manually**: Workflow dispatch

## 📚 **Additional Resources**

### **GitHub Actions**
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Environment Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

### **Security Tools**
- [Snyk Documentation](https://docs.snyk.io/)
- [Trivy Documentation](https://trivy.dev/)
- [TruffleHog Documentation](https://trufflesecurity.com/)

### **Project Documentation**
- [Development Setup](./DEVELOPMENT-SETUP.md)
- [Project Structure](./PROJECT-STRUCTURE.md)
- [Task Management](./project-management/)

---

**The CI/CD pipeline is now fully configured and ready for automated testing, building, and deployment!** 🎉
