# Deployment Strategy

## Overview
This document outlines the deployment strategy for the Rewind the Map platform, including staging, production, and rollback procedures.

## Deployment Architecture

### 1. Environment Strategy
- **Development** - Local development environment
- **Staging** - Pre-production testing environment
- **Production** - Live production environment

### 2. Deployment Pipeline
```
Code Commit → Build → Test → Staging Deploy → Production Deploy
```

## Environment Configuration

### 1. Development Environment
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@localhost:5432/rewindthemap_dev
      - REDIS_URL=redis://localhost:6379
      - MAPBOX_TOKEN=your_dev_token
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=rewindthemap_dev
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 2. Staging Environment
```yaml
# docker-compose.staging.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=staging
      - DATABASE_URL=${STAGING_DATABASE_URL}
      - REDIS_URL=${STAGING_REDIS_URL}
      - MAPBOX_TOKEN=${STAGING_MAPBOX_TOKEN}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=rewindthemap_staging
      - POSTGRES_USER=${STAGING_DB_USER}
      - POSTGRES_PASSWORD=${STAGING_DB_PASSWORD}
    volumes:
      - postgres_staging_data:/var/lib/postgresql/data

  redis:
    image: redis:7

volumes:
  postgres_staging_data:
```

### 3. Production Environment
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${PROD_DATABASE_URL}
      - REDIS_URL=${PROD_REDIS_URL}
      - MAPBOX_TOKEN=${PROD_MAPBOX_TOKEN}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=rewindthemap_prod
      - POSTGRES_USER=${PROD_DB_USER}
      - POSTGRES_PASSWORD=${PROD_DB_PASSWORD}
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7
    restart: unless-stopped

volumes:
  postgres_prod_data:
```

## Docker Configuration

### 1. Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

### 2. .dockerignore
```dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output
.coverage
.coverage/
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## Kubernetes Deployment

### 1. Namespace Configuration
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: rewindthemap
  labels:
    name: rewindthemap
```

### 2. ConfigMap
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: rewindthemap-config
  namespace: rewindthemap
data:
  NODE_ENV: "production"
  PORT: "3000"
  LOG_LEVEL: "info"
```

### 3. Secret
```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: rewindthemap-secrets
  namespace: rewindthemap
type: Opaque
data:
  DATABASE_URL: <base64-encoded-database-url>
  REDIS_URL: <base64-encoded-redis-url>
  MAPBOX_TOKEN: <base64-encoded-mapbox-token>
  JWT_SECRET: <base64-encoded-jwt-secret>
```

### 4. Deployment
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rewindthemap-app
  namespace: rewindthemap
  labels:
    app: rewindthemap
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rewindthemap
  template:
    metadata:
      labels:
        app: rewindthemap
    spec:
      containers:
      - name: app
        image: rewindthemap:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: rewindthemap-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: rewindthemap-secrets
              key: DATABASE_URL
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: rewindthemap-secrets
              key: REDIS_URL
        - name: MAPBOX_TOKEN
          valueFrom:
            secretKeyRef:
              name: rewindthemap-secrets
              key: MAPBOX_TOKEN
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

### 5. Service
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: rewindthemap-service
  namespace: rewindthemap
spec:
  selector:
    app: rewindthemap
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

### 6. Ingress
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: rewindthemap-ingress
  namespace: rewindthemap
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.rewindthemap.com
    secretName: rewindthemap-tls
  rules:
  - host: api.rewindthemap.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: rewindthemap-service
            port:
              number: 80
```

## CI/CD Pipeline

### 1. GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to staging
      run: |
        echo "Deploying to staging environment"
        # Add staging deployment commands here

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      run: |
        echo "Deploying to production environment"
        # Add production deployment commands here
```

### 2. Deployment Scripts
```bash
#!/bin/bash
# scripts/deploy.sh

set -e

ENVIRONMENT=$1
VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$VERSION" ]; then
  echo "Usage: $0 <environment> <version>"
  echo "Example: $0 staging v1.0.0"
  exit 1
fi

echo "Deploying version $VERSION to $ENVIRONMENT environment"

# Build Docker image
docker build -t rewindthemap:$VERSION .

# Tag image for environment
docker tag rewindthemap:$VERSION rewindthemap:$ENVIRONMENT

# Push to registry
docker push rewindthemap:$VERSION
docker push rewindthemap:$ENVIRONMENT

# Deploy to Kubernetes
kubectl set image deployment/rewindthemap-app app=rewindthemap:$VERSION -n rewindthemap

# Wait for rollout to complete
kubectl rollout status deployment/rewindthemap-app -n rewindthemap

echo "Deployment completed successfully"
```

## Database Migration Strategy

### 1. Migration Scripts
```typescript
// migrations/001_create_photos_table.sql
CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  decade VARCHAR(10) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_photos_decade ON photos(decade);
CREATE INDEX idx_photos_location ON photos(latitude, longitude);
CREATE INDEX idx_photos_user ON photos(user_id);
```

### 2. Migration Runner
```typescript
// scripts/migrate.ts
import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const runMigrations = async () => {
  const client = await pool.connect();
  
  try {
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Get list of migration files
    const migrationFiles = [
      '001_create_photos_table.sql',
      '002_create_users_table.sql',
      '003_add_photo_tags.sql'
    ];

    for (const filename of migrationFiles) {
      // Check if migration already executed
      const result = await client.query(
        'SELECT id FROM migrations WHERE filename = $1',
        [filename]
      );

      if (result.rows.length === 0) {
        console.log(`Running migration: ${filename}`);
        
        // Read and execute migration file
        const migrationSQL = readFileSync(
          join(__dirname, '..', 'migrations', filename),
          'utf8'
        );
        
        await client.query(migrationSQL);
        
        // Record migration as executed
        await client.query(
          'INSERT INTO migrations (filename) VALUES ($1)',
          [filename]
        );
        
        console.log(`Migration ${filename} completed`);
      } else {
        console.log(`Migration ${filename} already executed`);
      }
    }
  } finally {
    client.release();
  }
};

runMigrations()
  .then(() => {
    console.log('All migrations completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
```

## Rollback Strategy

### 1. Blue-Green Deployment
```yaml
# k8s/blue-green-deployment.yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: rewindthemap-rollout
  namespace: rewindthemap
spec:
  replicas: 3
  strategy:
    blueGreen:
      activeService: rewindthemap-active
      previewService: rewindthemap-preview
      autoPromotionEnabled: false
      scaleDownDelaySeconds: 30
      prePromotionAnalysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: rewindthemap-preview
      postPromotionAnalysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: rewindthemap-active
  selector:
    matchLabels:
      app: rewindthemap
  template:
    metadata:
      labels:
        app: rewindthemap
    spec:
      containers:
      - name: app
        image: rewindthemap:latest
        ports:
        - containerPort: 3000
```

### 2. Rollback Script
```bash
#!/bin/bash
# scripts/rollback.sh

set -e

ENVIRONMENT=$1
PREVIOUS_VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$PREVIOUS_VERSION" ]; then
  echo "Usage: $0 <environment> <previous_version>"
  echo "Example: $0 production v1.0.0"
  exit 1
fi

echo "Rolling back $ENVIRONMENT to version $PREVIOUS_VERSION"

# Rollback Kubernetes deployment
kubectl rollout undo deployment/rewindthemap-app -n rewindthemap

# Wait for rollout to complete
kubectl rollout status deployment/rewindthemap-app -n rewindthemap

# Verify rollback
kubectl get pods -n rewindthemap -l app=rewindthemap

echo "Rollback completed successfully"
```

## Monitoring and Alerting

### 1. Health Checks
```typescript
// src/health.ts
import { Request, Response } from 'express';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check database connection
    await pool.query('SELECT 1');
    
    // Check Redis connection
    // Add Redis health check here
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

export const readinessCheck = async (req: Request, res: Response) => {
  try {
    // Check if application is ready to serve traffic
    await pool.query('SELECT 1');
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
```

### 2. Prometheus Metrics
```typescript
// src/metrics.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

export const photoUploadsTotal = new Counter({
  name: 'photo_uploads_total',
  help: 'Total number of photo uploads',
  labelNames: ['decade', 'status']
});

export const databaseConnections = new Gauge({
  name: 'database_connections',
  help: 'Number of database connections'
});
```

## Security Considerations

### 1. Secrets Management
```yaml
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: rewindthemap-secrets
  namespace: rewindthemap
type: Opaque
data:
  DATABASE_URL: <base64-encoded>
  REDIS_URL: <base64-encoded>
  MAPBOX_TOKEN: <base64-encoded>
  JWT_SECRET: <base64-encoded>
  ENCRYPTION_KEY: <base64-encoded>
```

### 2. Network Policies
```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: rewindthemap-network-policy
  namespace: rewindthemap
spec:
  podSelector:
    matchLabels:
      app: rewindthemap
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: rewindthemap
    ports:
    - protocol: TCP
      port: 5432
    - protocol: TCP
      port: 6379
```

## Backup and Recovery

### 1. Database Backup
```bash
#!/bin/bash
# scripts/backup-db.sh

set -e

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/rewindthemap_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Upload to S3
aws s3 cp "$BACKUP_FILE.gz" s3://rewindthemap-backups/database/

# Clean up old backups (keep last 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Database backup completed: $BACKUP_FILE.gz"
```

### 2. Recovery Script
```bash
#!/bin/bash
# scripts/restore-db.sh

set -e

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file>"
  echo "Example: $0 rewindthemap_20231201_120000.sql.gz"
  exit 1
fi

echo "Restoring database from backup: $BACKUP_FILE"

# Download backup from S3
aws s3 cp "s3://rewindthemap-backups/database/$BACKUP_FILE" /tmp/

# Decompress backup
gunzip "/tmp/$BACKUP_FILE"

# Restore database
psql $DATABASE_URL < "/tmp/${BACKUP_FILE%.gz}"

# Clean up
rm "/tmp/$BACKUP_FILE" "/tmp/${BACKUP_FILE%.gz}"

echo "Database restore completed"
```

This deployment strategy ensures reliable, scalable, and secure deployment of the Rewind the Map platform across all environments.
