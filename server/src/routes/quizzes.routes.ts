import { Router } from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  addQuestionToQuiz,
  updateQuestionInQuiz,
  deleteQuestionFromQuiz,
  submitQuizAttempt,
  getQuizAttempts,
} from "../controllers/quizzes.controllers.js";
import validToken, { optionalAuth } from "../middlewares/validToken.js";
import { requireEducator } from "../middlewares/requireRole.js";

const router = Router();

/**
 * Quiz Routes
 * Authoring is restricted to educators. Quiz reads are public, but answer
 * keys are only returned to educators (see getQuizById).
 */

// Basic CRUD operations
router.post("/", validToken, requireEducator, createQuiz);
router.get("/", getAllQuizzes);
router.get("/:id", optionalAuth, getQuizById);
router.put("/:id", validToken, requireEducator, updateQuiz);
router.delete("/:id", validToken, requireEducator, deleteQuiz);

// Question management
router.post("/:id/questions", validToken, requireEducator, addQuestionToQuiz);
router.put("/:quizId/questions/:questionId", validToken, requireEducator, updateQuestionInQuiz);
router.delete("/:quizId/questions/:questionId", validToken, requireEducator, deleteQuestionFromQuiz);

// Quiz attempts
router.post("/:id/attempt", validToken, submitQuizAttempt);
router.get("/:id/attempts", validToken, getQuizAttempts);

export default router;
