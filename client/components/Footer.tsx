"use client";

import Link from "next/link";
import ElectricBorder from "./ElectricBorder";
import { motion } from "framer-motion";
import BrandMark from "./BrandMark";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: "💼",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/gouravsittam/",
      color: "hover:bg-blue-500",
    },
    {
      icon: "🐙",
      label: "GitHub",
      href: "https://github.com/GouravSittam",
      color: "hover:bg-gray-900 hover:text-white",
    },
    {
      icon: "📸",
      label: "Instagram",
      href: "https://www.instagram.com/gouravv.c/",
      color: "hover:bg-pink-500",
    },
    {
      icon: "𝕏",
      label: "X",
      href: "https://x.com/Gouravv_c",
      color: "hover:bg-black hover:text-white",
    },
  ];

  const exploreLinks = [
    { label: "How it Works", href: "#missions", emoji: "🚀" },
    { label: "Explore Modules", href: "#modules", emoji: "📚" },
    { label: "Play Games", href: "/games", emoji: "🎮" },
    { label: "Articles", href: "/articles", emoji: "📰" },
  ];

  const dashboardLinks = [
    { label: "Teacher Dashboard", href: "/teacher-dashboard", emoji: "👨‍🏫" },
    { label: "Student Dashboard", href: "/student-dashboard", emoji: "👨‍🎓" },
    { label: "Sign In", href: "/auth-model", emoji: "🔐" },
  ];

  return (
    <footer
      className="relative border-t-8 border-black bg-gradient-to-br from-green-400 via-emerald-500 to-blue-600 text-black overflow-hidden"
      style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-10 right-10 w-64 h-64 bg-yellow-300 rounded-full opacity-10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-10 left-10 w-72 h-72 bg-pink-400 rounded-full opacity-10 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <BrandMark textClassName="text-xl sm:text-2xl" />
            </motion.div>
            <p className="text-xs sm:text-sm leading-relaxed max-w-xs font-sans">
              🌍 <strong>Learn. Play. Save the Planet.</strong>
              <br />
              <span className="text-xs opacity-90">
                Empowering students through AI-driven environmental education.
              </span>
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-2xl w-12 h-12 flex items-center justify-center bg-white border-3 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${social.color} transition-all duration-300 cursor-pointer`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Explore */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="mb-4 sm:mb-5 text-sm sm:text-base font-bold uppercase tracking-wider bg-yellow-400 inline-block px-4 py-2 rounded-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              🗺️ Explore
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-sans">
              {exploreLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.05 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-200 cursor-pointer group"
                  >
                    <span className="text-lg group-hover:scale-125 transition-transform duration-200">
                      {link.emoji}
                    </span>
                    <span className="font-semibold">{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Dashboards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="mb-4 sm:mb-5 text-sm sm:text-base font-bold uppercase tracking-wider bg-yellow-400 inline-block px-4 py-2 rounded-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              📊 Access
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-sans">
              {dashboardLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.05 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-200 cursor-pointer group"
                  >
                    <span className="text-lg group-hover:scale-125 transition-transform duration-200">
                      {link.emoji}
                    </span>
                    <span className="font-semibold">{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter / Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="mb-4 sm:mb-5 text-sm sm:text-base font-bold uppercase tracking-wider bg-yellow-400 inline-block px-4 py-2 rounded-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              📬 Newsletter
            </h3>
            <p className="text-xs sm:text-sm mb-4 font-sans leading-relaxed">
              Get the latest updates on new modules, games, and environmental
              challenges!
            </p>
            <ElectricBorder
              color="#FFD400"
              speed={1.5}
              chaos={1.2}
              thickness={3}
              className="rounded-xl"
            >
              <form className="flex overflow-hidden rounded-xl bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-3 py-3 text-xs sm:text-sm text-black placeholder-black/50 outline-none bg-transparent font-sans"
                  aria-label="Email"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 sm:px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs sm:text-sm font-bold tracking-wider border-l-4 border-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 cursor-pointer"
                >
                  Join 🚀
                </motion.button>
              </form>
            </ElectricBorder>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 grid grid-cols-3 gap-2"
            >
              {[
                { value: "10K+", label: "Students" },
                { value: "500+", label: "Schools" },
                { value: "50+", label: "Modules" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  className="bg-white/90 border-3 border-black rounded-lg p-2 text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="text-sm sm:text-base font-bold text-yellow-600">
                    {stat.value}
                  </div>
                  <div className="text-[8px] sm:text-xs font-sans">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 mb-8 h-1 bg-black rounded-full"
        />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs md:text-sm font-sans"
        >
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <span className="text-lg">©</span>
            <span className="font-bold">{currentYear} EduEarth.</span>
            <span>All rights reserved.</span>
            <span className="text-base">🌱</span>
          </motion.p>
          <div className="flex items-center gap-4 sm:gap-6">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#"
                className="hover:text-yellow-300 transition-colors duration-200 font-semibold cursor-pointer"
              >
                Privacy Policy
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="#"
                className="hover:text-yellow-300 transition-colors duration-200 font-semibold cursor-pointer"
              >
                Terms of Service
              </Link>
            </motion.div>
            <motion.a
              href="#top"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-lg border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 font-bold cursor-pointer"
            >
              <span>Back to Top</span>
              <motion.span
                animate={{ y: [-2, 2, -2] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-base"
              >
                ⬆️
              </motion.span>
            </motion.a>
          </div>
        </motion.div>

        {/* Made with love */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8 text-center"
        >
          <motion.p
            whileHover={{ scale: 1.05 }}
            className="text-xs font-sans inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border-2 border-black"
          >
            Made with{" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ❤️
            </motion.span>{" "}
            for the Planet
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
