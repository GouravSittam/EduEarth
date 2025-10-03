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
      className="min-h-screen w-full bg-gradient-to-r from-green-500 via-green-400 to-blue-500 flex flex-col items-center p-8"
    >
      {/* Top heading */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-white text-3xl sm:text-4xl font-bold mb-4 tracking-wide font-[pixel]"
      >
        Why This Platform?
      </motion.h1>

      {/* Subheading */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-12"
      >
        Because learning about the Earth should be fun
      </motion.h2>

      {/* Card Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center"
      >
        {/* Card 1 */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            y: -10,
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
          className="flex flex-col bg-yellow-400 rounded-2xl shadow-lg p-6 w-full md:w-1/3 h-96"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-full h-40 relative mb-4"
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
              className="text-black font-bold text-lg mb-2"
            >
              AI-Curated Modules
            </motion.h3>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="text-black text-sm"
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
          className="flex flex-col bg-yellow-400 rounded-2xl shadow-lg p-6 w-full md:w-1/3 h-96"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="w-full h-40 relative mb-4"
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
            className="text-black font-bold text-lg mb-2"
          >
            Gamified Challenges
          </motion.h3>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="text-black text-sm mb-4"
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
          className="flex flex-col bg-yellow-400 rounded-2xl shadow-lg p-6 w-full md:w-1/3 h-96"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="w-full h-40 relative mb-4"
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
            className="text-black font-bold text-lg mb-2"
          >
            Rewards & Streaks
          </motion.h3>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="text-black text-sm mb-4"
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
