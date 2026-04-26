import { Router } from "express";
import { metricsRegistry } from "../observability/metrics.js";

const metricsRouter = Router();

metricsRouter.get("/", async (_req, res) => {
  res.set("Content-Type", metricsRegistry.contentType);
  res.end(await metricsRegistry.metrics());
});

export default metricsRouter;
