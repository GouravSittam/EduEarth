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

// Core Dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 6969;

// ═══════════════════════════════════════════════════════════════════════════
// 🛡️ MIDDLEWARE SETUP
// ═══════════════════════════════════════════════════════════════════════════

// CORS Configuration - Allow credentials from any origin
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.CLIENT_BASE_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(null, origin); // allow all in dev
    },
    credentials: true,
  }),
);

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
    const route = req.route?.path
      ? `${req.baseUrl}${req.route.path}`
      : req.path;
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

// ═══════════════════════════════════════════════════════════════════════════
// 🎮 REAL-TIME GAME SERVER
// ═══════════════════════════════════════════════════════════════════════════

const gameServer = new GameServer(server);
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
