"use client";

import React from "react";
import Link from "next/link";
import ElectricBorder from "./ElectricBorder";
import { motion } from "framer-motion";

export default function SparklyGrowthPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="pb-20 bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col items-center border-t-8 border-purple-400 relative overflow-hidden"
    >
      {/* Animated background orbs */}
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
        className="absolute top-10 right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-10 left-10 w-48 h-48 bg-blue-300/30 rounded-full blur-3xl"
      />

      {/* Tag */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
        className="mt-16 bg-gradient-to-r from-purple-300 to-purple-400 text-purple-900 px-6 py-2 rounded-xl text-sm font-bold border-3 border-purple-600 shadow-[4px_4px_0px_0px_rgba(109,40,217,0.5)] cursor-pointer"
      >
        ✨ Sparkly Growth
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 bg-clip-text text-center px-4 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]"
      >
        Join a Thriving Learning Community
      </motion.h1>

      {/* Paragraph */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-6 text-gray-600 text-center text-base sm:text-lg max-w-2xl px-4 font-sans leading-relaxed"
      >
        🌍 EduEarth connects you with thousands of learners and expert
        educators, providing the guidance and resources needed to excel in your
        environmental learning journey
      </motion.p>

      {/* Cards */}
      <div className="mt-14 flex flex-col sm:flex-row gap-6 lg:gap-8 relative z-10">
        {/* Card 1 */}
        <ElectricBorder
          color="#8B5CF6"
          speed={1.5}
          chaos={1.2}
          thickness={3}
          className="rounded-2xl w-full sm:w-80"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8, type: "spring" }}
            whileHover={{ y: -8, scale: 1.05, rotate: 2 }}
            className="flex items-center bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl border-4 border-purple-600 shadow-[6px_6px_0px_0px_rgba(109,40,217,1)] hover:shadow-[10px_10px_0px_0px_rgba(109,40,217,1)] px-6 py-5 transition-all duration-300 cursor-pointer relative"
          >
            <div className="absolute top-2 right-2 text-3xl">📚</div>
            <div>
              <p className="text-3xl font-extrabold text-purple-800 drop-shadow-md">
                10K+
              </p>
              <p className="text-purple-700 text-sm font-bold">
                Engaged Learners
              </p>
            </div>
          </motion.div>
        </ElectricBorder>

        {/* Card 2 */}
        <ElectricBorder
          color="#8B5CF6"
          speed={1.5}
          chaos={1.2}
          thickness={3}
          className="rounded-2xl w-full sm:w-80"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9, type: "spring" }}
            whileHover={{ y: -8, scale: 1.05, rotate: -2 }}
            className="flex items-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl border-4 border-blue-600 shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] hover:shadow-[10px_10px_0px_0px_rgba(37,99,235,1)] px-6 py-5 transition-all duration-300 cursor-pointer relative"
          >
            <div className="absolute top-2 right-2 text-3xl">🌱</div>
            <div>
              <p className="text-3xl font-extrabold text-blue-800 drop-shadow-md">
                50+
              </p>
              <p className="text-blue-700 text-sm font-bold">
                Eco Modules Available
              </p>
            </div>
          </motion.div>
        </ElectricBorder>

        {/* Card 3 */}
        <ElectricBorder
          color="#8B5CF6"
          speed={1.5}
          chaos={1.2}
          thickness={3}
          className="rounded-2xl w-full sm:w-80"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1, type: "spring" }}
            whileHover={{ y: -8, scale: 1.05, rotate: 2 }}
            className="flex items-center bg-gradient-to-br from-green-100 to-green-200 rounded-2xl border-4 border-green-600 shadow-[6px_6px_0px_0px_rgba(22,163,74,1)] hover:shadow-[10px_10px_0px_0px_rgba(22,163,74,1)] px-6 py-5 transition-all duration-300 cursor-pointer relative"
          >
            <div className="absolute top-2 right-2 text-3xl">👨‍🏫</div>
            <div>
              <p className="text-3xl font-extrabold text-green-800 drop-shadow-md">
                500+
              </p>
              <p className="text-green-700 text-sm font-bold">Schools Joined</p>
            </div>
          </motion.div>
        </ElectricBorder>
      </div>

      {/* Button */}
      <Link href="#modules">
        <motion.button
          initial={{ y: 30, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 1.2, type: "spring" }}
          whileHover={{
            scale: 1.08,
            y: -5,
            boxShadow: "10px 10px 0px 0px rgba(109,40,217,1)",
          }}
          whileTap={{ scale: 0.95 }}
          className="mt-16 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold px-10 py-4 rounded-2xl border-4 border-purple-900 shadow-[6px_6px_0px_0px_rgba(109,40,217,1)] transition-all duration-300 text-base sm:text-lg cursor-pointer flex items-center gap-3"
        >
          <span>🚀 Explore Courses</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </motion.button>
      </Link>
    </motion.div>
  );
}
