import type { NextWebVitalsMetric } from "next/app";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (process.env.NODE_ENV !== "production") {
    // Keep local visibility to track regressions while tuning performance.
    const { name, value, id } = metric;
    console.log("[web-vitals]", name, value, id);
  }
}