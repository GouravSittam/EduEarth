import type { NextWebVitalsMetric } from "next/app";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (process.env.NODE_ENV !== "production") {
    // Keep local visibility to track regressions while tuning performance.
    console.log("[web-vitals]", metric.name, metric.value, metric.rating);
  }
}
