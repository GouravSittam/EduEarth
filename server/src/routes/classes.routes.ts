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
import { requireEducator } from "../middlewares/requireRole.js";

const router = Router();

/**
 * Class Routes
 * Reads of class metadata are public; anything that mutates a class or
 * exposes student contact details requires an educator.
 */

// Basic CRUD operations
router.post("/", validToken, requireEducator, createClass);
router.get("/", getAllClasses);
router.get("/:id", getClassById);
router.put("/:id", validToken, requireEducator, updateClass);
router.delete("/:id", validToken, requireEducator, deleteClass);

// Student management
router.post("/:id/students", validToken, requireEducator, addStudentToClass);
router.delete("/:id/students/:studentId", validToken, requireEducator, removeStudentFromClass);
router.get("/:id/students", validToken, requireEducator, getClassStudents);

// Teacher management
router.post("/:id/teachers", validToken, requireEducator, addTeacherToClass);
router.delete("/:id/teachers/:teacherId", validToken, requireEducator, removeTeacherFromClass);
router.get("/:id/teachers", validToken, getClassTeachers);

// Class statistics
router.get("/:id/statistics", getClassStatistics);

export default router;
