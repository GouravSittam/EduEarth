import { Request, Response } from "express";
import { Prisma, QuestionType } from "@prisma/client";
import { sendResponse } from "../utils/ResponseHelpers.js";
import { prisma } from "../prisma/client.js";
import { parseBoundedPagination } from "../utils/pagination.js";
import { quizzesService, sanitizeAnswers } from "../services/quizzes.service.js";
import { recordActivity } from "../services/progress.service.js";
import { isEducator } from "../middlewares/requireRole.js";
import {
  ValidationError,
  parseOptionalBoolean,
  parseOptionalInt,
} from "../utils/parse.js";

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

const QUIZ_SUMMARY_INCLUDE = {
  lesson: {
    select: { id: true, title: true, module: { select: { title: true } } },
  },
  _count: {
    select: {
      questions: true,
      attempts: true,
    },
  },
} as const;

const parseQuestionType = (value: unknown): QuestionType | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const upper = String(value).toUpperCase();
  if (upper in QuestionType) {
    return QuestionType[upper as keyof typeof QuestionType];
  }
  throw new ValidationError(
    `type must be one of ${Object.values(QuestionType).join(", ")}`,
  );
};

const parseOptions = (value: unknown) => {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.DbNull;
  if (!Array.isArray(value) || value.some((option) => typeof option !== "string")) {
    throw new ValidationError("options must be an array of strings");
  }
  return value as string[];
};

const handleValidationError = (res: Response, error: unknown) => {
  if (error instanceof ValidationError) {
    sendErrorResponse(res, 400, error.message);
    return true;
  }
  return false;
};

/**
 * Create a new quiz
 * POST /quizzes
 * Teacher only
 */
export const createQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, lessonId } = req.body ?? {};
    const timeLimit = parseOptionalInt(req.body?.timeLimit, "timeLimit", { min: 1, max: 7200 });
    const passingScore = parseOptionalInt(req.body?.passingScore, "passingScore", { min: 0, max: 100 });
    const ecoPoints = parseOptionalInt(req.body?.ecoPoints, "ecoPoints", { min: 0, max: 1000 });

    // Validate required fields
    if (!title) {
      sendErrorResponse(res, 400, "Title is required");
      return;
    }

    // If lessonId is provided, check if lesson exists
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: String(lessonId) },
      });

      if (!lesson) {
        sendErrorResponse(res, 404, "Lesson not found");
        return;
      }
    }

    // Create quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: String(title),
        description: description ? String(description) : null,
        timeLimit: timeLimit ?? null,
        passingScore: passingScore ?? 70,
        ecoPoints: ecoPoints ?? 20,
        lessonId: lessonId ? String(lessonId) : null,
      },
      include: QUIZ_SUMMARY_INCLUDE,
    });

    sendSuccessResponse(res, 201, "Quiz created successfully", quiz);
  } catch (error) {
    if (handleValidationError(res, error)) return;
    console.error("Create quiz error:", error);
    sendErrorResponse(res, 500, "Failed to create quiz");
  }
};

/**
 * Get all quizzes with pagination
 * GET /quizzes
 */
export const getAllQuizzes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page, limit, skip } = parseBoundedPagination(req.query.page, req.query.limit, 10, 50);
    const lessonId = req.query.lessonId as string;
    const search = req.query.search as string;

    // Build where clause
    const where: Prisma.QuizWhereInput = { isActive: true };
    if (lessonId) {
      where.lessonId = lessonId;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [quizzes, totalCount] = await Promise.all([
      prisma.quiz.findMany({
        where,
        skip,
        take: limit,
        include: QUIZ_SUMMARY_INCLUDE,
        orderBy: { createdAt: "desc" },
      }),
      prisma.quiz.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(res, 200, "Quizzes retrieved successfully", {
      quizzes,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all quizzes error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve quizzes");
  }
};

/**
 * Get a single quiz by ID
 * GET /quizzes/:id
 * Public; answer keys are only included for educators.
 */
export const getQuizById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Quiz ID is required");
      return;
    }

    const includeAnswers = isEducator(req.user);

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        ...QUIZ_SUMMARY_INCLUDE,
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            question: true,
            type: true,
            options: true,
            points: true,
            order: true,
            correctAnswer: includeAnswers,
            explanation: includeAnswers,
          },
        },
      },
    });

    if (!quiz || (!quiz.isActive && !includeAnswers)) {
      sendErrorResponse(res, 404, "Quiz not found");
      return;
    }

    sendSuccessResponse(res, 200, "Quiz retrieved successfully", quiz);
  } catch (error) {
    console.error("Get quiz by ID error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve quiz");
  }
};

/**
 * Update a quiz
 * PUT /quizzes/:id
 * Teacher only
 */
export const updateQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description } = req.body ?? {};
    const timeLimit = parseOptionalInt(req.body?.timeLimit, "timeLimit", { min: 1, max: 7200 });
    const passingScore = parseOptionalInt(req.body?.passingScore, "passingScore", { min: 0, max: 100 });
    const ecoPoints = parseOptionalInt(req.body?.ecoPoints, "ecoPoints", { min: 0, max: 1000 });
    const isActive = parseOptionalBoolean(req.body?.isActive, "isActive");

    if (!id) {
      sendErrorResponse(res, 400, "Quiz ID is required");
      return;
    }

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!existingQuiz) {
      sendErrorResponse(res, 404, "Quiz not found");
      return;
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: {
        ...(title && { title: String(title) }),
        ...(description !== undefined && {
          description: description === null ? null : String(description),
        }),
        ...(timeLimit !== undefined && { timeLimit }),
        ...(passingScore != null && { passingScore }),
        ...(ecoPoints != null && { ecoPoints }),
        ...(isActive !== undefined && { isActive }),
      },
      include: QUIZ_SUMMARY_INCLUDE,
    });

    sendSuccessResponse(res, 200, "Quiz updated successfully", updatedQuiz);
  } catch (error) {
    if (handleValidationError(res, error)) return;
    console.error("Update quiz error:", error);
    sendErrorResponse(res, 500, "Failed to update quiz");
  }
};

/**
 * Delete a quiz
 * DELETE /quizzes/:id
 * Teacher only
 */
export const deleteQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Quiz ID is required");
      return;
    }

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
    });

    if (!existingQuiz) {
      sendErrorResponse(res, 404, "Quiz not found");
      return;
    }

    // Attempts are student history; keep them and deactivate instead.
    if (existingQuiz._count.attempts > 0) {
      sendErrorResponse(
        res,
        409,
        "Cannot delete quiz with existing attempts. Deactivate instead."
      );
      return;
    }

    // The schema has no ON DELETE CASCADE for questions, so remove them first.
    await prisma.$transaction([
      prisma.quizQuestion.deleteMany({ where: { quizId: id } }),
      prisma.quiz.delete({ where: { id } }),
    ]);

    sendSuccessResponse(res, 200, "Quiz deleted successfully");
  } catch (error) {
    console.error("Delete quiz error:", error);
    sendErrorResponse(res, 500, "Failed to delete quiz");
  }
};

/**
 * Add question to quiz
 * POST /quizzes/:id/questions
 * Teacher only
 */
export const addQuestionToQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { question, correctAnswer, explanation } = req.body ?? {};
    const type = parseQuestionType(req.body?.type);
    const options = parseOptions(req.body?.options);
    const points = parseOptionalInt(req.body?.points, "points", { min: 1, max: 100 });
    const order = parseOptionalInt(req.body?.order, "order", { min: 0 });

    if (!id || !question || correctAnswer === undefined || correctAnswer === "") {
      sendErrorResponse(res, 400, "Quiz ID, question, and correct answer are required");
      return;
    }

    // Check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      sendErrorResponse(res, 404, "Quiz not found");
      return;
    }

    // Get the next order number if not provided
    let questionOrder = order ?? null;
    if (questionOrder === null) {
      const lastQuestion = await prisma.quizQuestion.findFirst({
        where: { quizId: id },
        orderBy: { order: "desc" },
      });
      questionOrder = lastQuestion ? lastQuestion.order + 1 : 1;
    }

    // Create question
    const newQuestion = await prisma.quizQuestion.create({
      data: {
        quizId: id,
        question: String(question),
        type: type ?? QuestionType.MULTIPLE_CHOICE,
        ...(options !== undefined && { options }),
        correctAnswer: String(correctAnswer),
        explanation: explanation ? String(explanation) : null,
        points: points ?? 1,
        order: questionOrder,
      },
    });

    sendSuccessResponse(res, 201, "Question added to quiz successfully", newQuestion);
  } catch (error) {
    if (handleValidationError(res, error)) return;
    console.error("Add question to quiz error:", error);
    sendErrorResponse(res, 500, "Failed to add question to quiz");
  }
};

/**
 * Update question in quiz
 * PUT /quizzes/:quizId/questions/:questionId
 * Teacher only
 */
export const updateQuestionInQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { quizId, questionId } = req.params;
    const { question, correctAnswer, explanation } = req.body ?? {};
    const type = parseQuestionType(req.body?.type);
    const options = parseOptions(req.body?.options);
    const points = parseOptionalInt(req.body?.points, "points", { min: 1, max: 100 });
    const order = parseOptionalInt(req.body?.order, "order", { min: 0 });

    if (!quizId || !questionId) {
      sendErrorResponse(res, 400, "Quiz ID and question ID are required");
      return;
    }

    // Check the question exists *and* belongs to this quiz
    const existingQuestion = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
    });

    if (!existingQuestion || existingQuestion.quizId !== quizId) {
      sendErrorResponse(res, 404, "Question not found");
      return;
    }

    // Update question
    const updatedQuestion = await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        ...(question && { question: String(question) }),
        ...(type && { type }),
        ...(options !== undefined && { options }),
        ...(correctAnswer !== undefined &&
          correctAnswer !== "" && { correctAnswer: String(correctAnswer) }),
        ...(explanation !== undefined && {
          explanation: explanation === null ? null : String(explanation),
        }),
        ...(points != null && { points }),
        ...(order != null && { order }),
      },
    });

    sendSuccessResponse(res, 200, "Question updated successfully", updatedQuestion);
  } catch (error) {
    if (handleValidationError(res, error)) return;
    console.error("Update question error:", error);
    sendErrorResponse(res, 500, "Failed to update question");
  }
};

/**
 * Delete question from quiz
 * DELETE /quizzes/:quizId/questions/:questionId
 * Teacher only
 */
export const deleteQuestionFromQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { quizId, questionId } = req.params;

    if (!quizId || !questionId) {
      sendErrorResponse(res, 400, "Quiz ID and question ID are required");
      return;
    }

    const existingQuestion = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
      include: { _count: { select: { answers: true } } },
    });

    if (!existingQuestion || existingQuestion.quizId !== quizId) {
      sendErrorResponse(res, 404, "Question not found");
      return;
    }

    if (existingQuestion._count.answers > 0) {
      sendErrorResponse(
        res,
        409,
        "This question has already been answered by students and cannot be deleted. Deactivate the quiz instead."
      );
      return;
    }

    await prisma.quizQuestion.delete({
      where: { id: questionId },
    });

    sendSuccessResponse(res, 200, "Question deleted successfully");
  } catch (error) {
    console.error("Delete question error:", error);
    sendErrorResponse(res, 500, "Failed to delete question");
  }
};

/**
 * Submit quiz attempt
 * POST /quizzes/:id/attempt
 * Student only
 */
export const submitQuizAttempt = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      sendErrorResponse(res, 401, "Unauthorized request");
      return;
    }

    if (!id || !Array.isArray(req.body?.answers)) {
      sendErrorResponse(res, 400, "Quiz ID and answers array are required");
      return;
    }

    const answers = sanitizeAnswers(req.body.answers);
    const timeSpent = parseOptionalInt(req.body?.timeSpent, "timeSpent", { min: 0, max: 86_400 });

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!quiz || !quiz.isActive) {
      sendErrorResponse(res, 404, "Quiz not found");
      return;
    }

    if (quiz.questions.length === 0) {
      sendErrorResponse(res, 400, "This quiz has no questions yet");
      return;
    }

    const student = await prisma.student.findUnique({
      where: { userId: req.user.id },
    });

    if (!student) {
      sendErrorResponse(
        res,
        403,
        "Join your school first to take quizzes and earn eco-points"
      );
      return;
    }

    const { questionAnswers, totalPoints, score, isPassed } =
      quizzesService.evaluateAttempt(quiz.questions, answers, quiz.passingScore);

    const { attempt, ecoPointsAwarded, progress } = await prisma.$transaction(async (tx) => {
      // Eco-points are awarded for the first pass only, so a quiz can't be
      // farmed by resubmitting it.
      const previousPass = await tx.quizAttempt.findFirst({
        where: { quizId: id, studentId: student.id, isPassed: true },
        select: { id: true },
      });

      const createdAttempt = await tx.quizAttempt.create({
        data: {
          studentId: student.id,
          quizId: id,
          score,
          totalPoints,
          isPassed,
          timeSpent: timeSpent ?? null,
          answers: {
            create: questionAnswers,
          },
        },
        include: {
          answers: {
            include: {
              question: true,
            },
          },
        },
      });

      const pointsToAward = isPassed && !previousPass ? quiz.ecoPoints : 0;
      const updatedProgress = await recordActivity(tx, student.id, pointsToAward);

      return {
        attempt: createdAttempt,
        ecoPointsAwarded: pointsToAward,
        progress: updatedProgress,
      };
    });

    sendSuccessResponse(res, 201, "Quiz attempt submitted successfully", {
      attempt,
      score,
      isPassed,
      ecoPointsAwarded,
      progress,
    });
  } catch (error) {
    if (handleValidationError(res, error)) return;
    console.error("Submit quiz attempt error:", error);
    sendErrorResponse(res, 500, "Failed to submit quiz attempt");
  }
};

/**
 * Get quiz attempts for a student
 * GET /quizzes/:id/attempts
 * Student only
 */
export const getQuizAttempts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      sendErrorResponse(res, 401, "Unauthorized request");
      return;
    }

    if (!id) {
      sendErrorResponse(res, 400, "Quiz ID is required");
      return;
    }

    const student = await prisma.student.findUnique({
      where: { userId: req.user.id },
    });

    if (!student) {
      sendSuccessResponse(res, 200, "Quiz attempts retrieved successfully", []);
      return;
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quizId: id,
        studentId: student.id,
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
    });

    sendSuccessResponse(res, 200, "Quiz attempts retrieved successfully", attempts);
  } catch (error) {
    console.error("Get quiz attempts error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve quiz attempts");
  }
};
