"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ElectricBorder from "./ElectricBorder";
import { modulesData } from "@/lib/modulesData";

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

// Transform modulesData to match the component's expected format
const modules = modulesData.map((mod) => ({
  title: mod.title,
  description: mod.description,
  duration: mod.duration,
  chapters: mod.chapters,
  missions: mod.missions,
  image: "/study.jpg",
  category: mod.category,
  slug: mod.slug,
}));

/* Old module definitions removed - now using centralized modulesData from @/lib/modulesData
const oldModules = [
  // Climate Action & Mitigation
  {
    title: "Climate Change Fundamentals",
    description: "Understanding greenhouse gases and global warming impacts.",
    duration: "20 min",
    chapters: 4,
    missions: 3,
    image: "/study.jpg",
    category: "Climate",
  },
  {
    title: "Carbon Footprint Reduction",
    description: "Calculate and reduce your personal carbon emissions.",
    duration: "18 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Climate",
  },
  {
    title: "Extreme Weather Patterns",
    description: "How climate change affects floods, droughts, and storms.",
    duration: "15 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Weather",
  },
  {
    title: "Climate Adaptation Strategies",
    description: "Building resilient communities for climate challenges.",
    duration: "22 min",
    chapters: 4,
    missions: 3,
    image: "/study.jpg",
    category: "Climate",
  },

  // Renewable Energy
  {
    title: "Solar Energy Revolution",
    description: "Harness the power of the sun for clean electricity.",
    duration: "16 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Energy",
  },
  {
    title: "Wind Power Technology",
    description: "How wind turbines generate sustainable energy.",
    duration: "14 min",
    chapters: 2,
    missions: 2,
    image: "/study.jpg",
    category: "Energy",
  },
  {
    title: "Hydroelectric Systems",
    description: "Water-powered energy for sustainable communities.",
    duration: "12 min",
    chapters: 2,
    missions: 1,
    image: "/study.jpg",
    category: "Energy",
  },
  {
    title: "Energy Storage Solutions",
    description: "Batteries and grid systems for renewable energy.",
    duration: "18 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Energy",
  },

  // Biodiversity Conservation
  {
    title: "Ecosystem Protection",
    description: "Why biodiversity matters for planetary health.",
    duration: "17 min",
    chapters: 3,
    missions: 3,
    image: "/study.jpg",
    category: "Biodiversity",
  },
  {
    title: "Endangered Species Recovery",
    description: "Conservation efforts to save threatened wildlife.",
    duration: "15 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Biodiversity",
  },
  {
    title: "Habitat Restoration Projects",
    description: "Rebuilding natural environments for wildlife.",
    duration: "19 min",
    chapters: 4,
    missions: 3,
    image: "/study.jpg",
    category: "Biodiversity",
  },
  {
    title: "Ocean Conservation",
    description: "Protecting marine ecosystems and coral reefs.",
    duration: "16 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Biodiversity",
  },

  // Circular Economy & Waste Management
  {
    title: "Circular Economy Principles",
    description: "Design out waste and keep resources in use.",
    duration: "20 min",
    chapters: 4,
    missions: 3,
    image: "/study.jpg",
    category: "Sustainability",
  },
  {
    title: "Waste Reduction Strategies",
    description: "Reduce, reuse, recycle for zero waste living.",
    duration: "14 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Pollution",
  },
  {
    title: "Composting & Organic Waste",
    description: "Turn food scraps into nutrient-rich soil.",
    duration: "12 min",
    chapters: 2,
    missions: 2,
    image: "/study.jpg",
    category: "Sustainability",
  },
  {
    title: "Plastic Pollution Solutions",
    description: "Combat single-use plastics and ocean waste.",
    duration: "16 min",
    chapters: 3,
    missions: 3,
    image: "/study.jpg",
    category: "Pollution",
  },

  // Sustainable Communities
  {
    title: "Green Urban Planning",
    description: "Design cities for sustainability and livability.",
    duration: "21 min",
    chapters: 4,
    missions: 3,
    image: "/study.jpg",
    category: "Sustainability",
  },
  {
    title: "Sustainable Transportation",
    description: "Electric vehicles, bikes, and public transit solutions.",
    duration: "15 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Sustainability",
  },
  {
    title: "Community Gardens & Food Security",
    description: "Local food production for resilient communities.",
    duration: "17 min",
    chapters: 3,
    missions: 3,
    image: "/study.jpg",
    category: "Sustainability",
  },
  {
    title: "Environmental Justice",
    description: "Equity and fairness in environmental protection.",
    duration: "19 min",
    chapters: 4,
    missions: 2,
    image: "/study.jpg",
    category: "Global Environmental",
  },

  // Green Innovation & Technology
  {
    title: "Green Technology Innovation",
    description: "Cutting-edge solutions for environmental challenges.",
    duration: "18 min",
    chapters: 3,
    missions: 3,
    image: "/study.jpg",
    category: "Sustainability",
  },
  {
    title: "Smart Grid Systems",
    description: "Intelligent energy distribution for efficiency.",
    duration: "16 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Energy",
  },
  {
    title: "Sustainable Agriculture",
    description: "Farming practices that protect the environment.",
    duration: "20 min",
    chapters: 4,
    missions: 3,
    image: "/study.jpg",
    category: "Sustainability",
  },
  {
    title: "Water Conservation Tech",
    description: "Innovative solutions for water scarcity.",
    duration: "14 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Global Environmental",
  },

  // Air Quality & Pollution
  {
    title: "Air Quality Monitoring",
    description: "Understanding and measuring air pollution levels.",
    duration: "13 min",
    chapters: 2,
    missions: 2,
    image: "/study.jpg",
    category: "Pollution",
  },
  {
    title: "Indoor Air Quality",
    description: "Creating healthy living and working environments.",
    duration: "11 min",
    chapters: 2,
    missions: 1,
    image: "/study.jpg",
    category: "Pollution",
  },
  {
    title: "Industrial Emissions Control",
    description: "Technologies to reduce factory pollution.",
    duration: "17 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Pollution",
  },

  // Global Environmental Issues
  {
    title: "Deforestation & Reforestation",
    description: "Protecting forests and planting for the future.",
    duration: "18 min",
    chapters: 3,
    missions: 3,
    image: "/study.jpg",
    category: "Global Environmental",
  },
  {
    title: "Water Scarcity Solutions",
    description: "Managing freshwater resources sustainably.",
    duration: "16 min",
    chapters: 3,
    missions: 2,
    image: "/study.jpg",
    category: "Global Environmental",
  },
  {
    title: "Sustainable Development Goals",
    description: "UN SDGs for a better world by 2030.",
    duration: "22 min",
    chapters: 4,
    missions: 3,
    image: "/study.jpg",
    category: "Global Environmental",
  },
  {
    title: "Climate Policy & Advocacy",
    description: "How governments and citizens drive change.",
    duration: "19 min",
    chapters: 4,
    missions: 2,
    image: "/study.jpg",
    category: "Global Environmental",
  },
]; */

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
          initial={{ y: -40, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
          className="flex items-center justify-center pt-8 sm:pt-10 md:pt-12 pb-2 relative px-4 z-10"
        >
          <motion.h1
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-lg sm:text-xl md:text-2xl lg:text-3xl text-black font-bold tracking-widest text-center transition-all duration-300 cursor-pointer"
          >
            🎓 Explore Modules
          </motion.h1>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4, type: "spring" }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-gradient-to-br from-white to-yellow-100 border-4 border-black px-4 sm:px-6 md:px-8 py-4 sm:py-5 rounded-2xl mx-auto w-fit mt-6 sm:mt-8 mb-8 sm:mb-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-10"
        >
          {categories.map((cat, index) => (
            <motion.button
              key={cat}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: 0.6 + index * 0.08,
                type: "spring" as const,
                stiffness: 200,
              }}
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-xl font-bold text-xs sm:text-sm md:text-base transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-black to-gray-800 text-yellow-400 border-3 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(251,191,36,0.5)]"
                  : "bg-white text-black border-2 border-black hover:bg-yellow-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
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
            initial={{ x: -50, opacity: 0, rotate: -180 }}
            whileInView={{ x: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1, type: "spring" }}
            whileHover={{ scale: 1.15, x: -5, rotate: -15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            disabled={page === 0}
            className={`absolute left-2 sm:left-4 z-20 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-300 to-yellow-400 text-black rounded-full p-4 sm:p-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] font-bold text-2xl sm:text-3xl transition-all duration-300 ${
              page === 0
                ? "opacity-30 cursor-not-allowed"
                : "hover:from-yellow-400 hover:to-yellow-500 cursor-pointer"
            }`}
          >
            ◀
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
                    initial={{ opacity: 0, x: 50, scale: 0.9, rotateY: 45 }}
                    animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, x: -50, scale: 0.9, rotateY: -45 }}
                    transition={{
                      duration: 0.6,
                      delay: idx * 0.12,
                      type: "spring" as const,
                      stiffness: 100,
                    }}
                    whileHover={{
                      y: -12,
                      scale: 1.04,
                      rotate: 1,
                      transition: { duration: 0.3 },
                    }}
                    className="text-black rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-all duration-300 relative"
                  >
                    {/* Decorative corners */}
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 bg-black rounded-full z-10" />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-black rounded-full z-10" />
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 bg-black rounded-full z-10" />
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-black rounded-full z-10" />
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-32 sm:h-36 md:h-40 relative border-b-4 border-black overflow-hidden"
                    >
                      <Image
                        src={mod.image}
                        alt={mod.title}
                        fill
                        priority={false}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                      />
                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </motion.div>
                    <div className="p-4 sm:p-5 md:p-6 flex flex-col justify-between h-full">
                      <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                        className="text-base sm:text-lg md:text-xl font-extrabold mb-2 sm:mb-3 tracking-wide drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]"
                      >
                        {mod.title}
                      </motion.h2>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                        className="mb-4 text-black/90 text-sm sm:text-base leading-relaxed font-sans font-semibold"
                      >
                        {mod.description}
                      </motion.p>
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                        className="mb-4 space-y-2"
                      >
                        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border-2 border-black/20 text-xs sm:text-sm font-bold">
                          <span className="text-base">🕒</span>
                          <span>{mod.duration}</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border-2 border-black/20 text-xs sm:text-sm font-bold flex-1">
                            <span className="text-base">📚</span>
                            <span>{mod.chapters} Ch</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border-2 border-black/20 text-xs sm:text-sm font-bold flex-1">
                            <span className="text-base">🎯</span>
                            <span>{mod.missions} M</span>
                          </div>
                        </div>
                      </motion.div>
                      <motion.button
                        initial={{ y: 20, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.5 + idx * 0.1,
                          type: "spring",
                        }}
                        whileHover={{
                          scale: 1.08,
                          y: -3,
                          boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const moduleSlug = mod.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, "");
                          window.location.href = `/modules/${moduleSlug}`;
                        }}
                        className="bg-gradient-to-r from-black to-gray-800 text-yellow-400 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold text-xs sm:text-sm md:text-base flex items-center gap-2 w-fit border-3 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer group"
                      >
                        <span>Start Module</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="text-base"
                        >
                          ▶
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
            initial={{ x: 50, opacity: 0, rotate: 180 }}
            whileInView={{ x: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1, type: "spring" }}
            whileHover={{ scale: 1.15, x: 5, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            disabled={page >= totalPages - 1}
            className={`absolute right-2 sm:right-4 z-20 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-300 to-yellow-400 text-black rounded-full p-4 sm:p-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] font-bold text-2xl sm:text-3xl transition-all duration-300 ${
              page >= totalPages - 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:from-yellow-400 hover:to-yellow-500 cursor-pointer"
            }`}
          >
            ▶
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
