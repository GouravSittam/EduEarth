import { Router } from "express";
import {
  // Lesson Modules
  createLessonModule,
  getAllLessonModules,
  getLessonModuleById,
  updateLessonModule,
  deleteLessonModule,
  
  // Lessons
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
  completeLesson,
  getLessonCompletions,
} from "../controllers/lessons.controllers.js";
import validToken from "../middlewares/validToken.js";

const router = Router();

/**
 * Lesson Routes
 * All endpoints for managing lessons and lesson modules
 */

// Lesson Modules CRUD
router.post("/modules", validToken, createLessonModule);
router.get("/modules", getAllLessonModules);
router.get("/modules/:id", getLessonModuleById);
router.put("/modules/:id", validToken, updateLessonModule);
router.delete("/modules/:id", validToken, deleteLessonModule);

// Lessons CRUD
router.post("/", validToken, createLesson);
router.get("/", getAllLessons);
router.get("/:id", getLessonById);
router.put("/:id", validToken, updateLesson);
router.delete("/:id", validToken, deleteLesson);

// Lesson completion
router.post("/:id/complete", validToken, completeLesson);
router.get("/:id/completions", validToken, getLessonCompletions);

export default router;
