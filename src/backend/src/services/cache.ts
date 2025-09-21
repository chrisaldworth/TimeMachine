import { getRedisClient } from '../config/redis';

// Cache configuration interface
export interface CacheConfig {
  defaultTTL: number; // seconds
  maxRetries: number;
  retryDelay: number; // milliseconds
}

// Cache key generator interface
export interface CacheKeyConfig {
  prefix: string;
  version: string;
  separator: string;
}

// Default cache configuration
const DEFAULT_CONFIG: CacheConfig = {
  defaultTTL: 3600, // 1 hour
  maxRetries: 3,
  retryDelay: 100,
};

// Default cache key configuration
const DEFAULT_KEY_CONFIG: CacheKeyConfig = {
  prefix: 'rewind',
  version: 'v1',
  separator: ':',
};

export class CacheService {
  private client = getRedisClient();
  private config: CacheConfig;
  private keyConfig: CacheKeyConfig;

  constructor(config: Partial<CacheConfig> = {}, keyConfig: Partial<CacheKeyConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.keyConfig = { ...DEFAULT_KEY_CONFIG, ...keyConfig };
  }

  /**
   * Generate cache key
   */
  private generateKey(key: string): string {
    return `${this.keyConfig.prefix}${this.keyConfig.separator}${this.keyConfig.version}${this.keyConfig.separator}${key}`;
  }

  /**
   * Set cache value
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const cacheKey = this.generateKey(key);
      const serializedValue = JSON.stringify(value);
      const expiration = ttl || this.config.defaultTTL;

      await this.client.setEx(cacheKey, expiration, serializedValue);
      return true;
    } catch (error) {
      console.error('❌ Cache set error:', error);
      return false;
    }
  }

  /**
   * Get cache value
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = this.generateKey(key);
      const value = await this.client.get(cacheKey);

      if (value === null) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      console.error('❌ Cache get error:', error);
      return null;
    }
  }

  /**
   * Delete cache value
   */
  async delete(key: string): Promise<boolean> {
    try {
      const cacheKey = this.generateKey(key);
      const result = await this.client.del(cacheKey);
      return result > 0;
    } catch (error) {
      console.error('❌ Cache delete error:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const cacheKey = this.generateKey(key);
      const result = await this.client.exists(cacheKey);
      return result === 1;
    } catch (error) {
      console.error('❌ Cache exists error:', error);
      return false;
    }
  }

  /**
   * Set expiration for key
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const cacheKey = this.generateKey(key);
      const result = await this.client.expire(cacheKey, ttl);
      return result === 1;
    } catch (error) {
      console.error('❌ Cache expire error:', error);
      return false;
    }
  }

  /**
   * Get TTL for key
   */
  async ttl(key: string): Promise<number> {
    try {
      const cacheKey = this.generateKey(key);
      return await this.client.ttl(cacheKey);
    } catch (error) {
      console.error('❌ Cache TTL error:', error);
      return -1;
    }
  }

  /**
   * Increment counter
   */
  async increment(key: string, value: number = 1): Promise<number> {
    try {
      const cacheKey = this.generateKey(key);
      return await this.client.incrBy(cacheKey, value);
    } catch (error) {
      console.error('❌ Cache increment error:', error);
      return 0;
    }
  }

  /**
   * Decrement counter
   */
  async decrement(key: string, value: number = 1): Promise<number> {
    try {
      const cacheKey = this.generateKey(key);
      return await this.client.decrBy(cacheKey, value);
    } catch (error) {
      console.error('❌ Cache decrement error:', error);
      return 0;
    }
  }

  /**
   * Get or set cache value (cache-aside pattern)
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T | null> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, fetch from source
      const value = await fetcher();

      // Store in cache
      await this.set(key, value, ttl);

      return value;
    } catch (error) {
      console.error('❌ Cache getOrSet error:', error);
      return null;
    }
  }

  /**
   * Clear cache by pattern
   */
  async clearPattern(pattern: string): Promise<number> {
    try {
      const searchPattern = this.generateKey(pattern);
      const keys = await this.client.keys(searchPattern);

      if (keys.length === 0) {
        return 0;
      }

      return await this.client.del(keys);
    } catch (error) {
      console.error('❌ Cache clear pattern error:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    hitCount: number;
    missCount: number;
    keyCount: number;
    memoryUsage: string;
  }> {
    try {
      const info = await this.client.info('stats');
      const memory = await this.client.info('memory');

      const stats = this.parseInfo(info);
      const memoryInfo = this.parseInfo(memory);

      return {
        hitCount: parseInt(stats.keyspace_hits || '0'),
        missCount: parseInt(stats.keyspace_misses || '0'),
        keyCount: parseInt(stats.db0 || '0'),
        memoryUsage: memoryInfo.used_memory_human || '0B',
      };
    } catch (error) {
      console.error('❌ Cache stats error:', error);
      return {
        hitCount: 0,
        missCount: 0,
        keyCount: 0,
        memoryUsage: '0B',
      };
    }
  }

  /**
   * Parse Redis INFO output
   */
  private parseInfo(info: string): Record<string, string> {
    const result: Record<string, string> = {};
    const lines = info.split('\r\n');

    for (const line of lines) {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':');
        if (key && value) {
          result[key] = value;
        }
      }
    }

    return result;
  }

  /**
   * Cache key generators for different data types
   */
  static generateKeys = {
    user: (id: string) => `user:${id}`,
    userSession: (sessionId: string) => `session:${sessionId}`,
    photo: (id: string) => `photo:${id}`,
    photoList: (filters: string) => `photos:list:${filters}`,
    photoStats: (id: string) => `photo:stats:${id}`,
    geospatial: (lat: number, lon: number, radius: number) =>
      `geo:${lat.toFixed(4)}:${lon.toFixed(4)}:${radius}`,
    mapTiles: (z: number, x: number, y: number) => `tile:${z}:${x}:${y}`,
    apiResponse: (endpoint: string, params: string) => `api:${endpoint}:${params}`,
    searchResults: (query: string, filters: string) => `search:${query}:${filters}`,
    imageProcessing: (id: string, variant: string) => `img:${id}:${variant}`,
  };
}

// Create default cache service instance
export const cacheService = new CacheService();

// Export cache service instance
export default cacheService;
