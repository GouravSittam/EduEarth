/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║   ███████╗██████╗ ██╗   ██╗███████╗ █████╗ ██████╗ ████████╗██╗  ██╗      ║
 * ║   ██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██║  ██║      ║
 * ║   █████╗  ██║  ██║██║   ██║█████╗  ███████║██████╔╝   ██║   ███████║      ║
 * ║   ██╔══╝  ██║  ██║██║   ██║██╔══╝  ██╔══██║██╔══██╗   ██║   ██╔══██║      ║
 * ║   ███████╗██████╔╝╚██████╔╝███████╗██║  ██║██║  ██║   ██║   ██║  ██║      ║
 * ║   ╚══════╝╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝      ║
 * ║                                                                           ║
 * ║          🌍 Where Learning Meets Action for a Sustainable Future 🚀       ║
 * ║                                                                           ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║  Server Entry Point                                                       ║
 * ║  ─────────────────                                                        ║
 * ║  • Express.js REST API                                                    ║
 * ║  • Socket.io Real-time Game Server                                        ║
 * ║  • Multi-role Authentication System                                       ║
 * ║  • Institution Management APIs                                            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════
// 📦 IMPORTS
// ═══════════════════════════════════════════════════════════════════════════

// Load .env before any other module reads process.env at import time.
import "dotenv/config";

// Core Dependencies
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import http from "http";
import crypto from "crypto";
import { pinoHttp } from "pino-http";

// Route Modules
import authRouter from "./routes/auth.routes.js";
import institutionRouter from "./routes/institutions.routes.js";
import articlesRouter from "./routes/articles.routes.js";
import classesRouter from "./routes/classes.routes.js";
import quizzesRouter from "./routes/quizzes.routes.js";
import lessonsRouter from "./routes/lessons.routes.js";
import leaderboardRouter from "./routes/leaderboard.routes.js";
import assistantRouter from "./routes/assistant.routes.js";
import { createGameRouter } from "./routes/game.routes.js";
import metricsRouter from "./routes/metrics.routes.js";

// Utilities & Game Engine
import { FlowController } from "./utils/flowController.js";
import GameServer from "./game/gameServer.js";
import logger from "./observability/logger.js";
import { httpRequestDurationMs } from "./observability/metrics.js";
import OutboxPublisherService from "./services/outboxPublisher.service.js";

// ═══════════════════════════════════════════════════════════════════════════
// ⚙️ CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 6969;

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ MIDDLEWARE SETUP
// ═══════════════════════════════════════════════════════════════════════════

// Behind Vercel/NGINX: trust the first proxy so req.ip is the real client IP
// (used by the assistant's rate limiter).
app.set("trust proxy", 1);

app.use(
  helmet({
    // The /flow page renders an inline diagram; the rest is a JSON API.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS: only known front-ends may make credentialed requests.
// Extra origins can be supplied as a comma-separated CORS_ORIGINS list.
const allowedOrigins = new Set(
  [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://edu-earth.vercel.app",
    process.env.CLIENT_BASE_URL,
    ...(process.env.CORS_ORIGINS ?? "").split(","),
  ]
    .map((origin) => origin?.trim().replace(/\/$/, ""))
    .filter((origin): origin is string => Boolean(origin)),
);

const isDevelopment = process.env.NODE_ENV !== "production";

const corsOrigin = (
  origin: string | undefined,
  callback: (error: Error | null, allow?: boolean) => void,
) => {
  // Same-origin requests, curl and server-to-server calls send no Origin.
  if (!origin) return callback(null, true);
  if (allowedOrigins.has(origin)) return callback(null, true);
  if (isDevelopment && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return callback(null, true);
  }
  return callback(null, false);
};

app.use(cors({ origin: corsOrigin, credentials: true }));

app.use(
  pinoHttp({
    logger,
    genReqId: (req, res) => {
      const existingId = req.headers["x-request-id"];
      const requestId =
        typeof existingId === "string" && existingId.length > 0
          ? existingId
          : crypto.randomUUID();
      res.setHeader("x-request-id", requestId);
      return requestId;
    },
  }),
);

app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    // Use the route pattern, never the raw path: raw paths (ids, 404 probes)
    // would create unbounded Prometheus label cardinality.
    const route = req.route?.path
      ? `${req.baseUrl}${req.route.path}`
      : "unmatched";
    httpRequestDurationMs.observe(
      {
        method: req.method,
        route,
        status_code: String(res.statusCode),
      },
      elapsedMs,
    );
  });
  next();
});

// Request Parsing
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// ═══════════════════════════════════════════════════════════════════════════
// 🏠 BASE ROUTES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /
 * @desc    API Welcome endpoint
 * @access  Public
 */
app.get("/", (_req, res) => {
  res.send(`
    🌍 Edu Earth API Server
    ━━━━━━━━━━━━━━━━━━━━━━
    Status: ✅ Running
    Docs: /health
  `);
});

/**
 * @route   GET /health
 * @desc    Health check endpoint for monitoring
 * @access  Public
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "Edu Earth API",
  });
});
app.use("/metrics", metricsRouter);

// ═══════════════════════════════════════════════════════════════════════════
// 📊 FLOW VISUALIZATION ROUTES
// ═══════════════════════════════════════════════════════════════════════════

app.get("/flow", FlowController.getFlowChart);
app.get("/flow/data", FlowController.getFlowData);

// ═══════════════════════════════════════════════════════════════════════════
// 🔌 API ROUTES
// ═══════════════════════════════════════════════════════════════════════════

app.use("/auth", authRouter); // 🔐 Authentication & Authorization
app.use("/institutions", institutionRouter); // 🏫 Institution Management
app.use("/articles", articlesRouter); // 📰 Educational Articles
app.use("/classes", classesRouter); // 📚 Class Management
app.use("/quizzes", quizzesRouter); // ❓ Quiz System
app.use("/lessons", lessonsRouter); // 📖 Lesson Management
app.use("/leaderboard", leaderboardRouter); // 🏆 Eco-points Leaderboard
app.use("/assistant", assistantRouter); // 🤖 Eco AI Assistant

// ═══════════════════════════════════════════════════════════════════════════
// 🎮 REAL-TIME GAME SERVER
// ═══════════════════════════════════════════════════════════════════════════

const gameServer = new GameServer(server, { corsOrigin });
const outboxPublisher = new OutboxPublisherService(gameServer, {
  pollIntervalMs: Number(process.env.OUTBOX_POLL_INTERVAL_MS || 3000),
  batchSize: Number(process.env.OUTBOX_BATCH_SIZE || 50),
});
app.use(
  "/game",
  createGameRouter(() => gameServer),
);

outboxPublisher.start();

// ═══════════════════════════════════════════════════════════════════════════
// 🧯 FALLBACK HANDLERS
// ═══════════════════════════════════════════════════════════════════════════

// Unknown routes → JSON 404 (the client always expects JSON).
app.use((req: Request, res: Response) => {
  const message = `Route not found: ${req.method} ${req.path}`;
  res.status(404).json({ success: false, message, error: { message } });
});

// Malformed JSON bodies, oversized payloads and uncaught errors → JSON.
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const status =
    typeof (err as { status?: unknown })?.status === "number"
      ? (err as { status: number }).status
      : 500;
  const message =
    status === 400
      ? "Malformed request body"
      : status === 413
        ? "Request body is too large"
        : "Internal server error";

  if (status >= 500) {
    req.log?.error({ err }, "Unhandled request error");
  }

  res.status(status).json({ success: false, message, error: { message } });
});

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 SERVER INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   🌍 EDU EARTH SERVER STARTED SUCCESSFULLY                                ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   ⚡ Port:        ${String(PORT).padEnd(50)}║
║   🕐 Started:     ${new Date().toLocaleString().padEnd(50)}║
║   🎮 Game Server: Active                                              ║
║   📡 Socket.io:   Ready                                               ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║   📌 AVAILABLE ENDPOINTS                                                  ║
║   ──────────────────────                                                  ║
║   🏠 Base:         http://localhost:${String(PORT).padEnd(37)}║
║   ❤️  Health:       /health                                            ║
║   🧭 Flow Chart:    /flow                                              ║
║   🗺️  Flow Data:     /flow/data                                         ║
║   🔐 Auth:         /auth                                              ║
║   🏫 Institutions: /institutions                                      ║
║   📚 Classes:      /classes                                           ║
║   📖 Lessons:      /lessons                                           ║
║   ❓ Quizzes:      /quizzes                                           ║
║   📰 Articles:     /articles                                          ║
║   🎮 Game:         /game                                              ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);
});

const gracefulShutdown = (signal: string) => {
  logger.info({ signal }, "Shutting down server");
  outboxPublisher.stop();

  server.close((error?: Error) => {
    if (error) {
      logger.error({ err: error }, "Server shutdown failed");
      process.exit(1);
      return;
    }

    process.exit(0);
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
