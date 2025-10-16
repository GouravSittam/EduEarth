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
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-cover bg-center px-4 py-20 sm:py-24 md:py-32 text-center sm:px-6"
      style={{
        fontFamily: '"Press Start 2P", system-ui, sans-serif',
        backgroundImage: "url('/herobackground.jpg')",
      }}
    >
      {/* Hero content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 w-full max-w-6xl"
      >
        {/* Heading box */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.5,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          className="mb-6 sm:mb-8 md:mb-10 inline-flex max-w-[95%] sm:max-w-[90%] md:max-w-[950px] items-center justify-center rounded-2xl sm:rounded-3xl md:rounded-4xl border border-black bg-yellow-300 px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 shadow-[0_4px_0_#000] sm:shadow-[0_6px_0_#000]"
          style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-full flex items-center justify-center"
          >
            <GlitchText className="text-black !text-[clamp(1rem,4vw,2rem)]">
              Learn. Play. Save the Planet.
            </GlitchText>
          </motion.div>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-20 max-w-xs sm:max-w-lg md:max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-white/95"
        >
          A Gamified platform that turns environmental education into fun
          challenges
        </motion.p>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              y: 0,
              transition: { duration: 0.1 },
            }}
            onClick={() => router.push("/games")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-4 rounded-full border-2 sm:border-4 border-black bg-yellow-300 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 text-black shadow-[0_4px_0_#000] sm:shadow-[0_6px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
          >
            <span className="text-xs sm:text-sm md:text-base">Play Games</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 items-center justify-center rounded-full"
            >
              <BsController className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </motion.span>
          </motion.button>
          
          {/* Dashboard Button (Role-Based) */}
          <motion.button
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              y: 0,
              transition: { duration: 0.1 },
            }}
            onClick={handleDashboardRedirect}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-4 rounded-full border-2 sm:border-4 border-black bg-yellow-300 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 text-black shadow-[0_4px_0_#000] sm:shadow-[0_6px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
          >
            <span className="text-xs sm:text-sm md:text-base text-center">
              {user?.role === "teacher"
                ? "Teacher Dashboard"
                : user?.role === "student"
                ? "Student Dashboard"
                : "Go to Dashboard"}
            </span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 items-center justify-center rounded-full"
            >
              <Users2Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </motion.span>
          </motion.button>
        </div>
      </motion.div>

      {/* <BotComponent /> */}
    </motion.section>
  );
}
