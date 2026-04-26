import { Counter, Histogram, Registry, collectDefaultMetrics } from "prom-client";

const register = new Registry();
collectDefaultMetrics({ register });

export const httpRequestDurationMs = new Histogram({
  name: "http_request_duration_ms",
  help: "HTTP request duration in milliseconds",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: [25, 50, 100, 200, 400, 800, 1200, 2000, 5000],
  registers: [register],
});

export const dbQueryDurationMs = new Histogram({
  name: "db_query_duration_ms",
  help: "Database query duration in milliseconds",
  labelNames: ["model", "action"] as const,
  buckets: [5, 10, 25, 50, 100, 200, 400, 800, 2000],
  registers: [register],
});

export const cacheEventsTotal = new Counter({
  name: "cache_events_total",
  help: "Cache hit/miss events",
  labelNames: ["cache_name", "event"] as const,
  registers: [register],
});

export const metricsRegistry = register;
