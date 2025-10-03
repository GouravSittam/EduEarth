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
    const { title, description, timeLimit, passingScore, ecoPoints, lessonId } = req.body;

    // Validate required fields
    if (!title) {
      sendErrorResponse(res, 400, "Title is required");
      return;
    }

    // If lessonId is provided, check if lesson exists
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
      });

      if (!lesson) {
        sendErrorResponse(res, 404, "Lesson not found");
        return;
      }
    }

    // Create quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        timeLimit,
        passingScore: passingScore || 70,
        ecoPoints: ecoPoints || 20,
        lessonId,
      },
      include: {
        lesson: {
          select: { id: true, title: true, module: { select: { title: true } } },
        },
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
    });

    sendSuccessResponse(res, 201, "Quiz created successfully", quiz);
  } catch (error) {
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const lessonId = req.query.lessonId as string;
    const search = req.query.search as string;

    // Build where clause
    const where: any = { isActive: true };
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
        include: {
          lesson: {
            select: { id: true, title: true, module: { select: { title: true } } },
          },
          _count: {
            select: {
              questions: true,
              attempts: true,
            },
          },
        },
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

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        lesson: {
          select: { id: true, title: true, module: { select: { title: true } } },
        },
        questions: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
    });

    if (!quiz) {
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
    const { title, description, timeLimit, passingScore, ecoPoints, isActive } = req.body;

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
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(timeLimit !== undefined && { timeLimit }),
        ...(passingScore !== undefined && { passingScore }),
        ...(ecoPoints !== undefined && { ecoPoints }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        lesson: {
          select: { id: true, title: true, module: { select: { title: true } } },
        },
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
    });

    sendSuccessResponse(res, 200, "Quiz updated successfully", updatedQuiz);
  } catch (error) {
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

    // Check if quiz has attempts
    if (existingQuiz._count.attempts > 0) {
      sendErrorResponse(
        res,
        400,
        "Cannot delete quiz with existing attempts. Deactivate instead."
      );
      return;
    }

    // Delete the quiz (this will cascade delete questions and answers)
    await prisma.quiz.delete({
      where: { id },
    });

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
    const { question, type, options, correctAnswer, explanation, points, order } = req.body;

    if (!id || !question || !correctAnswer) {
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
    let questionOrder = order;
    if (!questionOrder) {
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
        question,
        type: type || "MULTIPLE_CHOICE",
        options: options ? JSON.parse(JSON.stringify(options)) : null,
        correctAnswer,
        explanation,
        points: points || 1,
        order: questionOrder,
      },
    });

    sendSuccessResponse(res, 201, "Question added to quiz successfully", newQuestion);
  } catch (error) {
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
    const { question, type, options, correctAnswer, explanation, points, order } = req.body;

    if (!quizId || !questionId) {
      sendErrorResponse(res, 400, "Quiz ID and question ID are required");
      return;
    }

    // Check if question exists
    const existingQuestion = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
    });

    if (!existingQuestion) {
      sendErrorResponse(res, 404, "Question not found");
      return;
    }

    // Update question
    const updatedQuestion = await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        ...(question && { question }),
        ...(type && { type }),
        ...(options !== undefined && { options: options ? JSON.parse(JSON.stringify(options)) : null }),
        ...(correctAnswer && { correctAnswer }),
        ...(explanation !== undefined && { explanation }),
        ...(points !== undefined && { points }),
        ...(order !== undefined && { order }),
      },
    });

    sendSuccessResponse(res, 200, "Question updated successfully", updatedQuestion);
  } catch (error) {
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

    // Check if question exists
    const existingQuestion = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
    });

    if (!existingQuestion) {
      sendErrorResponse(res, 404, "Question not found");
      return;
    }

    // Delete question (this will cascade delete answers)
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
    const { answers } = req.body;
    const studentId = req.user?.id; // Assuming user is student

    if (!id || !answers || !Array.isArray(answers)) {
      sendErrorResponse(res, 400, "Quiz ID and answers array are required");
      return;
    }

    // Check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      sendErrorResponse(res, 404, "Quiz not found");
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

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    const questionAnswers = [];

    for (const question of quiz.questions) {
      totalPoints += question.points;
      
      const answer = answers.find(a => a.questionId === question.id);
      const isCorrect = answer && answer.answer === question.correctAnswer;
      
      if (isCorrect) {
        earnedPoints += question.points;
      }

      questionAnswers.push({
        questionId: question.id,
        answer: answer?.answer || "",
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0,
      });
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const isPassed = score >= quiz.passingScore;

    // Create attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        studentId: student.id,
        quizId: id,
        score,
        totalPoints,
        isPassed,
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

    // Award eco points if passed
    if (isPassed) {
      await prisma.student.update({
        where: { id: student.id },
        data: {
          ecoPoints: {
            increment: quiz.ecoPoints,
          },
        },
      });
    }

    sendSuccessResponse(res, 201, "Quiz attempt submitted successfully", {
      attempt,
      score,
      isPassed,
      ecoPointsAwarded: isPassed ? quiz.ecoPoints : 0,
    });
  } catch (error) {
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
    const studentId = req.user?.id; // Assuming user is student

    if (!id) {
      sendErrorResponse(res, 400, "Quiz ID is required");
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
