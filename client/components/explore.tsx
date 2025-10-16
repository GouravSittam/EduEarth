"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ElectricBorder from "./ElectricBorder";

const categories = [
  "All",
  "Climate",
  "Weather",
  "Energy",
  "Biodiversity",
  "Pollution",
  "Sustainability",
  "Global Environmental",
];

const modules = [
  {
    title: "Floods & Droughts Explained",
    description: "Why too much or too little rain changes lives?",
    duration: "15 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Climate",
  },
  {
    title: "Solar Energy Basics",
    description: "How solar power is changing the world.",
    duration: "12 min",
    chapters: 2,
    missions: 1,
    image: "/study.jpg",
    category: "Energy",
  },
  {
    title: "Biodiversity Matters",
    description: "Why protecting species is important.",
    duration: "10 min",
    chapters: 2,
    missions: 2,
    image: "/study.jpg",
    category: "Biodiversity",
  },
  {
    title: "Pollution Solutions",
    description: "Ways to reduce pollution in daily life.",
    duration: "8 min",
    chapters: 1,
    missions: 1,
    image: "/study.jpg",
    category: "Pollution",
  },
  {
    title: "Sustainability Steps",
    description: "Simple actions for a greener future.",
    duration: "14 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Sustainability",
  },
];

export default function ExploreModule() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(0);

  // Filter modules by category
  const filteredModules =
    activeCategory === "All"
      ? modules
      : modules.filter((mod) => mod.category === activeCategory);

  // Pagination
  const cardsPerPage = 4;
  const totalPages = Math.ceil(filteredModules.length / cardsPerPage);

  // Current visible set
  const visibleModules = filteredModules.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage
  );

  // Reset page when category changes
  React.useEffect(() => {
    setPage(0);
  }, [activeCategory]);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <motion.section
      id="modules"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen"
    >
      <div
        className="relative pt-30 flex h-200px w-full flex-col items-center justify-center bg-cover bg-center px-4 py-10 text-center md:px-6"
        style={{
          fontFamily: '"Press Start 2P", system-ui, sans-serif',
          backgroundImage: "url('/herobackground.jpg')",
        }}
      >
        {/* Dark overlay (below content) */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center pt-8 sm:pt-10 md:pt-12 pb-2 relative px-4"
        >
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-400 px-4 py-2 sm:px-6 sm:py-3 md:px-8 rounded text-lg sm:text-xl md:text-2xl lg:text-3xl text-black font-bold tracking-widest text-center"
            
          >
            Explore Modules
          </motion.h1>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 bg-yellow-400 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg mx-auto w-fit mt-6 sm:mt-8 mb-6 sm:mb-8 z-2"
        >
          {categories.map((cat, index) => (
            <motion.button
              key={cat}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: 0.6 + index * 0.1,
                type: "spring" as const,
                stiffness: 200,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 rounded-full font-bold text-xs sm:text-sm md:text-base lg:text-lg transition ${
                activeCategory === cat
                  ? "bg-black text-yellow-400"
                  : "bg-yellow-400 text-black"
              }`}
              
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Module Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative w-full flex items-center justify-center"
        >
          {/* Prev Arrow */}
          <motion.button
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            disabled={page === 0}
            className={`absolute left-0 z-10 top-1/2 -translate-y-1/2 bg-yellow-400 text-black rounded-full p-3 shadow-lg font-bold text-2xl transition ${
              page === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-yellow-300"
            }`}
          >
            &#8592;
          </motion.button>

          {/* Cards Row */}
          <motion.div className="flex pb-20 sm:pb-32 md:pb-40 flex-row gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 w-full justify-center transition-all duration-700 ease-in-out min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
            <AnimatePresence mode="wait">
              {visibleModules.map((mod, idx) => (
                <ElectricBorder
                  key={`${activeCategory}-${page}-${idx}`}
                  color="#FFD400"
                  speed={1.2}
                  chaos={1.1}
                  thickness={2}
                  className="rounded-2xl sm:rounded-3xl w-64 sm:w-72 md:w-80 min-w-64 sm:min-w-72 md:min-w-80 flex-shrink-0"
                >
                <motion.div
                  key={`${activeCategory}-${page}-${idx}`}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.9 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.1,
                    type: "spring" as const,
                    stiffness: 100,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                    transition: { duration: 0.3 },
                  }}
                  className="text-black rounded-2xl sm:rounded-3xl overflow-hidden bg-yellow-400 shadow-lg flex flex-col"
                >
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} className="w-full h-32 sm:h-36 md:h-40 relative">
                    <Image
                      src={mod.image}
                      alt={mod.title}
                      fill
                      priority={false}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </motion.div>
                  <div
                    className="p-4 sm:p-5 md:p-6 flex flex-col justify-between h-full"
                  >
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                      className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 tracking-widest"
                      
                    >
                      {mod.title}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                      className="mb-3 sm:mb-4 text-black text-sm sm:text-base"
                    >
                      {mod.description}
                    </motion.p>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                      className="mb-3 sm:mb-4 text-xs text-black space-y-1"
                    >
                      <div>🕒 Duration - {mod.duration}</div>
                      <div>📚 Chapters - {mod.chapters}</div>
                      <div>🎯 Missions - {mod.missions}</div>
                    </motion.div>
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#1a1a1a",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-black text-yellow-400 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 rounded-full font-bold text-xs sm:text-sm md:text-base flex items-center gap-1 sm:gap-2 w-fit"
                    >
                      Start Module
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        &#9654;
                      </motion.span>
                    </motion.button>
                  </div>
                </motion.div>
                </ElectricBorder>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Next Arrow */}
          <motion.button
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            disabled={page >= totalPages - 1}
            className={`absolute right-0 z-10 top-1/2 -translate-y-1/2 bg-yellow-400 text-black rounded-full p-3 shadow-lg font-bold text-2xl transition ${
              page >= totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-yellow-300"
            }`}
          >
            &#8594;
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
