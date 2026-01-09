/**
 * Redis Cache Utility for Leaderboard
 * Production-ready caching with fallback to database
 */

import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;
let isConnected = false;

const REDIS_URL = process.env.REDIS_URL || process.env.KVRedis_connectionString;
const CACHE_TTL = 3600; // 1 hour in seconds

/**
 * Initialize Redis client
 */
export async function initRedisClient() {
  if (redisClient && isConnected) {
    return redisClient;
  }

  try {
    if (!REDIS_URL) {
      console.warn('⚠️  Redis URL not configured, using in-memory cache fallback');
      return null;
    }

    redisClient = createClient({ url: REDIS_URL });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
      isConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis client connected');
      isConnected = true;
    });

    await redisClient.connect();
    isConnected = true;
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis:', error);
    return null;
  }
}

/**
 * Get value from Redis cache
 */
export async function getCachedValue<T>(key: string): Promise<T | null> {
  try {
    if (!isConnected || !redisClient) {
      return null;
    }

    const cached = await redisClient.get(key);
    if (cached) {
      console.log(`✅ Cache HIT: ${key}`);
      return JSON.parse(cached) as T;
    }

    console.log(`📦 Cache MISS: ${key}`);
    return null;
  } catch (error) {
    console.error(`Error getting cache for ${key}:`, error);
    return null;
  }
}

/**
 * Set value in Redis cache with TTL
 */
export async function setCachedValue<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL
): Promise<boolean> {
  try {
    if (!isConnected || !redisClient) {
      return false;
    }

    await redisClient.setEx(key, ttl, JSON.stringify(value));
    console.log(`💾 Cache SET: ${key} (TTL: ${ttl}s)`);
    return true;
  } catch (error) {
    console.error(`Error setting cache for ${key}:`, error);
    return false;
  }
}

/**
 * Delete value from Redis cache
 */
export async function deleteCachedValue(key: string): Promise<boolean> {
  try {
    if (!isConnected || !redisClient) {
      return false;
    }

    const deleted = await redisClient.del(key);
    if (deleted) {
      console.log(`🗑️  Cache DELETE: ${key}`);
    }
    return deleted > 0;
  } catch (error) {
    console.error(`Error deleting cache for ${key}:`, error);
    return false;
  }
}

/**
 * Invalidate cache pattern (e.g., "leaderboard:*")
 */
export async function invalidateCachePattern(pattern: string): Promise<number> {
  try {
    if (!isConnected || !redisClient) {
      return 0;
    }

    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) {
      return 0;
    }

    const deleted = await redisClient.del(keys);
    console.log(`🗑️  Cache INVALIDATE: ${pattern} (deleted ${deleted} keys)`);
    return deleted;
  } catch (error) {
    console.error(`Error invalidating cache pattern ${pattern}:`, error);
    return 0;
  }
}

/**
 * Clear all cache
 */
export async function clearAllCache(): Promise<boolean> {
  try {
    if (!isConnected || !redisClient) {
      return false;
    }

    await redisClient.flushDb();
    console.log('🗑️  Cache CLEARED: All keys deleted');
    return true;
  } catch (error) {
    console.error('Error clearing all cache:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  connected: boolean;
  keys: number;
  info?: string;
} | null> {
  try {
    if (!isConnected || !redisClient) {
      return { connected: false, keys: 0 };
    }

    const keys = await redisClient.dbSize();
    const info = await redisClient.info('stats');

    return {
      connected: true,
      keys,
      info
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
}

/**
 * Close Redis connection
 */
export async function closeRedisClient() {
  try {
    if (redisClient && isConnected) {
      await redisClient.quit();
      isConnected = false;
      redisClient = null;
      console.log('✅ Redis connection closed');
    }
  } catch (error) {
    console.error('Error closing Redis connection:', error);
  }
}
