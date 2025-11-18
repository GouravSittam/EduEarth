"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BotComponent from "./bot";
import { BsController } from "react-icons/bs";
import { Users2Icon } from "lucide-react";
import Link from "next/link";
import GlitchText from "./GlitchText";

export default function Hero() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Load user from localStorage when page mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Handle dashboard navigation
  const handleDashboardRedirect = () => {
    if (!user || !user.isLoggedIn) {
      alert("Please sign in first!");
      router.push("/auth-model");
      return;
    }

    if (user.role === "teacher") {
      router.push("/teacher-dashboard");
    } else {
      router.push("/student-dashboard");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center px-4 py-24 sm:py-28 md:py-32 text-center sm:px-6 overflow-hidden"
      style={{
        fontFamily: '"Press Start 2P", system-ui, sans-serif',
        backgroundImage: "url('/herobackground.jpg')",
      }}
    >
      {/* Animated overlay for depth */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(251,191,36,0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(34,197,94,0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(59,130,246,0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(251,191,36,0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Floating particles effect */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
          className="absolute w-16 h-16 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              [
                "rgba(251,191,36,0.4)",
                "rgba(34,197,94,0.4)",
                "rgba(59,130,246,0.4)",
              ][i % 3]
            }, transparent)`,
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
            filter: "blur(20px)",
          }}
        />
      ))}

      {/* Hero content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 w-full max-w-6xl"
      >
        {/* Heading box */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            type: "spring",
            stiffness: 80,
          }}
          whileHover={{
            scale: 1.03,
            rotate: [0, -1, 1, 0],
            transition: { duration: 0.4 },
          }}
          className="mb-8 sm:mb-10 md:mb-12 inline-flex max-w-[95%] sm:max-w-[90%] md:max-w-[950px] items-center justify-center rounded-3xl sm:rounded-4xl border-6 border-black bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 shadow-[0_8px_0_#000,0_12px_25px_rgba(0,0,0,0.5)] sm:shadow-[0_10px_0_#000,0_15px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_0_#000,0_18px_35px_rgba(0,0,0,0.7)] transition-all duration-300 relative overflow-hidden group cursor-pointer"
          style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
        >
          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-200%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut",
            }}
          />

          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full" />
          <div className="absolute top-2 right-2 w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full" />
          <div className="absolute bottom-2 left-2 w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full" />
          <div className="absolute bottom-2 right-2 w-3 h-3 sm:w-4 sm:h-4 bg-black rounded-full" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-full flex items-center justify-center gap-3 relative z-10"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-2xl sm:text-3xl md:text-4xl"
            >
              🌍
            </motion.span>
            <GlitchText className="text-black !text-[clamp(1rem,4vw,2rem)]">
              Learn. Play. Save the Planet.
            </GlitchText>
            <motion.span
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                delay: 1,
              }}
              className="text-2xl sm:text-3xl md:text-4xl"
            >
              🚀
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mx-auto mb-10 sm:mb-12 md:mb-16 lg:mb-20 max-w-xs sm:max-w-lg md:max-w-2xl text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-white font-sans bg-black/40 backdrop-blur-sm px-6 py-4 rounded-2xl border-2 border-yellow-400/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mr-2"
          >
            ✨
          </motion.span>
          A <strong className="text-yellow-400">Gamified platform</strong> that
          turns environmental education into fun challenges
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="inline-block ml-2"
          >
            🎮
          </motion.span>
        </motion.p>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
          <motion.button
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.1, type: "spring" }}
            whileHover={{
              scale: 1.08,
              y: -5,
              boxShadow: "0 12px 0 #000, 0 15px 30px rgba(0,0,0,0.5)",
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              y: 2,
              transition: { duration: 0.1 },
            }}
            onClick={() => router.push("/games")}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 sm:gap-4 rounded-2xl border-4 sm:border-5 border-black bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-5 text-black shadow-[0_6px_0_#000] sm:shadow-[0_8px_0_#000] transition-all duration-300 relative overflow-hidden cursor-pointer"
            style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
          >
            {/* Animated background on hover */}
            <motion.div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="relative z-10 text-sm sm:text-base md:text-lg">
              Play Games
            </span>
            <motion.span
              animate={{ x: [0, 5, 0], rotate: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 inline-flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-black text-yellow-400 group-hover:bg-white group-hover:text-black transition-colors duration-300"
            >
              <BsController className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.span>
          </motion.button>

          {/* Dashboard Button (Role-Based) */}
          <motion.button
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.3, type: "spring" }}
            whileHover={{
              scale: 1.08,
              y: -5,
              boxShadow: "0 12px 0 #000, 0 15px 30px rgba(0,0,0,0.5)",
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              y: 2,
              transition: { duration: 0.1 },
            }}
            onClick={handleDashboardRedirect}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 sm:gap-4 rounded-2xl border-4 sm:border-5 border-black bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 px-6 py-4 sm:px-8 sm:py-5 md:px-10 md:py-5 text-black shadow-[0_6px_0_#000] sm:shadow-[0_8px_0_#000] transition-all duration-300 relative overflow-hidden cursor-pointer"
            style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
          >
            {/* Animated background on hover */}
            <motion.div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="relative z-10 text-sm sm:text-base md:text-lg text-center">
              {user?.role === "teacher"
                ? "Teacher Dashboard"
                : user?.role === "student"
                ? "Student Dashboard"
                : "Go to Dashboard"}
            </span>
            <motion.span
              animate={{ x: [0, 5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 inline-flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-black text-green-400 group-hover:bg-white group-hover:text-black transition-colors duration-300"
            >
              <Users2Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.span>
          </motion.button>
        </div>
      </motion.div>

      {/* <BotComponent /> */}
    </motion.section>
  );
}
