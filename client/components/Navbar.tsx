"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
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
        className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] z-50"
      >
        <div className="backdrop-blur-md bg-black/70 rounded-3xl shadow-lg supports-[backdrop-filter]:backdrop-blur-md">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
            {/* Left: Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="h-10 w-10">
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
                  className="text-xl font-extrabold tracking-wide text-white md:text-2xl"
                  style={{
                    fontFamily: '"Press Start 2P", system-ui, sans-serif',
                  }}
                >
                  ECO Play
                </motion.div>
                <div className="text-xs text-green-100/90">
                  Gamified environmental education
                </div>
              </motion.div>
            </Link>

            {/* Right: Nav + Auth/Profile */}
            <div className="flex items-center gap-2 md:gap-4 relative">
              <motion.ul
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="hidden items-center gap-4 md:flex"
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
                        "text-sm font-medium transition-colors hover:text-yellow-300 " +
                        (item.isActive ? "text-yellow-400" : "text-green-100")
                      }
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.6,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <UserButton />
              </motion.div>
            </div>
          </nav>
        </div>
      </motion.header>
    </motion.div>
  );
}
