"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, X, Bot, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BotComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const apiKey = "AIzaSyCm6Tm_CdiyT0kGP9zPoBHa4wlmB5zjVW4";
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Topics to filter: navigation and environment-related
  const allowedTopics = [
    "navigation",
    "dashboard",
    "modules",
    "assignments",
    "missions",
    "leaderboard",
    "messages",
    "certificates",
    "settings",
    "environment",
    "climate",
    "weather",
    "energy",
    "resources",
    "solar",
    "ocean",
    "forest",
    "eco",
    "sustainable",
  ];

  const isRelevantTopic = (message: string) => {
    const lowerMessage = message.toLowerCase();
    return allowedTopics.some((topic) => lowerMessage.includes(topic));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Gemini API endpoint (use generateContent)
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
          apiKey,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: inputMessage }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 1,
              topP: 1,
              maxOutputTokens: 2048,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE",
              },
              // Add other safety settings as needed
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      let assistantContent =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";

      // Filter response if not relevant (basic check)
      if (!isRelevantTopic(inputMessage)) {
        assistantContent =
          "I'm here to help with website navigation (e.g., dashboard, modules) and environment topics (e.g., climate, energy). Ask me about those!";
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: assistantContent,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, there was an error with the API.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Position popup above the floating button
  const getPopupPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        bottom: window.innerHeight - rect.top + 10, // Above button
        right: window.innerWidth - rect.right,
      };
    }
    return { bottom: 100, right: 20 }; // Default position
  };

  if (!isOpen) {
    return (
      <motion.div
        ref={buttonRef}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{
            scale: 1.1,
            y: -2,
            boxShadow: "0 8px 0 #000",
          }}
          whileTap={{ scale: 0.9, y: 1 }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="fixed bottom-6 right-6 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-black bg-yellow-300 shadow-[0_6px_0_#000]"
          aria-label="Open AI Assistant"
        >
          <motion.svg
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-black"
          >
            <path d="M2 5a3 3 0 013-3h14a3 3 0 013 3v9a3 3 0 01-3 3H9.828L5 21.828V17H5a3 3 0 01-3-3V5z" />
          </motion.svg>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="fixed z-50"
      style={{ bottom: "100px", right: "20px" }}
    >
      {/* Floating Button - Minimize/Close */}
      <motion.div ref={buttonRef} className="mb-2" whileHover={{ scale: 1.1 }}>
        <motion.button
          onClick={() => setIsOpen(false)}
          whileHover={{
            y: -2,
            boxShadow: "0 8px 0 #000",
          }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-black bg-yellow-300 shadow-[0_6px_0_#000]"
          aria-label="Close AI Assistant"
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <X size={24} className="h-6 w-6 text-black" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Chat Popup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-4 bg-blue-600 text-white rounded-t-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Bot size={20} />
            </motion.div>
            <span className="font-semibold">AI Environment Assistant</span>
          </div>
          <motion.button
            onClick={() => setIsOpen(false)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            className="text-white hover:opacity-70"
          >
            <X size={20} />
          </motion.button>
        </motion.div>

        {/* Chat Messages */}
        <div ref={chatRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center text-gray-500 mt-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Bot size={32} className="mx-auto mb-2 opacity-50" />
                </motion.div>
                <p>Ask me about website navigation or environment topics!</p>
              </motion.div>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`mb-4 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`inline-block p-3 rounded-lg max-w-xs ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800 shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </motion.div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-left mb-4"
              >
                <div className="inline-block p-3 rounded-lg bg-white text-gray-800 shadow-sm">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="rounded-full h-4 w-4 border-b-2 border-blue-600"
                    />
                    <span>Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="p-4 border-t border-gray-200"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                <Send size={18} />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BotComponent;
