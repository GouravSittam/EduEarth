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
 * Create a new article
 * POST /articles
 * Admin only
 */
export const createArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      sendErrorResponse(res, 403, "Only administrators can create articles");
      return;
    }

    const { publishDate, extractedDate, url, headline, body, section, source } =
      req.body;

    // Validate required fields
    if (
      !publishDate ||
      !extractedDate ||
      !url ||
      !headline ||
      !body ||
      !section ||
      !source
    ) {
      sendErrorResponse(
        res,
        400,
        "All fields (publishDate, extractedDate, url, headline, body, section, source) are required"
      );
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      sendErrorResponse(res, 400, "Invalid URL format");
      return;
    }

    // Check if article with same URL already exists
    const existingArticle = await prisma.article.findUnique({
      where: { url },
    });

    if (existingArticle) {
      sendErrorResponse(res, 409, "Article with this URL already exists");
      return;
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        publishDate: new Date(publishDate),
        extractedDate: new Date(extractedDate),
        url,
        headline,
        body,
        section,
        source,
      },
    });

    sendSuccessResponse(res, 201, "Article created successfully", article);
  } catch (error) {
    console.error("Create article error:", error);
    sendErrorResponse(res, 500, "Failed to create article");
  }
};

/**
 * Get all articles with pagination and filtering
 * GET /articles
 */
export const getAllArticles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const section = req.query.section as string;
    const source = req.query.source as string;
    const search = req.query.search as string;
    const sortBy = (req.query.sortBy as string) || "publishDate";
    const sortOrder =
      (req.query.sortOrder as string) === "asc" ? "asc" : "desc";

    // Build where clause
    const where: any = {};
    if (section) {
      where.section = { contains: section, mode: "insensitive" };
    }
    if (source) {
      where.source = { contains: source, mode: "insensitive" };
    }
    if (search) {
      where.OR = [
        { headline: { contains: search, mode: "insensitive" } },
        { body: { contains: search, mode: "insensitive" } },
        { section: { contains: search, mode: "insensitive" } },
        { source: { contains: search, mode: "insensitive" } },
      ];
    }

    // Validate sortBy field
    const validSortFields = [
      "publishDate",
      "extractedDate",
      "createdAt",
      "updatedAt",
      "headline",
      "source",
    ];
    const orderBy: any = {};
    if (validSortFields.includes(sortBy)) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.publishDate = "desc"; // Default sort
    }

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.article.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(res, 200, "Articles retrieved successfully", {
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all articles error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve articles");
  }
};

/**
 * Get a single article by ID
 * GET /articles/:id
 */
export const getArticleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Article ID is required");
      return;
    }

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      sendErrorResponse(res, 404, "Article not found");
      return;
    }

    sendSuccessResponse(res, 200, "Article retrieved successfully", article);
  } catch (error) {
    console.error("Get article by ID error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve article");
  }
};

/**
 * Update an article
 * PUT /articles/:id
 * Admin only
 */
export const updateArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      sendErrorResponse(res, 403, "Only administrators can update articles");
      return;
    }

    const { id } = req.params;
    const { publishDate, extractedDate, url, headline, body, section, source } =
      req.body;

    if (!id) {
      sendErrorResponse(res, 400, "Article ID is required");
      return;
    }

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      sendErrorResponse(res, 404, "Article not found");
      return;
    }

    // If URL is being updated, check for duplicates
    if (url && url !== existingArticle.url) {
      try {
        new URL(url);
      } catch {
        sendErrorResponse(res, 400, "Invalid URL format");
        return;
      }

      const urlExists = await prisma.article.findUnique({
        where: { url },
      });

      if (urlExists) {
        sendErrorResponse(res, 409, "Article with this URL already exists");
        return;
      }
    }

    // Build update data
    const updateData: any = {};
    if (publishDate !== undefined)
      updateData.publishDate = new Date(publishDate);
    if (extractedDate !== undefined)
      updateData.extractedDate = new Date(extractedDate);
    if (url !== undefined) updateData.url = url;
    if (headline !== undefined) updateData.headline = headline;
    if (body !== undefined) updateData.body = body;
    if (section !== undefined) updateData.section = section;
    if (source !== undefined) updateData.source = source;

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    sendSuccessResponse(
      res,
      200,
      "Article updated successfully",
      updatedArticle
    );
  } catch (error) {
    console.error("Update article error:", error);
    sendErrorResponse(res, 500, "Failed to update article");
  }
};

/**
 * Delete an article
 * DELETE /articles/:id
 * Admin only
 */
export const deleteArticle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      sendErrorResponse(res, 403, "Only administrators can delete articles");
      return;
    }

    const { id } = req.params;

    if (!id) {
      sendErrorResponse(res, 400, "Article ID is required");
      return;
    }

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      sendErrorResponse(res, 404, "Article not found");
      return;
    }

    // Delete the article
    await prisma.article.delete({
      where: { id },
    });

    sendSuccessResponse(res, 200, "Article deleted successfully");
  } catch (error) {
    console.error("Delete article error:", error);
    sendErrorResponse(res, 500, "Failed to delete article");
  }
};

/**
 * Get articles by section
 * GET /articles/section/:section
 */
export const getArticlesBySection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { section } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!section) {
      sendErrorResponse(res, 400, "Section is required");
      return;
    }

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where: {
          section: { contains: section, mode: "insensitive" },
        },
        skip,
        take: limit,
        orderBy: { publishDate: "desc" },
      }),
      prisma.article.count({
        where: {
          section: { contains: section, mode: "insensitive" },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(
      res,
      200,
      `Articles from section '${section}' retrieved successfully`,
      {
        articles,
        section,
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
    console.error("Get articles by section error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve articles by section");
  }
};

/**
 * Get articles by source
 * GET /articles/source/:source
 */
export const getArticlesBySource = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { source } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!source) {
      sendErrorResponse(res, 400, "Source is required");
      return;
    }

    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where: {
          source: { contains: source, mode: "insensitive" },
        },
        skip,
        take: limit,
        orderBy: { publishDate: "desc" },
      }),
      prisma.article.count({
        where: {
          source: { contains: source, mode: "insensitive" },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    sendSuccessResponse(
      res,
      200,
      `Articles from source '${source}' retrieved successfully`,
      {
        articles,
        source,
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
    console.error("Get articles by source error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve articles by source");
  }
};

/**
 * Get article statistics
 * GET /articles/statistics
 */
export const getArticleStatistics = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const [totalArticles, articlesBySection, articlesBySource, recentArticles] =
      await Promise.all([
        // Total articles count
        prisma.article.count(),

        // Group by section
        prisma.article.groupBy({
          by: ["section"],
          _count: { section: true },
          orderBy: { _count: { section: "desc" } },
          take: 10,
        }),

        // Group by source
        prisma.article.groupBy({
          by: ["source"],
          _count: { source: true },
          orderBy: { _count: { source: "desc" } },
          take: 10,
        }),

        // Recent articles (last 7 days)
        prisma.article.count({
          where: {
            publishDate: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
      ]);

    const statistics = {
      overview: {
        totalArticles,
        recentArticles,
      },
      distribution: {
        bySection: articlesBySection.map((item) => ({
          section: item.section,
          count: item._count.section,
        })),
        bySource: articlesBySource.map((item) => ({
          source: item.source,
          count: item._count.source,
        })),
      },
    };

    sendSuccessResponse(
      res,
      200,
      "Article statistics retrieved successfully",
      statistics
    );
  } catch (error) {
    console.error("Get article statistics error:", error);
    sendErrorResponse(res, 500, "Failed to retrieve article statistics");
  }
};
