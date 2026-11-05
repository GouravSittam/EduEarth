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
  joinInstitution,
} from "../controllers/institutions.controllers.js";
import validToken from "../middlewares/validToken.js";
import { requireEducator } from "../middlewares/requireRole.js";

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

// Membership
router.post("/:id/join", validToken, joinInstitution);

// Institution-specific data (rosters expose emails → educators only)
router.get("/:id/statistics", getInstitutionStatistics);
router.get("/:id/students", validToken, requireEducator, getInstitutionStudents);
router.get("/:id/teachers", validToken, requireEducator, getInstitutionTeachers);
router.get("/:id/classes", getInstitutionClasses);

export default router;
