"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import UserButton from "./UserButton";
import BrandMark from "./BrandMark";

type NavItem = {
  href: string;
  label: string;
  emoji: string;
  sectionId?: string;
};

const navItems: NavItem[] = [
  { href: "/home", label: "Home", emoji: "🏠" },
  { href: "#missions", label: "Missions", emoji: "🚀", sectionId: "missions" },
  { href: "/games", label: "Games", emoji: "🎮" },
  { href: "#modules", label: "Modules", emoji: "📚", sectionId: "modules" },
  { href: "/articles", label: "Articles", emoji: "📰" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLabel, setActiveLabel] = useState("Home");
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (pathname !== "/home") {
      const routeMatch = navItems.find((item) => item.href === pathname);
      setActiveLabel(routeMatch?.label ?? "Home");
      return;
    }

    const sectionItems = navItems.filter((item) => item.sectionId);
    const sections = sectionItems
      .map((item) => {
        const element = document.getElementById(item.sectionId!);
        return element ? { ...item, element } : null;
      })
      .filter(Boolean) as Array<NavItem & { element: HTMLElement }>;

    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio);
        }

        if (window.scrollY < 120) {
          setActiveLabel("Home");
          return;
        }

        const activeSection = sections.reduce(
          (best, section) => {
            const ratio = visibility.get(section.sectionId ?? "") ?? 0;
            if (ratio > best.ratio) {
              return { label: section.label, ratio };
            }
            return best;
          },
          { label: "Home", ratio: 0 },
        );

        setActiveLabel(activeSection.label);
      },
      {
        root: null,
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => observer.observe(section.element));

    return () => observer.disconnect();
  }, [pathname]);

  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem,
  ) => {
    if (pathname !== "/home" || !item.sectionId) {
      return;
    }

    event.preventDefault();
    const section = document.getElementById(item.sectionId);
    if (!section) {
      return;
    }

    setActiveLabel(item.label);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${item.sectionId}`);
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
        <div className="relative backdrop-blur-xl bg-gradient-to-r from-black/85 via-gray-900/85 to-black/85 rounded-2xl md:rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(251,191,36,1)] hover:shadow-[12px_12px_0px_0px_rgba(251,191,36,1)] transition-shadow duration-300">
          {/* Decorative corner accents */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full" />

          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-4 md:px-8">
            {/* Left: Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2 sm:gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 rounded-xl"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <BrandMark showTagline />
              </motion.div>
            </Link>

            {/* Right: Nav + Auth/Profile */}
            <div className="flex items-center gap-3 sm:gap-4 relative">
              {/* Desktop Navigation */}
              <motion.ul
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="hidden items-center gap-2 lg:gap-3 lg:flex"
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
                      onClick={(event) => handleSectionClick(event, item)}
                      className={
                        "group relative px-4 py-3 min-h-[44px] min-w-[44px] rounded-xl font-semibold text-xs lg:text-sm transition-[background-color,color,border-color,box-shadow] duration-300 cursor-pointer inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 " +
                        (activeLabel === item.label
                          ? "bg-yellow-400 text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                          : "text-green-100 hover:text-yellow-300 hover:bg-white/10 border-2 border-transparent")
                      }
                    >
                      <span className="text-base">{item.emoji}</span>
                      <span>{item.label}</span>
                      {activeLabel !== item.label && (
                        <motion.span className="absolute bottom-0 left-0 h-0.5 bg-yellow-400 w-0 group-hover:w-full transition-[width] duration-300" />
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
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                className="lg:hidden p-2.5 text-white bg-yellow-400/20 rounded-xl border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors duration-300 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400"
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
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden border-t-2 border-yellow-400/30 bg-gradient-to-b from-black/50 to-black/70 backdrop-blur-lg overflow-hidden rounded-b-2xl"
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
                        onClick={(event) => {
                          handleSectionClick(event, item);
                          setIsMobileMenuOpen(false);
                        }}
                        className={
                          "flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl font-semibold text-sm transition-[background-color,color,border-color,box-shadow,transform] duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 " +
                          (activeLabel === item.label
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
                    <UserButton mobile={true} />
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
