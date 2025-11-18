import React from "react";
import ElectricBorder from "./ElectricBorder";
import { JSX } from "react";
import { motion } from "framer-motion";

export default function EducationLanding(): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="relative pt-30 flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center px-4 py-16 sm:py-20 text-center md:px-6"
      style={{
        fontFamily: '"Press Start 2P", system-ui, sans-serif',
        backgroundImage: "url('/herobackground.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Animated background orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-20 right-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl z-0"
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
        className="absolute bottom-20 left-10 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl z-0"
      />

      <div className="w-full max-w-6xl z-10 relative">
        {/* Top banner */}
        <motion.div
          initial={{ y: -40, opacity: 0, scale: 0.9 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
          className="mx-auto mb-10 sm:mb-12 w-fit"
          role="banner"
        >
          <motion.h1
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 px-8 py-4 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-black font-extrabold text-lg md:text-xl lg:text-2xl transition-all duration-300 cursor-pointer"
          >
            🏫 Built for Schools & Families
          </motion.h1>
        </motion.div>

        {/* Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <ElectricBorder
            color="#FFD400"
            speed={1.5}
            chaos={1.2}
            thickness={3}
            className="rounded-2xl"
          >
            <motion.article
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
              whileHover={{ y: -10, scale: 1.03, rotate: 1 }}
              className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 rounded-2xl border-4 border-black p-6 flex flex-col items-center text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative cursor-pointer"
            >
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-3 h-3 bg-black rounded-full" />
              <div className="absolute top-2 right-2 w-3 h-3 bg-black rounded-full" />
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-black rounded-full" />
              <div className="absolute bottom-2 right-2 w-3 h-3 bg-black rounded-full" />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-black mb-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              >
                {/* Stylized black & white profile (young man with headphones) - inline SVG */}
                <svg
                  viewBox="0 0 120 120"
                  width="90"
                  height="90"
                  aria-hidden="true"
                >
                  <rect width="120" height="120" fill="#fff" />
                  <g transform="translate(10,8)" fill="#000">
                    <path d="M50 18c-9 0-16 7-16 16s7 16 16 16 16-7 16-16-7-16-16-16z" />
                    <path
                      d="M2 54c0-14 11-25 25-25h66c14 0 25 11 25 25v22c0 14-11 25-25 25H27C13 126 2 115 2 101V54z"
                      fill="#fff"
                    />
                    <path
                      d="M6 62v24c0 11 9 20 20 20h66c11 0 20-9 20-20V62"
                      stroke="#000"
                      strokeWidth="3"
                      fill="none"
                    />
                    {/* Headphones */}
                    <path
                      d="M10 46c0-18 14-32 32-32s32 14 32 32"
                      stroke="#000"
                      strokeWidth="4"
                      fill="none"
                    />
                    <rect
                      x="6"
                      y="46"
                      width="14"
                      height="22"
                      rx="4"
                      fill="#000"
                    />
                    <rect
                      x="100"
                      y="46"
                      width="14"
                      height="22"
                      rx="4"
                      fill="#000"
                    />
                    {/* Face details (white) */}
                    <circle cx="50" cy="34" r="6" fill="#fff" />
                    <rect
                      x="44"
                      y="40"
                      width="12"
                      height="6"
                      rx="3"
                      fill="#fff"
                    />
                  </g>
                </svg>
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-black font-extrabold text-lg md:text-xl mb-3 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]"
              >
                👨‍🏫 Teacher Dashboard
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="text-black text-sm sm:text-base mb-6 font-sans font-semibold leading-relaxed"
              >
                Auto-generate PPTs, quizzes, and lesson aids instantly. Track
                student scores &amp; streaks in real-time.
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="mt-auto inline-flex items-center gap-3 bg-gradient-to-r from-black to-gray-800 text-yellow-400 px-5 py-3 rounded-xl border-3 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] transition-all duration-300 cursor-pointer"
              >
                <motion.svg
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
                </motion.svg>
                <span className="text-sm font-bold">
                  Get Started as a Teacher
                </span>
              </motion.button>
            </motion.article>
          </ElectricBorder>

          {/* Card 2 */}
          <ElectricBorder
            color="#FFD400"
            speed={1.5}
            chaos={1.2}
            thickness={3}
            className="rounded-2xl"
          >
            <motion.article
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
              whileHover={{ y: -10, scale: 1.03, rotate: -1 }}
              className="bg-gradient-to-br from-green-300 via-emerald-400 to-teal-400 rounded-2xl border-4 border-black p-6 flex flex-col items-center text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative cursor-pointer"
            >
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-3 h-3 bg-black rounded-full" />
              <div className="absolute top-2 right-2 w-3 h-3 bg-black rounded-full" />
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-black rounded-full" />
              <div className="absolute bottom-2 right-2 w-3 h-3 bg-black rounded-full" />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-black mb-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              >
                {/* reuse SVG avatar */}
                <svg
                  viewBox="0 0 120 120"
                  width="90"
                  height="90"
                  aria-hidden="true"
                >
                  <rect width="120" height="120" fill="#fff" />
                  <g transform="translate(10,8)" fill="#000">
                    <path d="M50 18c-9 0-16 7-16 16s7 16 16 16 16-7 16-16-7-16-16-16z" />
                    <path
                      d="M2 54c0-14 11-25 25-25h66c14 0 25 11 25 25v22c0 14-11 25-25 25H27C13 126 2 115 2 101V54z"
                      fill="#fff"
                    />
                    <path
                      d="M6 62v24c0 11 9 20 20 20h66c11 0 20-9 20-20V62"
                      stroke="#000"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M10 46c0-18 14-32 32-32s32 14 32 32"
                      stroke="#000"
                      strokeWidth="4"
                      fill="none"
                    />
                    <rect
                      x="6"
                      y="46"
                      width="14"
                      height="22"
                      rx="4"
                      fill="#000"
                    />
                    <rect
                      x="100"
                      y="46"
                      width="14"
                      height="22"
                      rx="4"
                      fill="#000"
                    />
                    <circle cx="50" cy="34" r="6" fill="#fff" />
                    <rect
                      x="44"
                      y="40"
                      width="12"
                      height="6"
                      rx="3"
                      fill="#fff"
                    />
                  </g>
                </svg>
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="text-black font-extrabold text-lg md:text-xl mb-3 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]"
              >
                👪 Parent Insights
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="text-black text-sm sm:text-base mb-6 font-sans font-semibold leading-relaxed"
              >
                See your child's learning progress &amp; eco-habits. Celebrate
                streaks, view certificates, and reward eco-actions.
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9, type: "spring" }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="mt-auto inline-flex items-center gap-3 bg-gradient-to-r from-black to-gray-800 text-green-400 px-5 py-3 rounded-xl border-3 border-green-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] transition-all duration-300 cursor-pointer"
              >
                <motion.svg
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
                </motion.svg>
                <span className="text-sm font-bold">Join as a Parent</span>
              </motion.button>
            </motion.article>
          </ElectricBorder>

          {/* Card 3 */}
          <ElectricBorder
            color="#FFD400"
            speed={1.5}
            chaos={1.2}
            thickness={3}
            className="rounded-2xl"
          >
            <motion.article
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
              whileHover={{ y: -10, scale: 1.03, rotate: 1 }}
              className="bg-gradient-to-br from-blue-300 via-cyan-400 to-sky-400 rounded-2xl border-4 border-black p-6 flex flex-col items-center text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative cursor-pointer"
            >
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-3 h-3 bg-black rounded-full" />
              <div className="absolute top-2 right-2 w-3 h-3 bg-black rounded-full" />
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-black rounded-full" />
              <div className="absolute bottom-2 right-2 w-3 h-3 bg-black rounded-full" />

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7, type: "spring" }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-black mb-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
              >
                {/* reuse SVG avatar */}
                <svg
                  viewBox="0 0 120 120"
                  width="90"
                  height="90"
                  aria-hidden="true"
                >
                  <rect width="120" height="120" fill="#fff" />
                  <g transform="translate(10,8)" fill="#000">
                    <path d="M50 18c-9 0-16 7-16 16s7 16 16 16 16-7 16-16-7-16-16-16z" />
                    <path
                      d="M2 54c0-14 11-25 25-25h66c14 0 25 11 25 25v22c0 14-11 25-25 25H27C13 126 2 115 2 101V54z"
                      fill="#fff"
                    />
                    <path
                      d="M6 62v24c0 11 9 20 20 20h66c11 0 20-9 20-20V62"
                      stroke="#000"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M10 46c0-18 14-32 32-32s32 14 32 32"
                      stroke="#000"
                      strokeWidth="4"
                      fill="none"
                    />
                    <rect
                      x="6"
                      y="46"
                      width="14"
                      height="22"
                      rx="4"
                      fill="#000"
                    />
                    <rect
                      x="100"
                      y="46"
                      width="14"
                      height="22"
                      rx="4"
                      fill="#000"
                    />
                    <circle cx="50" cy="34" r="6" fill="#fff" />
                    <rect
                      x="44"
                      y="40"
                      width="12"
                      height="6"
                      rx="3"
                      fill="#fff"
                    />
                  </g>
                </svg>
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="text-black font-extrabold text-lg md:text-xl mb-3 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]"
              >
                🏆 Rewards &amp; Certificates
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.9 }}
                className="text-black text-sm sm:text-base mb-6 font-sans font-semibold leading-relaxed"
              >
                Students earn verified eco-certificates. Printable badges for
                school portfolios &amp; family pride.
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1, type: "spring" }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="mt-auto inline-flex items-center gap-3 bg-gradient-to-r from-black to-gray-800 text-blue-400 px-5 py-3 rounded-xl border-3 border-blue-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] transition-all duration-300 cursor-pointer"
              >
                <motion.svg
                  animate={{ y: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 16v-8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 12l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 20h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
                <span className="text-sm font-bold">
                  Download Sample Certificate
                </span>
              </motion.button>
            </motion.article>
          </ElectricBorder>
        </div>
      </div>
    </motion.div>
  );
}
