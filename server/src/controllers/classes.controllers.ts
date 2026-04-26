import { Request, Response } from "express";
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
  error?: any
) => {
  return sendResponse({ res, success: false, message, error, statusCode });
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
    const { name, institutionId, subject, description } = req.body;

    // Validate required fields
    if (!name || !institutionId || !subject) {
      sendErrorResponse(res, 400, "Name, institutionId, and subject are required");
      return;
    }

    // Check if institution exists
    const institution = await prisma.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) {
      sendErrorResponse(res, 404, "Institution not found");
      return;
    }

    // Create class
    const newClass = await prisma.class.create({
      data: {
        name: String(name),
        institutionId: String(institutionId),
        subject: String(subject),
        description: description ? String(description) : null,
      } as any,
      include: {
        institution: {
          select: { id: true, name: true, type: true },
        },
      },
    });

    sendSuccessResponse(res, 201, "Class created successfully", newClass);
    await cacheService.delByPrefix("classes:stats:");
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
    const { id } = req.params;
    const { name, subject, description } = req.body;

    if (!id) {
      sendErrorResponse(res, 400, "Class ID is required");
      return;
    }

    // Check if class exists
    const existingClass = await prisma.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      sendErrorResponse(res, 404, "Class not found");
      return;
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(subject && { subject }),
        ...(description !== undefined && { description }),
      },
      include: {
        institution: {
          select: { id: true, name: true, type: true },
        },
      },
    });

    sendSuccessResponse(res, 200, "Class updated successfully", updatedClass);
    await cacheService.delByPrefix("classes:stats:");
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
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Class ID is required");
      return;
    }

    // Check if class exists
    const existingClass = await prisma.class.findUnique({
      where: { id },
    });

    if (!existingClass) {
      sendErrorResponse(res, 404, "Class not found");
      return;
    }

    // Delete the class
    await prisma.class.delete({
      where: { id },
    });

    sendSuccessResponse(res, 200, "Class deleted successfully");
    await cacheService.delByPrefix("classes:stats:");
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
    const { id } = req.params;
    const { studentId } = req.body;

    if (!id || !studentId) {
      sendErrorResponse(res, 400, "Class ID and student ID are required");
      return;
    }

    const enrollment = await prisma.$transaction(async (tx) => {
      const [classData, student] = await Promise.all([
        tx.class.findUnique({ where: { id } }),
        tx.student.findUnique({ where: { id: studentId } }),
      ]);
      if (!classData) {
        throw new Error("CLASS_NOT_FOUND");
      }
      if (!student) {
        throw new Error("STUDENT_NOT_FOUND");
      }
      const existingEnrollment = await (tx as any).studentClass.findFirst({
        where: { studentId, classId: id, isActive: true },
      });
      if (existingEnrollment) {
        throw new Error("STUDENT_ALREADY_ENROLLED");
      }
      return (tx as any).studentClass.create({
        data: { studentId, classId: id, isActive: true },
        include: {
          student: {
            include: {
              user: { select: { id: true, name: true, email: true, avatar: true } },
            },
          },
          class: {
            select: { id: true, name: true, subject: true },
          },
        },
      });
    });

    sendSuccessResponse(res, 201, "Student added to class successfully", enrollment);
    await cacheService.delByPrefix(`classes:stats:${id}`);
  } catch (error) {
    if (error instanceof Error && error.message === "CLASS_NOT_FOUND") {
      sendErrorResponse(res, 404, "Class not found");
      return;
    }
    if (error instanceof Error && error.message === "STUDENT_NOT_FOUND") {
      sendErrorResponse(res, 404, "Student not found");
      return;
    }
    if (error instanceof Error && error.message === "STUDENT_ALREADY_ENROLLED") {
      sendErrorResponse(res, 409, "Student is already enrolled in this class");
      return;
    }
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
    const { id, studentId } = req.params;

    if (!id || !studentId) {
      sendErrorResponse(res, 400, "Class ID and student ID are required");
      return;
    }

    // Check if enrollment exists
    const enrollment = await (prisma as any).studentClass.findFirst({
      where: {
        studentId,
        classId: id,
        isActive: true,
      },
    });

    if (!enrollment) {
      sendErrorResponse(res, 404, "Student is not enrolled in this class");
      return;
    }

    // Soft delete - set isActive to false instead of hard delete
    await (prisma as any).studentClass.update({
      where: { id: enrollment.id },
      data: { isActive: false },
    });

    sendSuccessResponse(res, 200, "Student removed from class successfully");
    await cacheService.delByPrefix(`classes:stats:${id}`);
  } catch (error) {
    console.error("Remove student from class error:", error);
    sendErrorResponse(res, 500, "Failed to remove student from class");
  }
};

/**
 * Get class students
 * GET /classes/:id/students
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

    const [students, totalCount] = await Promise.all([
      (prisma as any).studentClass.findMany({
        where: { 
          classId: id,
          isActive: true,
        },
        skip,
        take: limit,
        include: {
          student: {
            include: {
              user: {
                select: { id: true, name: true, email: true, avatar: true },
              },
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      }),
      (prisma as any).studentClass.count({ 
        where: { 
          classId: id,
          isActive: true,
        } 
      }),
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
    const cacheKey = `classes:stats:${id}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      sendSuccessResponse(res, 200, "Class statistics retrieved successfully", cached);
      return;
    }


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

    // Get comprehensive statistics
    const [
      totalStudents,
      totalTeachers,
      totalEcoPoints,
      recentEnrollments,
    ] = await Promise.all([
      // Total active students
      (prisma as any).studentClass.count({
        where: { classId: id, isActive: true },
      }),

      // Total active teachers
      (prisma as any).teacherClass.count({
        where: { classId: id, isActive: true },
      }),

      // Total eco points from students in this class
      (prisma as any).studentClass.aggregate({
        where: { classId: id, isActive: true },
        _sum: {
          student: {
            ecoPoints: true,
          },
        },
      }),

      // Recent enrollments (last 7 days)
      (prisma as any).studentClass.findMany({
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
              user: {
                select: { name: true, avatar: true },
              },
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
        totalEcoPoints: totalEcoPoints._sum?.student?.ecoPoints || 0,
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
    const { id } = req.params;
    const { teacherId, role = "PRIMARY" } = req.body;
    const normalizedRole = classesService.normalizeRole(role);

    if (!id || !teacherId) {
      sendErrorResponse(res, 400, "Class ID and teacher ID are required");
      return;
    }

    const assignment = await prisma.$transaction(async (tx) => {
      const [classData, teacher] = await Promise.all([
        tx.class.findUnique({ where: { id } }),
        tx.teacher.findUnique({ where: { id: teacherId } }),
      ]);
      if (!classData) {
        throw new Error("CLASS_NOT_FOUND");
      }
      if (!teacher) {
        throw new Error("TEACHER_NOT_FOUND");
      }
      const existingAssignment = await (tx as any).teacherClass.findFirst({
        where: { teacherId, classId: id, isActive: true },
      });
      if (existingAssignment) {
        throw new Error("TEACHER_ALREADY_ASSIGNED");
      }
      return (tx as any).teacherClass.create({
        data: { teacherId, classId: id, role: normalizedRole, isActive: true },
        include: {
          teacher: {
            include: {
              user: { select: { id: true, name: true, email: true, avatar: true } },
            },
          },
          class: { select: { id: true, name: true, subject: true } },
        },
      });
    });

    sendSuccessResponse(res, 201, "Teacher added to class successfully", assignment);
    await cacheService.delByPrefix(`classes:stats:${id}`);
  } catch (error) {
    if (error instanceof Error && error.message === "CLASS_NOT_FOUND") {
      sendErrorResponse(res, 404, "Class not found");
      return;
    }
    if (error instanceof Error && error.message === "TEACHER_NOT_FOUND") {
      sendErrorResponse(res, 404, "Teacher not found");
      return;
    }
    if (error instanceof Error && error.message === "TEACHER_ALREADY_ASSIGNED") {
      sendErrorResponse(res, 409, "Teacher is already assigned to this class");
      return;
    }
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
    const { id, teacherId } = req.params;

    if (!id || !teacherId) {
      sendErrorResponse(res, 400, "Class ID and teacher ID are required");
      return;
    }

    // Check if assignment exists
    const assignment = await (prisma as any).teacherClass.findFirst({
      where: {
        teacherId,
        classId: id,
        isActive: true,
      },
    });

    if (!assignment) {
      sendErrorResponse(res, 404, "Teacher is not assigned to this class");
      return;
    }

    // Soft delete - set isActive to false
    await (prisma as any).teacherClass.update({
      where: { id: assignment.id },
      data: { isActive: false },
    });

    sendSuccessResponse(res, 200, "Teacher removed from class successfully");
    await cacheService.delByPrefix(`classes:stats:${id}`);
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

    const [teachers, totalCount] = await Promise.all([
      (prisma as any).teacherClass.findMany({
        where: { 
          classId: id,
          isActive: true,
        },
        skip,
        take: limit,
        include: {
          teacher: {
            include: {
              user: {
                select: { id: true, name: true, email: true, avatar: true },
              },
            },
          },
        },
        orderBy: { assignedAt: "desc" },
      }),
      (prisma as any).teacherClass.count({ 
        where: { 
          classId: id,
          isActive: true,
        } 
      }),
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