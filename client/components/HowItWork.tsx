"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HowItWorks() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? 2 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === 2 ? 0 : current + 1);
  };

  const slides = [
    {
      image: "/brain.png",
      title: "AI Creates Modules",
      description:
        "From real-world news, science reports & government advisories.",
      altText: "Brain Illustration",
    },
    {
      image: "/study12.png",
      title: "Students Learn & Play",
      description:
        "Students explore modules, play quizzes, debates & challenges.",
      altText: "Study Illustration",
    },
    {
      image: "/trophy.png",
      title: "Earn & Impact",
      description: "Collect streaks, badges & real-world rewards for students.",
      altText: "Trophy Illustration",
    },
  ];

  return (
    <motion.section
      id="missions"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-green-400 to-blue-500 px-4 sm:px-6"
    >
      {/* Fixed Header */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 text-black font-bold text-xl bg-yellow-400 px-4 py-2 rounded z-0"
      >
        How It Works
      </motion.h1>

      {/* Slides Container */}
      <div className="w-full h-full mx-auto mt-5 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="min-w-full flex flex-col items-center justify-center pt-28 sm:pt-32 rounded-lg text-black space-y-6"
          >
            <motion.img
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                type: "spring" as const,
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.3 },
              }}
              src={slides[current].image}
              alt={slides[current].altText}
              className="w-44 h-44 sm:w-60 sm:h-60 mb-0"
            />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              }}
              className="w-full max-w-xl bg-yellow-400 border-2 border-black p-5 sm:p-8 shadow-lg text-black space-y-4"
            >
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-xl sm:text-2xl font-bold"
              >
                {slides[current].title}
              </motion.h2>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {slides[current].description}
              </motion.p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ scale: 1.2, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black text-4xl font-bold px-3 z-20"
        >
          ◀
        </motion.button>
        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ scale: 1.2, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black text-4xl font-bold px-3 z-20"
        >
          ▶
        </motion.button>
      </div>

      {/* Dots */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="flex space-x-3 mt-6 justify-center"
      >
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            onClick={() => setCurrent(index)}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.8 }}
            className={`w-4 h-4 rounded-full cursor-pointer transition-colors duration-300 ${
              index === current ? "bg-black" : "bg-gray-400"
            }`}
          />
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        whileHover={{
          scale: 1.05,
          backgroundColor: "#FDE047",
          boxShadow: "0 8px 20px rgba(251, 191, 36, 0.4)",
        }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-2 rounded hover:scale-105 transition z-0"
      >
        Explore a Module
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          ▶
        </motion.span>
      </motion.button>
    </motion.section>
  );
}
