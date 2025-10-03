import { Request, Response } from "express";
import { InstitutionType } from "@prisma/client";
import { sendResponse } from "../utils/ResponseHelpers.js";
import { prisma } from "../prisma/client.js";

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
 * Create a new institution
 * POST /institutions
 * Admin only
 */
export const createInstitution = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      sendErrorResponse(
        res,
        403,
        "Only administrators can create institutions"
      );
      return;
    }

    const { name, address, type, adminId } = req.body;

    // Validate required fields
    if (!name || !type || !adminId) {
      sendErrorResponse(res, 400, "Name, type, and adminId are required");
      return;
    }

    // Validate institution type
    if (!Object.values(InstitutionType).includes(type)) {
      sendErrorResponse(res, 400, "Invalid institution type");
      return;
    }

    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!adminUser) {
      sendErrorResponse(res, 404, "Admin user not found");
      return;
    }

    // Create institution
    const institution = await prisma.institution.create({
      data: {
        name,
        address,
        type,
        adminId,
      },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    sendSuccessResponse(
      res,
      201,
      "Institution created successfully",
      institution
    );
  } catch (error) {
    console.error("Create institution error:", error);
    sendErrorResponse(res, 500, "Failed to create institution");
  }
};

/**
 * Get all institutions with pagination
 * GET /institutions
 */
export const getAllInstitutions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type as InstitutionType;
    const search = req.query.search as string;

    // Build where clause
    const where: any = {};
    if (type && Object.values(InstitutionType).includes(type)) {
      where.type = type;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    const [institutions, totalCount] = await Promise.all([
      prisma.institution.findMany({
        where,
        skip,
        take: limit,
        include: {
          admin: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: {
              classes: true,
              students: true,
              teachers: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.institution.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(res, 200, "Institutions retrieved successfully", {
      institutions,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all institutions error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve institutions");
  }
};

/**
 * Get a single institution by ID
 * GET /institutions/:id
 */
export const getInstitutionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Institution ID is required");
      return;
    }

    const institution = await prisma.institution.findUnique({
      where: { id },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: {
            classes: true,
            students: true,
            teachers: true,
          },
        },
      },
    });

    if (!institution) {
      sendErrorResponse(res, 404, "Institution not found");
      return;
    }

    sendSuccessResponse(
      res,
      200,
      "Institution retrieved successfully",
      institution
    );
  } catch (error) {
    console.error("Get institution by ID error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve institution");
  }
};

/**
 * Update an institution
 * PUT /institutions/:id
 * Admin only
 */
export const updateInstitution = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      sendErrorResponse(
        res,
        403,
        "Only administrators can update institutions"
      );
      return;
    }

    const { id } = req.params;
    const { name, address, type } = req.body;

    if (!id) {
      sendErrorResponse(res, 400, "Institution ID is required");
      return;
    }

    // Check if institution exists
    const existingInstitution = await prisma.institution.findUnique({
      where: { id },
    });

    if (!existingInstitution) {
      sendErrorResponse(res, 404, "Institution not found");
      return;
    }

    // Validate institution type if provided
    if (type && !Object.values(InstitutionType).includes(type)) {
      sendErrorResponse(res, 400, "Invalid institution type");
      return;
    }

    const updatedInstitution = await prisma.institution.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(address !== undefined && { address }),
        ...(type && { type }),
      },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: {
            classes: true,
            students: true,
            teachers: true,
          },
        },
      },
    });

    sendSuccessResponse(
      res,
      200,
      "Institution updated successfully",
      updatedInstitution
    );
  } catch (error) {
    console.error("Update institution error:", error);
    sendErrorResponse(res, 500, "Failed to update institution");
  }
};

/**
 * Delete an institution
 * DELETE /institutions/:id
 * Admin only
 */
export const deleteInstitution = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      sendErrorResponse(
        res,
        403,
        "Only administrators can delete institutions"
      );
      return;
    }

    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Institution ID is required");
      return;
    }

    // Check if institution exists and get counts
    const institution = await prisma.institution.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            classes: true,
            students: true,
            teachers: true,
          },
        },
      },
    });

    if (!institution) {
      sendErrorResponse(res, 404, "Institution not found");
      return;
    }

    // Check if institution has active data
    if (
      institution._count.classes > 0 ||
      institution._count.students > 0 ||
      institution._count.teachers > 0
    ) {
      sendErrorResponse(
        res,
        400,
        "Cannot delete institution with active classes, students, or teachers"
      );
      return;
    }

    // Delete the institution
    await prisma.institution.delete({
      where: { id },
    });

    sendSuccessResponse(res, 200, "Institution deleted successfully");
  } catch (error) {
    console.error("Delete institution error:", error);
    sendErrorResponse(res, 500, "Failed to delete institution");
  }
};

/**
 * Get institution statistics
 * GET /institutions/:id/statistics
 */
export const getInstitutionStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Institution ID is required");
      return;
    }

    // Check if institution exists
    const institution = await prisma.institution.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!institution) {
      sendErrorResponse(res, 404, "Institution not found");
      return;
    }

    // Get comprehensive statistics
    const [
      totalClasses,
      totalStudents,
      totalTeachers,
      totalEcoPoints,
      topPerformers,
    ] = await Promise.all([
      // Total classes
      prisma.class.count({
        where: { institutionId: id },
      }),

      // Total students
      prisma.student.count({
        where: { institutionId: id },
      }),

      // Total teachers
      prisma.teacher.count({
        where: { institutionId: id },
      }),

      // Total eco points earned
      prisma.student.aggregate({
        where: { institutionId: id },
        _sum: { ecoPoints: true },
      }),

      // Top performing students
      prisma.student.findMany({
        where: { institutionId: id },
        select: {
          id: true,
          ecoPoints: true,
          level: true,
          user: {
            select: { name: true, avatar: true },
          },
        },
        orderBy: { ecoPoints: "desc" },
        take: 5,
      }),
    ]);

    const statistics = {
      overview: {
        totalClasses,
        totalStudents,
        totalTeachers,
        totalEcoPoints: totalEcoPoints._sum?.ecoPoints || 0,
      },
      engagement: {
        avgEcoPointsPerStudent:
          totalStudents > 0
            ? Math.round((totalEcoPoints._sum?.ecoPoints || 0) / totalStudents)
            : 0,
      },
      topPerformers,
    };

    sendSuccessResponse(
      res,
      200,
      "Institution statistics retrieved successfully",
      statistics
    );
  } catch (error) {
    console.error("Get institution statistics error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve institution statistics");
  }
};

/**
 * Get institution students
 * GET /institutions/:id/students
 */
export const getInstitutionStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!id) {
      sendErrorResponse(res, 400, "Institution ID is required");
      return;
    }

    // Check if institution exists
    const institution = await prisma.institution.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!institution) {
      sendErrorResponse(res, 404, "Institution not found");
      return;
    }

    const [students, totalCount] = await Promise.all([
      prisma.student.findMany({
        where: { institutionId: id },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          _count: {
            select: {
              completedLessons: true,
              badges: true,
            },
          },
        },
        orderBy: { ecoPoints: "desc" },
      }),
      prisma.student.count({ where: { institutionId: id } }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(
      res,
      200,
      "Institution students retrieved successfully",
      {
        students,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }
    );
  } catch (error) {
    console.error("Get institution students error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve institution students");
  }
};

/**
 * Get institution teachers
 * GET /institutions/:id/teachers
 */
export const getInstitutionTeachers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!id) {
      sendErrorResponse(res, 400, "Institution ID is required");
      return;
    }

    // Check if institution exists
    const institution = await prisma.institution.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!institution) {
      sendErrorResponse(res, 404, "Institution not found");
      return;
    }

    const [teachers, totalCount] = await Promise.all([
      prisma.teacher.findMany({
        where: { institutionId: id },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          _count: {
            select: { classes: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.teacher.count({ where: { institutionId: id } }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(
      res,
      200,
      "Institution teachers retrieved successfully",
      {
        teachers,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }
    );
  } catch (error) {
    console.error("Get institution teachers error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve institution teachers");
  }
};

/**
 * Get institution classes
 * GET /institutions/:id/classes
 */
export const getInstitutionClasses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!id) {
      sendErrorResponse(res, 400, "Institution ID is required");
      return;
    }

    // Check if institution exists
    const institution = await prisma.institution.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!institution) {
      sendErrorResponse(res, 404, "Institution not found");
      return;
    }

    const [classes, totalCount] = await Promise.all([
      prisma.class.findMany({
        where: { institutionId: id },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              students: true,
              teachers: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.class.count({ where: { institutionId: id } }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(
      res,
      200,
      "Institution classes retrieved successfully",
      {
        classes,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }
    );
  } catch (error) {
    console.error("Get institution classes error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve institution classes");
  }
};
