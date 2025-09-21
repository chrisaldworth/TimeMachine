# Database Setup Guide

## 🎯 **Overview**

This guide explains how to set up and use the PostgreSQL database with PostGIS extension for the Rewind the Map project.

## 🚀 **Quick Start**

### **1. Start Database Services**
```bash
# Start PostgreSQL and Redis using Docker Compose
npm run db:setup

# Or start services individually
npm run db:start
```

### **2. Run Migrations**
```bash
# Run all pending migrations
npm run migrate:up

# Check migration status
npm run migrate:status
```

### **3. Test Connection**
```bash
# Test database connection
npm run db:test

# Connect to database
npm run db:connect
```

## 🗄️ **Database Architecture**

### **Core Tables**
- **users** - User accounts and profiles
- **photos** - Photo metadata with geospatial data
- **tags** - Normalized tag management
- **photo_tags** - Many-to-many relationship between photos and tags
- **comments** - Photo comments and replies
- **likes** - Photo likes and favorites
- **reports** - Content moderation reports
- **user_sessions** - User authentication sessions
- **audit_logs** - System audit trail

### **Geospatial Features**
- **PostGIS Extension** - Advanced geospatial operations
- **Spatial Indexing** - GIST indexes for location queries
- **Coordinate Systems** - WGS84 (EPSG:4326) for GPS coordinates
- **Distance Calculations** - Haversine formula for accurate distances
- **Bounding Box Queries** - Efficient spatial filtering

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rewind_the_map
DB_USER=postgres
DB_PASSWORD=password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Connection Pool Settings
DB_POOL_MAX=20
DB_POOL_MIN=5
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=2000
```

### **Docker Compose Services**
- **postgres** - PostgreSQL 15 with PostGIS 3.3
- **redis** - Redis 7 for caching and sessions
- **backend** - Node.js API server
- **frontend** - React Native Metro bundler

## 📊 **Database Schema**

### **Users Table**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_visibility VARCHAR(20) DEFAULT 'public',
    roles user_role[] DEFAULT ARRAY['user'],
    locale VARCHAR(10) DEFAULT 'en-US',
    notification_prefs JSONB DEFAULT '{"email": true, "push": false}',
    avatar_url VARCHAR(500),
    bio TEXT,
    website_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false
);
```

### **Photos Table**
```sql
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    capture_date DATE NOT NULL,
    date_confidence date_confidence DEFAULT 'estimated',
    location GEOMETRY(POINT, 4326) NOT NULL, -- WGS84 coordinate system
    location_confidence location_confidence DEFAULT 'estimated',
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    license VARCHAR(50) DEFAULT 'CC-BY-4.0',
    exif_data JSONB,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    processed_variants TEXT[] DEFAULT ARRAY[]::TEXT[],
    moderation_status photo_status DEFAULT 'pending',
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    soft_deleted_at TIMESTAMP WITH TIME ZONE
);
```

## 🔍 **Geospatial Queries**

### **Find Photos Within Radius**
```sql
-- Find photos within 5km of a location
SELECT * FROM find_photos_within_radius(40.7128, -74.0060, 5000);
```

### **Distance Calculation**
```sql
-- Calculate distance between two points
SELECT calculate_distance(40.7128, -74.0060, 34.0522, -118.2437);
```

### **Bounding Box Query**
```sql
-- Find photos within a bounding box
SELECT * FROM photos 
WHERE ST_Within(location, ST_MakeEnvelope(-74.1, 40.7, -73.9, 40.8, 4326));
```

## 🚀 **Migration System**

### **Available Commands**
```bash
# Run all pending migrations
npm run migrate:up

# Check migration status
npm run migrate:status

# Rollback last migration
npm run migrate:rollback

# Show migration help
npm run migrate
```

### **Migration Files**
- Located in `src/backend/src/migrations/`
- Naming convention: `001_description.sql`
- Automatically executed in order
- Version tracked in `migrations` table

## 🔧 **Development Commands**

### **Database Management**
```bash
# Start database services
npm run db:start

# Stop database services
npm run db:stop

# Restart database services
npm run db:restart

# View database logs
npm run db:logs

# Connect to database
npm run db:connect

# Test database connection
npm run db:test
```

### **Migration Commands**
```bash
# Run migrations
npm run migrate:up

# Check status
npm run migrate:status

# Rollback
npm run migrate:rollback
```

## 📊 **Performance Optimization**

### **Indexes**
- **B-tree indexes** for common queries (email, dates, status)
- **GIST spatial indexes** for location queries
- **GIN indexes** for array fields (tags)
- **Composite indexes** for complex queries

### **Query Optimization**
- Use prepared statements for security
- Implement connection pooling
- Monitor slow queries
- Use EXPLAIN ANALYZE for query plans

### **Caching Strategy**
- Redis for session storage
- Query result caching
- Image processing cache
- API response caching

## 🔒 **Security**

### **Database Security**
- SSL/TLS connections in production
- Role-based access control
- Data encryption at rest
- Audit logging for all operations

### **Application Security**
- Parameterized queries (no SQL injection)
- Input validation and sanitization
- Rate limiting on API endpoints
- Authentication and authorization

## 📈 **Monitoring**

### **Health Checks**
- Database connection monitoring
- Query performance tracking
- Connection pool monitoring
- Disk space and memory usage

### **Logging**
- Query execution logs
- Error tracking and alerting
- Performance metrics
- Audit trail for compliance

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Connection Refused**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
npm run db:logs

# Restart service
npm run db:restart
```

#### **Migration Errors**
```bash
# Check migration status
npm run migrate:status

# Check database logs
npm run db:logs

# Rollback if needed
npm run migrate:rollback
```

#### **PostGIS Not Available**
```bash
# Check PostGIS extension
npm run db:connect
# Then run: SELECT PostGIS_Version();
```

### **Performance Issues**
```bash
# Check slow queries
npm run db:connect
# Then run: SELECT * FROM pg_stat_statements ORDER BY total_time DESC;

# Check index usage
# Then run: SELECT * FROM pg_stat_user_indexes;
```

## 📚 **Resources**

### **Documentation**
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

### **Useful Queries**
- [PostGIS Spatial Functions](https://postgis.net/docs/reference.html)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl.html)

---

**Remember: Always backup your database before running migrations in production!** 🎯
