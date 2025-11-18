"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import UserButton from "./UserButton";

type NavItem = {
  href: string;
  label: string;
  isActive?: boolean;
  emoji: string;
};

const navItems: NavItem[] = [
  { href: "/home", label: "Home", isActive: true, emoji: "🏠" },
  { href: "#missions", label: "Missions", emoji: "🚀" },
  { href: "/games", label: "Games", emoji: "🎮" },
  { href: "#modules", label: "Modules", emoji: "📚" },
  { href: "/articles", label: "Articles", emoji: "📰" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      className="fixed top-0 left-0 w-full z-50 pointer-events-none"
    >
      <motion.header
        initial={{ scale: 0.95, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          type: "spring",
          stiffness: 100,
        }}
        className="fixed top-3 sm:top-4 md:top-6 left-1/2 transform -translate-x-1/2 w-[96%] sm:w-[92%] md:w-[90%] max-w-7xl z-50 pointer-events-auto"
      >
        <div className="relative backdrop-blur-xl bg-gradient-to-r from-black/85 via-gray-900/85 to-black/85 rounded-2xl md:rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(251,191,36,1)] hover:shadow-[12px_12px_0px_0px_rgba(251,191,36,1)] transition-all duration-300">
          {/* Decorative corner accents */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full" />

          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4 md:px-8">
            {/* Left: Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 sm:gap-3 cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="relative h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-1"
              >
                <Image
                  src="/eco-play-logo-small.png"
                  alt="ECO Play Logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain p-0.5"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="leading-tight"
              >
                <motion.div
                  whileHover={{ scale: 1.05, color: "#fbbf24" }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-wide text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text"
                  style={{
                    fontFamily: '"Press Start 2P", system-ui, sans-serif',
                  }}
                >
                  EDU EARTH
                </motion.div>
                <div className="text-[8px] sm:text-[10px] text-green-300 font-sans hidden sm:block">
                  🌍 Save the Planet
                </div>
              </motion.div>
            </Link>

            {/* Right: Nav + Auth/Profile */}
            <div className="flex items-center gap-3 sm:gap-4 relative">
              {/* Desktop Navigation */}
              <motion.ul
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="hidden items-center gap-2 lg:gap-3 xl:flex"
              >
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -3, scale: 1.05 }}
                  >
                    <Link
                      href={item.href}
                      className={
                        "group relative px-4 py-2 rounded-xl font-semibold text-xs lg:text-sm transition-all duration-300 cursor-pointer inline-flex items-center gap-2 " +
                        (item.isActive
                          ? "bg-gradient-to-r from-yellow-300 to-yellow-400 text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
                          : "text-green-100 hover:text-yellow-300 hover:bg-white/10")
                      }
                    >
                      <span className="text-base">{item.emoji}</span>
                      <span>{item.label}</span>
                      {!item.isActive && (
                        <motion.span className="absolute bottom-0 left-0 h-0.5 bg-yellow-400 w-0 group-hover:w-full transition-all duration-300" />
                      )}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMobileMenu}
                className="xl:hidden p-2.5 text-white bg-yellow-400/20 rounded-xl border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 cursor-pointer"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>

              {/* Desktop User Button */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.7,
                  type: "spring",
                  stiffness: 200,
                }}
                className="hidden xl:block"
              >
                <UserButton />
              </motion.div>
            </div>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="xl:hidden border-t-2 border-yellow-400/30 bg-gradient-to-b from-black/50 to-black/70 backdrop-blur-lg overflow-hidden rounded-b-2xl"
              >
                <div className="px-4 py-5 space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -30, opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={
                          "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer " +
                          (item.isActive
                            ? "bg-gradient-to-r from-yellow-300 to-yellow-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            : "text-green-100 hover:bg-white/10 hover:text-yellow-300 border-2 border-transparent hover:border-yellow-400/50")
                        }
                      >
                        <span className="text-xl">{item.emoji}</span>
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: navItems.length * 0.08,
                    }}
                    className="pt-4 border-t-2 border-yellow-400/30 mt-2"
                  >
                    <UserButton />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </motion.div>
  );
}
