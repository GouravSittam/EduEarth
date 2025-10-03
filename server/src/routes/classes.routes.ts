import { Router } from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
  getClassStudents,
  getClassStatistics,
  addTeacherToClass,
  removeTeacherFromClass,
  getClassTeachers,
} from "../controllers/classes.controllers.js";
import validToken from "../middlewares/validToken.js";

const router = Router();

/**
 * Class Routes
 * All endpoints for managing classes
 */

// Basic CRUD operations
router.post("/", validToken, createClass);
router.get("/", getAllClasses);
router.get("/:id", getClassById);
router.put("/:id", validToken, updateClass);
router.delete("/:id", validToken, deleteClass);

// Student management
router.post("/:id/students", validToken, addStudentToClass);
router.delete("/:id/students/:studentId", validToken, removeStudentFromClass);
router.get("/:id/students", getClassStudents);

// Teacher management
router.post("/:id/teachers", validToken, addTeacherToClass);
router.delete("/:id/teachers/:teacherId", validToken, removeTeacherFromClass);
router.get("/:id/teachers", getClassTeachers);

// Class statistics
router.get("/:id/statistics", getClassStatistics);

export default router;
