"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ElectricBorder from "./ElectricBorder";
import { useState, useEffect } from "react";
import { Sparkles, Trophy, Zap, Users, Target, Award } from "lucide-react";

export default function WhyThisPlatform() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [stats, setStats] = useState({
    modules: 0,
    students: 0,
    challenges: 0,
  });

  // Animate stats on mount
  useEffect(() => {
    const animateStats = () => {
      let moduleCount = 0;
      let studentCount = 0;
      let challengeCount = 0;

      const interval = setInterval(() => {
        if (moduleCount < 30) moduleCount++;
        if (studentCount < 1000) studentCount += 50;
        if (challengeCount < 200) challengeCount += 10;

        setStats({
          modules: moduleCount,
          students: studentCount,
          challenges: challengeCount,
        });

        if (
          moduleCount >= 30 &&
          studentCount >= 1000 &&
          challengeCount >= 200
        ) {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    };

    animateStats();
  }, []);

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

  const features = [
    {
      title: "AI-Curated Modules",
      description:
        "Fresh content from real-world environmental news and sustainability research.",
      icon: Sparkles,
      image: "/earth.png",
      stats: `${stats.modules}+ Modules`,
      color: "from-green-400 to-emerald-500",
      features: [
        "Real-time environmental news integration",
        "Adaptive learning paths",
        "Interactive video lessons",
        "Hands-on projects",
      ],
    },
    {
      title: "Gamified Challenges",
      description: "Multiplayer modes, quizzes, and real-world eco missions.",
      icon: Trophy,
      image: "/earth.png",
      stats: `${stats.challenges}+ Challenges`,
      color: "from-blue-400 to-cyan-500",
      features: [
        "Eco Sprint racing game",
        "Eco Strike strategy game",
        "Recycle Rush simulation",
        "Team competitions",
      ],
    },
    {
      title: "Rewards & Streaks",
      description: "Badges, XP, and streaks to keep learning fun and engaging.",
      icon: Award,
      image: "/earth.png",
      stats: `${stats.students}+ Students`,
      color: "from-yellow-400 to-orange-500",
      features: [
        "Eco Points system",
        "Achievement badges",
        "Daily streak rewards",
        "Leaderboard rankings",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full bg-gradient-to-br from-green-400 via-emerald-500 to-blue-600 flex flex-col items-center p-4 sm:p-6 md:p-10 lg:p-12 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-10 right-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 left-10 w-56 h-56 bg-pink-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/3 w-40 h-40 bg-blue-400/15 rounded-full blur-3xl"
      />

      {/* Top heading */}
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
        className="text-center mb-6 sm:mb-8"
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
          className="inline-block bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 px-6 py-3 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 mb-4 cursor-pointer"
        >
          <motion.h1 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide font-[pixel]">
            🌟 Why This Platform?
          </motion.h1>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-2 w-40 bg-black mx-auto rounded-full"
        />
      </motion.div>

      {/* Subheading */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mb-8 sm:mb-10 px-4 max-w-4xl"
      >
        <motion.h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-black/30 backdrop-blur-md px-6 py-4 rounded-2xl border-4 border-white/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] font-sans inline-block">
          Because learning about the Earth should be{" "}
          <motion.span
            animate={{
              scale: [1, 1.1, 1],
              color: ["#FDE047", "#FFFFFF", "#FDE047"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="inline-block font-extrabold"
          >
            fun
          </motion.span>{" "}
          & 💪 <strong className="text-yellow-300">impactful</strong>
        </motion.h2>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 sm:mb-14"
      >
        {[
          {
            icon: Target,
            label: "Modules",
            value: stats.modules + "+",
            emoji: "📚",
          },
          {
            icon: Users,
            label: "Students",
            value: stats.students + "+",
            emoji: "👨‍🎓",
          },
          {
            icon: Zap,
            label: "Challenges",
            value: stats.challenges + "+",
            emoji: "⚡",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.8 + index * 0.15,
              type: "spring",
              stiffness: 150,
            }}
            whileHover={{ scale: 1.12, y: -8, rotate: 3 }}
            className="bg-gradient-to-br from-white to-yellow-100 backdrop-blur-md rounded-2xl px-5 sm:px-7 py-4 flex items-center gap-3 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              className="text-3xl sm:text-4xl"
            >
              {stat.emoji}
            </motion.div>
            <div>
              <div className="text-black font-bold text-xl sm:text-2xl">
                {stat.value}
              </div>
              <div className="text-black/70 text-xs sm:text-sm font-semibold">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Card Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col sm:flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 w-full max-w-7xl justify-center px-4 relative z-10"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <ElectricBorder
              key={index}
              color="#FFD400"
              speed={1.2}
              chaos={1.1}
              thickness={2}
              className="rounded-xl sm:rounded-2xl w-full md:w-1/3"
            >
              <motion.div
                variants={cardVariants}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                  rotate: activeCard === index ? 0 : 2,
                  transition: { duration: 0.3 },
                }}
                onHoverStart={() => setActiveCard(index)}
                onHoverEnd={() => setActiveCard(null)}
                className="flex flex-col bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-5 sm:p-7 h-auto sm:h-[550px] relative overflow-hidden cursor-pointer transition-all duration-300"
              >
                {/* Decorative corners */}
                <div className="absolute top-2 left-2 w-3 h-3 bg-black rounded-full" />
                <div className="absolute top-2 right-2 w-3 h-3 bg-black rounded-full" />
                <div className="absolute bottom-2 left-2 w-3 h-3 bg-black rounded-full" />
                <div className="absolute bottom-2 right-2 w-3 h-3 bg-black rounded-full" />

                {/* Gradient overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 0.15 : 0 }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl`}
                />

                {/* Icon Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.8 + index * 0.2,
                    type: "spring",
                  }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  className="absolute top-4 right-4 bg-black rounded-xl p-3 border-3 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] cursor-pointer"
                >
                  <Icon className="w-7 h-7 text-yellow-400" />
                </motion.div>
                <div className="relative z-10 flex flex-col h-full mt-8">
                  <motion.h3
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-black text-2xl sm:text-3xl font-extrabold mb-3 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]"
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-black font-sans text-sm sm:text-base mb-4 leading-relaxed font-semibold"
                  >
                    {feature.description}
                  </motion.p>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] cursor-pointer"
                  >
                    <div className="text-black text-xl font-bold">
                      {feature.stats}
                    </div>
                    <div className="text-black/70 text-xs font-semibold">
                      Live statistics 📊
                    </div>
                  </motion.div>

                  <div className="space-y-2 mb-6">
                    {feature.features.map((item, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ x: -10, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.2 + featureIndex * 0.1,
                        }}
                        whileHover={{ x: 5, scale: 1.02 }}
                        className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-2.5 border-2 border-black/20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] transition-all duration-200 cursor-pointer"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-black" />
                        <span className="text-black text-sm sm:text-base font-semibold">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-contain drop-shadow-xl"
                        sizes="160px"
                        priority={index === 0}
                      />
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                        transition={{
                          repeat: Infinity,
                          duration: 6,
                          ease: "easeInOut",
                        }}
                        className="absolute -inset-2 rounded-full border border-white/40"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </ElectricBorder>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        whileInView={{ y: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.8, type: "spring" }}
        className="mt-12 sm:mt-16 text-center space-y-6"
      >
        <motion.p
          whileHover={{ scale: 1.05 }}
          className="text-white text-lg sm:text-xl font-bold bg-black/40 backdrop-blur-md px-8 py-4 rounded-2xl border-3 border-white/30 inline-block shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
        >
          🚀 Ready to create unforgettable environmental learning journeys?
        </motion.p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <motion.button
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-2xl bg-white/20 border-4 border-white/50 backdrop-blur-md font-bold text-white text-base sm:text-lg hover:bg-white/30 transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.3)] cursor-pointer"
          >
            📚 Explore Modules
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-300 to-yellow-400 text-black border-4 border-black font-bold text-base sm:text-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            ⭐ Join the Beta
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
