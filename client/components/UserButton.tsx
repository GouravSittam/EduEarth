"use client";

import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";

export default function UserButton({
  className = "",
  mobile = false,
}: {
  className?: string;
  mobile?: boolean;
}) {
  const { user, authUser, signOut, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setDropdownOpen(false);
  };

  const displayName =
    user?.name ??
    authUser?.user_metadata?.full_name ??
    authUser?.email ??
    "User";
  const displayEmail = user?.email ?? authUser?.email ?? "";

  if (!user && !authUser && !isLoading) {
    return (
      <Link
        href="/auth-model"
        className={`ml-1 rounded-full border-2 border-black bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_3px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0 ${className} ${
          mobile ? "block text-center w-full" : ""
        }`}
        style={{
          fontFamily: '"Press Start 2P", system-ui, sans-serif',
        }}
      >
        <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          SIGN UP
        </motion.span>
      </Link>
    );
  }

  if (!user && !authUser && isLoading) {
    return (
      <div
        className={`ml-1 rounded-full border-2 border-black bg-yellow-300 px-4 py-2 text-sm font-semibold text-black shadow-[0_3px_0_#000] ${className}`}
      >
        Loading
      </div>
    );
  }

  if (mobile) {
    return (
      <div className={`flex flex-col items-center gap-3 p-2 ${className}`}>
        <div className="flex items-center gap-3 w-full">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-yellow-400 shrink-0">
            <img
              src={user?.avatar || "/avatar.png"}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-white truncate">
              {displayName}
            </span>
            <span className="text-xs text-gray-300 truncate">
              {displayEmail}
            </span>
          </div>
        </div>
        <button
          onClick={() => void handleLogout()}
          className="w-full rounded-xl bg-red-500/80 border border-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="h-10 w-10 overflow-hidden rounded-full border-2 border-yellow-400"
      >
        <motion.img
          whileHover={{ scale: 1.1 }}
          src={user?.avatar || "/avatar.png"}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </motion.button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border p-3 z-50"
          >
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-sm font-semibold text-gray-800"
            >
              {displayName}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="text-xs text-gray-500 mb-3"
            >
              {displayEmail}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => void handleLogout()}
              className="w-full rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 transition"
            >
              Logout
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
