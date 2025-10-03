import { Router } from "express";
import type GameServer from "../game/gameServer.js";

// We optionally accept a getter to share live stats from GameServer
export const createGameRouter = (getGameServer?: () => GameServer | undefined) => {
  const router = Router();
  // Health check
  router.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", service: "game-service" });
  });

  // Basic stats
  router.get("/stats", (_req, res) => {
    const gs = getGameServer?.();
    const stats = gs?.getStats() ?? { activeGames: 0, waitingPlayers: 0, totalQuestions: 15 };
    res.status(200).json(stats);
  });

  return router;
};

export default createGameRouter;
