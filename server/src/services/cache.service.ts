import { Redis } from "ioredis";
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
  // Without a listener ioredis logs "Unhandled error event" on every failed
  // reconnect. The cache is best-effort, so log once per outage instead.
  let reportedOutage = false;
  redisClient.on("error", (error) => {
    if (!reportedOutage) {
      reportedOutage = true;
      console.warn("Redis cache unavailable, continuing without cache:", error.message);
    }
  });
  redisClient.on("ready", () => {
    reportedOutage = false;
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
      // SCAN instead of KEYS: KEYS blocks Redis while it walks the keyspace.
      let cursor = "0";
      do {
        const [nextCursor, keys] = await client.scan(
          cursor,
          "MATCH",
          `${prefix}*`,
          "COUNT",
          200,
        );
        cursor = nextCursor;
        if (keys.length > 0) {
          await client.del(...keys);
        }
      } while (cursor !== "0");
    } catch {
      // no-op fallback
    }
  },
};
