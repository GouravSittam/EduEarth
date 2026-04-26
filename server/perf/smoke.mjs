const baseUrl = process.env.PERF_BASE_URL || "http://localhost:6969";
const endpoints = ["/health", "/articles", "/classes", "/institutions"];

const run = async () => {
  const results = [];
  for (const endpoint of endpoints) {
    const started = performance.now();
    const response = await fetch(`${baseUrl}${endpoint}`);
    const elapsedMs = performance.now() - started;
    results.push({ endpoint, status: response.status, elapsedMs });
  }

  for (const result of results) {
    console.log(
      `${result.endpoint}: status=${result.status} elapsed=${result.elapsedMs.toFixed(1)}ms`,
    );
  }
};

run().catch((error) => {
  console.error("Perf smoke test failed:", error);
  process.exitCode = 1;
});
