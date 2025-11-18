"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import UserButton from "./UserButton";

type NavItem = { href: string; label: string; isActive?: boolean };

const navItems: NavItem[] = [
  { href: "/home", label: "Home", isActive: true },
  { href: "#missions", label: "Missions" },
  { href: "/games", label: "Games" },
  { href: "#modules", label: "Modules" },
  { href: "/articles", label: "Articles" },
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
      className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/30 rounded-b-2xl z-50"
    >
      <motion.header
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="fixed top-2 sm:top-4 md:top-6 left-1/2 transform -translate-x-1/2 w-[95%] sm:w-[90%] md:w-[90%] z-50"
      >
        <div className="backdrop-blur-md bg-black/70 rounded-2xl md:rounded-3xl shadow-lg supports-[backdrop-filter]:backdrop-blur-md">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-6">
            {/* Left: Logo */}
            <Link href="/" className="group flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10">
                <Image
                  src="/eco-play-logo-small.png"
                  alt="ECO Play Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              </div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="leading-tight"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-wide text-white"
                  style={{
                    fontFamily: '"Press Start 2P", system-ui, sans-serif',
                  }}
                >
                  EDU EARTH
                </motion.div>
                <div className="text-xs sm:text-xs text-green-100/90 hidden sm:block">
                  Gamified environmental education
                </div>
              </motion.div>
            </Link>

            {/* Right: Nav + Auth/Profile */}
            <div className="flex items-center gap-2 sm:gap-4 relative">
              {/* Desktop Navigation */}
              <motion.ul
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="hidden items-center gap-2 lg:gap-4 xl:flex"
              >
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <Link
                      href={item.href}
                      className={
                        "text-xs lg:text-sm font-medium transition-colors hover:text-yellow-300 " +
                        (item.isActive ? "text-yellow-400" : "text-green-100")
                      }
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.6,
                  type: "spring",
                  stiffness: 200,
                }}
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-white hover:text-yellow-300 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>

              {/* Desktop User Button */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.6,
                  type: "spring",
                  stiffness: 200,
                }}
                className="hidden lg:block"
              >
                <UserButton />
              </motion.div>
            </div>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden border-t border-white/20"
              >
                <div className="px-4 py-4 space-y-3">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={
                          "block text-sm font-medium transition-colors hover:text-yellow-300 py-2 " +
                          (item.isActive ? "text-yellow-400" : "text-green-100")
                        }
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  <div className="pt-3 border-t border-white/20">
                    <UserButton />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </motion.div>
  );
}
