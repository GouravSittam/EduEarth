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

        if (moduleCount >= 30 && studentCount >= 1000 && challengeCount >= 200) {
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
      description: "Fresh content from real-world environmental news and sustainability research.",
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
      className="min-h-screen w-full bg-gradient-to-br from-green-500 via-emerald-400 to-blue-500 flex flex-col items-center p-4 sm:p-6 md:p-8 relative overflow-hidden"
    >
      {/* Animated background elements */}
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
        className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-20 left-10 w-40 h-40 bg-yellow-300/10 rounded-full blur-3xl"
      />

      {/* Top heading */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-4"
      >
        <motion.h1
          className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-wide font-[pixel]"
        >
          Why This Platform?
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-1 w-32 bg-yellow-400 mx-auto rounded-full"
        />
      </motion.div>

      {/* Subheading */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-center mb-6 sm:mb-8 px-4"
      >
        Because learning about the Earth should be{" "}
        <motion.span
          animate={{
            color: ["#FFD400", "#FFFFFF", "#FFD400"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="inline-block"
        >
          fun
        </motion.span>
        {" "}& impactful
      </motion.h2>

      {/* Stats Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 sm:mb-12"
      >
        {[
          { icon: Target, label: "Modules", value: stats.modules + "+" },
          { icon: Users, label: "Students", value: stats.students + "+" },
          { icon: Zap, label: "Challenges", value: stats.challenges + "+" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.1, y: -5 }}
            className="bg-white/20 backdrop-blur-md rounded-xl px-4 sm:px-6 py-3 flex items-center gap-3 border border-white/30"
          >
            <stat.icon className="w-6 h-6 text-yellow-400" />
            <div>
              <div className="text-white font-bold text-lg sm:text-xl">{stat.value}</div>
              <div className="text-white/80 text-xs sm:text-sm">{stat.label}</div>
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
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                onHoverStart={() => setActiveCard(index)}
                onHoverEnd={() => setActiveCard(null)}
                className="flex flex-col bg-yellow-400 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 h-auto sm:h-[500px] relative overflow-hidden cursor-pointer"
              >
                {/* Gradient overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 0.1 : 0 }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-xl`}
                />

                {/* Icon Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-full p-2"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="relative z-10 flex flex-col h-full mt-8">
                  <motion.h3
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-black text-2xl sm:text-3xl font-bold mb-2"
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-black/80 text-sm sm:text-base mb-4"
                  >
                    {feature.description}
                  </motion.p>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="bg-black/10 rounded-xl p-3 mb-4 border border-black/10"
                  >
                    <div className="text-black text-lg font-semibold">{feature.stats}</div>
                    <div className="text-black/60 text-xs">Live statistics powered by engagement</div>
                  </motion.div>

                  <div className="space-y-2 mb-6">
                    {feature.features.map((item, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        initial={{ x: -10, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 + featureIndex * 0.1 }}
                        className="flex items-center gap-2 bg-white/40 rounded-lg px-3 py-2 border border-black/5"
                      >
                        <span className="w-2 h-2 rounded-full bg-black/60" />
                        <span className="text-black text-sm sm:text-base">{item}</span>
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
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
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
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-10 sm:mt-14 text-center text-white space-y-4"
      >
        <p className="text-base sm:text-lg">
          Ready to create unforgettable environmental learning journeys?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-6 py-3 rounded-full bg-black/20 border border-white/40 backdrop-blur-md font-semibold hover:bg-white/20 transition">
            Explore Modules
          </button>
          <button className="px-6 py-3 rounded-full bg-white text-emerald-600 font-semibold hover:bg-yellow-100 transition">
            Join the Beta
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
