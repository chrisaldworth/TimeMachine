import { createClient, RedisClientType } from 'redis';

// Redis configuration interface
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  retryDelayOnFailover?: number;
  retryDelayOnClusterDown?: number;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
  keepAlive?: number;
  family?: number;
  connectTimeout?: number;
  commandTimeout?: number;
  retryDelayOnFailover?: number;
  enableReadyCheck?: boolean;
  maxRetriesPerRequest?: number;
  retryDelayOnClusterDown?: number;
  enableOfflineQueue?: boolean;
}

// Environment-based configuration
const getRedisConfig = (): RedisConfig => {
  const env = process.env.NODE_ENV || 'development';

  const baseConfig: RedisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryDelayOnFailover: parseInt(process.env.REDIS_RETRY_DELAY || '100'),
    retryDelayOnClusterDown: parseInt(process.env.REDIS_CLUSTER_RETRY_DELAY || '300'),
    maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3'),
    lazyConnect: true,
    keepAlive: parseInt(process.env.REDIS_KEEPALIVE || '30000'),
    family: 4, // IPv4
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '10000'),
    commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT || '5000'),
    enableReadyCheck: true,
    enableOfflineQueue: false,
  };

  return baseConfig;
};

// Create Redis client
let redisClient: RedisClientType | null = null;

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    const config = getRedisConfig();
    redisClient = createClient({
      socket: {
        host: config.host,
        port: config.port,
        connectTimeout: config.connectTimeout,
        commandTimeout: config.commandTimeout,
        keepAlive: config.keepAlive,
        family: config.family,
      },
      password: config.password,
      database: config.db,
      retryDelayOnFailover: config.retryDelayOnFailover,
      retryDelayOnClusterDown: config.retryDelayOnClusterDown,
      maxRetriesPerRequest: config.maxRetriesPerRequest,
      lazyConnect: config.lazyConnect,
      enableReadyCheck: config.enableReadyCheck,
      enableOfflineQueue: config.enableOfflineQueue,
    });

    // Handle Redis events
    redisClient.on('error', (err) => {
      console.error('❌ Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('🔗 Redis Client Connected');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis Client Ready');
    });

    redisClient.on('end', () => {
      console.log('🔌 Redis Client Disconnected');
    });

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis Client Reconnecting...');
    });

    // Log events in development
    if (process.env.NODE_ENV === 'development') {
      redisClient.on('connect', () => {
        console.log('📊 Redis client connected to server');
      });

      redisClient.on('ready', () => {
        console.log('📊 Redis client ready for commands');
      });
    }
  }

  return redisClient;
};

// Connect to Redis
export const connectRedis = async (): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.connect();
    console.log('✅ Redis connection established');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error;
  }
};

// Disconnect from Redis
export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.disconnect();
    redisClient = null;
    console.log('📊 Redis connection closed');
  }
};

// Test Redis connection
export const testRedisConnection = async (): Promise<boolean> => {
  try {
    const client = getRedisClient();
    await client.ping();
    console.log('✅ Redis connection test successful');
    return true;
  } catch (error) {
    console.error('❌ Redis connection test failed:', error);
    return false;
  }
};

// Redis health check
export const getRedisHealth = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  info: any;
  memory: any;
  stats: any;
}> => {
  try {
    const client = getRedisClient();

    const info = await client.info('server');
    const memory = await client.info('memory');
    const stats = await client.info('stats');

    return {
      status: 'healthy',
      info: parseRedisInfo(info),
      memory: parseRedisInfo(memory),
      stats: parseRedisInfo(stats),
    };
  } catch (error) {
    console.error('❌ Redis health check failed:', error);
    return {
      status: 'unhealthy',
      info: null,
      memory: null,
      stats: null,
    };
  }
};

// Parse Redis INFO output
const parseRedisInfo = (info: string): Record<string, string> => {
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
};

export default getRedisClient;
