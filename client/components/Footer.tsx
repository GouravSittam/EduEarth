"use client";

import Link from "next/link";
import Image from "next/image";
import ElectricBorder from "./ElectricBorder";

export default function Footer() {
  return (
    <footer
      className="relative border-t-4 border-black bg-gradient-to-t from-blue-500 via-green-400 to-green-500 text-black"
      style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image src="/eco-play-logo-small.png" alt="EduEarth" fill className="object-contain" />
              </div>
              <span className="text-lg sm:text-xl font-black tracking-wider">EduEarth</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed max-w-xs opacity-90">
              Learn. Play. Save the Planet.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 text-sm">
              <a href="#" aria-label="Twitter" className="hover:opacity-80">🐦</a>
              <a href="#" aria-label="YouTube" className="hover:opacity-80">▶️</a>
              <a href="#" aria-label="Discord" className="hover:opacity-80">💬</a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-bold uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="#missions">How it Works</Link></li>
              <li><Link href="#modules">Explore Modules</Link></li>
              <li><Link href="/games">Play Games</Link></li>
              <li><Link href="/articles">Articles</Link></li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-bold uppercase tracking-wider">Dashboards</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link href="/teacher-dashboard">Teacher</Link></li>
              <li><Link href="/student-dashboard">Student</Link></li>
              <li><Link href="/auth-model">Sign In</Link></li>
            </ul>
          </div>

          {/* Newsletter / Demo */}
          <div>
            <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-bold uppercase tracking-wider">Stay Updated</h3>
            <ElectricBorder color="#FFD400" speed={1.2} chaos={1.1} thickness={2} className="rounded-xl">
              <form className="flex overflow-hidden rounded-xl bg-yellow-300 border-2 border-black">
                <input
                  type="email"
                  placeholder="Email for updates"
                  className="flex-grow px-3 py-2 text-[10px] sm:text-xs md:text-sm text-black placeholder-black/60 outline-none bg-transparent"
                  aria-label="Email"
                />
                <button type="submit" className="px-3 sm:px-4 py-2 bg-black text-yellow-300 text-xs sm:text-sm font-bold tracking-wider">
                  Join
                </button>
              </form>
            </ElectricBorder>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs md:text-sm">
          <p>© {new Date().getFullYear()} EduEarth. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:underline">Privacy</Link>
            <Link href="#" className="hover:underline">Terms</Link>
            <a href="#top" className="inline-flex items-center gap-2 hover:underline">Back to top ⬆️</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
