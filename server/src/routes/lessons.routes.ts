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
import { requireEducator } from "../middlewares/requireRole.js";

const router = Router();

/**
 * Lesson Routes
 * Reads are public; authoring is restricted to educators.
 */

// Lesson Modules CRUD
router.post("/modules", validToken, requireEducator, createLessonModule);
router.get("/modules", getAllLessonModules);
router.get("/modules/:id", getLessonModuleById);
router.put("/modules/:id", validToken, requireEducator, updateLessonModule);
router.delete("/modules/:id", validToken, requireEducator, deleteLessonModule);

// Lessons CRUD
router.post("/", validToken, requireEducator, createLesson);
router.get("/", getAllLessons);
router.get("/:id", getLessonById);
router.put("/:id", validToken, requireEducator, updateLesson);
router.delete("/:id", validToken, requireEducator, deleteLesson);

// Lesson completion
router.post("/:id/complete", validToken, completeLesson);
router.get("/:id/completions", validToken, getLessonCompletions);

export default router;
