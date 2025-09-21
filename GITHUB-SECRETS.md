# 🔐 GitHub Secrets Configuration

## 📋 **Required Secrets**

This document lists all the secrets that need to be configured in GitHub for the CI/CD pipeline to work properly.

## 🔧 **How to Add Secrets**

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Click on **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with the exact name and value

## 🌍 **Environment-Specific Secrets**

### **Staging Environment Secrets**
Add these secrets to the **staging** environment:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `STAGING_DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@staging-db:5432/rewind_staging` |
| `STAGING_REDIS_URL` | Redis connection string | `redis://staging-redis:6379` |
| `STAGING_JWT_SECRET` | JWT signing secret | `staging-super-secret-jwt-key` |
| `STAGING_MAPBOX_ACCESS_TOKEN` | Mapbox API token | `pk.staging-mapbox-token` |
| `STAGING_AWS_ACCESS_KEY_ID` | AWS access key | `AKIAIOSFODNN7EXAMPLE` |
| `STAGING_AWS_SECRET_ACCESS_KEY` | AWS secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `STAGING_AWS_REGION` | AWS region | `us-east-1` |
| `STAGING_AWS_S3_BUCKET` | S3 bucket name | `rewind-staging-photos` |
| `STAGING_SMTP_HOST` | SMTP server | `smtp.staging.example.com` |
| `STAGING_SMTP_PORT` | SMTP port | `587` |
| `STAGING_SMTP_USER` | SMTP username | `staging@example.com` |
| `STAGING_SMTP_PASS` | SMTP password | `staging-smtp-password` |
| `STAGING_CORS_ORIGIN` | CORS allowed origins | `https://staging.rewindthemap.com` |

### **Production Environment Secrets**
Add these secrets to the **production** environment:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `PRODUCTION_PORT` | Production port | `3000` |
| `PRODUCTION_DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@prod-db:5432/rewind_production` |
| `PRODUCTION_REDIS_URL` | Redis connection string | `redis://prod-redis:6379` |
| `PRODUCTION_JWT_SECRET` | JWT signing secret | `production-super-secret-jwt-key` |
| `PRODUCTION_MAPBOX_ACCESS_TOKEN` | Mapbox API token | `pk.production-mapbox-token` |
| `PRODUCTION_AWS_ACCESS_KEY_ID` | AWS access key | `AKIAIOSFODNN7EXAMPLE` |
| `PRODUCTION_AWS_SECRET_ACCESS_KEY` | AWS secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `PRODUCTION_AWS_REGION` | AWS region | `us-east-1` |
| `PRODUCTION_AWS_S3_BUCKET` | S3 bucket name | `rewind-production-photos` |
| `PRODUCTION_SMTP_HOST` | SMTP server | `smtp.production.example.com` |
| `PRODUCTION_SMTP_PORT` | SMTP port | `587` |
| `PRODUCTION_SMTP_USER` | SMTP username | `production@example.com` |
| `PRODUCTION_SMTP_PASS` | SMTP password | `production-smtp-password` |
| `PRODUCTION_CORS_ORIGIN` | CORS allowed origins | `https://rewindthemap.com` |

## 🔒 **Security Tool Secrets**

### **Repository-Level Secrets**
Add these secrets to the repository (not environment-specific):

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `SNYK_TOKEN` | Snyk API token | [Snyk Dashboard](https://app.snyk.io/account) |
| `FOSSA_API_KEY` | FOSSA API key | [FOSSA Dashboard](https://app.fossa.com/) |
| `CODECOV_TOKEN` | Codecov upload token | [Codecov Dashboard](https://codecov.io/) |

## 🚀 **Getting API Keys**

### **Mapbox**
1. Go to [Mapbox](https://www.mapbox.com/)
2. Sign up for an account
3. Go to Account → Access tokens
4. Create a new token
5. Copy the token value

### **AWS S3**
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Create an IAM user
3. Attach S3 permissions
4. Create access keys
5. Copy the keys

### **Snyk**
1. Go to [Snyk](https://snyk.io/)
2. Sign up for an account
3. Go to Account → General → API Token
4. Copy the token

### **FOSSA**
1. Go to [FOSSA](https://fossa.com/)
2. Sign up for an account
3. Go to Settings → API Keys
4. Create a new key
5. Copy the key

## ⚠️ **Security Best Practices**

### **Secret Management**
- **Never commit secrets** to the repository
- **Use environment-specific secrets** for different environments
- **Rotate secrets regularly** (every 90 days)
- **Use strong, unique passwords** for each secret
- **Limit access** to secrets to necessary team members only

### **Secret Naming**
- **Use descriptive names** that indicate the environment
- **Follow consistent naming** conventions
- **Include the service name** in the secret name
- **Use uppercase with underscores** for consistency

### **Secret Values**
- **Use strong passwords** (minimum 16 characters)
- **Include special characters** and numbers
- **Avoid dictionary words** and common patterns
- **Use different values** for each environment

## 🔍 **Verifying Secrets**

### **Check Secret Configuration**
1. Go to repository Settings → Secrets and variables → Actions
2. Verify all required secrets are present
3. Check that environment-specific secrets are in the correct environment
4. Ensure secret names match exactly (case-sensitive)

### **Test Secret Access**
1. Create a test workflow that uses the secrets
2. Run the workflow to verify secrets are accessible
3. Check the logs to ensure secrets are not exposed
4. Remove the test workflow after verification

## 📚 **Additional Resources**

### **GitHub Documentation**
- [Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Environment Secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Secret Management](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

### **Security Tools**
- [Snyk Documentation](https://docs.snyk.io/)
- [FOSSA Documentation](https://docs.fossa.com/)
- [Codecov Documentation](https://docs.codecov.com/)

---

**Configure these secrets before running the CI/CD pipeline!** 🔐
