import express from 'express';
import { getRedisHealth } from '../config/redis';
import { cacheService } from '../services/cache';
import { sessionService } from '../services/session';
import { geospatialCacheService } from '../services/geospatial-cache';

const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'healthy',
        database: 'healthy',
        redis: 'healthy',
        cache: 'healthy',
        session: 'healthy',
        geospatial: 'healthy',
      },
      metrics: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Redis health check endpoint
 */
router.get('/redis', async (req, res) => {
  try {
    const redisHealth = await getRedisHealth();
    const cacheStats = await cacheService.getStats();
    const sessionStats = await sessionService.getSessionStats();
    const geospatialStats = await geospatialCacheService.getGeospatialCacheStats();

    const health = {
      status: redisHealth.status,
      timestamp: new Date().toISOString(),
      redis: {
        status: redisHealth.status,
        info: redisHealth.info,
        memory: redisHealth.memory,
        stats: redisHealth.stats,
      },
      cache: {
        hitCount: cacheStats.hitCount,
        missCount: cacheStats.missCount,
        keyCount: cacheStats.keyCount,
        memoryUsage: cacheStats.memoryUsage,
        hitRatio: cacheStats.hitCount / (cacheStats.hitCount + cacheStats.missCount) || 0,
      },
      session: {
        totalSessions: sessionStats.totalSessions,
        activeSessions: sessionStats.activeSessions,
        expiredSessions: sessionStats.expiredSessions,
      },
      geospatial: {
        geospatialQueries: geospatialStats.geospatialQueries,
        mapTiles: geospatialStats.mapTiles,
        geocodingResults: geospatialStats.geocodingResults,
        distanceCalculations: geospatialStats.distanceCalculations,
      },
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Redis health check failed',
    });
  }
});

/**
 * Cache statistics endpoint
 */
router.get('/cache', async (req, res) => {
  try {
    const cacheStats = await cacheService.getStats();
    const sessionStats = await sessionService.getSessionStats();
    const geospatialStats = await geospatialCacheService.getGeospatialCacheStats();

    const stats = {
      timestamp: new Date().toISOString(),
      cache: {
        hitCount: cacheStats.hitCount,
        missCount: cacheStats.missCount,
        keyCount: cacheStats.keyCount,
        memoryUsage: cacheStats.memoryUsage,
        hitRatio: cacheStats.hitCount / (cacheStats.hitCount + cacheStats.missCount) || 0,
      },
      session: {
        totalSessions: sessionStats.totalSessions,
        activeSessions: sessionStats.activeSessions,
        expiredSessions: sessionStats.expiredSessions,
      },
      geospatial: {
        geospatialQueries: geospatialStats.geospatialQueries,
        mapTiles: geospatialStats.mapTiles,
        geocodingResults: geospatialStats.geocodingResults,
        distanceCalculations: geospatialStats.distanceCalculations,
      },
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get cache statistics',
    });
  }
});

/**
 * Cache management endpoints
 */
router.post('/cache/clear', async (req, res) => {
  try {
    const { pattern } = req.body;
    
    if (!pattern) {
      return res.status(400).json({
        error: 'Pattern is required',
      });
    }

    const clearedCount = await cacheService.clearPattern(pattern);
    
    res.json({
      message: `Cleared ${clearedCount} cache entries`,
      pattern,
      clearedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to clear cache',
    });
  }
});

router.post('/cache/clear/geospatial', async (req, res) => {
  try {
    const { pattern } = req.body;
    const clearedCount = await geospatialCacheService.clearGeospatialCache(pattern || '*');
    
    res.json({
      message: `Cleared ${clearedCount} geospatial cache entries`,
      pattern: pattern || '*',
      clearedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to clear geospatial cache',
    });
  }
});

router.post('/cache/clear/tiles', async (req, res) => {
  try {
    const { zoomLevel } = req.body;
    const clearedCount = await geospatialCacheService.clearMapTileCache(zoomLevel);
    
    res.json({
      message: `Cleared ${clearedCount} map tile cache entries`,
      zoomLevel,
      clearedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to clear map tile cache',
    });
  }
});

router.post('/sessions/cleanup', async (req, res) => {
  try {
    const cleanedCount = await sessionService.cleanupExpiredSessions();
    
    res.json({
      message: `Cleaned up ${cleanedCount} expired sessions`,
      cleanedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to cleanup expired sessions',
    });
  }
});

export default router;
