# Redis Caching Setup Guide

## 🎯 **Overview**

This guide explains how to set up and use Redis for caching, session management, and performance optimization in the Rewind the Map project.

## 🚀 **Quick Start**

### **1. Start Redis Services**
```bash
# Start Redis using Docker Compose
npm run db:start

# Or start all services including Redis
docker-compose up -d redis
```

### **2. Test Redis Connection**
```bash
# Test Redis connection
npm run db:test

# Check Redis health
curl http://localhost:3000/health/redis
```

### **3. View Cache Statistics**
```bash
# View cache statistics
curl http://localhost:3000/health/cache

# View Redis logs
npm run db:logs
```

## 🔧 **Redis Configuration**

### **Environment Variables**
```bash
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0

# Redis Connection Settings
REDIS_CONNECT_TIMEOUT=10000
REDIS_COMMAND_TIMEOUT=5000
REDIS_KEEPALIVE=30000
REDIS_MAX_RETRIES=3
REDIS_RETRY_DELAY=100
```

### **Docker Compose Configuration**
```yaml
redis:
  image: redis:7-alpine
  container_name: rewind_redis
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  networks:
    - rewind_network
  healthcheck:
    test: ["CMD", "redis-cli", "ping"]
    interval: 10s
    timeout: 5s
    retries: 5
  restart: unless-stopped
```

## 📊 **Caching Services**

### **1. Cache Service**
The main caching service provides:
- **Key-Value Storage** - Store and retrieve any serializable data
- **TTL Management** - Automatic expiration of cached data
- **Cache Patterns** - Cache-aside, write-through, write-behind
- **Statistics** - Hit/miss ratios, memory usage, key counts

```typescript
import { cacheService } from './services/cache';

// Set cache value
await cacheService.set('user:123', userData, 3600); // 1 hour TTL

// Get cache value
const user = await cacheService.get('user:123');

// Get or set pattern
const data = await cacheService.getOrSet(
  'expensive-query',
  () => performExpensiveQuery(),
  1800 // 30 minutes TTL
);
```

### **2. Session Service**
User session management with Redis:
- **Session Storage** - Secure session data storage
- **Session Validation** - Validate and refresh sessions
- **Session Cleanup** - Automatic cleanup of expired sessions
- **Multi-Device Support** - Multiple sessions per user

```typescript
import { sessionService } from './services/session';

// Create session
const session = await sessionService.createSession({
  userId: 'user123',
  email: 'user@example.com',
  displayName: 'John Doe',
  roles: ['user'],
  ttl: 86400 // 24 hours
});

// Validate session
const isValid = await sessionService.validateSession(sessionId);

// Refresh session
await sessionService.refreshSession(sessionId, 86400);
```

### **3. Geospatial Cache Service**
Specialized caching for geospatial data:
- **Location Queries** - Cache location-based search results
- **Map Tiles** - Cache map tile data
- **Geocoding** - Cache geocoding results
- **Distance Calculations** - Cache distance calculations

```typescript
import { geospatialCacheService } from './services/geospatial-cache';

// Cache geospatial query
await geospatialCacheService.cacheGeospatialQuery(
  40.7128, -74.0060, 5000, // lat, lon, radius
  results, 3600 // 1 hour TTL
);

// Cache map tile
await geospatialCacheService.cacheMapTile(
  10, 512, 384, // zoom, x, y
  tileData, 'png', 7200 // 2 hours TTL
);
```

## 🎯 **Cache Key Conventions**

### **Key Structure**
```
{prefix}:{version}:{type}:{identifier}
```

### **Examples**
```
rewind:v1:user:123
rewind:v1:session:abc123
rewind:v1:photo:456
rewind:v1:geo:40.7128:-74.0060:5000
rewind:v1:tile:10:512:384
rewind:v1:api:photos:list:page=1&limit=20
```

## 📈 **Performance Optimization**

### **Cache Hit Ratios**
- **Target**: >80% cache hit ratio
- **Monitoring**: Available at `/health/cache`
- **Optimization**: Adjust TTL and cache patterns

### **Memory Usage**
- **Monitoring**: Redis memory usage tracking
- **Optimization**: Set appropriate TTL values
- **Cleanup**: Regular cleanup of expired keys

### **Connection Pooling**
- **Configuration**: Optimized connection pool settings
- **Monitoring**: Connection health monitoring
- **Scaling**: Horizontal scaling support

## 🔍 **Health Monitoring**

### **Health Endpoints**
```bash
# General health check
GET /health

# Redis-specific health
GET /health/redis

# Cache statistics
GET /health/cache
```

### **Cache Management**
```bash
# Clear cache by pattern
POST /health/cache/clear
{
  "pattern": "user:*"
}

# Clear geospatial cache
POST /health/cache/clear/geospatial
{
  "pattern": "geo:*"
}

# Clear map tiles
POST /health/cache/clear/tiles
{
  "zoomLevel": 10
}

# Cleanup expired sessions
POST /health/sessions/cleanup
```

## 🧪 **Testing**

### **Unit Tests**
```bash
# Test cache operations
npm run test -- --testPathPattern=cache

# Test session management
npm run test -- --testPathPattern=session

# Test geospatial caching
npm run test -- --testPathPattern=geospatial
```

### **Integration Tests**
```bash
# Test Redis integration
npm run test -- --testPathPattern=redis

# Test caching with API
npm run test -- --testPathPattern=api
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Redis Connection Failed**
```bash
# Check if Redis is running
docker-compose ps redis

# Check Redis logs
npm run db:logs

# Restart Redis
npm run db:restart
```

#### **High Memory Usage**
```bash
# Check Redis memory usage
curl http://localhost:3000/health/redis

# Clear old cache entries
curl -X POST http://localhost:3000/health/cache/clear \
  -H "Content-Type: application/json" \
  -d '{"pattern": "old:*"}'
```

#### **Low Cache Hit Ratio**
```bash
# Check cache statistics
curl http://localhost:3000/health/cache

# Analyze cache patterns
# Consider adjusting TTL values
# Review cache key strategies
```

### **Performance Issues**
```bash
# Check Redis performance
redis-cli --latency

# Monitor Redis commands
redis-cli monitor

# Check memory usage
redis-cli info memory
```

## 📚 **Best Practices**

### **Cache Key Design**
- Use consistent naming conventions
- Include version information
- Use descriptive identifiers
- Avoid special characters

### **TTL Management**
- Set appropriate TTL values
- Use different TTLs for different data types
- Consider data freshness requirements
- Implement cache warming strategies

### **Memory Management**
- Monitor memory usage regularly
- Set memory limits appropriately
- Implement cache eviction policies
- Clean up expired keys regularly

### **Error Handling**
- Implement graceful degradation
- Handle Redis unavailability
- Use fallback mechanisms
- Log cache errors appropriately

## 🔒 **Security**

### **Redis Security**
- Enable authentication
- Use encrypted connections (TLS)
- Restrict network access
- Regular security updates

### **Session Security**
- Use secure session tokens
- Implement session encryption
- Set appropriate session timeouts
- Implement session invalidation

## 📊 **Monitoring and Alerting**

### **Key Metrics**
- Cache hit/miss ratios
- Memory usage
- Connection pool status
- Response times
- Error rates

### **Alerting**
- Low cache hit ratio
- High memory usage
- Connection failures
- Performance degradation

## 📚 **Resources**

### **Documentation**
- [Redis Documentation](https://redis.io/docs/)
- [Node.js Redis Client](https://github.com/redis/node-redis)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)

### **Useful Commands**
```bash
# Connect to Redis
redis-cli

# Monitor Redis commands
redis-cli monitor

# Check Redis info
redis-cli info

# Check memory usage
redis-cli info memory

# Check statistics
redis-cli info stats
```

---

**Remember: Monitor cache performance regularly and adjust strategies based on usage patterns!** 🎯
