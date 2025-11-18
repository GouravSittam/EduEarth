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
      gradient: "from-purple-400 via-pink-500 to-red-500",
    },
    {
      image: "/study12.png",
      title: "Students Learn & Play",
      description:
        "Students explore modules, play quizzes, debates & challenges.",
      altText: "Study Illustration",
      gradient: "from-cyan-400 via-blue-500 to-indigo-500",
    },
    {
      image: "/trophy.png",
      title: "Earn & Impact",
      description: "Collect streaks, badges & real-world rewards for students.",
      altText: "Trophy Illustration",
      gradient: "from-yellow-400 via-orange-500 to-red-500",
    },
  ];

  return (
    <motion.section
      id="missions"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-400 via-emerald-500 to-blue-600 px-4 sm:px-6"
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 left-10 w-40 h-40 bg-pink-400 rounded-full opacity-20 blur-3xl"
      />

      {/* Fixed Header with Enhanced Styling */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30"
      >
        <motion.h1
          whileHover={{ scale: 1.08, rotate: [-1, 1, -1, 0] }}
          className="text-black font-bold text-xl sm:text-2xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 px-6 py-3 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer"
        >
          🚀 How It Works
        </motion.h1>
      </motion.div>

      {/* Slides Container */}
      <div className="w-full h-full mx-auto mt-5 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 300, rotateY: 45 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -300, rotateY: -45 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="min-w-full flex flex-col items-center justify-center pt-28 sm:pt-32 rounded-lg text-black space-y-8"
          >
            {/* Image Container with Gradient Background */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                type: "spring" as const,
                stiffness: 150,
              }}
              className={`relative p-8 rounded-3xl bg-gradient-to-br ${slides[current].gradient} shadow-2xl border-4 border-black`}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,255,255,0.3)",
                    "0 0 40px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-3xl"
              />
              <motion.img
                whileHover={{
                  scale: 1.15,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 },
                }}
                src={slides[current].image}
                alt={slides[current].altText}
                className="w-44 h-44 sm:w-60 sm:h-60 relative z-10 drop-shadow-2xl cursor-pointer"
              />
            </motion.div>

            {/* Content Card with Enhanced Styling */}
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
              whileHover={{
                scale: 1.03,
                y: -5,
              }}
              className="w-full max-w-2xl relative"
            >
              {/* Decorative corner elements */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-black rounded-tl-lg" />
              <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-black rounded-tr-lg" />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-black rounded-bl-lg" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-black rounded-br-lg" />

              <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 border-4 border-black p-6 sm:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 space-y-5 rounded-2xl">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-12 bg-black rounded-full" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
                    {slides[current].title}
                  </h2>
                </motion.div>
                <motion.p
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-base sm:text-lg text-black leading-relaxed pl-5"
                >
                  {slides[current].description}
                </motion.p>

                {/* Progress indicator */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="h-2 bg-black rounded-full mt-4"
                  style={{ width: `${((current + 1) / 3) * 100}%` }}
                />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows with Enhanced Design */}
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ scale: 1.2, x: -8, rotate: -15 }}
          whileTap={{ scale: 0.85 }}
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-300 to-yellow-400 text-black text-3xl sm:text-4xl font-bold p-3 sm:p-4 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 z-30 cursor-pointer"
          aria-label="Previous slide"
        >
          ◀
        </motion.button>
        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ scale: 1.2, x: 8, rotate: 15 }}
          whileTap={{ scale: 0.85 }}
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-300 to-yellow-400 text-black text-3xl sm:text-4xl font-bold p-3 sm:p-4 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 z-30 cursor-pointer"
          aria-label="Next slide"
        >
          ▶
        </motion.button>
      </div>

      {/* Enhanced Dots Navigation */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="flex space-x-4 mt-8 justify-center items-center"
      >
        {[0, 1, 2].map((index) => (
          <motion.button
            key={index}
            onClick={() => setCurrent(index)}
            whileHover={{ scale: 1.5, y: -5 }}
            whileTap={{ scale: 0.9 }}
            className={`relative transition-all duration-300 cursor-pointer ${
              index === current ? "w-12 h-5" : "w-5 h-5"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`w-full h-full rounded-full border-3 border-black transition-all duration-300 ${
                index === current
                  ? "bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            />
            {index === current && (
              <motion.div
                layoutId="activeDot"
                className="absolute inset-0 rounded-full bg-yellow-400"
                style={{ zIndex: -1 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Enhanced CTA Button */}
      <motion.button
        initial={{ y: 50, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 1.4, type: "spring" }}
        whileHover={{
          scale: 1.08,
          y: -5,
          boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)",
        }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 text-black text-base sm:text-lg font-bold px-8 py-4 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 z-20 cursor-pointer group"
      >
        <span className="flex items-center gap-3">
          🎓 Explore a Module
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-xl"
          >
            ▶
          </motion.span>
        </span>
      </motion.button>
    </motion.section>
  );
}
