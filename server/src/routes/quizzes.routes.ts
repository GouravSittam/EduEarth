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
import validToken from "../middlewares/validToken.js";

const router = Router();

/**
 * Quiz Routes
 * All endpoints for managing quizzes
 */

// Basic CRUD operations
router.post("/", validToken, createQuiz);
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.put("/:id", validToken, updateQuiz);
router.delete("/:id", validToken, deleteQuiz);

// Question management
router.post("/:id/questions", validToken, addQuestionToQuiz);
router.put("/:quizId/questions/:questionId", validToken, updateQuestionInQuiz);
router.delete("/:quizId/questions/:questionId", validToken, deleteQuestionFromQuiz);

// Quiz attempts
router.post("/:id/attempt", validToken, submitQuizAttempt);
router.get("/:id/attempts", validToken, getQuizAttempts);

export default router;
