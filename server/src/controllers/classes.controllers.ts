import { Request, Response } from "express";
import type { User } from "@prisma/client";
import { sendResponse } from "../utils/ResponseHelpers.js";
import { prisma } from "../prisma/client.js";
import { parseBoundedPagination } from "../utils/pagination.js";
import { classesService } from "../services/classes.service.js";
import { cacheService } from "../services/cache.service.js";

// Helper functions for consistent responses
const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  return sendResponse({ res, success: true, message, data, statusCode });
};

const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
) => {
  return sendResponse({
    res,
    success: false,
    message,
    error: { message },
    statusCode,
  });
};

const STUDENT_USER_SELECT = {
  select: { id: true, name: true, email: true, avatar: true },
} as const;

/**
 * Teachers may only manage classes of the institution they belong to.
 * Admins may manage everything.
 */
const getTeacherInstitutionId = async (user: User | undefined) => {
  if (!user) return null;
  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    select: { institutionId: true },
  });
  return teacher?.institutionId ?? null;
};

const canManageInstitution = async (
  user: User | undefined,
  institutionId: string,
) => {
  if (!user) return false;
  if (user.isAdmin) return true;
  return (await getTeacherInstitutionId(user)) === institutionId;
};

/**
 * Load a class and verify the caller may manage it.
 * Sends the error response itself and returns null when access is denied.
 */
const loadManageableClass = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    sendErrorResponse(res, 400, "Class ID is required");
    return null;
  }

  const classData = await prisma.class.findUnique({ where: { id } });

  if (!classData) {
    sendErrorResponse(res, 404, "Class not found");
    return null;
  }

  if (!(await canManageInstitution(req.user, classData.institutionId))) {
    sendErrorResponse(res, 403, "You can only manage classes in your own institution");
    return null;
  }

  return classData;
};

/**
 * Create a new class
 * POST /classes
 * Teacher only
 */
export const createClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, institutionId, subject, description } = req.body ?? {};

    // Validate required fields
    if (!name || !institutionId || !subject) {
      sendErrorResponse(res, 400, "Name, institutionId, and subject are required");
      return;
    }

    // Check if institution exists
    const institution = await prisma.institution.findUnique({
      where: { id: String(institutionId) },
    });

    if (!institution) {
      sendErrorResponse(res, 404, "Institution not found");
      return;
    }

    if (!(await canManageInstitution(req.user, institution.id))) {
      sendErrorResponse(res, 403, "You can only create classes in your own institution");
      return;
    }

    const creatorTeacher = req.user
      ? await prisma.teacher.findUnique({ where: { userId: req.user.id } })
      : null;

    // Create class, and make the creating teacher its primary teacher.
    const newClass = await prisma.class.create({
      data: {
        name: String(name),
        institutionId: institution.id,
        subject: String(subject),
        description: description ? String(description) : null,
        ...(creatorTeacher && {
          teachers: {
            create: { teacherId: creatorTeacher.id, role: "PRIMARY" },
          },
        }),
      },
      include: {
        institution: {
          select: { id: true, name: true, type: true },
        },
      },
    });

    sendSuccessResponse(res, 201, "Class created successfully", newClass);
    await cacheService.delByPrefix("classes:stats:");
    await cacheService.delByPrefix(`institutions:stats:${institution.id}`);
  } catch (error) {
    console.error("Create class error:", error);
    sendErrorResponse(res, 500, "Failed to create class");
  }
};

/**
 * Get all classes with pagination
 * GET /classes
 */
export const getAllClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page, limit, skip } = parseBoundedPagination(req.query.page, req.query.limit, 10, 50);
    const institutionId = req.query.institutionId as string;
    const subject = req.query.subject as string;
    const search = req.query.search as string;

    // Build where clause
    const where: any = {};
    if (institutionId) {
      where.institutionId = institutionId;
    }
    if (subject) {
      where.subject = { contains: subject, mode: "insensitive" };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [classes, totalCount] = await Promise.all([
      prisma.class.findMany({
        where,
        skip,
        take: limit,
        include: {
          institution: {
            select: { id: true, name: true, type: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.class.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(res, 200, "Classes retrieved successfully", {
      classes,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all classes error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve classes");
  }
};

/**
 * Get a single class by ID
 * GET /classes/:id
 */
export const getClassById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Class ID is required");
      return;
    }

    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        institution: {
          select: { id: true, name: true, type: true },
        },
      },
    });

    if (!classData) {
      sendErrorResponse(res, 404, "Class not found");
      return;
    }

    sendSuccessResponse(res, 200, "Class retrieved successfully", classData);
  } catch (error) {
    console.error("Get class by ID error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve class");
  }
};

/**
 * Update a class
 * PUT /classes/:id
 * Teacher only
 */
export const updateClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const existingClass = await loadManageableClass(req, res);
    if (!existingClass) return;

    const { name, subject, description } = req.body ?? {};

    const updatedClass = await prisma.class.update({
      where: { id: existingClass.id },
      data: {
        ...(name && { name: String(name) }),
        ...(subject && { subject: String(subject) }),
        ...(description !== undefined && {
          description: description === null ? null : String(description),
        }),
      },
      include: {
        institution: {
          select: { id: true, name: true, type: true },
        },
      },
    });

    sendSuccessResponse(res, 200, "Class updated successfully", updatedClass);
    await cacheService.delByPrefix(`classes:stats:${existingClass.id}`);
  } catch (error) {
    console.error("Update class error:", error);
    sendErrorResponse(res, 500, "Failed to update class");
  }
};

/**
 * Delete a class
 * DELETE /classes/:id
 * Teacher only
 */
export const deleteClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const existingClass = await loadManageableClass(req, res);
    if (!existingClass) return;

    // Enrollments and teacher assignments cascade; leaderboards do not.
    await prisma.$transaction([
      prisma.leaderboard.deleteMany({ where: { classId: existingClass.id } }),
      prisma.class.delete({ where: { id: existingClass.id } }),
    ]);

    sendSuccessResponse(res, 200, "Class deleted successfully");
    await cacheService.delByPrefix(`classes:stats:${existingClass.id}`);
    await cacheService.delByPrefix(`institutions:stats:${existingClass.institutionId}`);
  } catch (error) {
    console.error("Delete class error:", error);
    sendErrorResponse(res, 500, "Failed to delete class");
  }
};

/**
 * Add student to class
 * POST /classes/:id/students
 * Teacher only
 */
export const addStudentToClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classData = await loadManageableClass(req, res);
    if (!classData) return;

    const studentId = req.body?.studentId;

    if (!studentId || typeof studentId !== "string") {
      sendErrorResponse(res, 400, "Student ID is required");
      return;
    }

    const student = await prisma.student.findUnique({ where: { id: studentId } });

    if (!student) {
      sendErrorResponse(res, 404, "Student not found");
      return;
    }

    if (student.institutionId !== classData.institutionId) {
      sendErrorResponse(res, 400, "Student belongs to a different institution");
      return;
    }

    const existingEnrollment = await prisma.studentClass.findUnique({
      where: { studentId_classId: { studentId, classId: classData.id } },
    });

    if (existingEnrollment?.isActive) {
      sendErrorResponse(res, 409, "Student is already enrolled in this class");
      return;
    }

    // Re-activate a previous (soft-deleted) enrollment instead of violating
    // the unique (studentId, classId) constraint.
    const enrollment = await prisma.studentClass.upsert({
      where: { studentId_classId: { studentId, classId: classData.id } },
      update: { isActive: true, enrolledAt: new Date() },
      create: { studentId, classId: classData.id, isActive: true },
      include: {
        student: { include: { user: STUDENT_USER_SELECT } },
        class: { select: { id: true, name: true, subject: true } },
      },
    });

    sendSuccessResponse(res, 201, "Student added to class successfully", enrollment);
    await cacheService.delByPrefix(`classes:stats:${classData.id}`);
  } catch (error) {
    console.error("Add student to class error:", error);
    sendErrorResponse(res, 500, "Failed to add student to class");
  }
};

/**
 * Remove student from class
 * DELETE /classes/:id/students/:studentId
 * Teacher only
 */
export const removeStudentFromClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classData = await loadManageableClass(req, res);
    if (!classData) return;

    const { studentId } = req.params;

    if (!studentId) {
      sendErrorResponse(res, 400, "Student ID is required");
      return;
    }

    const result = await prisma.studentClass.updateMany({
      where: { studentId, classId: classData.id, isActive: true },
      data: { isActive: false },
    });

    if (result.count === 0) {
      sendErrorResponse(res, 404, "Student is not enrolled in this class");
      return;
    }

    sendSuccessResponse(res, 200, "Student removed from class successfully");
    await cacheService.delByPrefix(`classes:stats:${classData.id}`);
  } catch (error) {
    console.error("Remove student from class error:", error);
    sendErrorResponse(res, 500, "Failed to remove student from class");
  }
};

/**
 * Get class students
 * GET /classes/:id/students
 * Educators only (exposes student emails)
 */
export const getClassStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { page, limit, skip } = parseBoundedPagination(req.query.page, req.query.limit, 20, 100);

    if (!id) {
      sendErrorResponse(res, 400, "Class ID is required");
      return;
    }

    // Check if class exists
    const classData = await prisma.class.findUnique({
      where: { id },
      select: { id: true, name: true, subject: true },
    });

    if (!classData) {
      sendErrorResponse(res, 404, "Class not found");
      return;
    }

    const where = { classId: id, isActive: true };

    const [students, totalCount] = await Promise.all([
      prisma.studentClass.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: { include: { user: STUDENT_USER_SELECT } },
        },
        orderBy: { enrolledAt: "desc" },
      }),
      prisma.studentClass.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(res, 200, "Class students retrieved successfully", {
      class: classData,
      students,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get class students error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve class students");
  }
};

/**
 * Get class statistics
 * GET /classes/:id/statistics
 */
export const getClassStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Class ID is required");
      return;
    }

    const cacheKey = `classes:stats:${id}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      sendSuccessResponse(res, 200, "Class statistics retrieved successfully", cached);
      return;
    }

    // Check if class exists
    const classData = await prisma.class.findUnique({
      where: { id },
      select: { id: true, name: true, subject: true },
    });

    if (!classData) {
      sendErrorResponse(res, 404, "Class not found");
      return;
    }

    const activeInClass = { classes: { some: { classId: id, isActive: true } } };

    const [totalStudents, totalTeachers, ecoPointsAggregate, recentEnrollments] =
      await Promise.all([
        prisma.studentClass.count({ where: { classId: id, isActive: true } }),
        prisma.teacherClass.count({ where: { classId: id, isActive: true } }),
        // Prisma cannot sum across a relation, so aggregate students directly.
        prisma.student.aggregate({
          where: activeInClass,
          _sum: { ecoPoints: true },
          _avg: { ecoPoints: true },
        }),
        prisma.studentClass.findMany({
          where: {
            classId: id,
            isActive: true,
            enrolledAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          include: {
            student: {
              include: {
                user: { select: { name: true, avatar: true } },
              },
            },
          },
          orderBy: { enrolledAt: "desc" },
          take: 5,
        }),
      ]);

    const statistics = {
      class: classData,
      overview: {
        totalStudents,
        totalTeachers,
        totalEcoPoints: ecoPointsAggregate._sum.ecoPoints ?? 0,
        avgEcoPoints: Math.round(ecoPointsAggregate._avg.ecoPoints ?? 0),
      },
      recentActivity: {
        recentEnrollments,
      },
    };

    sendSuccessResponse(res, 200, "Class statistics retrieved successfully", statistics);
    await cacheService.set(cacheKey, statistics, 120);
  } catch (error) {
    console.error("Get class statistics error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve class statistics");
  }
};

/**
 * Add teacher to class
 * POST /classes/:id/teachers
 * Admin/Teacher only
 */
export const addTeacherToClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classData = await loadManageableClass(req, res);
    if (!classData) return;

    const { teacherId, role = "PRIMARY" } = req.body ?? {};
    const normalizedRole = classesService.normalizeRole(role);

    if (!teacherId || typeof teacherId !== "string") {
      sendErrorResponse(res, 400, "Teacher ID is required");
      return;
    }

    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });

    if (!teacher) {
      sendErrorResponse(res, 404, "Teacher not found");
      return;
    }

    if (teacher.institutionId !== classData.institutionId) {
      sendErrorResponse(res, 400, "Teacher belongs to a different institution");
      return;
    }

    const existingAssignment = await prisma.teacherClass.findUnique({
      where: { teacherId_classId: { teacherId, classId: classData.id } },
    });

    if (existingAssignment?.isActive) {
      sendErrorResponse(res, 409, "Teacher is already assigned to this class");
      return;
    }

    const assignment = await prisma.teacherClass.upsert({
      where: { teacherId_classId: { teacherId, classId: classData.id } },
      update: { isActive: true, role: normalizedRole, assignedAt: new Date() },
      create: { teacherId, classId: classData.id, role: normalizedRole, isActive: true },
      include: {
        teacher: { include: { user: STUDENT_USER_SELECT } },
        class: { select: { id: true, name: true, subject: true } },
      },
    });

    sendSuccessResponse(res, 201, "Teacher added to class successfully", assignment);
    await cacheService.delByPrefix(`classes:stats:${classData.id}`);
  } catch (error) {
    console.error("Add teacher to class error:", error);
    sendErrorResponse(res, 500, "Failed to add teacher to class");
  }
};

/**
 * Remove teacher from class
 * DELETE /classes/:id/teachers/:teacherId
 * Admin/Teacher only
 */
export const removeTeacherFromClass = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const classData = await loadManageableClass(req, res);
    if (!classData) return;

    const { teacherId } = req.params;

    if (!teacherId) {
      sendErrorResponse(res, 400, "Teacher ID is required");
      return;
    }

    const result = await prisma.teacherClass.updateMany({
      where: { teacherId, classId: classData.id, isActive: true },
      data: { isActive: false },
    });

    if (result.count === 0) {
      sendErrorResponse(res, 404, "Teacher is not assigned to this class");
      return;
    }

    sendSuccessResponse(res, 200, "Teacher removed from class successfully");
    await cacheService.delByPrefix(`classes:stats:${classData.id}`);
  } catch (error) {
    console.error("Remove teacher from class error:", error);
    sendErrorResponse(res, 500, "Failed to remove teacher from class");
  }
};

/**
 * Get class teachers
 * GET /classes/:id/teachers
 */
export const getClassTeachers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { page, limit, skip } = parseBoundedPagination(req.query.page, req.query.limit, 20, 100);

    if (!id) {
      sendErrorResponse(res, 400, "Class ID is required");
      return;
    }

    // Check if class exists
    const classData = await prisma.class.findUnique({
      where: { id },
      select: { id: true, name: true, subject: true },
    });

    if (!classData) {
      sendErrorResponse(res, 404, "Class not found");
      return;
    }

    const where = { classId: id, isActive: true };

    const [teachers, totalCount] = await Promise.all([
      prisma.teacherClass.findMany({
        where,
        skip,
        take: limit,
        include: {
          teacher: {
            include: {
              user: { select: { id: true, name: true, avatar: true } },
            },
          },
        },
        orderBy: { assignedAt: "desc" },
      }),
      prisma.teacherClass.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(res, 200, "Class teachers retrieved successfully", {
      class: classData,
      teachers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get class teachers error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve class teachers");
  }
};
