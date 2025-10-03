import { Request, Response } from "express";
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

// ==================== LESSON MODULES ====================

/**
 * Create a new lesson module
 * POST /lessons/modules
 * Admin/Teacher only
 */
export const createLessonModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, category, difficulty, order } = req.body;

    // Validate required fields
    if (!title || !category) {
      sendErrorResponse(res, 400, "Title and category are required");
      return;
    }

    // Create lesson module
    const module = await prisma.lessonModule.create({
      data: {
        title,
        description,
        category,
        difficulty: difficulty || "BEGINNER",
        order: order || 0,
      },
    });

    sendSuccessResponse(res, 201, "Lesson module created successfully", module);
  } catch (error) {
    console.error("Create lesson module error:", error);
    sendErrorResponse(res, 500, "Failed to create lesson module");
  }
};

/**
 * Get all lesson modules with pagination
 * GET /lessons/modules
 */
export const getAllLessonModules = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category as string;
    const difficulty = req.query.difficulty as string;
    const search = req.query.search as string;

    // Build where clause
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }
    if (difficulty) {
      where.difficulty = difficulty;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [modules, totalCount] = await Promise.all([
      prisma.lessonModule.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              lessons: true,
            },
          },
        },
        orderBy: { order: "asc" },
      }),
      prisma.lessonModule.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(res, 200, "Lesson modules retrieved successfully", {
      modules,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all lesson modules error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve lesson modules");
  }
};

/**
 * Get a single lesson module by ID
 * GET /lessons/modules/:id
 */
export const getLessonModuleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Module ID is required");
      return;
    }

    const module = await prisma.lessonModule.findUnique({
      where: { id },
      include: {
        lessons: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!module) {
      sendErrorResponse(res, 404, "Lesson module not found");
      return;
    }

    sendSuccessResponse(res, 200, "Lesson module retrieved successfully", module);
  } catch (error) {
    console.error("Get lesson module by ID error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve lesson module");
  }
};

/**
 * Update a lesson module
 * PUT /lessons/modules/:id
 * Admin/Teacher only
 */
export const updateLessonModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, category, difficulty, order, isActive } = req.body;

    if (!id) {
      sendErrorResponse(res, 400, "Module ID is required");
      return;
    }

    // Check if module exists
    const existingModule = await prisma.lessonModule.findUnique({
      where: { id },
    });

    if (!existingModule) {
      sendErrorResponse(res, 404, "Lesson module not found");
      return;
    }

    const updatedModule = await prisma.lessonModule.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    sendSuccessResponse(res, 200, "Lesson module updated successfully", updatedModule);
  } catch (error) {
    console.error("Update lesson module error:", error);
    sendErrorResponse(res, 500, "Failed to update lesson module");
  }
};

/**
 * Delete a lesson module
 * DELETE /lessons/modules/:id
 * Admin/Teacher only
 */
export const deleteLessonModule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Module ID is required");
      return;
    }

    // Check if module exists
    const existingModule = await prisma.lessonModule.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    if (!existingModule) {
      sendErrorResponse(res, 404, "Lesson module not found");
      return;
    }

    // Check if module has lessons
    if (existingModule._count.lessons > 0) {
      sendErrorResponse(
        res,
        400,
        "Cannot delete module with existing lessons. Deactivate instead."
      );
      return;
    }

    // Delete the module
    await prisma.lessonModule.delete({
      where: { id },
    });

    sendSuccessResponse(res, 200, "Lesson module deleted successfully");
  } catch (error) {
    console.error("Delete lesson module error:", error);
    sendErrorResponse(res, 500, "Failed to delete lesson module");
  }
};

// ==================== LESSONS ====================

/**
 * Create a new lesson
 * POST /lessons
 * Admin/Teacher only
 */
export const createLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { moduleId, title, content, videoUrl, imageUrl, estimatedTime, ecoPoints, order } = req.body;

    // Validate required fields
    if (!moduleId || !title || !content) {
      sendErrorResponse(res, 400, "Module ID, title, and content are required");
      return;
    }

    // Check if module exists
    const module = await prisma.lessonModule.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      sendErrorResponse(res, 404, "Lesson module not found");
      return;
    }

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        title,
        content,
        videoUrl,
        imageUrl,
        estimatedTime: estimatedTime || 10,
        ecoPoints: ecoPoints || 10,
        order: order || 0,
      },
      include: {
        module: {
          select: { id: true, title: true, category: true },
        },
      },
    });

    sendSuccessResponse(res, 201, "Lesson created successfully", lesson);
  } catch (error) {
    console.error("Create lesson error:", error);
    sendErrorResponse(res, 500, "Failed to create lesson");
  }
};

/**
 * Get all lessons with pagination
 * GET /lessons
 */
export const getAllLessons = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const moduleId = req.query.moduleId as string;
    const search = req.query.search as string;

    // Build where clause
    const where: any = { isActive: true };
    if (moduleId) {
      where.moduleId = moduleId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [lessons, totalCount] = await Promise.all([
      prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        include: {
          module: {
            select: { id: true, title: true, category: true },
          },
        },
        orderBy: { order: "asc" },
      }),
      prisma.lesson.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(res, 200, "Lessons retrieved successfully", {
      lessons,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all lessons error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve lessons");
  }
};

/**
 * Get a single lesson by ID
 * GET /lessons/:id
 */
export const getLessonById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Lesson ID is required");
      return;
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          select: { id: true, title: true, category: true },
        },
        quizzes: {
          where: { isActive: true },
          select: { id: true, title: true, ecoPoints: true },
        },
      },
    });

    if (!lesson) {
      sendErrorResponse(res, 404, "Lesson not found");
      return;
    }

    sendSuccessResponse(res, 200, "Lesson retrieved successfully", lesson);
  } catch (error) {
    console.error("Get lesson by ID error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve lesson");
  }
};

/**
 * Update a lesson
 * PUT /lessons/:id
 * Admin/Teacher only
 */
export const updateLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, videoUrl, imageUrl, estimatedTime, ecoPoints, order, isActive } = req.body;

    if (!id) {
      sendErrorResponse(res, 400, "Lesson ID is required");
      return;
    }

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      sendErrorResponse(res, 404, "Lesson not found");
      return;
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(estimatedTime !== undefined && { estimatedTime }),
        ...(ecoPoints !== undefined && { ecoPoints }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        module: {
          select: { id: true, title: true, category: true },
        },
      },
    });

    sendSuccessResponse(res, 200, "Lesson updated successfully", updatedLesson);
  } catch (error) {
    console.error("Update lesson error:", error);
    sendErrorResponse(res, 500, "Failed to update lesson");
  }
};

/**
 * Delete a lesson
 * DELETE /lessons/:id
 * Admin/Teacher only
 */
export const deleteLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Lesson ID is required");
      return;
    }

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            completions: true,
            quizzes: true,
          },
        },
      },
    });

    if (!existingLesson) {
      sendErrorResponse(res, 404, "Lesson not found");
      return;
    }

    // Check if lesson has completions or quizzes
    if (existingLesson._count.completions > 0 || existingLesson._count.quizzes > 0) {
      sendErrorResponse(
        res,
        400,
        "Cannot delete lesson with existing completions or quizzes. Deactivate instead."
      );
      return;
    }

    // Delete the lesson
    await prisma.lesson.delete({
      where: { id },
    });

    sendSuccessResponse(res, 200, "Lesson deleted successfully");
  } catch (error) {
    console.error("Delete lesson error:", error);
    sendErrorResponse(res, 500, "Failed to delete lesson");
  }
};

/**
 * Mark lesson as completed by student
 * POST /lessons/:id/complete
 * Student only
 */
export const completeLesson = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { timeSpent } = req.body;
    const studentId = req.user?.id; // Assuming user is student

    if (!id) {
      sendErrorResponse(res, 400, "Lesson ID is required");
      return;
    }

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      sendErrorResponse(res, 404, "Lesson not found");
      return;
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { userId: studentId },
    });

    if (!student) {
      sendErrorResponse(res, 404, "Student not found");
      return;
    }

    // Check if already completed
    const existingCompletion = await (prisma as any).lessonCompletion.findUnique({
      where: {
        studentId_lessonId: {
          studentId: student.id,
          lessonId: id,
        },
      },
    });

    if (existingCompletion) {
      sendErrorResponse(res, 409, "Lesson already completed");
      return;
    }

    // Create completion record
    const completion = await (prisma as any).lessonCompletion.create({
      data: {
        studentId: student.id,
        lessonId: id,
        timeSpent,
      },
      include: {
        lesson: {
          select: { id: true, title: true, ecoPoints: true },
        },
      },
    });

    // Award eco points
    await prisma.student.update({
      where: { id: student.id },
      data: {
        ecoPoints: {
          increment: lesson.ecoPoints,
        },
      },
    });

    sendSuccessResponse(res, 201, "Lesson completed successfully", {
      completion,
      ecoPointsAwarded: lesson.ecoPoints,
    });
  } catch (error) {
    console.error("Complete lesson error:", error);
    sendErrorResponse(res, 500, "Failed to complete lesson");
  }
};

/**
 * Get lesson completions for a student
 * GET /lessons/:id/completions
 * Student only
 */
export const getLessonCompletions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const studentId = req.user?.id; // Assuming user is student

    if (!id) {
      sendErrorResponse(res, 400, "Lesson ID is required");
      return;
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { userId: studentId },
    });

    if (!student) {
      sendErrorResponse(res, 404, "Student not found");
      return;
    }

    const completions = await (prisma as any).lessonCompletion.findMany({
      where: {
        lessonId: id,
        studentId: student.id,
      },
      include: {
        lesson: {
          select: { id: true, title: true, ecoPoints: true },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    sendSuccessResponse(res, 200, "Lesson completions retrieved successfully", completions);
  } catch (error) {
    console.error("Get lesson completions error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve lesson completions");
  }
};
