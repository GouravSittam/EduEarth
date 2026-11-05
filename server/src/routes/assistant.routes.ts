import { Router, type Request, type Response } from "express";
import { sendResponse } from "../utils/ResponseHelpers.js";
import {
  AssistantError,
  consumeAssistantQuota,
  generateAssistantReply,
  isAssistantConfigured,
  parseChatMessages,
} from "../services/assistant.service.js";

const router = Router();

const fail = (res: Response, statusCode: number, message: string) =>
  sendResponse({ res, success: false, message, error: { message }, statusCode });

/** GET /assistant/status — lets the UI hide the chat if it isn't configured. */
router.get("/status", (_req: Request, res: Response) => {
  sendResponse({ res, success: true, data: { enabled: isAssistantConfigured() } });
});

/**
 * POST /assistant/chat
 * Body: { messages: [{ role: "user" | "assistant", content: string }] }
 */
router.post("/chat", async (req: Request, res: Response) => {
  const quota = consumeAssistantQuota(req.ip ?? "unknown");

  if (!quota.allowed) {
    res.setHeader("Retry-After", String(quota.retryAfterSeconds));
    return fail(res, 429, "You're chatting fast! Take a short break and try again soon.");
  }

  try {
    const messages = parseChatMessages(req.body?.messages);
    const reply = await generateAssistantReply(messages);

    return sendResponse({
      res,
      success: true,
      data: { reply: { role: "assistant", content: reply } },
    });
  } catch (error) {
    if (error instanceof AssistantError) {
      return fail(res, error.statusCode, error.message);
    }

    console.error("Assistant chat error:", error);
    return fail(res, 500, "Something went wrong with the eco-assistant");
  }
});

export default router;
