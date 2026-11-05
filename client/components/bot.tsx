"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bot, Leaf, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { assistantApi, server } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

/**
 * "Eco", EduEarth's AI guide.
 *
 * All model calls go through the EduEarth API (`/assistant/chat`), which holds
 * the API key server-side and applies rate limits. The browser never sees a key.
 */

const SUGGESTIONS = [
  "How do I earn eco-points?",
  "Why are coral reefs dying?",
  "3 ways to save water at school",
  "How does Eco Sprint work?",
];

const MAX_HISTORY = 12;

const pixelFont = { fontFamily: '"Press Start 2P", system-ui, sans-serif' };
const readableFont = {
  fontFamily: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
};

const BotComponent: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only show the launcher if the server has the assistant configured.
  useEffect(() => {
    let active = true;
    server
      .get<{ enabled: boolean }>("/assistant/status")
      .then((response) => {
        if (active) setEnabled(Boolean(response.data?.enabled));
      })
      .catch(() => {
        if (active) setEnabled(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? inputMessage).trim();
    if (!content || isLoading) return;

    const history: ChatMessage[] = [
      ...messages,
      { role: "user" as const, content },
    ].slice(-MAX_HISTORY);

    setMessages(history);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await assistantApi.chat(history);
      const reply = response.data?.reply;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            reply?.content ?? "Sorry, I couldn't come up with an answer.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!enabled) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="eco-chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Eco, the EduEarth AI assistant"
            className="flex h-[min(32rem,calc(100dvh-7rem))] w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[1.5rem] border-4 border-black bg-[#fffbea] shadow-[8px_8px_0_#000]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b-4 border-black bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-black bg-yellow-300 shadow-[0_3px_0_#000]">
                  <Leaf className="h-5 w-5 text-black" />
                </span>
                <div>
                  <p className="text-[0.7rem] text-black" style={pixelFont}>
                    ECO
                  </p>
                  <p className="text-xs text-black/75" style={readableFont}>
                    Your planet-smart guide
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white text-black transition hover:bg-yellow-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/30"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={chatRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
              style={readableFont}
              aria-live="polite"
            >
              {messages.length === 0 ? (
                <div className="space-y-4 text-center">
                  <div className="mx-auto mt-2 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-black bg-yellow-300 shadow-[0_4px_0_#000]">
                    <Bot className="h-7 w-7 text-black" />
                  </div>
                  <p className="text-sm leading-6 text-black/80">
                    Hi! I&apos;m Eco 🌱 Ask me about climate, nature, recycling
                    — or how to get around EduEarth.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => void sendMessage(suggestion)}
                        className="rounded-full border-2 border-black bg-white px-3 py-1.5 text-xs text-black shadow-[0_2px_0_#000] transition hover:-translate-y-0.5 hover:bg-green-100"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl border-2 border-black px-3 py-2 text-sm leading-6 shadow-[0_3px_0_#000] ${
                        msg.role === "user"
                          ? "rounded-br-sm bg-yellow-300 text-black"
                          : "rounded-bl-sm bg-white text-black"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm border-2 border-black bg-white px-3 py-2 text-sm text-black shadow-[0_3px_0_#000]">
                    <Sparkles className="h-4 w-4 animate-pulse text-green-600" />
                    Eco is thinking…
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
              className="flex gap-2 border-t-4 border-black bg-white px-3 py-3"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask Eco anything green…"
                aria-label="Message Eco"
                value={inputMessage}
                maxLength={2000}
                onChange={(e) => setInputMessage(e.target.value)}
                className="min-w-0 flex-1 rounded-xl border-2 border-black bg-[#fffbea] px-3 py-2 text-sm text-black placeholder:text-black/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400/60"
                style={readableFont}
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={!inputMessage.trim() || isLoading}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-green-400 text-black shadow-[0_3px_0_#000] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? "Close Eco assistant" : "Open Eco assistant"}
        aria-expanded={isOpen}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-black bg-yellow-300 shadow-[0_6px_0_#000] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-500"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-black" />
        ) : (
          <Bot className="h-6 w-6 text-black" />
        )}
      </motion.button>
    </div>
  );
};

export default BotComponent;
