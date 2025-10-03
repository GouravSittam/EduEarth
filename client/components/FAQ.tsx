"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(2);

  const faqs = [
    { id: 1, question: "What is this platform about?", answer: "" },
    {
      id: 2,
      question: "How long does it take to see results?",
      answer:
        "It depends on the campaign type and your business goals. While some paid ads can show results in days, organic strategies like SEO or content marketing may take a few months.",
    },
    { id: 3, question: "Is there a free trial available?", answer: "" },
    { id: 4, question: "How secure is the platform?", answer: "" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-yellow-400 flex flex-col items-center justify-start p-8 relative overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

      {/* Tag */}
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring" as const,
            stiffness: 200,
          }}
          whileHover={{ scale: 1.05 }}
          className="bg-yellow-300 w-25 mx-auto px-auto flex justifycontent-center border border-black text-black px-4 py-1 rounded-lg font-medium mb-6"
        >
          FAQs
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-3xl md:text-4xl font-bold text-blue-700 text-center mb-4"
        >
          Frequently Asked Question
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-black text-center max-w-2xl mb-10 text-xl"
          style={{ fontFamily: "poppines" }}
        >
          As we couldn't find anything on the market that checked those boxes,
          we decided to build our own recruiting software. Our tool is easy to
          set up.
        </motion.p>
      </div>

      {/* FAQ List */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative text-xl z-10 w-full max-w-3xl space-y-6"
        style={{ fontFamily: "poppines" }}
      >
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
          >
            <motion.div
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              className="flex items-center justify-between cursor-pointer p-2 rounded-lg transition-colors"
              onClick={() => setOpen(open === faq.id ? null : faq.id)}
            >
              <div className="flex items-center space-x-4">
                <motion.span
                  whileHover={{ scale: 1.2, color: "#1d4ed8" }}
                  className="text-3xl font-bold text-gray-300"
                >
                  {String(faq.id).padStart(2, "0")}
                </motion.span>
                <span className="text-lg font-bold text-black">
                  {faq.question}
                </span>
              </div>
              <motion.div
                animate={{ rotate: open === faq.id ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-black"
              >
                +
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {faq.answer && open === faq.id && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mt-2 ml-14 text-black text-sm max-w-2xl overflow-hidden"
                >
                  {faq.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* Button */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="relative z-10 mt-12"
      >
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          <span>View all</span>
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-blue-600 font-bold"
          >
            →
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
