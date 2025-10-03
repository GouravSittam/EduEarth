import { Router } from "express";
import {
  createInstitution,
  getAllInstitutions,
  getInstitutionById,
  updateInstitution,
  deleteInstitution,
  getInstitutionStatistics,
  getInstitutionStudents,
  getInstitutionTeachers,
  getInstitutionClasses,
} from "../controllers/institutions.controllers.js";
import validToken from "../middlewares/validToken.js";

const router = Router();

/**
 * Institution Routes
 * All endpoints for managing institutions
 */

// Basic CRUD operations
router.post("/", validToken, createInstitution);
router.get("/", getAllInstitutions);
router.get("/:id", getInstitutionById);
router.put("/:id", validToken, updateInstitution);
router.delete("/:id", validToken, deleteInstitution);

// Institution-specific data
router.get("/:id/statistics", getInstitutionStatistics);
router.get("/:id/students", getInstitutionStudents);
router.get("/:id/teachers", getInstitutionTeachers);
router.get("/:id/classes", getInstitutionClasses);

export default router;
