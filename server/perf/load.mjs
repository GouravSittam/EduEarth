const baseUrl = process.env.PERF_BASE_URL || "http://localhost:6969";
const concurrency = Number(process.env.PERF_CONCURRENCY || 20);
const requests = Number(process.env.PERF_REQUESTS || 200);
const endpoint = process.env.PERF_ENDPOINT || "/articles";

const oneRequest = async () => {
  const started = performance.now();
  const response = await fetch(`${baseUrl}${endpoint}`);
  await response.text();
  return performance.now() - started;
};

const run = async () => {
  const durations = [];
  let cursor = 0;

  const workers = Array.from({ length: concurrency }, async () => {
    while (cursor < requests) {
      cursor += 1;
      const elapsed = await oneRequest();
      durations.push(elapsed);
    }
  });

  await Promise.all(workers);
  durations.sort((a, b) => a - b);
  const p95 = durations[Math.floor(durations.length * 0.95)] ?? 0;
  const avg = durations.reduce((acc, value) => acc + value, 0) / durations.length;
  console.log(
    `endpoint=${endpoint} requests=${requests} concurrency=${concurrency} avg=${avg.toFixed(1)}ms p95=${p95.toFixed(1)}ms`,
  );
};

run().catch((error) => {
  console.error("Perf load test failed:", error);
  process.exitCode = 1;
});
