import Redis from "ioredis";
import { cacheEventsTotal } from "../observability/metrics.js";

type CacheableValue = unknown;

let redisClient: Redis | null = null;

const getRedisClient = () => {
  if (redisClient) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return null;
  }

  redisClient = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
  });
  return redisClient;
};

export const cacheService = {
  async get<T = CacheableValue>(key: string): Promise<T | null> {
    const client = getRedisClient();
    if (!client) {
      return null;
    }
    try {
      if (client.status === "wait") {
        await client.connect();
      }
      const value = await client.get(key);
      if (!value) {
        cacheEventsTotal.inc({ cache_name: "redis", event: "miss" });
        return null;
      }
      cacheEventsTotal.inc({ cache_name: "redis", event: "hit" });
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
  async set(key: string, value: CacheableValue, ttlSeconds = 60): Promise<void> {
    const client = getRedisClient();
    if (!client) {
      return;
    }
    try {
      if (client.status === "wait") {
        await client.connect();
      }
      await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch {
      // no-op fallback
    }
  },
  async delByPrefix(prefix: string): Promise<void> {
    const client = getRedisClient();
    if (!client) {
      return;
    }
    try {
      if (client.status === "wait") {
        await client.connect();
      }
      const keys = await client.keys(`${prefix}*`);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch {
      // no-op fallback
    }
  },
};
