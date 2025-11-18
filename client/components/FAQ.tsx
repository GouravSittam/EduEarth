"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(1);

  const faqs = [
    {
      id: 1,
      question: "What is EduEarth all about?",
      answer:
        "EduEarth is an innovative educational platform that uses AI to create engaging environmental learning modules from real-world news and scientific reports. Students learn through interactive games, quizzes, and challenges while earning rewards for their progress.",
      icon: "🌍",
    },
    {
      id: 2,
      question: "How does the AI-powered learning work?",
      answer:
        "Our AI analyzes current environmental news, research papers, and government advisories to automatically generate relevant, up-to-date learning modules. This ensures students always learn from the latest real-world developments in environmental science.",
      icon: "🤖",
    },
    {
      id: 3,
      question: "What rewards can students earn?",
      answer:
        "Students collect streaks for daily learning, unlock achievement badges for completing modules, earn XP points, and can compete on leaderboards. Top performers receive recognition and special incentives to encourage continuous learning.",
      icon: "🏆",
    },
    {
      id: 4,
      question: "Is the platform suitable for all ages?",
      answer:
        "Yes! EduEarth is designed for students of various age groups with adaptive difficulty levels. Teachers can customize content for their specific classroom needs, making it perfect for middle school through high school students.",
      icon: "👨‍🎓",
    },
    {
      id: 5,
      question: "How can teachers track student progress?",
      answer:
        "Teachers have access to comprehensive dashboards showing individual and class-wide progress, completion rates, quiz scores, and engagement metrics. They can create custom assignments and monitor learning outcomes in real-time.",
      icon: "📊",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 flex flex-col items-center justify-start p-6 sm:p-8 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 90, 180],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, -90, -180],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 left-10 w-48 h-48 bg-green-400 rounded-full opacity-20 blur-3xl"
      />

      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Tag */}
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            type: "spring" as const,
            stiffness: 200,
          }}
          whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
          className="bg-gradient-to-r from-white to-yellow-100 mx-auto flex items-center justify-center border-4 border-black text-black px-6 py-2 rounded-xl font-bold mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer"
        >
          ❓ FAQs
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="text-4xl md:text-5xl font-bold text-black text-center mb-6 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.5)]"
        >
          Frequently Asked Questions
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-black text-center max-w-2xl mb-12 text-lg sm:text-xl leading-relaxed px-4"
        >
          Got questions? We've got answers! Find everything you need to know
          about EduEarth's AI-powered environmental learning platform.
        </motion.p>
      </div>

      {/* FAQ List */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative z-10 w-full max-w-4xl space-y-4 px-4"
      >
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ x: -50, opacity: 0, scale: 0.95 }}
            whileInView={{ x: 0, opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.9 + index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
            className="group"
          >
            <motion.div
              whileHover={{
                scale: 1.02,
                y: -2,
              }}
              className={`bg-white border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 overflow-hidden ${
                open === faq.id
                  ? "bg-gradient-to-br from-white to-yellow-50"
                  : ""
              }`}
            >
              <div
                className="flex items-center justify-between cursor-pointer p-5 sm:p-6"
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl flex-shrink-0"
                  >
                    {faq.icon}
                  </motion.div>
                  <div className="flex items-center gap-3 flex-1">
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className="text-2xl sm:text-3xl font-bold text-yellow-500 flex-shrink-0"
                    >
                      {String(faq.id).padStart(2, "0")}
                    </motion.span>
                    <span className="text-base sm:text-lg font-bold text-black">
                      {faq.question}
                    </span>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: open === faq.id ? 45 : 0 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.2 }}
                  className="text-3xl font-bold text-black bg-yellow-400 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 ml-2 cursor-pointer"
                >
                  +
                </motion.div>
              </div>

              <AnimatePresence>
                {open === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="px-5 sm:px-6 pb-6 pt-2"
                    >
                      <div className="ml-0 sm:ml-16 pl-4 border-l-4 border-yellow-400">
                        <p className="text-black text-sm sm:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Button */}
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.8 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 1.6, type: "spring" }}
        className="relative z-10 mt-12"
      >
        <motion.button
          whileHover={{
            scale: 1.08,
            y: -3,
            boxShadow: "10px 10px 0px 0px rgba(0,0,0,1)",
          }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer group"
        >
          <span>View All FAQs</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-blue-600 font-bold text-xl group-hover:bg-yellow-400 transition-colors duration-300"
          >
            →
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
