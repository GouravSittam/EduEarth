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

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
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
          <div
            className="flex min-w-0 flex-1 flex-col overflow-hidden"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            <span className="text-sm font-semibold leading-snug text-white break-words">
              {displayName}
            </span>
            <span className="text-xs leading-5 text-gray-300 break-all">
              {displayEmail}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="min-h-[44px] w-full rounded-xl border border-red-500 bg-red-500/80 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setDropdownOpen((prev) => !prev)}
        type="button"
        aria-haspopup="menu"
        aria-expanded={dropdownOpen}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-yellow-400 bg-black shadow-[0_4px_0_#000] transition-shadow duration-200 hover:shadow-[0_6px_0_#000]"
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
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-50 mt-3 w-80 max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border-4 border-black bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 p-0 text-white shadow-[8px_8px_0px_0px_rgba(251,191,36,1)] backdrop-blur-xl"
            style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
          >
            <div className="absolute -left-2 -top-2 h-4 w-4 rounded-full border-2 border-black bg-yellow-400" />
            <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full border-2 border-black bg-yellow-400" />
            <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full border-2 border-black bg-yellow-400" />
            <div className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full border-2 border-black bg-yellow-400" />

            <div className="border-b-2 border-yellow-400/30 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 px-4 py-3 text-[0.6rem] text-black shadow-[0_3px_0_#000]">
              PLAYER PROFILE
            </div>

            <div className="flex items-start gap-3 px-4 py-4">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-yellow-400 bg-black shadow-[0_4px_0_#000]">
                <img
                  src={user?.avatar || "/avatar.png"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 inline-flex max-w-full rounded-lg border-2 border-black bg-yellow-400 px-2.5 py-1 text-[0.55rem] leading-tight text-black shadow-[0_3px_0_#000]">
                  ECO ID
                </div>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-[0.8rem] leading-snug text-white break-words"
                >
                  {displayName}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="mt-2 rounded-xl border border-yellow-400/30 bg-white/10 px-3 py-2 text-[0.65rem] leading-5 text-green-200 break-all"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {displayEmail}
                </motion.p>
              </div>
            </div>

            <div className="p-4">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => void handleLogout()}
                className="min-h-[44px] w-full rounded-xl border-[3px] border-black bg-gradient-to-r from-red-500 via-rose-500 to-red-600 px-4 py-3 text-[0.72rem] text-white shadow-[0_4px_0_#000] transition-[transform,box-shadow,filter] duration-200 hover:brightness-110 hover:shadow-[0_6px_0_#000]"
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
