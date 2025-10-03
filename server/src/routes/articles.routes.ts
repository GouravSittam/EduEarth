import { Router } from "express";
import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticlesBySection,
  getArticlesBySource,
  getArticleStatistics,
} from "../controllers/articles.controllers.js";
import validToken from "../middlewares/validToken.js";

const router = Router();

/**
 * Article Routes
 * All endpoints for managing articles
 */

// Statistics (must come before /:id routes)
router.get("/statistics", getArticleStatistics);

// Section and source specific routes (must come before /:id routes)
router.get("/section/:section", getArticlesBySection);
router.get("/source/:source", getArticlesBySource);

// Basic CRUD operations
router.post("/", validToken, createArticle);
router.get("/", getAllArticles);
router.get("/:id", getArticleById);
router.put("/:id", validToken, updateArticle);
router.delete("/:id", validToken, deleteArticle);

export default router;
