/**
 * EduEarth eco-assistant: a thin server-side proxy to Google Gemini.
 *
 * The API key lives only on the server (GEMINI_API_KEY). The browser never
 * sees it, and every request is validated and rate limited here.
 */

export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

const DEFAULT_MODEL = "gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = 20_000;

export const ASSISTANT_LIMITS = {
  maxMessages: 20,
  maxMessageChars: 2_000,
};

const SYSTEM_PROMPT = `You are "Eco", the friendly guide inside EduEarth — a gamified environmental-education platform for school students (roughly ages 10-18) and their teachers.

What you help with:
1. Environmental science and sustainability: climate change, renewable energy, biodiversity, water, waste and recycling, pollution, conservation, green careers, and practical eco-habits.
2. Using EduEarth:
   - Home page: overview, missions and featured modules.
   - Modules: short video-based lessons (climate, energy, oceans, waste, etc.) with assignments and missions.
   - Games: "Eco Sprint" (real-time 1v1 eco quiz duel), "Eco Strike" and "Recycle Rush" (sort waste into the right bins).
   - Articles: daily environmental news with quick summaries.
   - Student dashboard: eco-points, level, daily streak, rank and leaderboard. Students earn points by completing lessons and passing quizzes (first pass only), and must join their school from the dashboard to start earning.
   - Teacher dashboard: classes, students and school statistics.

How to answer:
- Be warm, encouraging and age-appropriate. Keep answers short (under ~150 words) unless asked for more detail; use simple bullet points when helpful.
- Be scientifically accurate. If you're unsure, say so instead of guessing.
- When it fits, end with one small, practical action the student can try.
- If asked about something unrelated to the environment, sustainability or EduEarth, politely say you're EduEarth's eco guide and steer back to those topics.
- Never ask for or repeat personal information (full names, addresses, phone numbers, passwords).`;

export class AssistantError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

export const isAssistantConfigured = () => Boolean(process.env.GEMINI_API_KEY);

/** Validate untrusted chat history from the client. */
export const parseChatMessages = (input: unknown): ChatMessage[] => {
  if (!Array.isArray(input) || input.length === 0) {
    throw new AssistantError("messages must be a non-empty array", 400);
  }

  const messages = input.slice(-ASSISTANT_LIMITS.maxMessages).map((item) => {
    if (!item || typeof item !== "object") {
      throw new AssistantError("Each message must be an object", 400);
    }

    const { role, content } = item as Record<string, unknown>;

    if (role !== "user" && role !== "assistant") {
      throw new AssistantError("message role must be 'user' or 'assistant'", 400);
    }

    if (typeof content !== "string" || !content.trim()) {
      throw new AssistantError("message content must be a non-empty string", 400);
    }

    return {
      role,
      content: content.trim().slice(0, ASSISTANT_LIMITS.maxMessageChars),
    } satisfies ChatMessage;
  });

  if (messages.at(-1)?.role !== "user") {
    throw new AssistantError("The last message must come from the user", 400);
  }

  return messages;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
};

export const generateAssistantReply = async (messages: ChatMessage[]) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new AssistantError("The eco-assistant is not configured yet", 503);
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  let response: globalThis.Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 800,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ],
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    throw new AssistantError(
      timedOut ? "The eco-assistant took too long to answer" : "Could not reach the eco-assistant",
      504,
    );
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(`Gemini request failed (${response.status}): ${detail.slice(0, 500)}`);
    throw new AssistantError(
      response.status === 429
        ? "The eco-assistant is busy right now. Try again in a minute."
        : "The eco-assistant is unavailable right now",
      response.status === 429 ? 429 : 502,
    );
  }

  const data = (await response.json()) as GeminiResponse;

  if (data.promptFeedback?.blockReason) {
    return "Let's keep things friendly and on-topic! Ask me anything about the environment or how to use EduEarth. 🌱";
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  return text || "Sorry, I couldn't come up with an answer. Could you rephrase that?";
};

/**
 * Tiny fixed-window rate limiter keyed by client IP. Good enough for a single
 * instance; swap for Redis if the API is scaled horizontally.
 */
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;
const buckets = new Map<string, { count: number; resetAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, WINDOW_MS).unref();

export const consumeAssistantQuota = (key: string) => {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
};
