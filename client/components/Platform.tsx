"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function WhyThisPlatform() {
  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full bg-gradient-to-r from-green-500 via-green-400 to-blue-500 flex flex-col items-center p-4 sm:p-6 md:p-8"
    >
      {/* Top heading */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 tracking-wide font-[pixel] text-center"
      >
        Why This Platform?
      </motion.h1>

      {/* Subheading */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-center mb-8 sm:mb-10 md:mb-12 px-4"
      >
        Because learning about the Earth should be fun
      </motion.h2>

      {/* Card Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col sm:flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 w-full max-w-6xl justify-center px-4"
      >
        {/* Card 1 */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -10,
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
          className="flex flex-col bg-yellow-400 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 w-full md:w-1/3 h-80 sm:h-96"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-full h-32 sm:h-40 relative mb-3 sm:mb-4"
          >
            <Image
              src="/earth.png"
              alt="Pencils in holder"
              fill
              className="object-cover rounded-lg"
            />
          </motion.div>
          <div>
            <motion.h3
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-black font-bold text-base sm:text-lg mb-1 sm:mb-2"
            >
              AI-Curated Modules
            </motion.h3>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="text-black text-xs sm:text-sm"
            >
              Fresh content from real-world environmental news.
            </motion.p>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="flex justify-between mt-4 text-black text-lg"
          >
            {["★", "🎁", "👑", "🛡", "🚩"].map((icon, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.3, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -10,
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
          className="flex flex-col bg-yellow-400 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 w-full md:w-1/3 h-80 sm:h-96"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="w-full h-32 sm:h-40 relative mb-3 sm:mb-4"
          >
            <Image
              src="/earth.png"
              alt="Pencils in holder"
              fill
              className="object-cover rounded-lg"
            />
          </motion.div>
          <motion.h3
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="text-black font-bold text-base sm:text-lg mb-1 sm:mb-2"
          >
            Gamified Challenges
          </motion.h3>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="text-black text-xs sm:text-sm mb-3 sm:mb-4"
          >
            Multiplayer modes, quizzes, debates.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="flex justify-between mt-auto text-black text-lg"
          >
            {["★", "🎁", "👑", "🛡", "🚩"].map((icon, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.3, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -10,
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
          className="flex flex-col bg-yellow-400 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 w-full md:w-1/3 h-80 sm:h-96"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="w-full h-32 sm:h-40 relative mb-3 sm:mb-4"
          >
            <Image
              src="/earth.png"
              alt="Writing on notebook"
              fill
              className="object-cover rounded-lg"
            />
          </motion.div>
          <motion.h3
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="text-black font-bold text-base sm:text-lg mb-1 sm:mb-2"
          >
            Rewards & Streaks
          </motion.h3>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="text-black text-xs sm:text-sm mb-3 sm:mb-4"
          >
            Badges, XP, and streaks to keep learning fun.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="flex justify-between mt-auto text-black text-lg"
          >
            {["★", "🎁", "👑", "🛡", "🚩"].map((icon, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.3, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
