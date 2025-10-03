import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import authRouter from "./routes/auth.routes.js";
import institutionRouter from "./routes/institutions.routes.js";
import articlesRouter from "./routes/articles.routes.js";
import classesRouter from "./routes/classes.routes.js";
import quizzesRouter from "./routes/quizzes.routes.js";
import lessonsRouter from "./routes/lessons.routes.js";
import { FlowController } from "./utils/flowController.js";
import GameServer from "./game/gameServer.js";
import { createGameRouter } from "./routes/game.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 6900;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      return callback(null, origin);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.send(`This is your API`);
});

app.get("/health", (_req, res) => {
  res.status(200).send(`ok`);
});

// Flow endpoints
app.get("/flow", FlowController.getFlowChart);
app.get("/flow/data", FlowController.getFlowData);

app.use("/auth", authRouter);
app.use("/institutions", institutionRouter);
app.use("/articles", articlesRouter);
app.use("/classes", classesRouter);
app.use("/quizzes", quizzesRouter);
app.use("/lessons", lessonsRouter);

// Init sockets for game
const gameServer = new GameServer(server);

// HTTP routes for game
app.use("/game", createGameRouter(() => gameServer));

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
